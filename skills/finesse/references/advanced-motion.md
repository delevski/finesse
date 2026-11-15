# Advanced motion: the signature layer

`motion-recipes.md` covers the everyday layer - entrances, transitions, press feedback. This file is the layer above: WebGL scenes, characterful controls, physics-feeling interactions. These are what make a UI feel like a product somebody obsessed over, not a component library.

## Rules of the signature layer

1. **One signature animation per screen.** A 3D hero OR an eyeball switch OR magnetic buttons - never all three in one viewport. Signature motion is a spice; a screen full of it reads as a toy.
2. **The everyday layer still applies.** Signature animations sit on top of states, tokens and RTL, never instead of them. A 3D scene that pops into a blank screen is still a blank screen - skeleton first, scene when ready.
3. **Performance is part of the design.** 60fps or cut it. Transform/opacity only for DOM motion, one WebGL context per page, pause everything offscreen and on hidden tabs, dispose on unmount. Judge it on a mid-range phone, not your laptop.
4. **Every signature animation degrades.** `prefers-reduced-motion` -> static end state. WebGL unavailable -> styled CSS fallback. CDN/import failure -> error state with retry, never a black hole.
5. **RTL still binds.** Physical travel direction of a control must match its logical meaning (see EyeSwitch below). Pointer-driven effects (ripple, magnetic) use physical event coordinates, which are already direction-correct - do not "fix" them with logical props.

---

## 1. Three.js in a Next.js + shadcn app

Setup:

```bash
npm i three && npm i -D @types/three
```

Never render WebGL during SSR. Load the scene client-side only:

```tsx
// app/page.tsx
import dynamic from "next/dynamic";
const AuroraBlob = dynamic(() => import("@/components/AuroraBlob"), { ssr: false });
```

### Recipe A: aurora blob hero

A breathing, slowly-rotating blob with pointer parallax. Vanilla three (no react-three-fiber dependency), ~60 lines of scene code:

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export default function AuroraBlob({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      setFailed(true); // WebGL unavailable -> CSS fallback below
      return;
    }
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75)); // battery > sharpness
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
    cam.position.z = 4.2;

    const geo = new THREE.IcosahedronGeometry(1.35, 32);
    const base = geo.attributes.position.array.slice() as unknown as Float32Array;
    const mat = new THREE.MeshStandardMaterial({ roughness: 0.25, metalness: 0.1 });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    const key = new THREE.DirectionalLight(0x14b8a6, 2.2); key.position.set(3, 2, 4);
    const rim = new THREE.DirectionalLight(0xf5b453, 1.1); rim.position.set(-4, -1, 2);
    scene.add(key, rim, new THREE.AmbientLight(0x223041, 1.4));

    const pos = geo.attributes.position;
    const pointer = { x: 0, y: 0 };
    let raf = 0, running = true;
    const v = new THREE.Vector3();

    const displace = (t: number) => {
      for (let i = 0; i < pos.count; i++) {
        v.set(base[i * 3], base[i * 3 + 1], base[i * 3 + 2]);
        const n = 0.16 * Math.sin(v.x * 2.1 + t) * Math.sin(v.y * 1.7 + t * 1.3) * Math.sin(v.z * 2.4 + t * 0.7);
        v.normalize().multiplyScalar(1.35 + n);
        pos.setXYZ(i, v.x, v.y, v.z);
      }
      pos.needsUpdate = true;
      geo.computeVertexNormals();
    };

    const frame = (now: number) => {
      if (!running) return;
      const t = now / 1000;
      displace(t * 0.6);
      mesh.rotation.y = t * 0.12;
      mesh.rotation.x += (pointer.y * 0.25 - mesh.rotation.x) * 0.04;
      mesh.rotation.z += (pointer.x * 0.18 - mesh.rotation.z) * 0.04;
      renderer.render(scene, cam);
      raf = requestAnimationFrame(frame);
    };

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = host;
      renderer.setSize(w, h);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
    };
    resize();

    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / innerWidth) * 2 - 1;
      pointer.y = (e.clientY / innerHeight) * 2 - 1;
    };
    // Pause offscreen and on hidden tabs - a hero nobody sees must not burn battery.
    const io = new IntersectionObserver(([e]) => {
      running = e.isIntersecting && !document.hidden;
      if (running) raf = requestAnimationFrame(frame); else cancelAnimationFrame(raf);
    });
    const onVis = () => { running = !document.hidden; if (running) raf = requestAnimationFrame(frame); else cancelAnimationFrame(raf); };

    io.observe(host);
    document.addEventListener("visibilitychange", onVis);
    addEventListener("resize", resize);
    if (!reduce) addEventListener("pointermove", onPointer);

    if (reduce) { displace(0); renderer.render(scene, cam); } // one static frame
    else raf = requestAnimationFrame(frame);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onPointer);
      geo.dispose(); mat.dispose(); renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  if (failed) {
    // Fallback, not a hole: same spot, same size, styled gradient.
    return <div className={className} aria-hidden style={{
      background: "radial-gradient(60% 60% at 40% 35%, hsl(var(--primary) / .35), transparent 70%)",
    }} />;
  }
  return <div ref={hostRef} className={className} aria-hidden />;
}
```

Rules for WebGL in app UI:
- `aria-hidden` on decorative scenes. If the scene conveys content, it is not decoration - give it a real text alternative.
- Cap `pixelRatio` at ~1.75. Retina 3x rendering is the #1 mobile battery killer.
- One renderer per page. Two scenes = one renderer with two passes, or cut one scene.
- Always the cleanup return: geometry, material, renderer, listeners, rAF. A leaked WebGL context crashes mobile Safari after a few route changes.

### Recipe B: pointer-reactive particle field

Section background (login pages, empty dashboards). `THREE.Points` with a few hundred particles; on pointermove, particles within a radius ease away and spring back. Same lifecycle rules as the blob: pause offscreen, dispose on unmount, static frame under reduced motion. Keep particles under 800 on mobile - measure with `renderer.info` while tuning, not by feel.

---

## 2. Character switches: the eyeball toggle

Two recipes here. The first gives a plain switch a face. The second is the glass day/night dragger.

A switch whose thumb is a little character. At rest its eyes are closed. On press the eyes pop open; on release it hops to the other side with a squash-and-stretch arc, glances in the travel direction, and closes its eyes after landing. This is the difference between a toggle and a toy people play with.

State machine: `idle -> awake (press/hover/focus) -> jumping (toggle) -> landed -> idle`.

```tsx
"use client";
import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const TRACK = 64, THUMB = 30, PAD = 4;
const TRAVEL = TRACK - THUMB - PAD * 2; // 30px

