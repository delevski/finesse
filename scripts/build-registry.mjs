#!/usr/bin/env node
// Build the shadcn-compatible registry for the finesse demos.
// Reads registry/finesse/*.tsx -> docs/r/<name>.json + docs/r/index.json
import { readdirSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, basename } from "node:path";

const SRC = "registry/finesse";
const OUT = "docs/r";

const META = {
  "spring-dropdown": { title: "Spring Dropdown", titleHe: "דרופדאון קפיצי", description: "תפריט שנפתח בקסקדה עם אוברשוט קפיצי, פריט אחר פריט." },
  "command-button": { title: "Command Button", titleHe: "כפתור פקודה", description: "כפתור בסגנון Cmd+K עם צ'יפים נוצצים שפועם כשלוחצים על הקיצור האמיתי." },
  "springy-input": { title: "Springy Input", titleHe: "שדה קפיצי", description: "אינפוט שקופץ בפוקוס, תווית צפה, ורעידה פיזית על קלט שגוי." },
  "glass-lens": { title: "Glass Lens", titleHe: "עדשת זכוכית", description: "עדשה שעוקבת אחרי הסמן ומגדילה את התוכן מתחתיה." },
  "goo-morph": { title: "Goo Morph", titleHe: "מורפ נוזלי", description: "שתי בועות מתמזגות דרך פילטר goo וממירות פליי לפאוז." },
  "roll-links": { title: "Roll Links", titleHe: "קישורים מתגלגלים", description: "קישורי ניווט שהטקסט שלהם מתגלגל למעלה וחושף תאום בצבע מבטא." },
  "prompt-box": { title: "Prompt Box", titleHe: "תיבת פרומפט", description: "שדה פרומפט לסוכן שגדל בפוקוס, סופר תווים, וכפתור שליחה שהופך לעצירה." },
  "expand-card": { title: "Expand Card", titleHe: "כרטיס מתרחב", description: "כרטיס קומפקטי שנפתח במקום בקפיץ וחושף שורות פרטים מדורגות." },
  "profile-card": { title: "Profile Card", titleHe: "כרטיס פרופיל", description: "ריחוף מגליד פאנל סטטיסטיקות מעל כרטיס פרופיל, פסים גדלים בקסקדה." },
  "magnetic-button": { title: "Magnetic Button", titleHe: "כפתור מגנטי", description: "כפתור שנמשך אל הסמן ברדיוס וקופץ חזרה למנוחה." },
  "copy-button": { title: "Copy Button", titleHe: "כפתור העתקה", description: "אייקון ההעתקה הופך ל-V נצייר עם אישור קופץ, ואז חוזר בשקט." },
  "bottom-bar": { title: "Bottom Bar", titleHe: "סרגל תחתון", description: "סרגל טאבים בסגנון טלפון עם מחוון נוזלי שנמתח אל הטאב." },
  "dynamic-menu": { title: "Dynamic Menu", titleHe: "תפריט דינמי", description: "פריטים שבחרת עולים לראש עם FLIP - התפריט לומד הרגלים." },
  "segmented-control": { title: "Segmented Control", titleHe: "בקר מקטעים", description: "בקר ארבע-דרך עם גלולה קפיצית שחורגת ומתייצבת." },
  "sidebar-collapse": { title: "Sidebar Collapse", titleHe: "סיידבר מתכווץ", description: "סיידבר מיני שמתקפל לפס אייקונים בקפיץ, תוויות דועכות." },
  "number-stepper": { title: "Number Stepper", titleHe: "סטפר מספרים", description: "פלוס/מינוס עם ספרות שמתגלגלות כמו אודומטר וקופצות." },
  "range-slider": { title: "Range Slider", titleHe: "סליידר טווח", description: "סליידר עם בועת ערך קפיצית, מילוי גרדיאנט ונעילה על טיקים." },
  "checkbox-list": { title: "Checkbox List", titleHe: "רשימת צ'קבוקסים", description: "סימון מצייר V, קו חוצה את התווית באנימציה, והפריט צונח לבוצעו." },
  "siri-orb": { title: "Siri Orb", titleHe: "כדור סירי", description: "כדור גרדיאנט שכבתי שנושם, ומתלקח כשמחזיקים אותו." },
  "agent-steps": { title: "Agent Steps", titleHe: "צעדי סוכן", description: "ציר צעדים של ריצת סוכן: ספינר שהופך ל-V מצויר, צעד אחר צעד." },
  "hold-button": { title: "Hold Button", titleHe: "כפתור החזקה", description: "החזקה ממלאה טבעת מסביב לכפתור; רק החזקה מלאה מאשרת." },
  "exposure-slider": { title: "Exposure Slider", titleHe: "סליידר חשיפה", description: "סליידר שמשחית בין לילה ליום בסצנה, עם שמש/ירח מסתובבים." },
  "boarding-pass": { title: "Boarding Pass", titleHe: "כרטיס עלייה", description: "כרטיס טיסה עם שורת קריעה, הטיית תלת-ממד וברקוד מרקד." },
  "slide-confirm": { title: "Slide to Confirm", titleHe: "החלקה לאישור", description: "ידית שנגררת לאורך מסילה עם שימר; שחרור מוקדם מחזיר בקפיץ." },
  "notification-stack": { title: "Notification Stack", titleHe: "ערימת התראות", description: "התראות מוערמות; ריחוף פורס אותן ומחיאה זורקת את העליונה." },
  "wheel-picker": { title: "Wheel Picker", titleHe: "גלגל בחירה", description: "תוף בסגנון iOS עם סיבוב תלת-ממדי ודטנטים בגלילה." },
  "dynamic-text": { title: "Dynamic Text", titleHe: "טקסט דינמי", description: "כותרת שמחליפה מילת מפתח במעבר טשטוש+גלילה בלולאה." },
  "voice-input": { title: "Voice Input", titleHe: "קלט קולי", description: "החזקת מיקרופון: עמודות צורת-גל חיות, ואז התמליל מקליד את עצמו." },
  "tool-approval": { title: "Tool Approval", titleHe: "אישור כלי", description: "כרטיס בקשת הרצה של סוכן: אישור מחליק טיל, דחייה מחליקה רוז." },
  "toolbar": { title: "Toolbar", titleHe: "סרגל כלים צף", description: "כדור כלים צף: אייקונים קופצים פנימה בקסקדה עם בועות תווית." },
  "scrubber": { title: "Scrubber", titleHe: "סקראבר מדיה", description: "סקראבר וידאו עם בועת תצוגה קפיצית שעוקבת אחרי הגרירה." },
  "cart-button": { title: "Cart Button", titleHe: "כפתור סל", description: "הוספה לסל שולחת פריט מעופף לסמל והבאדג' קופץ עם הספירה." },
  "page-flip": { title: "Page Flip", titleHe: "דפדוף עמוד", description: "כרטיס שמתהפך כמו עמוד בספר בתלת-ממד, עם צד אחורי." },
  "signature-pad": { title: "Signature Pad", titleHe: "פד חתימה", description: "חתימה על קנבס עם קו שנהנה כמו עט אמיתי, וניקוי בדעיכה." },
  "undo-button": { title: "Undo Button", titleHe: "כפתור ביטול", description: "אחרי פעולה צץ כפתור ביטול עם ספירה לאחור מעגלית." },
  "card-field": { title: "Card Field", titleHe: "שדה כרטיס", description: "שדה תשלום שמקבץ ספרות בלייב ומהפך כרטיס מיני לצד CVV." },
  "stack-panel": { title: "Stack Panel", titleHe: "פאנלים מוערמים", description: "פאנלים מוערמים נפרשים כמו חבילת קלפים בריחוף." },
  "typewriter": { title: "Typewriter", titleHe: "מכונת כתיבה", description: "מקליד משפט, עוצר, מוחק ומקליד את הבא, עם סמן מהבהב." },
  "thinking-text": { title: "Thinking Text", titleHe: "טקסט חושב", description: "שורת טעינת-סוכן סטנדרטית: שימר על הטקסט ונקודות קופצות." },
  "glass-player": { title: "Glass Player", titleHe: "נגן זכוכית", description: "מיני-נגן זכוכית מט: עמודות אקולייזר רוקדות וקופאות בפאוז." },
  "bell-button": { title: "Bell Button", titleHe: "כפתור פעמון", description: "הפעמון מצלצל בקשת אמיתית עם ניצוצות, והבאדג' מתאפס." },
  "morph-popover": { title: "Morph Popover", titleHe: "פופאובר מתמורפ", description: "כפתור ההדק עצמו גדל לפאנל פופאובר עם אינטרפולציית פינות." },
  "task-list": { title: "Task List", titleHe: "רשימת משימות", description: "סימון משימה קופץ עם קונפטי ומעדכן פס התקדמות בקפיץ." },
  "music-toggle": { title: "Music Toggle", titleHe: "טוגל מוזיקה", description: "כפתור פליי/פאוז שהאייקון שלו עובר מורפ ועמודות רוקדות לידו." },
  "spark-badge": { title: "Spark Badge", titleHe: "באדג' ניצוצות", description: "(threeui, MIT) באדג' עם ניצוצות שחגים סביבו על קנבס זעיר." },
  "uplink-loader": { title: "Uplink Loader", titleHe: "טוען אפלינק", description: "(threeui, MIT) חבילות אור עולות בקורה אל רכזת, עם טקסט התקדמות." },
  "liquid-metal-button": { title: "Liquid Metal Button", titleHe: "כפתור מתכת נוזלית", description: "(threeui, MIT) כפתור כרום עם ברק מתכתי זורם ופיזיקת לחיצה." },
  "dot-matrix-text": { title: "Dot Matrix Text", titleHe: "טקסט מטריצת-נקודות", description: "(threeui, MIT) המילה מרכיבה את עצמה מרשת נקודות, תא אחר תא." },
  "crt-text": { title: "CRT Text", titleHe: "טקסט CRT", description: "(threeui, MIT) טקסט נדלק כמו מסך CRT ישן: קו נפתח, סריקות ופליקר." },
  "laser-border": { title: "Laser Border", titleHe: "מסגרת לייזר", description: "(threeui, MIT) כרטיס שקרן לייזר סורקת את מסגרתו ברציפות." },
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
