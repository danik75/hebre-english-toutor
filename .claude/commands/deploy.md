---
description: Commit all staged changes and push to GitHub, which triggers an automatic Railway redeploy
---

Push the current branch to GitHub so Railway auto-deploys the latest changes.

Steps:
1. Run `git status` to show what will be committed
2. Run `git add -A` to stage all changes (ask the user to confirm if there are unexpected files)
3. Ask the user for a commit message (or suggest one based on the changes)
4. Run `git commit -m "<message>\n\nCo-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"`
5. Run `git push origin main`
6. Confirm the push succeeded and remind the user that Railway will redeploy automatically (usually takes ~2 minutes)

If there are no uncommitted changes, just push any unpushed commits with `git push origin main`.