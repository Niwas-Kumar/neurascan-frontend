# NeuraScan Frontend — React + Vite

Modern SaaS frontend for the NeuraScan AI Learning Disorder Detection System.

## Prerequisites
- Node.js 18+
- npm 9+
- NeuraScan backend running on http://localhost:8080

## Quick Start

### 1. Install dependencies
npm install

### 2. Run development server
npm run dev

App opens at http://localhost:3000
All /api/* requests are automatically proxied to http://localhost:8080

## Build for Production
npm run build
npm run preview

## Pages & Roles

### Teacher Account
- Dashboard     — Stats, trend charts, activity feed
- Students      — Add / edit / delete student cards
- Upload Paper  — Drag-drop upload + AI analysis results
- Reports       — Filterable accordion report list
- Analytics     — BarChart, RadarChart, ScatterChart, at-risk table
- Settings      — Profile, password, notifications, appearance

### Parent Account
- My Child      — Latest analysis report with risk status
- Progress      — Score history line chart + report timeline
- Settings      — Profile, password, notifications, appearance

### Auth Pages
- Login         — Role-toggled (Teacher/Parent), OAuth buttons
- Register      — 3-step animated wizard
- Forgot Pasword — Email reset flow

## Connecting to Backend
The vite.config.js proxies /api to http://localhost:8080.
If your backend runs on a different port, change the target in vite.config.js:

  proxy: {
    '/api': {
      target: 'http://localhost:YOUR_PORT',
      changeOrigin: true,
    }
  }

## OAuth (Google/GitHub)
The login page shows OAuth buttons. To wire them up:
1. Configure OAuth2 in the Spring Boot backend (see backend README)
2. In LoginPage.jsx, change handleOAuth to:
   const handleOAuth = (provider) => {
     window.location.href = `/oauth2/authorization/${provider.toLowerCase()}`
   }

## Notes
- JWT token stored in localStorage under key ns_token
- All API calls in src/services/api.js — one file to update if endpoints change
- On 401 response, app automatically redirects to /login
