<p align="right">🌐 <a href="README.md">English</a> · <b>עברית</b></p>

<div dir="rtl">

# 📦 Stock Assistant — Frontend

<p align="center">
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" />
  <img alt="Vite" src="https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white" />
  <img alt="Mantine" src="https://img.shields.io/badge/Mantine-9-339AF0?logo=mantine&logoColor=white" />
  <img alt="Redux Toolkit" src="https://img.shields.io/badge/Redux%20Toolkit-2-764ABC?logo=redux&logoColor=white" />
  <img alt="i18next" src="https://img.shields.io/badge/i18next-EN%20%7C%20RU%20%7C%20HE-26A69A?logo=i18next&logoColor=white" />
  <img alt="License" src="https://img.shields.io/badge/License-Proprietary-red" />
</p>

<p align="center"><b>ה-Frontend של Stock Assistant</b> — מערכת ניהול הזמנות ומלאי פנימית לרשת חנויות, המחברת בין חנויות, מחסן מרכזי, מנהלים ונהגים בממשק אחד.</p>

</div>

---

<div dir="rtl">

## 📖 תוכן עניינים

- [אודות הפרויקט](#-אודות-הפרויקט)
- [תפקידים במערכת](#-תפקידים-במערכת)
- [יכולות עיקריות](#-יכולות-עיקריות)
- [סטאק טכנולוגי](#️-סטאק-טכנולוגי)
- [מבנה הפרויקט](#-מבנה-הפרויקט)
- [צילומי מסך](#-צילומי-מסך)
- [התקנה והרצה מקומית](#-התקנה-והרצה-מקומית)
- [סקריפטים זמינים](#-סקריפטים-זמינים)
- [פריסה (Deployment)](#-פריסה-deployment)
- [הפרויקט הקשור — Backend](#-הפרויקט-הקשור--backend)
- [רישיון](#-רישיון)

## 📋 אודות הפרויקט

**Stock Assistant** היא מערכת ווב פנים-ארגונית לניהול הזמנות, מלאי ומחסנים עבור רשת חנויות. המערכת מחליפה תהליכי הזמנה ומעקב מלאי ידניים (טלפון/וואטסאפ/אקסל) בזרימת עבודה דיגיטלית אחת: חנות מזמינה מוצרים מהמחסן המרכזי, המחסן מטפל בהזמנה ושולח, ומנהל המערכת רואה תמונת מצב מלאה בכל רגע נתון — כולל התראות על מלאי נמוך, סטטיסטיקות ודוחות.

הריפו הזה מכיל את ה-**Frontend** — אפליקציית **React SPA** שצורכת את ה-API של [Stock Assistant Backend](#-הפרויקט-הקשור--backend).

## 👥 תפקידים במערכת

| תפקיד | תיאור |
|---|---|
| 🏪 **STORE** (חנות) | יוצרת הזמנות מהקטלוג, עוקבת אחר הסטטוס שלהן, ופותחת בקשות החזרה |
| 📦 **WAREHOUSE** (מחסן) | מטפל בהזמנות נכנסות, מנהל מלאי ומחסנים, סוגר החזרות שחוזרות פיזית |
| 👑 **ADMIN** (מנהל) | גישה מלאה: מוצרים, משתמשים, חנויות, מחסנים, ספקים, סטטיסטיקה, הגדרות מערכת ואישור החזרות |
| 🚚 **DRIVER** (נהג) | סורק QR של החזרות שאושרו ואוסף אותן מהחנות |

הרשאות ל-API מוגדרות לפי תפקיד (Role Guards) וגם לפי "תחום אחריות" של מנהל (`adminScopes`) — כך שמנהלים שונים יכולים לראות רק את הקטגוריות שהוקצו להם.

## ✨ יכולות עיקריות

**הזמנות**
- יצירת הזמנה ע"י חנות, לפי חלון ימים/שעת חיתוך (Cutoff) שמוגדר בהגדרות המערכת
- מעקב סטטוסים: חדש → בטיפול → נשלח → הושלם / הוחזר למלאי / נדחתה
- הזמנות "מחיקת מלאי" (Write-off) שנפתחות ישירות ע"י מחסן/מנהל

**מוצרים ומלאי**
- קטלוג מוצרים לפי קטגוריות ומותגים, עם תמונה, מק"ט, סוג אריזה (פלטה/קרטון/חבילה/יחידה) וכמות ליחידת אריזה
- מוצרים תחליפיים (Substitute) שמוצעים אוטומטית כשמוצר אזל
- גרירה-ושחרור (Drag & Drop) לסידור סדר תצוגת המוצרים
- הגבלת כמות מקסימלית להזמנה למוצר בודד

**מחסנים**
- ריבוי מחסנים, עם מחסן ברירת מחדל
- העברת מלאי בין מחסנים
- מסך מלאי לכל מחסן בנפרד

**החזרות (Returns) עם QR**
- חנות פותחת החזרה עם תמונה וכמות → מנהל מאשר/דוחה → נהג סורק QR ואוסף → מחסן סורק וסוגר, והמלאי חוזר אוטומטית למחסן ברירת המחדל
- הדפסת מסמך החזרה

**ספקים, סטטיסטיקה ודוחות**
- ניהול ספקים פרטי לכל מנהל
- לוחות סטטיסטיקה (הזמנות ובקשות) עם ייצוא ל-Excel

**ניהול משתמשים, חנויות והגדרות**
- ניהול משתמשים, חנויות, מותגים וקטגוריות
- הגדרות מערכת: ימי הזמנה, שעת חיתוך, מייל תמיכה, מצב תחזוקה (Maintenance Mode)

**התראות**
- Toast + הבהוב כותרת הטאב על הזמנה חדשה שמגיעה למחסן (בדיקה תקופתית ברקע)
- מודל התראת מלאי נמוך למנהל, פעם ביום ולפי דרישה

**רב-לשוניות ונגישות**
- 3 שפות מובנות: **אנגלית, רוסית ועברית**, כולל תמיכה מלאה בכיווניות RTL

## 🛠️ סטאק טכנולוגי

| טכנולוגיה | שימוש |
|---|---|
| **React 19** + React Compiler | ליבת האפליקציה |
| **Vite 7** | Build tool ו-Dev server |
| **Mantine 9** (core, dates, notifications, modals, spotlight, dropzone, carousel, charts, tiptap) | ספריית רכיבי UI |
| **Redux Toolkit + RTK Query** | ניהול state וקריאות API עם קאשינג אוטומטי |
| **redux-persist** | שמירת סשן/הרשאות בין רענוני דף |
| **React Router 7** | ניתוב, כולל Lazy Loading לכל עמוד |
| **React Hook Form + Yup** | טפסים ואימות קלט |
| **i18next / react-i18next** | תרגום ורב-לשוניות (EN/RU/HE) |
| **dnd-kit** | גרירה-ושחרור לסידור מוצרים |
| **Recharts / @mantine/charts** | גרפים בעמודי הסטטיסטיקה |
| **qrcode.react + html5-qrcode** | הפקה וסריקה של קודי QR להחזרות |
| **react-hot-toast** | הודעות מסך (Toast) |
| **Vercel Analytics / Speed Insights** | מדדי שימוש וביצועים בפרודקשן |

## 📁 מבנה הפרויקט

```
src/
├─ pages/           עמודי האפליקציה (הזמנות, מוצרים, מחסנים, החזרות, סטטיסטיקה...)
├─ features/        לוגיקה פיצ'רית מאורגנת (auth, notifications, language...)
├─ components/      רכיבי UI לשימוש חוזר (layout, טבלאות, מודלים)
├─ store/           Redux store + RTK Query API slices
├─ i18n/            קבצי תרגום EN/RU/HE
├─ utils/           פונקציות עזר משותפות
├─ constants/       קבועים גלובליים
└─ styles/          עיצוב גלובלי (SCSS)
```

## 🖼️ צילומי מסך

> צילומי המסך למטה מתועדים מתוך המערכת בפועל (ממשק בעברית ובאנגלית, בהתאמה לתפקיד המשתמש המחובר).

| | |
|---|---|
| **מסך התחברות** <br> ![Login](screenshots/login.png) | **דף הבית — התראת מלאי נמוך** <br> ![Dashboard alert](screenshots/dashboard-alert.png) |
| **דף הבית בעברית (RTL)** <br> ![Dashboard Hebrew](screenshots/dashboard-he.png) | **ניהול מוצרים** <br> ![Products](screenshots/products.png) |
| **כל ההזמנות** <br> ![Orders](screenshots/orders.png) | **סטטיסטיקה כללית** <br> ![Statistics](screenshots/statistics.png) |
| **ניהול מחסנים** <br> ![Warehouses](screenshots/warehouses.png) | **החזרות** <br> ![Returns](screenshots/returns.png) |

## 🚀 התקנה והרצה מקומית

**דרישות מוקדמות:** Node.js 18+‎, Yarn, וגישה ל-API של ה-Backend (מקומי או מרוחק).

```bash
git clone https://github.com/igorlyakh/storage_frontend.git
cd storage_frontend
yarn install
yarn dev
```

האפליקציה תעלה על `http://localhost:5173`. בסביבת פיתוח, Vite מגדיר Proxy אוטומטי מ-`/api` ומ-`/uploads` אל שרת ה-Backend המקומי בפורט `3001` (ראו `vite.config.js`) — אין צורך במשתני סביבה נוספים בצד ה-Frontend.

## 📜 סקריפטים זמינים

| פקודה | תיאור |
|---|---|
| `yarn dev` | הרצת שרת פיתוח עם Hot Reload |
| `yarn build` | בנייה לפרודקשן לתיקיית `dist/` |
| `yarn preview` | הרצת build הפרודקשן מקומית |
| `yarn lint` | בדיקת קוד עם ESLint |

## ☁️ פריסה (Deployment)

הפרויקט מוגדר לפריסה על **Vercel** (ראו `vercel.json`):

- `framework: vite`, בנייה עם `yarn build`, פלט מתיקיית `dist/`
- כל בקשה ל-`/api/*` ול-`/uploads/*` מנותבת (Rewrite) אל שרת ה-Backend
- כל שאר הנתיבים מנותבים ל-`index.html` (תמיכה ב-SPA routing)

קיימת גם אפשרות פריסה חלופית שבה שרת ה-Backend (NestJS) מגיש את קובצי ה-`dist/` הבנויים ישירות כ-Static files (למשל בפריסת VPS), ללא Vercel כלל.

## 🔗 הפרויקט הקשור — Backend

קוד השרת (NestJS + PostgreSQL) נמצא בריפו נפרד: **[storage_backend](https://github.com/igorlyakh/storage_backend)**.

## 📄 רישיון

הפרויקט הזה הוא **קנייני** וכל הזכויות בו שמורות. אין להעתיק, להפיץ או לעשות בו שימוש ללא רשות מפורשת ובכתב. לפרטים ראו את קובץ [LICENSE](LICENSE).

</div>
