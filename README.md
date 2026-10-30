# AnNur Web Edition

This is a separate browser/PWA port created from the supplied native Android source ZIP.

## Important architecture note
The supplied Android app is **native Kotlin + Jetpack Compose** (`com.annur.quran`, version `2.9.7`). It does not contain a reusable React/Vite web bundle. This project is therefore a separate React + Vite implementation. The original Android project has not been modified.

## Included in this first web port
- Responsive AnNur web shell with dark/light theme and Bangla/English UI toggle
- 114-surah index extracted from the Android app's QuranData.kt and Bengali resource array
- Original 614-page Imdadia Hafezi Quran PDF embedded in the reader
- Local browser bookmarks and last-read page
- Prayer-time lookup using AlAdhan API (requires location permission and internet)
- Qibla bearing calculation using browser geolocation; device compass heading is best-effort and browser-dependent
- Tasbih counter, goal, Khatam tracker and private local journal (localStorage)
- Bundled Sunnah, Ruqyah, Muslim names and fallback Hadith data
- Streaming recitation for Mishary Alafasy (internet required)
- PWA manifest and service worker for installability / app-shell caching

## Not yet at Android feature parity
This is not a byte-for-byte or feature-complete conversion of the Android application. The native project contains additional screens and services (full Quran text/search and ayah audio timing, full Hadith repository, tafsir, onboarding, account/Firestore sync, journal PIN/biometric/photo/bin, backup/restore, adhan/reminder scheduling, background audio/media session, live streams, widgets, fasting/Ramadan trackers, qaza/attendance, zakat calculator, Hijri calendar, detailed settings and native integrations). Those require separate web implementations and testing.

Web-specific limitations:
- Browser notifications and background execution are not equivalent to Android exact alarms/boot receivers.
- Web cannot provide Android home-screen widgets, Android biometric APIs, or guaranteed background media playback.
- Local journal/bookmarks/counters are browser-profile-specific until cloud sync is implemented.
- PDF display uses the browser's built-in PDF viewer; behavior differs by browser.

## Run locally
Requirements: Node.js 20+.

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages
1. Push this folder's contents to a new GitHub repository (or a dedicated `web` branch/folder).
2. In GitHub: Settings -> Pages -> Build and deployment -> Source: **GitHub Actions**.
3. The included workflow `.github/workflows/deploy.yml` builds and publishes `dist`.
4. Your site will be available at `https://YOUR-USERNAME.github.io/REPOSITORY/`.

If using a custom domain, configure it in Settings -> Pages and update DNS. GitHub Pages serves static files only; it is not a backend/database host.

## Data / attribution
The Quran PDF, JSON datasets, fonts and app logo were copied from the supplied AnNur source archive. Keep the original project's relevant content attribution and font licenses with any redistribution. Review the permissions for each bundled content source before public deployment.
