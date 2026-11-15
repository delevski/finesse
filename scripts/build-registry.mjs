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
  playground: {
    title: "Motion Playground",
    titleHe: "פלייגראונד תנועה",
    description: "סליידרים לקשיחות קפיץ ומשך שמכוונים אנימציה בלייב, עם העתקת ערכים מכוונים ללוח.",
  },
  "pull-refresh": {
    title: "Pull Refresh",
    titleHe: "משיכה לרענון עם מטפס",
    description: "מושכים את הרשימה ומטפס יורד על חבל; שחרור מעבר לסף קולע אותו למעלה ומרענן.",
  },
  "split-flap": {
    title: "Split Flap",
    titleHe: "מונה ספליט־פלאפ",
    description: "ספרות מתהפכות כמו שלט שדה תעופה ישן, חצי עליון מתקפל ונפתח מחדש.",
  },
  "empty-robot": {
    title: "Empty Robot",
    titleHe: "רובוט אמפטי־סטייט",
    description: "רובוט עצוב למצב ריק שמתאושש וקופץ כשמגיע הפריט הראשון.",
  },
  "cmd-palette": {
    title: "Command Palette",
    titleHe: "פלטת פקודות",
    description: "Cmd+K עם סטאגר בפתיחה, חיפוש חי והדגשה שקופצת עם החיצים.",
  },
  "swipe-actions": {
    title: "Swipe Actions",
    titleHe: "פעולות שורה בסווייפ",
    description: "שורה נחשפת לפעולות עם צמצום; האייקון מתנדנד כשמחושק.",
  },
  "step-walker": {
    title: "Step Walker",
    titleHe: "סטפר נקודה מהלכת",
    description: "נקודה שקופצת בין שלבים בסקווש בזמן שהקו נצבע אחריה.",
  },
  "peel-skeleton": {
    title: "Peel Skeleton",
    titleHe: "סקלטון מדבקה",
    description: "השלד נקלף כמו מדבקה באלכסון ומגלה את התוכן במקום פייד.",
  },
  "voice-note": {
    title: "Voice Note",
    titleHe: "הודעה קולית",
    description: "בועת הקלטה עם ווייבפורם חי שמתמלא ומקפץ בזמן נגינה.",
  },
  "sunset-toggle": {
    title: "Sunset Toggle",
    titleHe: "מעבר שקיעה",
    description: "שמש שוקעת, שמי גרדיאנט מתחשכים וכוכבים נדלקים - במקום סוויץ.",
  },
  "plan-switch": { title: "Plan Switch", titleHe: "מתכנן מחירון", description: "טוגל חודשי/שנתי עם פיל שקופץ והמחיר מתהפך כמו לוח יציאות." },
  "letter-limit": { title: "Letter Limit", titleHe: "גבול אותיות", description: "תקציב אותיות שמרגישים: האריחים נושרים פיזית ככל שמתקרבים לגבול." },
  "pull-cord": { title: "Pull Cord", titleHe: "חבל הדלקה", description: "מושכים את החבל עד הסף, הוא נקלע חזרה מתנדנד והמנורה נדלקת." },
  "morph-tooltip": { title: "Morph Tooltip", titleHe: "טולטיפ מתהווה", description: "כפתור ה-? עצמו גדל לתוך הטולטיפ במורפולוגיית FLIP מלאה." },
  "file-drop": { title: "File Drop", titleHe: "זריקת קובץ", description: "גוררים שבבית קובץ לתיקייה; המכסה נפתח, הקובץ שולחף פנימה והתיקייה מבצעת קפיצת שמחה." },
  "morph-island": { title: "Morph Island", titleHe: "איילנד דינמי", description: "פיל בסגנון Dynamic Island שנפתח בקפיץ לנגן מיני ונסגר באותו מורף פיזי." },
  "goo-menu": { title: "Goo Menu", titleHe: "תפריט גאו", description: "פעולות נוזליות שבוקעות מה-FAB ומתמזגות איתו בפילטר גאו." },
  "jelly-slider": { title: "Jelly Slider", titleHe: "סליידר ג׳לי", description: "הידית נמתחת עם מהירות הגרירה ומתנדנדת חזרה לעיגול בשחרור." },
  "hold-publish": { title: "Hold to Publish", titleHe: "החזיקו לפרסום", description: "מילוי מתקדם רק כשמחזיקים; שחרור מוקדם מרוקן עם רעידה, השלמה מסיימת בפיצוץ." },
  "rubber-dock": { title: "Rubber Dock", titleHe: "דוק גומי", description: "הגדלה בסגנון macOS עם נפילה גאוסית סביב האצבע." },
  "marker-text": { title: "Marker Text", titleHe: "מרקר סימון", description: "הדגשות מרקר נמרחות אחת אחרי השנייה כמו בעט פוסקה אמיתי." },
  "word-roll": { title: "Word Roll", titleHe: "מילים מתגלגלות", description: "הפועל בכותרת מתגלגל החוצה והבא נקלע פנימה בקפיץ." },
  "weight-wave": { title: "Weight Wave", titleHe: "גל משקל", description: "אותיות מתחמנות סביב האצבע בפונט וריאבילי; גל עצמאי במנוחה." },
  "read-along": { title: "Read Along", titleHe: "קריאה מודגשת", description: "הדגשת קריוקי שקופצת מילה־מילה בקצב קריאה עם קו התקדמות." },
  "ghost-suggestion": { title: "Ghost Suggestion", titleHe: "השלמת רפאים", description: "השלמה אפורה צפה מול הסמן; קבלה ב-Tab מקפיצה את האותיות החדשות." },
  "goo-thinking": { title: "Goo Thinking", titleHe: "מחשבה נוזלית", description: "שלוש נקודות מתמזגות ונפרדות בגאו עד שהתשובה נולדת מהן." },
  "streaming-reply": { title: "Streaming Reply", titleHe: "תשובה זורמת", description: "תשובת סוכן זורמת בנתחים עם סמן בלוק מהבהב." },
  "like-burst": { title: "Like Burst", titleHe: "לייק מתפוצץ", description: "לב קופץ בקפיץ, זורק טבעת ו־12 חלקיקים, והמונה מתגלגל." },
  "loading-success": { title: "Loading to Success", titleHe: "טעינה להצלחה", description: "הכפתור מתכווץ לספינר עגול וקופץ חזרה ירוק עם V מצויר." },
  "star-rating": { title: "Star Rating", titleHe: "דירוג כוכבים", description: "כוכבים מתמלאים בסטאגר קפיצי עם סיבוב קטן ותווית תגובה מתחלפת." },
  "detent-dial": { title: "Detent Dial", titleHe: "חוגת דטנט", description: "חוגה סיבובית עם נעילות מדורגות, קפיצה לסימון הקרוב וסימון דולק." },
  "face-id": { title: "Face ID", titleHe: "פתיחת פייס־איידי", description: "סריקת פנים: סוגריים נצבעים, קו סורק, ונעילה ירוקה בסוף." },
  "pagination-dots": { title: "Pagination Dots", titleHe: "דפדוף נוזלי", description: "תולעת נוזלית שנמתחת לעבר הנקודה הפעילה במקום נקודה שגדלה." },
  "tag-input": { title: "Tag Input", titleHe: "תגיות קופצות", description: "צ׳יפים נקפצים פנימה עם הטיה אקראית ומתכווצים למרכז במחיקה." },
  "password-strength": { title: "Password Strength", titleHe: "מטר סיסמה", description: "מקטעים נקפצים אחד־אחד עם צבע עולה והפרצוף מגיב לכל שינוי." },
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