export function EyeSwitch({
  checked, onCheckedChange, label,
}: { checked: boolean; onCheckedChange: (v: boolean) => void; label: string }) {
  const reduce = useReducedMotion();
  const [awake, setAwake] = useState(false);
  const isRtl = typeof document !== "undefined" && document.dir === "rtl";
  // Physical travel flips in RTL: "on" sits at the inline-start, which is the RIGHT.
  const targetX = checked ? (isRtl ? -TRAVEL : TRAVEL) : 0;

  const toggle = () => {
    onCheckedChange(!checked);
    if (reduce) { setAwake(false); return; }
    setAwake(true);
    setTimeout(() => setAwake(false), 650); // eyes close after landing
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={toggle}
      onPointerDown={() => setAwake(true)}
      onPointerUp={() => !reduce && setTimeout(() => setAwake(false), 650)}
      onPointerLeave={() => !checked && setAwake(false)}
      onFocus={() => setAwake(true)}
      onBlur={() => setAwake(false)}
      className="relative h-9 rounded-full border bg-muted transition-colors data-[on]:bg-primary/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      data-on={checked || undefined}
      style={{ width: TRACK }}
    >
      <motion.span
        className="absolute top-1/2 grid place-items-center rounded-full bg-primary shadow-md"
        style={{ width: THUMB, height: THUMB, insetInlineStart: PAD, y: "-50%" }}
        animate={{
          x: targetX,
          scaleY: awake ? [1, 0.82, 1.08, 1] : 1,   // squash on takeoff, stretch mid-air, settle
          scaleX: awake ? [1, 1.12, 0.94, 1] : 1,
        }}
        transition={
          reduce
            ? { duration: 0 }
            : { x: { type: "spring", stiffness: 480, damping: 26 },
                scaleY: { duration: 0.45, times: [0, 0.35, 0.7, 1] },
                scaleX: { duration: 0.45, times: [0, 0.35, 0.7, 1] } }
        }
      >
        {/* The face: two eyes whose lids open on press, pupils glance toward travel */}
        <motion.svg
          width={THUMB * 0.66} height={THUMB * 0.4} viewBox="0 0 20 12"
          animate={{ scaleY: awake ? 1 : 0.12 }}       // 0.12 = closed lids, not 0 (a seam, not a void)
          transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 600, damping: 24 }}
          style={{ originY: "50%" }}
          aria-hidden
        >
          {[6, 14].map((cx) => (
            <g key={cx}>
              <ellipse cx={cx} cy={6} rx={3.4} ry={4.6} fill="hsl(var(--primary-foreground))" />
              <motion.circle
                cy={6} r={1.7} fill="hsl(var(--foreground))"
                animate={{ cx: cx + (awake ? (checked ? (isRtl ? -1.4 : 1.4) : (isRtl ? 1.4 : -1.4)) : 0) }}
                transition={{ duration: 0.18 }}
              />
            </g>
          ))}
        </motion.svg>
      </motion.span>
    </button>
  );
}
```

Why each detail exists:
- **Lids to 0.12, not 0** - a closed eye reads as a seam; scaleY 0 reads as a missing feature.
- **Squash before the jump** (`scaleY 0.82` first) - anticipation is what makes it feel alive. Without it, it is a sliding circle.
- **Pupils glance toward travel direction** - 1.4px, cheap, and it is the detail people screenshot.
- **RTL flips the travel, not the logic** - compute `targetX` from `document.dir`; never from hardcoded `right`/`left`. Position the thumb with `inset-inline-start` so the off state anchors to the correct edge in both directions.
- **It is a real switch** - `role="switch"`, `aria-checked`, `aria-label` ("מצב לילה", not "switch"), keyboard toggle via native button click. The character is decoration layered on an accessible control.
- **Reduced motion** - instant state change, eyes fade, no jump.

## 2b. GlassSwitch: drag-the-glass day/night

A wide rounded track that fades between a day scene and a night scene. The thumb is a frosted-glass pane (`backdrop-filter: blur`) you drag or tap; inside the pane a sun made of dots dissolves into a moon made of dots as the value moves 0 -> 1, with twinkling star particles on the night side. Below the track, show the live value while dragging (`0.42`) - the number is part of the charm.

Structure:

```tsx
<div
  role="switch" aria-checked={night} aria-label="מצב לילה" tabIndex={0}
  onKeyDown={(e) => { if (e.key === " " || e.key === "Enter" || e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); snap(night ? 0 : 1); } }}
  className="glass-switch"
