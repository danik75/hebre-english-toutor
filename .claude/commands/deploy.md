---
description: Commit all staged changes, push to GitHub, verify Railway deploys the new version
---

Deploy the latest changes to production on Railway.

## How deployment works
- Railway is connected to the GitHub repo `danik75/hebre-english-toutor`
- Every push to `main` should trigger an automatic Railway rebuild
- If auto-deploy doesn't trigger, use `railway deployment redeploy --yes` to force it
- Deploys take ~2–3 minutes (Nixpacks build + npm install + npm run build + npm start)
- The live URL is: https://hebre-english-toutor-production.up.railway.app

## Steps

1. Run `git status` to see what will be committed
2. Stage relevant files with `git add <files>` (avoid `git add -A` which can pick up secrets)
3. Suggest a commit message based on the changes; confirm with the user
4. Commit: `git commit -m "<message>\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"`
5. Push: `git push origin main`
6. Run `railway deployment list` to confirm a new BUILDING entry appears
7. If no new build appears within 30 seconds, run `railway deployment redeploy --yes`
8. Poll with `railway deployment list` until the latest entry shows SUCCESS
9. Verify by curling `https://hebre-english-toutor-production.up.railway.app/api/lessons` and checking the lesson count matches what's in `src/data/lessons.js`

## If there are no uncommitted changes
Skip steps 1–5 and go straight to step 6 (push any unpushed commits or trigger a redeploy).

## Railway CLI quick reference
```bash
railway status                      # show project/service info
railway deployment list             # list recent deployments with status
railway deployment redeploy --yes   # force redeploy latest build
railway logs --tail 20              # stream recent server logs
railway domain                      # print the live URL
```
