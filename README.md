<div align="center">

<img src="https://img.shields.io/badge/NeuraScan-AI%20Learning%20Disorder%20Detection-blue?style=for-the-badge&logo=brain&logoColor=white" alt="NeuraScan" />

<br/>
<br/>

![React](https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js_18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![npm](https://img.shields.io/badge/npm_9+-CB3837?style=for-the-badge&logo=npm&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

<br/>

*Modern SaaS frontend for the NeuraScan AI Learning Disorder Detection System*

</div>

---

## ⚡ Prerequisites

| Requirement | Version | Notes |
|---|---|---|
| ![Node](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) **Node.js** | `18+` | LTS recommended |
| ![npm](https://img.shields.io/badge/npm-CB3837?style=flat-square&logo=npm&logoColor=white) **npm** | `9+` | Comes with Node |
| ![Spring](https://img.shields.io/badge/Backend-6DB33F?style=flat-square&logo=springboot&logoColor=white) **NeuraScan Backend** | — | Running on `http://localhost:8080` |

---

## 🚀 Quick Start

**1 · Install dependencies**
```bash
npm install
```

**2 · Start the development server**
```bash
npm run dev
```
> App opens at **`http://localhost:3000`** — all `/api/*` requests are automatically proxied to port `8080`

**3 · Build for production**
```bash
npm run build
npm run preview
```

---

## 🗂️ Pages & Roles

### 👩‍🏫 Teacher Account

| Page | Description |
|---|---|
| 📊 **Dashboard** | Stats, trend charts, and activity feed |
| 🎓 **Students** | Add, edit, and delete student cards |
| 📤 **Upload Paper** | Drag-drop upload with AI analysis results |
| 📋 **Reports** | Filterable accordion report list |
| 📈 **Analytics** | BarChart, RadarChart, ScatterChart + at-risk table |
| ⚙️ **Settings** | Profile, password, notifications, appearance |

### 👨‍👩‍👦 Parent Account

| Page | Description |
|---|---|
| 👶 **My Child** | Latest analysis report with risk status |
| 📉 **Progress** | Score history line chart + report timeline |
| ⚙️ **Settings** | Profile, password, notifications, appearance |

### 🔐 Auth Pages

| Page | Description |
|---|---|
| 🔐 **Login** | Role-toggled (Teacher / Parent) with OAuth buttons |
| ✨ **Register** | 3-step animated wizard |
| 📧 **Forgot Password** | Email-based reset flow |

---

## 🔗 Connecting to the Backend

All `/api` traffic is proxied via `vite.config.js`. If your backend runs on a different port, update the target:

```js
// vite.config.js
proxy: {
  '/api': {
    target: 'http://localhost:YOUR_PORT',
    changeOrigin: true,
  }
}
```

---

## 🔑 OAuth — Google & GitHub

The login page includes OAuth buttons. To wire them to your Spring Boot backend:

**Step 1 —** Configure OAuth2 in the Spring Boot backend *(see backend README)*

**Step 2 —** Update `handleOAuth` in `LoginPage.jsx`:

```js
const handleOAuth = (provider) => {
  window.location.href = `/oauth2/authorization/${provider.toLowerCase()}`;
};
```

---

## 📝 Developer Notes

> **JWT** — Token is stored in `localStorage` under the key `ns_token`

> **API Layer** — All API calls live in `src/services/api.js` — one file to update if endpoints change

> **Auth Guard** — On any `401` response, the app automatically redirects to `/login`

---

<div align="center">

**NeuraScan** &nbsp;·&nbsp; AI Learning Disorder Detection &nbsp;·&nbsp; Frontend v1.0

</div>