>
  <div className="gs-day" />            {/* sky gradient, opacity 1 - v */}
  <div className="gs-night" />          {/* purple gradient + stars, opacity v */}
  <div className="gs-pane"             /* the draggable glass */
       style={{ transform: `translateX(${x}px)` }}
       onPointerDown={startDrag}>
    <DotsSun style={{ opacity: 1 - v }} />
    <DotsMoon style={{ opacity: v }} />
  </div>
</div>
<output dir="ltr">{v.toFixed(2)}</output>
```

Behavior rules:
- **Drag with pointer capture.** `setPointerCapture` on pointerdown, track `clientX`, clamp to the track, `v = x / maxX`. On release, snap with a spring to the nearest side; a drag under ~6px is a tap and toggles. Tapping the track itself jumps the pane to that side.
- **The scene follows v, not the snapped state.** Background, sun/moon opacity and the pane position all derive from the live `v`, so holding the glass halfway genuinely holds the world halfway.
- **Dots, not icons.** Build the sun/moon from ~40 absolutely-positioned dots (concentric rings for the sun; two-circle crescent mask for the moon). Give 4-5 night dots a `twinkle` keyframe with staggered delays. Dot matrices read as crafted; an emoji reads as a shortcut.
- **Keyboard and aria as above** - it is still `role="switch"`; arrows and space snap it.
- **Reduced motion** - tap toggles instantly, no drag spring; keep the cross-fade under 100ms.

## 2c. Circular theme reveal

When a toggle changes the whole theme, reveal the new one as a circle expanding from the control - the View Transitions API does this in a few lines:

```tsx
const flip = (e: React.MouseEvent) => {
  const root = document.documentElement;
  root.style.setProperty("--rx", `${e.clientX}px`);
  root.style.setProperty("--ry", `${e.clientY}px`);
  const apply = () => { root.dataset.theme = next; };
  if (reduce || !("startViewTransition" in document)) { apply(); return; }
  document.startViewTransition(apply);
};
```

```css
::view-transition-old(root) { animation: none; z-index: 1; }
::view-transition-new(root) { animation: circle-in .65s cubic-bezier(.22,1,.36,1); z-index: 2; }
@keyframes circle-in {
  from { clip-path: circle(0 at var(--rx) var(--ry)); }
  to   { clip-path: circle(150% at var(--rx) var(--ry)); }
}
```

No `startViewTransition` (older Safari) or reduced motion -> instant swap. The origin must be the control the user touched, not the viewport center. Inside a single panel rather than the whole page, do the same with a WAAPI `clip-path: circle()` animation on the incoming layer.

---

## 3. Ripple (pointer-true, RTL-safe)

Material-style ink from the exact press point. Physical event coordinates are already correct in both writing directions - do not route them through logical properties.

```tsx
function useRipple() {
  return (e: React.PointerEvent<HTMLElement>) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    const d = Math.max(r.width, r.height) * 2.1;
    const ink = document.createElement("span");
    ink.className = "ripple-ink";
    ink.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
    el.appendChild(ink);
    ink.addEventListener("animationend", () => ink.remove());
  };
}
// <button onPointerDown={ripple} className="ripple-host ...">
```

```css
.ripple-host { position: relative; overflow: hidden; isolation: isolate; }
.ripple-ink {
  position: absolute; border-radius: 999px; pointer-events: none;
  background: currentColor; opacity: .22; transform: scale(0);
  animation: ripple .55s cubic-bezier(.22,1,.36,1) forwards;
}
@keyframes ripple { to { transform: scale(1); opacity: 0; } }
```

Rules: host gets `overflow: hidden` and `isolation: isolate` (keeps ink under rounded corners and above the background). `currentColor` inherits the label color - a dark button inks light, a light button inks dark, no per-variant tokens. Clean up on `animationend`, not with a timeout.

---

## 4. Magnetic hover

The button leans toward the cursor within a short radius and springs back on leave. Desktop only - touch has no hover, so gate it:

```tsx
function Magnetic({ children, strength = 0.35 }: { children: React.ReactNode; strength?: number }) {
  const reduce = useReducedMotion();
  const noHover = typeof matchMedia !== "undefined" && matchMedia("(hover: none)").matches;
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 180, damping: 14, mass: 0.4 });
  if (reduce || noHover) return <>{children}</>;

  return (
    <motion.div
      style={{ x: sx, y: sy, display: "inline-block" }}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}
