<div align="center">

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=NeuraScan&fontSize=80&fontColor=fff&animation=twinkling&fontAlignY=35&desc=AI%20Learning%20Disorder%20Detection%20System&descAlignY=62&descAlign=50" width="100%"/>

<br/>

[![React](https://img.shields.io/badge/React_18-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

<br/>

> 🧠 **NeuraScan** is a modern SaaS platform that uses AI to detect learning disorders from student work.  
> Teachers upload papers, parents track progress — all powered by a Spring Boot backend.

<br/>

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-neurascan.vercel.app-blue?style=for-the-badge)](https://neurascan-frontend.vercel.app)
&nbsp;
[![Backend Repo](https://img.shields.io/badge/🔧%20Backend%20API-Spring%20Boot-6DB33F?style=for-the-badge)](https://github.com/Niwas-Kumar)

<br/>

</div>

---

## ✨ What is NeuraScan?

NeuraScan helps **teachers** and **parents** identify learning disorders (dyslexia, dyscalculia, ADHD indicators, etc.) early — before they impact a child's academic future.

| 🎯 Who It's For | 💡 What They Get |
|---|---|
| 👩‍🏫 **Teachers** | Upload student papers → get instant AI-powered disorder risk analysis |
| 👨‍👩‍👦 **Parents** | View child's latest report, track progress over time, monitor quiz results |
| 🤖 **The AI** | Flags risk levels, generates detailed reports, powers analytics dashboards |

---

## 🖼️ Feature Highlights

<details>
<summary><b>👩‍🏫 Teacher Portal</b></summary>
<br/>

| Page | Route | Description |
|---|---|---|
| 📊 **Dashboard** | `/teacher/dashboard` | KPI cards, trend charts, live activity feed |
| 🏫 **Classes** | `/teacher/classes` | Create & manage classes |
| 🎓 **Students** | `/teacher/classes/:id/students` | Add, edit, delete students per class |
| 📤 **Upload Paper** | `/teacher/upload` | Drag-and-drop upload — AI analysis runs instantly |
| 📋 **Reports** | `/teacher/reports` | Filterable, searchable accordion report list |
| 📈 **Analytics** | `/teacher/analytics` | BarChart · RadarChart · ScatterChart + at-risk table |
| 🧩 **Quizzes** | `/teacher/quizzes` | Create quizzes, send to students via email link |
| ⚙️ **Settings** | `/teacher/settings` | Profile · Password · Notifications · Appearance |

</details>

<details>
<summary><b>👨‍👩‍👦 Parent Portal</b></summary>
<br/>

| Page | Route | Description |
|---|---|---|
| 🏠 **Dashboard** | `/parent/dashboard` | Child's latest analysis, risk status, summary |
| 📉 **Progress** | `/parent/progress` | Score history line chart + full report timeline |
| 🧩 **Quiz Progress** | `/parent/quiz-progress` | Track child's quiz performance over time |
| ⚙️ **Settings** | `/parent/settings` | Profile · Password · Notifications · Appearance |

</details>

<details>
<summary><b>🔐 Auth Flow</b></summary>
<br/>

| Page | Route | Description |
|---|---|---|
| 🔐 **Login** | `/login` | Role-toggled (Teacher / Parent) with Google & GitHub OAuth |
| ✨ **Register** | `/register` | 3-step animated onboarding wizard |
| 📧 **Forgot Password** | `/forgot-password` | Email-based reset request |
| 🔑 **Reset Password** | `/reset-password` | Token-validated new password form |
| ✅ **Verify Email** | `/verify-email` | Firebase email verification gate |

</details>

<details>
<summary><b>🌐 Public Pages</b></summary>
<br/>

| Page | Route |
|---|---|
| 🏠 Landing | `/` |
| 💳 Pricing | `/pricing` |
| ❓ Help | `/help` |
| 📬 Contact | `/contact` |
| 🧬 About | `/about` |
| 🎯 Quiz Attempt | `/quiz-attempt` *(email link)*  |

</details>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology |
|---|---|
| **UI Framework** | React 18 + React Router DOM v6 |
| **Build Tool** | Vite 5 |
| **Animations** | Framer Motion |
| **Charts** | Recharts (Bar · Radar · Scatter · Line) |
| **Auth / DB** | Firebase (Auth + Firestore) |
| **HTTP Client** | Axios |
| **Icons** | Lucide React |
| **Notifications** | React Hot Toast |
| **File Upload** | React Dropzone |
| **Backend** | Spring Boot (REST API on `:8080`) |
| **Deployment** | Vercel |

</div>

---

## ⚡ Quick Start

### Prerequisites

| Requirement | Version |
|---|---|
| **Node.js** | `18+` (LTS recommended) |
| **npm** | `9+` |
| **NeuraScan Backend** | Running on `http://localhost:8080` |

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Niwas-Kumar/neurascan-frontend.git
cd neurascan-frontend

# 2. Install dependencies
npm install

# 3. Copy and configure environment variables
cp .env.development .env.local
# → Edit .env.local with your Firebase config and API URL

# 4. Start the dev server
npm run dev
```

> ✅ App starts at **`http://localhost:3000`** — all `/api/*` calls proxy to your backend at `:8080`

### Build & Preview

```bash
npm run build    # Production build → dist/
npm run preview  # Serve the production build locally
```

---

## 🔧 Environment Variables

Create a `.env.local` (gitignored) based on `.env.development`:

```env
# Backend API
VITE_API_URL=http://localhost:8080

# Firebase
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## 📁 Project Structure

```
neurascan-frontend/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   ├── auth/            # OAuth redirect handler
│   │   ├── layout/          # AppLayout (sidebar + nav)
│   │   └── shared/          # Reusable UI components
│   ├── context/
│   │   └── AuthContext.jsx  # Global auth state (Firebase)
│   ├── hooks/               # Custom React hooks
│   ├── pages/
│   │   ├── auth/            # Login · Register · Forgot/Reset · Verify
│   │   ├── teacher/         # Dashboard · Classes · Upload · Reports · Analytics · Quizzes
│   │   ├── parent/          # Dashboard · Progress · Quiz Progress
│   │   ├── LandingPage.jsx
│   │   ├── PricingPage.jsx
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   └── HelpPage.jsx
│   ├── services/
│   │   └── api.js           # All Axios API calls (one file to rule them all)
│   ├── styles/
│   │   └── designSystem.css # CSS custom properties / design tokens
│   ├── utils/               # Helper functions
│   ├── App.jsx              # Root router + auth guards
│   ├── firebase.js          # Firebase initialization
│   └── main.jsx             # React entry point
├── .env.development         # Dev environment template
├── .env.production          # Prod environment template
├── vite.config.js           # Vite + dev proxy config
└── vercel.json              # Vercel SPA rewrite rules
```

---

## 🔑 OAuth Setup (Google & GitHub)

**Step 1 —** Configure OAuth2 providers in your Spring Boot backend *(see backend README)*

**Step 2 —** Update `handleOAuth` in `src/pages/auth/LoginPage.jsx`:

```js
const handleOAuth = (provider) => {
  window.location.href = `/oauth2/authorization/${provider.toLowerCase()}`;
};
```

> OAuth callback is handled by `src/components/auth/OAuth2RedirectHandler.jsx` at `/oauth2/redirect`

---

## 📝 Developer Notes

| Topic | Detail |
|---|---|
| 🔐 **JWT Storage** | Token stored in `localStorage` under the key `ns_token` |
| 🌐 **API Layer** | All calls live in `src/services/api.js` — one file to update if endpoints change |
| 🛡️ **Auth Guard** | Any `401` response auto-redirects to `/login` |
| 💤 **Backend Keep-Alive** | `useBackendKeepAlive` pings the backend every 14 min to prevent cold starts |
| 🎨 **Design Tokens** | All colors, spacing, and shadows use CSS variables from `designSystem.css` |
| 🔒 **Route Protection** | `ProtectedRoute` checks auth + role — teachers can't see parent routes and vice versa |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feat/your-feature`
3. **Commit** your changes: `git commit -m "feat: add your feature"`
4. **Push** to your fork: `git push origin feat/your-feature`
5. **Open** a Pull Request

Please follow the existing code style and keep changes focused.

---

## 📄 License

This project is licensed under the **MIT License**.

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=100&section=footer" width="100%"/>

**NeuraScan** &nbsp;·&nbsp; Empowering Early Detection of Learning Disorders &nbsp;·&nbsp; v2.0

Made with ❤️ by [Niwas Kumar](https://github.com/Niwas-Kumar)

</div>
