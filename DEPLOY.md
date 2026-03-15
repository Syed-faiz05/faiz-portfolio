# Deployment Guide

This project is set up to deploy the **Backend on Render** and the **Frontend on Vercel**.

---

## 1. Backend Deployment (Render)

Render natively supports Node.js/Express applications without requiring severless configurations.

### Steps to Deploy
1. Go to [Render](https://render.com) and click **New+ > Web Service**.
2. Connect your GitHub repository and select your project.
3. **Settings:**
    - **Language:** Node
    - **Root Directory:** `backend`
    - **Build Command:** `npm install`
    - **Start Command:** `node server.js`
4. **Environment Variables:**
    - Add `MONGO_URI` (Your MongoDB Atlas connection string).
    - Add `JWT_SECRET` (A secure random string).
5. Click **Create Web Service**.
6. Once deployed, copy your new Render backend URL (e.g., `https://faiz-portfolio-backend.onrender.com`).

---

## 2. Frontend Deployment (Vercel)

Vercel provides excellent out-of-the-box support for Vite + React applications. The `.nvmrc` file in the repository root ensures Vercel uses the correct, stable Node LTS version for native modules.

### Steps to Deploy
1. Open your `frontend/.env` file (or `src/config.js`) and ensure your `VITE_API_URL` points to your newly deployed Render backend.
   ```env
   VITE_API_URL=https://faiz-portfolio-backend.onrender.com
   ```
   *(Make sure there is no trailing slash `/` at the end of the URL)*
2. Push any updated `.env` configurations to GitHub.
3. Go to [Vercel](https://vercel.com) and click **Add New... > Project**.
4. Import your GitHub repository.
5. **Settings:**
    - **Root Directory:** Edit this and select the `frontend` folder.
    - **Framework Preset:** Vite
    - **Build Command:** `npm run build`
    - **Output Directory:** `dist`
6. **Environment Variables:**
    - Add `VITE_API_URL` pointing to your Render backend URL (if you didn't commit it to `.env`).
7. Click **Deploy**.
8. Once deployed, Vercel will provide your live public URL (e.g., `https://faiz-portfolio.vercel.app`).

---

## 3. Final Step: Whitelist your Frontend URL

Once your frontend is active on Vercel, you MUST whitelist its URL in your backend so CORS doesn't block the requests.

1. Open `backend/server.js`.
2. Locate the `allowedOrigins` array near the top.
3. Add your new Vercel URL to the list:
```javascript
const allowedOrigins = [
    'https://faiz-portfolio.vercel.app',          // ADD YOUR VERCEL URL HERE
    'http://localhost:5173',
    'http://localhost:5000'
];
```
4. Push this change to GitHub. Render will automatically redeploy your backend with the updated CORS policy.