```

Cap the pull at ~40% of the distance (`strength 0.35`) and the travel under ~18px - more than that and the button dodges the click, which is the opposite of delightful.

---

## 5. Success burst

A one-shot particle pop when an async action succeeds - pairs with the states layer, it never replaces the success message:

```tsx
function burst(host: HTMLElement, colors = ["hsl(var(--primary))", "hsl(var(--accent))", "#f5b453"]) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  for (let i = 0; i < 12; i++) {
    const bit = document.createElement("span");
    bit.style.cssText = `position:absolute;inset-inline-start:50%;top:50%;width:6px;height:6px;border-radius:2px;pointer-events:none;background:${colors[i % colors.length]}`;
    host.appendChild(bit);
    const a = (Math.PI * 2 * i) / 12 + Math.random() * 0.6;
    const d = 40 + Math.random() * 34;
    bit.animate(
      [{ transform: "translate(-50%,-50%) rotate(0deg)", opacity: 1 },
       { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) rotate(${180 + Math.random() * 180}deg)`, opacity: 0 }],
      { duration: 520 + Math.random() * 260, easing: "cubic-bezier(.22,1,.36,1)" }
    ).onfinish = () => bit.remove();
  }
}
```

Call it when the submit promise resolves, on the button that was clicked. The burst is radial - no direction, so nothing to mirror in RTL. Use `inset-inline-start: 50%` anyway so the origin stays centered if the host's writing mode changes.

---

## 6. Standard controls, signature level

The everyday components are where "basic" is most visible. These recipes are inspired by the high-star animation libraries - React Bits (davidhdev/react-bits), Magic UI (magicuidesign/magicui), Codrops demos - and rebuilt for Next.js + shadcn with the states layer intact (focus ring, aria, keyboard). Every selection deserves a story: open with character, confirm with motion, land the choice where the user can see it.

**Checkbox (burst)** - the check draws itself (SVG `stroke-dasharray` 22 -> 0), and on check the box plays a jelly squash-and-stretch (`scale(1.3,.7) -> (.82,1.18) -> (1.12,.9) -> 1`, ~550ms) while 8-12 small particles burst outward from the box center with random angle/distance/rotation and fade. Particles are spawned spans, removed on `animationend`; skip them under `prefers-reduced-motion`.

**Dropdown (3D unfold)** - the wrapper gets `perspective: ~900px`; items enter with `rotateX(-75deg) translateY(-8px)` -> none, `transform-origin: top`, staggered ~55ms with an overshoot bezier (`cubic-bezier(.2,1.35,.3,1)`), so the panel reads as unfolding, not fading. On select, the chosen row flashes the accent wash once, the button label swaps through a blur (blur(5px)/fade out, swap text, blur back in), and the check springs in with rotation. Close on outside click and Escape; `aria-expanded`, `role="listbox"`/`option`, `aria-selected`.

**Combobox (cascade + fly-to-chip)** - typing shows the mini spinner (visible async state); results cascade in with `blur(6px) translateY(10px)` -> sharp, staggered ~50ms, re-running on every keystroke's render. Zero results get a designed empty state plus a short horizontal shake on the input. On select, the option row flies (shared `flyArc`) into the chip area and lands as a removable chip that springs in (`scale(.3) rotate(-8deg)` -> none); removing the chip shrinks/rotates it out.

**Fan drawer (the selection fan)** - instead of a plain bottom sheet: options are cards stacked on a shared pivot below the stage (`transform-origin: 50% 160%`). Opening rotates each card to its fan angle (`--a: -22deg..22deg`) with a staggered overshoot (`cubic-bezier(.2,1.45,.32,1)`, ~55ms apart) over a dimming backdrop - the fan unfolds like a hand of cards. Center card carries the top z-index. On select, a clone of the card flies a quadratic-bezier arc (perpendicular control point ~0.3x the chord) up to the trigger at the head, rotating with the path tangent and shrinking to ~30%; on landing the trigger pops (`scale .82 -> 1.07 -> 1` + expanding glow ring) and shows the selection; the fan collapses with reverse stagger. Escape/backdrop close. RTL-safe: rotation is symmetric, no logical-property offsets in the fan geometry.

**Loaders with character** - replace the gray spinner: three orbiting dots, an equalizer of bars, five particles that converge to the center, merge, and pass through to the opposite side (`rotate(var(--ang)) translateX(...)` keyframes), a morphing blob (animated `border-radius` + rotation), or a progress ring that fills with a live percentage and ends in a drawn check. A determinate action (upload, import) always gets the ring over an indeterminate spinner.

**Shared: `flyArc(from, to, html)`** - the selection-flight primitive used by the combobox and fan drawer: fixed-position clone, rAF loop over a quadratic bezier (endpoints = element centers, control point = chord midpoint + perpendicular offset), rotation follows the path tangent, scale eases toward the target, element removed on finish. Resolves immediately under reduced motion. One layout read per endpoint per flight - never per frame.

All of these are demoed live in the gallery (`docs/index.html`, the signature-motion section) - copy the behavior from there.

---

## 7. Performance and fallback checklist

- [ ] One signature animation per screen; everyday motion everywhere else.
- [ ] rAF loops pause on `visibilitychange` and `IntersectionObserver`; verified in devtools (0% CPU when hidden).
- [ ] Every effect has its cleanup return: rAF cancelled, listeners removed, geometry/material/renderer disposed.
- [ ] `pixelRatio` capped; particle counts tuned on a mid-range phone.
- [ ] `prefers-reduced-motion`: static end state for every recipe above, not "animation off, layout broken".
- [ ] WebGL unavailable or CDN blocked: styled fallback or error + retry, never an empty canvas or a black screen.
- [ ] No layout reads (`getBoundingClientRect` etc.) inside per-frame loops - read once on pointer/resize events, animate from cached values (ripple and magnetic read per event, which is fine; per-frame is not).
- [ ] RTL pass: travel directions match logical meaning; pointer effects untouched; Hebrew labels on the control itself.
