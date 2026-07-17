# Import2Profit

Import2Profit is a full-stack web application for managing imported products bought from international suppliers and resold on marketplaces such as Vinted, eBay, Amazon Seller, Wallapop and OLX.

The codebase is written in English. The user interface is in Portuguese from Portugal.

## Stack

- Frontend: React + Vite + CSS Modules
- Backend: Node.js + Express
- Database: MongoDB with Mongoose
- Authentication: JWT login/register

## Getting Started

1. Install dependencies:

```bash
npm run install:all
```

2. Create `backend/.env` from `backend/.env.example`.

3. Start the app:

```bash
npm run dev
```

Backend: `http://localhost:5000`

Frontend: `http://localhost:5173`

## Deploy Frontend on Netlify

Netlify should host the React frontend. The Express API needs to run separately, for example on Render, Railway, Fly.io or another Node.js host connected to MongoDB Atlas.

1. Push this repository to GitHub.

2. In Netlify, create a new site from Git and choose this repository.

3. Netlify will read `netlify.toml`, which uses:

```text
Base directory: frontend
Build command: npm run build
Publish directory: dist
```

4. Add this environment variable in Netlify:

```env
VITE_API_URL=https://your-api-domain.com/api
```

Replace `https://your-api-domain.com` with the deployed backend URL.

5. Deploy the site.

6. In the backend host, set `CLIENT_URL` to the final Netlify URL, for example:

```env
CLIENT_URL=https://import2profit.netlify.app
```

For local development, keep using:

```env
VITE_API_URL=http://localhost:5000/api
```

## Main Concepts

- Products track acquisition costs, shipping, duties, taxes, fees, stock status and profitability.
- Import orders group products into batches and can distribute shipping/customs costs between products.
- Sales register marketplace performance and update profit analytics.
- Dashboard and reports aggregate stock value, sales, margins, ROI and monthly profit.
