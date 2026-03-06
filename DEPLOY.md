# Deployment Guide

This project is set up to deploy the **Backend on Vercel** and the **Frontend on Netlify**.

---

## 1. Backend Deployment (Vercel)

Vercel is primarily for Serverless Functions. To host an Express.js backend on Vercel, you need to make a few small adjustments to your code so Vercel knows how to run it.

### Required Code Changes

**1. Create `backend/vercel.json`**
Create a new file named `vercel.json` inside your `backend` folder with the following configuration:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

**2. Update `backend/server.js`**
At the very bottom of `server.js`, you need to export the Express app instead of just listening to a port:
```javascript
// Remove or comment out the app.listen block:
// connectDB().then(() => {
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// });

// Replace with this for Vercel:
connectDB();
module.exports = app;
```

### Steps to Deploy
1. Push your updated code to GitHub.
2. Go to [Vercel](https://vercel.com) and click **Add New... > Project**.
3. Import your GitHub repository.
4. **Settings:**
    - **Root Directory:** Edit this and select the `backend` folder.
    - **Framework Preset:** Leave as `Other`.
5. **Environment Variables:**
    - Add `MONGO_URI` (Your MongoDB Atlas connection string).
    - Add `JWT_SECRET` (A secure random string).
6. Click **Deploy**.
7. Once deployed, copy your new Vercel backend URL (e.g., `https://my-backend.vercel.app`).

---

## 2. Frontend Deployment (Netlify)

Deploying a Vite + React frontend to Netlify is very straightforward.

### Required Configuration

**1. Set the API URL**
Go into your `frontend/.env` file (or `src/config.js`) and ensure your `VITE_API_URL` points to your newly deployed Vercel backend.
```env
VITE_API_URL=https://my-backend.vercel.app
```
*(Make sure there is no trailing slash `/` at the end of the URL)*

### Steps to Deploy
1. Push your frontend code changes to GitHub.
2. Go to [Netlify](https://www.netlify.com/) and click **Add new site > Import an existing project**.
3. Connect your GitHub account and select your repository.
4. **Settings:**
    - **Base directory:** `frontend`
    - **Build command:** `npm run build`
    - **Publish directory:** `frontend/dist`
5. **Environment Variables:**
    - Click "Add environment variables" and add `VITE_API_URL` with your Vercel backend URL.
6. Click **Deploy site**.
7. Once deployed, Netlify will give you a public URL.

---

## 3. Final Step: Whitelist your Frontend URL

Once your frontend is active on Netlify, you MUST whitelist its URL in your backend so CORS doesn't block the requests.

1. Open `backend/server.js`.
2. Locate the `allowedOrigins` array near the top.
3. Add your new Netlify URL to the list:
```javascript
const allowedOrigins = [
    'https://faiz-portfolio-bcpk13mdw.vercel.app', // Old Vercel frontend if any
    'https://your-new-site.netlify.app',          // ADD YOUR NETLIFY URL HERE
    'http://localhost:5173',
    'http://localhost:5000'
];
```
4. Push this change to GitHub. Vercel will automatically redeploy your backend with the updated CORS policy.
