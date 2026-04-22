# TriFlow Serve — T&R Irrigation LLC

Static HTML deployment — no build step, no dependencies, deploys instantly on Vercel.

## FILES IN THIS PROJECT
- `index.html` — The entire app (single file)
- `manifest.json` — PWA config for home screen install
- `vercel.json` — Vercel static deployment config
- `README.md` — This file

## STEP 1 — ADD YOUR API KEY
Open `index.html` and find line 14:
```
const API_KEY = "REPLACE_WITH_YOUR_API_KEY";
```
Replace `REPLACE_WITH_YOUR_API_KEY` with your actual `sk-ant-...` key from console.anthropic.com

⚠️ IMPORTANT: Do this BEFORE uploading to GitHub. Your key will be visible in the code — only share this repo privately, or use Vercel environment variables (see below for the more secure option).

## STEP 2 — UPLOAD TO GITHUB
1. Go to github.com/trirrigation27
2. Open your `triflowserve` repository
3. Delete the old files (src/, public/, package.json)
4. Upload these 4 files: index.html, manifest.json, vercel.json, README.md
5. Commit changes

## STEP 3 — DEPLOY ON VERCEL
1. Go to vercel.com → your triflowserve project
2. Click Redeploy (or it auto-deploys when GitHub updates)
3. Framework Preset: select OTHER (not Create React App)
4. Deploy — should complete in under 30 seconds
5. Live at triflowserve.vercel.app 🎉

## ADD TO PHONE HOME SCREEN
iPhone Safari: Share → Add to Home Screen → name it TriFlow → Add
Android Chrome: Menu (⋮) → Add to Home Screen → Add

## UPDATING THE APP
1. Get updated index.html from Claude
2. Go to github.com/trirrigation27/triflowserve
3. Click index.html → pencil icon (Edit)
4. Select all, paste new code
5. Commit changes → Vercel auto-redeploys in ~30 seconds

## SECURE API KEY OPTION
Instead of putting the key in index.html, you can use Vercel environment variables:
1. In Vercel project → Settings → Environment Variables
2. Add: REACT_APP_ANTHROPIC_API_KEY = your key
3. This keeps your key out of GitHub
(Requires a small code change — ask Claude to implement this if needed)
