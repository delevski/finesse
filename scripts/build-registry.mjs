#!/usr/bin/env node
// Build the shadcn-compatible registry for the finesse demos.
// Reads registry/finesse/*.tsx -> docs/r/<name>.json + docs/r/index.json
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";

const SRC = "registry/finesse";
const OUT = "docs/r";

const META = {
  "fan-drawer": {
    title: "Fan Drawer",
    titleHe: "מגירת מניפה",
    description: "כפתור שהופך למניפת קלפים שמתגלגלים מהצד - בחירה עפה בקשת אל הכפתור ומתקבעת שם.",
  },
  "swipe-stack": {
    title: "Swipe Stack",
    titleHe: "ערימת החלקה",
    description: "קלפים שנזרקים ימינה ושמאלה עם מהירות זריקה אמיתית וסיבוב פיזי, שכבות עמוקות מתקדמות.",
  },
  "liquid-tabs": {
    title: "Liquid Tabs",
    titleHe: "טאבים נוזליים",
    description: "מחוון שנמתח כמו ג׳לי לעבר הטאב החדש ומתייצב (FLIP אמיתי בין מצבים).",
  },
  "toast-physics": {
    title: "Toast Physics",
    titleHe: "התראות עם פיזיקה",
    description: "טוסטים שקופצים פנימה, נערמים, ואפשר לזרוק אותם הצידה במחיאה.",
  },
  "tilt-card": {
    title: "Tilt Card",
    titleHe: "כרטיס הטייה",
    description: "כרטיס תלת־ממדי שעוקב אחרי האצבע עם ברק ספקולרי, וקופץ חזרה לשטוח.",
  },
  "text-scramble": {
    title: "Text Scramble",
    titleHe: "טקסט מתפענח",
    description: "כותרת שמתפענחת אות אחר אות בגלילה לתצוגה - גליפים אקראיים לפני התייצבות.",
  },
  "otp-input": {
    title: "OTP Input",
    titleHe: "קלט קוד חד־פעמי",
    description: "תאי ספרות עם קפיצה אלסטית, סימון שגיאה ברעידה ואישור ירוק בגל מדורג.",
  },
  "flip-dialog": {
    title: "FLIP Dialog",
    titleHe: "דיאלוג מתרחב",
    description: "כרטיס הקטנה עצמו מתרחב לדיאלוג - FLIP מלא, לא פאנל שצץ משום מקום.",
  },
  odometer: {
    title: "Odometer",
    titleHe: "מונה קילומטראז׳",
    description: "מונה שמתגלגל ספרה־ספרה כמו קילומטראז׳ אמיתי, עם סטגר לכל טור.",
  },
};

mkdirSync(OUT, { recursive: true });

const items = [];
for (const file of readdirSync(SRC).filter((f) => f.endsWith(".tsx")).sort()) {
  const name = basename(file, ".tsx");
  const content = readFileSync(join(SRC, file), "utf8");
  const meta = META[name] ?? { title: name, titleHe: name, description: "" };
  const item = {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name,
    type: "registry:component",
    title: meta.title,
    description: meta.description,
    files: [
      {
        path: `components/finesse/${file}`,
        type: "registry:component",
        content,
      },
    ],
  };
  writeFileSync(join(OUT, `${name}.json`), JSON.stringify(item, null, 2) + "\n");
  items.push({
    name,
    title: meta.title,
    titleHe: meta.titleHe,
    description: meta.description,
    url: `/r/${name}.json`,
  });
  console.log(`built docs/r/${name}.json (${content.length} bytes)`);
}

writeFileSync(
  join(OUT, "index.json"),
  JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", name: "finesse", items }, null, 2) + "\n"
);
console.log(`built docs/r/index.json (${items.length} items)`);
