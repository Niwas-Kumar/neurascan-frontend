<div align="center">

<img src="https://img.shields.io/badge/NeuraScan-AI%20Learning%20Disorder%20Detection-blue?style=for-the-badge&logo=brain&logoColor=white" alt="NeuraScan" />

<br/>
<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-22B5BF?style=for-the-badge&logo=chartdotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

<br/>

*Production-grade SaaS frontend for the NeuraScan AI-powered Learning Disorder Detection Platform*

</div>

---

## 📖 Overview

**NeuraScan** is an AI-powered SaaS platform designed to help educators and parents detect learning disorders in students at an early stage. The system analyses students' handwritten papers and quiz responses using machine learning models running on the backend and presents actionable insights through a clean, role-based web interface.

### Key capabilities

| Capability | Description |
|---|---|
| 🧠 **AI Analysis** | Upload handwritten answer sheets — the backend ML model detects patterns associated with dyslexia, dyscalculia, and attention disorders |
| 📊 **Role-based Dashboards** | Separate, purpose-built views for **Teachers** and **Parents** |
| 🎓 **Class & Student Management** | Teachers organise students into classes, track progress over time |
| 📝 **Quiz Engine** | Teachers create and assign quizzes; parents view their child's quiz performance |
| 📈 **Advanced Analytics** | Bar, Radar, and Scatter charts built with Recharts for trend analysis and at-risk identification |
| 🔐 **Secure Authentication** | JWT-based session management with Google OAuth via Firebase |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
│                                                                 │
│   React 18 + Vite                                               │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│   │  Pages   │  │Components│  │ Context  │  │   Services   │  │
│   │ (routes) │→ │  (UI)    │→ │(AuthCtx) │→ │  (api.js)    │  │
│   └──────────┘  └──────────┘  └──────────┘  └──────┬───────┘  │
│                                                      │          │
└──────────────────────────────────────────────────────┼──────────┘
                                                       │ HTTP / REST
              ┌────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────┐      ┌──────────────────────────┐
