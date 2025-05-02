
# MERN Auth App

A simple **MERN** (MongoDB, Express, React, Node.js) application with:
- Email/password signup (multi‑step form)
- Email confirmation via Gmail SMTP (app password)
- Login with JWT (HttpOnly cookie)
- "Sign in with Google" (OAuth2)

---

## Prerequisites:
1. **Node.js** (v16+) and **npm**
2. **MongoDB Atlas** account
3. **Google Account** with 2‑Step Verification enabled
4. **Google Cloud** project for OAuth credentials

---

## Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
npm install --save-dev nodemon
```

### 2. Create .env file
In backend/.env, add:
```
PORT=5000
MONGO_URI="mongodb+srv://<DB_USER>:<DB_PASS>@<CLUSTER_HOST>/<DB_NAME>?retryWrites=true&w=majority"
JWT_SECRET=your_jwt_secret_here
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=your_gmail_app_password  
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

### 3. MongoDB Atlas Configuration
- Create Cluster in Atlas
- Whitelist your IP under Network Access
- Add Database User under Database Access (username & password)
- Copy the connection string (paste into MONGO_URI)
- Make sure <DB_NAME> matches your desired database name

### 4. Gmail SMTP (Nodemailer)
- Enable 2‑Step Verification in your Google Account
- In Security → App passwords, create a Mail app password
- Paste that 16‑character password into EMAIL_PASS

### 5. Google OAuth2
- In Google Cloud Console, select the project
- Under APIs & Services → OAuth consent screen, choose External, fill in basic info, Save
- Add your email under Test users (while in Testing mode)
- Under Credentials, create an OAuth Web Client:
  - Authorized JavaScript origins: http://localhost:3000
  - Authorized redirect URIs: http://localhost:5000/api/auth/google/callback
- Copy Client ID & Client Secret into your .env

### 6. Start the backend
```bash
npm run dev   # nodemon server.js
```

You should see:
``` MONGO_URI is: …
MongoDB connected
Server running on port 5000
```

---

## Frontend Setup

### 1. Install dependencies
```bash
cd ../frontend
npm install
```

### 2. Start development server
```bash
npm start
```

Launches: http://localhost:3000

---

## Usage Flow
- Signup at /signup → fill Personal → Company → Credentials → submit
- Confirm via email link → redirected to /login
- Login with email/password or Sign in with Google
- (First‑time Google) → auto‑create/confirm account
- Dashboard at /dashboard
- Optionally, visit /connect-gmail to link Gmail OAuth

---

## Testing & Troubleshooting (based on what i faced)
- If no emails: Check EMAIL_USER & EMAIL_PASS, review spam folder.
- If there are OAuth errors: Ensure Consentscreen is in Testing, add Test users, match origins/redirect URIs.
- if Auth failures: Verify JWT_SECRET is set and cookies enabled (HttpOnly).
- DB errors: Confirm MONGO_URI and Atlas firewall are correct.
