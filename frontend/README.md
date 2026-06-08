# CloseMate AI — Frontend

React + Vite + TypeScript chat-based frontend for CloseMate AI, an AI-powered assistant that helps salespeople and insurance agents close more deals.

## Tech Stack

- **React 18** with TypeScript
- **Vite 5** for dev/build
- **Tailwind CSS 3** for styling
- **React Router 6** for routing
- **Axios** for API calls

## Project Structure

```
src/
├── main.tsx              # Entry point
├── App.tsx               # Route definitions
├── index.css             # Tailwind imports + global styles
├── context/
│   └── AuthContext.tsx    # Auth state (JWT, login/logout)
├── services/
│   └── api.ts            # Axios API client
├── components/
│   ├── AppLayout.tsx      # App shell (header, usage meter, nav)
│   └── UsageMeter.tsx     # Free tier usage indicator
└── pages/
    ├── LandingPage.tsx   # Marketing landing page (route: /)
    ├── LoginPage.tsx     # Login form (route: /login)
    ├── SignupPage.tsx    # Signup form (route: /signup)
    ├── ChatPage.tsx      # Main chat interface (route: /app)
    ├── PricingPage.tsx   # Free/Pro plans (route: /pricing)
    ├── SuccessPage.tsx   # Post-payment success
    └── CancelPage.tsx    # Payment cancellation
```

## Routes

| Path | Page | Auth Required |
|------|------|--------------|
| `/` | Landing page | No |
| `/login` | Login | No (redirects to /app if logged in) |
| `/signup` | Signup | No (redirects to /app if logged in) |
| `/app` | Chat interface | Yes |
| `/pricing` | Pricing & plans | Yes |
| `/success` | Post-checkout success | Yes |
| `/cancel` | Cancellation | Yes |

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (proxies /api to localhost:3001)
npm run dev

# Build for production
npm run build
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `/api` | Backend API base URL (Vite dev proxy used by default) |

## API Proxy

In development, Vite proxies `/api/*` requests to the backend at `http://localhost:3001`. In production, set `VITE_API_URL` to the production backend URL.

## Features

- **Objection Handler** — Paste an objection, get a persuasive rebuttal script
- **Script Generator** — Describe your scenario/product, get a tailored sales script
- **Lead Responder** — Paste a lead's message, get a suggested response
- **Usage Meter** — Shows remaining free-tier requests in the header
- **Subscription Paywall** — Free (5/day) and Pro ($29/mo unlimited) tiers with Stripe