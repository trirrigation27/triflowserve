# TriFlow Serve — T&R Irrigation LLC Operations Platform

Your complete field operations app: Calendar, Invoice Builder, Inventory, SMS Campaigns, Client Management, and AI Assistant.

**Live URL:** https://triflowserve.vercel.app

---

## DEPLOYING TO VERCEL (First Time Setup)

### Step 1 — Get an Anthropic API Key
1. Go to https://console.anthropic.com
2. Sign in or create a free account
3. Click **API Keys** → **Create Key**
4. Copy the key (starts with `sk-ant-...`) — save it somewhere safe

### Step 2 — Upload Files to GitHub
1. Go to https://github.com/trirrigation27
2. Click the green **New** button to create a new repository
3. Name it: `triflowserve`
4. Keep it **Public**
5. Click **Create repository**
6. On the next screen click **uploading an existing file**
7. Drag and drop ALL files and folders from this project into the upload area:
   - `src/` folder
   - `public/` folder
   - `package.json`
   - `.gitignore`
   - `README.md`
   - ⚠️ DO NOT upload the `.env` file — your API key must stay private
8. Click **Commit changes**

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com
2. Click **Sign Up** → choose **Continue with GitHub**
3. Authorize Vercel to access your GitHub account
4. Click **Add New Project**
5. Find `triflowserve` in the list and click **Import**
6. Under **Framework Preset** select: **Create React App**
7. Click **Environment Variables** and add:
   - Name: `REACT_APP_ANTHROPIC_API_KEY`
   - Value: paste your `sk-ant-...` key here
8. Click **Deploy**
9. Wait ~2 minutes — Vercel builds and deploys automatically
10. Your app is live at **triflowserve.vercel.app** 🎉

---

## ADDING TO YOUR PHONE HOME SCREEN

### iPhone (Safari):
1. Open https://triflowserve.vercel.app in Safari
2. Tap the **Share** button (box with arrow pointing up)
3. Scroll down and tap **Add to Home Screen**
4. Name it **TriFlow** and tap **Add**
5. App icon appears on your home screen — works like a native app

### Android (Chrome):
1. Open https://triflowserve.vercel.app in Chrome
2. Tap the three-dot menu (⋮)
3. Tap **Add to Home Screen**
4. Tap **Add**

---

## UPDATING THE APP

Whenever Claude builds an update for you:

1. Go to https://github.com/trirrigation27/triflowserve
2. Click on `src/App.js`
3. Click the **pencil icon** (Edit this file)
4. Select all the text and replace it with the new code Claude provides
5. Click **Commit changes**
6. Vercel automatically detects the change and redeploys in ~2 minutes
7. Refresh your phone — update is live

---

## WHAT'S PERSISTENT (Saves Between Sessions)
- ✅ All booked jobs and calendar entries
- ✅ Inventory quantities
- ✅ Technician working hours (Robert & Thomas)
- ✅ Data stored in browser localStorage on each device

## WHAT RESETS
- Invoice builder (clears after each invoice — by design)
- AI chat history (starts fresh each session)
- SMS campaign state

---

## SUPPORT
Built and maintained via Claude.ai — open your Claude conversation to request updates, new features, or fixes. Changes deploy in minutes.
