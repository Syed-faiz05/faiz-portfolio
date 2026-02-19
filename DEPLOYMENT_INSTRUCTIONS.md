
# 🚀 Deployment Guide: Render (Backend) & Netlify (Frontend)

This guide provides step-by-step instructions to deploy your full-stack portfolio.

## 1. Backend Deployment (Render)

**Service:** [Render](https://render.com/)  
**Type:** Web Service

### Configuration
1.  **Connect GitHub Repository:** Select your repo (`faiz-portfolio`).
2.  **Name:** `faiz-portfolio-api` (or similar)
3.  **Root Directory:** `backend`
4.  **Environment:** `Node`
5.  **Build Command:** `npm install`
6.  **Start Command:** `node server.js`

### Environment Variables (Required)
Add these in the "Environment" tab on Render:

| Variable | Value Description |
| :--- | :--- |
| `MONGO_URI` | Your full MongoDB connection string (e.g., from Atlas). |
| `JWT_SECRET` | A long, random string for security (e.g., generate one). |
| `FRONTEND_URL` | The URL of your **Netlify** site (e.g., `https://your-site.netlify.app`). |
| `PORT` | `10000` (Optional, Render sets this automatically). |

---

## 2. Frontend Deployment (Netlify)

**Service:** [Netlify](https://www.netlify.com/)  
**Type:** Site from Git

### Configuration
1.  **New Site from Git:** Select GitHub and your repo (`faiz-portfolio`).
2.  **Base Directory:** `frontend`
3.  **Build Command:** `npm run build`
4.  **Publish Directory:** `dist`

### Environment Variables (Required)
Add these in "Site configuration" > "Environment variables":

| Variable | Value Description |
| :--- | :--- |
| `VITE_API_URL` | The URL of your **Render** backend (e.g., `https://faiz-portfolio-api.onrender.com`). **Do not add a trailing slash.** |

### ⚠️ Important: SPA Redirects
For React routing to work on refresh (e.g., reloading `/projects`), a `_redirects` file is required in `public/`.
*State:* **I have already created this file for you locally (`frontend/public/_redirects`).** Ensure you push it to GitHub.

---

## 3. Deployment Workflow

1.  **Push Changes:**
    ```bash
    git add .
    git commit -m "Prepare for deployment"
    git push origin main
    ```

2.  **Wait for Builds:**
    -   Check Render dashboard for backend build status.
    -   Check Netlify dashboard for frontend build status.

3.  **Cross-Link URLs:**
    -   Once Netlify is live, copy the URL and update `FRONTEND_URL` in **Render**.
    -   Once Render is live, copy the URL and update `VITE_API_URL` in **Netlify**.
    -   **Redeploy** both if you changed environment variables.

## 4. Troubleshooting

*   **CORS Error?** 
    -   Ensure `FRONTEND_URL` in Render matches your Netlify URL **exactly** (no trailing slash).
    -   Ensure `server.js` uses `app.use(cors({ origin: process.env.FRONTEND_URL, ... }))` or allows all origins `app.use(cors())` for testing.

*   **Page Not Found on Refresh (Netlify)?**
    -   Verify `_redirects` file exists in `frontend/public/` with content: `/* /index.html 200`.

*   **API Connection Error?**
    -   Check Browser Console (F12) > Network Tab.
    -   Verify requests are going to `https://<render-url>/api/...` and not `localhost`.
