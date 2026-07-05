# Focus Garden Ultimate - Railway No-CI Fix

This version is adjusted for Railway when `npm ci` hangs or fails with `Exit handler never called`.

Important changes:

- Dockerfile uses one `npm install`, not `npm ci`.
- Dockerfile does not copy `package-lock.json`.
- Dependencies are pinned to stable versions.
- Railway builder is forced to Dockerfile via `railway.json`.

## Deploy on Railway

1. Upload all files to the GitHub repository root.
2. Delete the old `package-lock.json` from GitHub if it is still there.
3. Make sure `Dockerfile` is in the root and capitalized exactly: `Dockerfile`.
4. In Railway, keep Build Command and Start Command empty.
5. Redeploy.

In Railway logs, you should see that Railway is using the detected Dockerfile.
