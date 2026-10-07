# 🚀 GitHub Pages Subfolder Deployment Guide

This guide covers how to deploy the **Thrilling Tales (Teyvat Interactive Timeline)** static website to **GitHub Pages** within a repository subfolder (e.g., `https://<username>.github.io/<repo-name>/`).

---

## 1. Quick Start via Repository Settings

Because the site uses zero-build native web standards, you can deploy directly from your `main` branch with no build pipelines:

1. Push your repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: initial teyvat timeline scaffolding"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```
2. Navigate to your repository on GitHub.
3. Open **Settings** > **Pages** (in the left sidebar).
4. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main`.
   - **Folder**: Select `/ (root)`.
5. Click **Save**.
6. Wait 1-2 minutes for GitHub to publish the site. Your site will be available at:
   - **Root Landing Page**: `https://<your-username>.github.io/<repo-name>/`
   - **Interactive Timeline Subpage**: `https://<your-username>.github.io/<repo-name>/timeline/`

---

## 2. Subfolder Asset Resolution Rules

When a site is hosted under `https://<username>.github.io/<repo-name>/`:

| Path Format | Example | Resolves To | Status |
| :--- | :--- | :--- | :--- |
| **Root Absolute (DO NOT USE)** | `/assets/css/style.css` | `https://<username>.github.io/assets/css/style.css` | ❌ **404 Not Found** |
| **Relative from Root** | `./assets/css/style.css` | `https://<username>.github.io/<repo-name>/assets/css/style.css` | ✅ **Works** |
| **Relative from Subpage** | `../assets/css/style.css` | `https://<username>.github.io/<repo-name>/assets/css/style.css` | ✅ **Works** |
| **Subpage Link from Root** | `./timeline/` | `https://<username>.github.io/<repo-name>/timeline/` | ✅ **Works** |
| **Root Link from Subpage** | `../index.html` | `https://<username>.github.io/<repo-name>/` | ✅ **Works** |

### Why `.nojekyll` is Crucial
The `.nojekyll` file at the root of the repository instructs GitHub Pages to bypass its default Jekyll static generator. This ensures:
- Folders with underscores (e.g. `_data/`, `_lib/`) are not stripped or hidden.
- Static assets, JSON files, and module scripts are served without modification.

---

## 3. Optional: Automated Deployment via GitHub Actions

If you prefer deploying via GitHub Actions workflow (useful if a build tool or linter is introduced later), create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

To use this workflow:
1. Go to **Settings** > **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push to `main`, and the action will publish the site automatically.