│   Spring Boot Backend        │      │   Firebase (Auth)         │
│   (REST API — port 8080)    │      │   Google OAuth 2.0        │
│                             │      │   Token exchange          │
│  ┌─────────┐ ┌───────────┐  │      └──────────────────────────┘
│  │ ML Model│ │  Database │  │
│  │(Analysis│ │(PostgreSQL│  │
│  │ Engine) │ │ / MySQL)  │  │
│  └─────────┘ └───────────┘  │
└─────────────────────────────┘
```

### Frontend layers

| Layer | Technology | Responsibility |
|---|---|---|
| **Routing** | React Router v6 | Role-protected nested routes (`/teacher/*`, `/parent/*`) |
| **State** | React Context API | Global auth state (`AuthContext`) |
| **HTTP** | Axios | Centralised API client with JWT interceptors and auto-401 redirect |
| **UI / Charts** | Recharts, Framer Motion, Lucide React | Data visualisation, page transitions, icon set |
| **Auth** | Firebase SDK + JWT | Google OAuth sign-in; JWT stored in `localStorage` under `ns_token` |
| **Build** | Vite 5 | Dev server (port 3000), HMR, `/api` proxy to backend |
| **Styling** | CSS custom properties | Design token system (`src/styles/tokens.css`, `designSystem.css`) |
| **Deploy** | Vercel | `vercel.json` SPA rewrite rules included |

### Authentication & authorisation flow

```
User clicks "Sign in with Google"
        │
        ▼
Firebase Google OAuth popup
        │
        ▼
ID token returned to frontend
        │
        ▼
POST /api/auth/google  ──►  Spring Boot validates token
                                     │
                              Issues JWT (role: TEACHER | PARENT)
                                     │
                          ◄──────────┘
JWT stored in localStorage (ns_token)
        │
        ▼
Axios interceptor attaches Bearer token to every request
        │
        ▼
401 response → auto-redirect to /login
```

---

## 📂 Project Structure

```
neurascan-frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── auth/              # OAuth redirect handler, premium auth layout
│   │   ├── landing/           # Public navbar & footer
│   │   ├── layout/            # Authenticated app shell (sidebar + outlet)
│   │   ├── shared/            # Reusable UI primitives (buttons, loaders, cards)
│   │   └── teacher/           # Teacher-specific cards (ClassCard, StudentCard)
│   ├── context/
│   │   └── AuthContext.jsx    # Global auth state, login/logout helpers
│   ├── hooks/
│   │   ├── useBackendKeepAlive.js   # Pings backend every 14 min (Render cold-start)
│   │   └── index.js
│   ├── pages/
│   │   ├── auth/              # Login, Register, ForgotPassword, ResetPassword, VerifyEmail
│   │   ├── parent/            # ParentDashboard, ProgressPage, QuizProgressPage
│   │   ├── teacher/           # TeacherDashboard, ClassesView, UploadPage, ReportsPage,
│   │   │                      #   AnalyticsPage, QuizPage
│   │   ├── AboutPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── HelpPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── PricingPage.jsx
│   │   ├── QuizAttemptPage.jsx   # Public quiz link (accessed via email token)
│   │   └── SettingsPage.jsx      # Shared settings for both roles
│   ├── services/
│   │   ├── api.js             # Axios instance, interceptors, all endpoint helpers
│   │   ├── optimizedApi.js    # Request deduplication / caching layer
│   │   └── handwritingAnalysis.js
│   ├── styles/
│   │   ├── tokens.css         # CSS custom-property design tokens
│   │   ├── designSystem.css   # Component-level style utilities
│   │   └── globals.css
│   ├── utils/
│   │   └── requestCache.js    # In-memory request cache
│   ├── firebase.js            # Firebase app initialisation (reads VITE_FIREBASE_* env vars)
│   ├── App.jsx                # Root router, protected route wrappers
│   └── main.jsx               # React DOM entry point
├── .env.example               # Required environment variable template (no real values)
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## 🛠️ Tech Stack

| Category | Library / Tool | Version |
|---|---|---|
| UI Framework | React | 18 |
| Build Tool | Vite | 5 |
| Routing | React Router DOM | 6 |
| HTTP Client | Axios | 1.6 |
| Charts | Recharts | 2.12 |
| Animations | Framer Motion | 11 |
| Icons | Lucide React | 0.323 |
| Auth (OAuth) | Firebase SDK | 12 |
| Notifications | React Hot Toast | 2.4 |
| File Upload | React Dropzone | 14 |
| Date Utilities | date-fns | 3 |

---

## ⚡ Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| **Node.js** | `18+` | LTS recommended |
| **npm** | `9+` | Comes with Node |
| **NeuraScan Backend** | — | Running on `http://localhost:8080` |
| **Firebase project** | — | Required for Google OAuth (see setup below) |

---

## 🚀 Quick Start

**1 · Install dependencies**
```bash
npm install
```

**2 · Configure environment variables**

Copy `.env.example` to `.env.development` and fill in your values:
```bash
cp .env.example .env.development
```

```env
VITE_API_URL=http://localhost:8080/api

VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**3 · Start the development server**
```bash
npm run dev
```
> App opens at **`http://localhost:3000`** — all `/api/*` requests are automatically proxied to port `8080`

**4 · Build for production**
```bash
npm run build
npm run preview
```

---

## 🗂️ Pages & Roles

### 👩‍🏫 Teacher Account

| Page | Route | Description |
|---|---|---|
| 📊 **Dashboard** | `/teacher/dashboard` | KPI cards, trend charts, and recent activity feed |
| 🏫 **Classes** | `/teacher/classes` | Create and manage classes |
| 🎓 **Students** | `/teacher/classes/:id/students` | Add, edit, and remove students per class |
| 📤 **Upload Paper** | `/teacher/upload` | Drag-and-drop handwriting upload with instant AI analysis |
| 📋 **Reports** | `/teacher/reports` | Filterable, paginated analysis report list |
| 📈 **Analytics** | `/teacher/analytics` | BarChart, RadarChart, ScatterChart + at-risk summary table |
| 📝 **Quizzes** | `/teacher/quizzes` | Create quizzes, distribute via email link |
| ⚙️ **Settings** | `/teacher/settings` | Profile, password, notifications, appearance |

### 👨‍👩‍👦 Parent Account

| Page | Route | Description |
|---|---|---|
| 👶 **Dashboard** | `/parent/dashboard` | Child's latest analysis report with risk indicators |
| 📉 **Progress** | `/parent/progress` | Score history line chart and timestamped report timeline |
| 🧩 **Quiz Progress** | `/parent/quiz-progress` | Quiz attempt history and scores |
| ⚙️ **Settings** | `/parent/settings` | Profile, password, notifications, appearance |

### 🔐 Auth & Public Pages

| Page | Route | Description |
|---|---|---|
| 🏠 **Landing** | `/` | Marketing landing page |
| 💰 **Pricing** | `/pricing` | Plans and feature comparison |
| ❓ **Help** | `/help` | FAQs and guides |
| 📬 **Contact** | `/contact` | Contact form |
| ℹ️ **About** | `/about` | Project and team info |
| 🔐 **Login** | `/login` | Role-toggled (Teacher / Parent) with Google OAuth |
| ✨ **Register** | `/register` | 3-step animated registration wizard |
| 📧 **Forgot Password** | `/forgot-password` | Email-based reset request |
| 🔑 **Reset Password** | `/reset-password` | Token-validated password reset |
| ✅ **Verify Email** | `/verify-email` | Email verification confirmation |
| 🧩 **Quiz Attempt** | `/quiz-attempt` | Public quiz page accessed via emailed token |

---

## 🔗 Connecting to the Backend

All `/api` traffic is proxied via `vite.config.js` during development. If your backend runs on a different port, update the target:

```js
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:YOUR_PORT',
    changeOrigin: true,
  }
}
```

In production (`npm run build`), set `VITE_API_URL` in your deployment environment to the backend's full URL — Axios will use it directly without a proxy.

---

## 🔑 Firebase & Google OAuth Setup

1. Create a project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable **Authentication → Sign-in method → Google**
3. Copy the web app config values into your `.env.development` (and Vercel/CI environment variables for production)
4. In the Spring Boot backend, configure `spring.security.oauth2.client` with the same Firebase / Google credentials *(see backend README)*

---

## 📝 Developer Notes

> **JWT** — Token is stored in `localStorage` under the key `ns_token`. A `sessionStorage` fallback exists for legacy sessions.

> **API Layer** — All endpoint helpers live in `src/services/api.js`. Change the `VITE_API_URL` env var to point at any environment.

> **Request Optimisation** — `src/services/optimizedApi.js` and `src/utils/requestCache.js` provide in-memory caching and request deduplication to reduce redundant network calls.

> **Auth Guard** — Any `401` response from the backend triggers an automatic redirect to `/login`, implemented in the Axios response interceptor.

> **Backend Keep-Alive** — `useBackendKeepAlive` pings the backend every 14 minutes to prevent the Render free-tier instance from going cold.

> **Design Tokens** — All colours, spacing, and shadows are defined as CSS custom properties in `src/styles/tokens.css`. Override these to retheme the application.

---

## 👤 Contributors

| Name | Role |
|---|---|
| [**Niwas Kumar**](https://github.com/Niwas-Kumar) | Creator & Lead Developer |

---

<div align="center">

**NeuraScan** &nbsp;·&nbsp; AI Learning Disorder Detection &nbsp;·&nbsp; Frontend v2.0

</div>
