
# Deployment Guide

This project is set up for deployment with a separate backend (Render) and frontend (Vercel).

## Project Structure

- `backend/`: Node.js/Express server
- `frontend/`: React/Vite application

## 1. Backend Deployment (Render)

1.  Create a new **Web Service** on Render.
2.  Connect your GitHub repository.
3.  **Settings:**
    -   **Root Directory:** `backend`
    -   **Build Command:** `npm install`
    -   **Start Command:** `node server.js`
4.  **Environment Variables:**
    -   `MONGO_URI`: Your MongoDB connection string.
    -   `JWT_SECRET`: A secure random string for authentication.
    -   `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://your-portfolio.vercel.app`).
        -   *Note: You can deploy the backend first, then update this variable later once you have the frontend URL.*

## 2. Frontend Deployment (Vercel)

1.  Create a new **Project** on Vercel.
2.  Import your GitHub repository.
3.  **Settings:**
    -   **Root Directory:** `frontend`
    -   **Framework Preset:** Vite
    -   **Build Command:** `npm run build` (or `vite build`)
    -   **Output Directory:** `dist`
4.  **Environment Variables:**
    -   `VITE_API_URL`: The URL of your deployed backend (e.g., `https://faiz-portfolio-jpb2.onrender.com`).
        -   *Important: Do not add a trailing slash `/`.*

## 3. Local Development

To run the project locally:

1.  **Backend:**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    Runs on `http://localhost:5000`.

2.  **Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    Runs on `http://localhost:5173`.

**Note:** The frontend is configured to use `VITE_API_URL` from `.env`.
-   For local development, ensure `frontend/.env` has `VITE_API_URL=http://localhost:5000` (or allow it to fallback to production URL if you want).
-   Current `frontend/.env` is set to Production URL: `https://faiz-portfolio-jpb2.onrender.com`.

## Troubleshooting

-   **CORS Errors:** ensuring `FRONTEND_URL` in backend environment variables matches your Vercel URL exactly.
-   **API Connection Failed:** Check if `VITE_API_URL` is set correctly in Vercel. Inspect the Network tab in your browser to see where requests are being sent.
