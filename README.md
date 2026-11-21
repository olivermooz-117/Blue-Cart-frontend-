# BlueCart Marketplace — Frontend

BlueCart helps users compare products across **Amazon, AliExpress, and eBay** using a Marginal Benefit / Cost-Benefit ranking system based on price, ratings, and payment safety.

**Live App:** https://blue-cart-frontend.vercel.app  
**Backend API:** https://blue-cart-backend-ynqy.onrender.com

---

## Features

| Feature | Description |
|---------|-------------|
| Multi-shop search | Search Amazon, AliExpress, and eBay in one query |
| MB/CB ranking | Products ranked by price, rating, and payment safety |
| Custom filters | Sliders to re-weight ranking factors live |
| **Product reviews** | Leave and read reviews per search query (guest or logged-in) |
| **Trust signals** | Pay-after-delivery badges and trusted-product highlights |
| **Marketplace availability** | See which shops contributed results and which are unavailable |
| Authentication | Email/password register and login |
| Search history | Logged-in users can view and re-run past searches |
| **Saved preferences** | Ranking weights remembered via localStorage |
| Responsive + PWA | Works on mobile and can be installed as an app |

---

## Tech Stack

- React 19 + Vite
- Redux Toolkit
- React Router
- Axios
- Vitest + Testing Library
- Vite PWA Plugin
- Deployed on Vercel

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/olivermooz-117/Blue-Cart-frontend-.git
cd Blue-Cart-frontend-
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and edit:

```env
# Local backend
VITE_API_URL=http://localhost:5000/api

# Or live backend
VITE_API_URL=https://blue-cart-backend-ynqy.onrender.com/api
```

Important: The URL must end with `/api`.

### 3. Run

```bash
npm run dev
```

App runs at `http://localhost:5173`.

### 4. Tests

```bash
npm test
```

### 5. Build

```bash
npm run build
npm run preview
```

---

Team

Oliver Moosberger  
John Muthomi  
Precious Faith Rodenyi  
Manasseh Mugo