# To-Do-List

This is a static React and Vite task list application prepared for **GitHub Pages**. The GitHub Pages build uses relative paths, so it works whether the repository is published at a project URL such as `https://<owner>.github.io/<repository>/` or at a custom domain.

## Publish through GitHub Pages

Push this project to a GitHub repository whose default deployment branch is `main`. In the repository, open **Settings → Pages** and set **Build and deployment** to **GitHub Actions**. Every push to `main` will run the included workflow at `.github/workflows/deploy-pages.yml` and publish the contents of the static build artifact.

| Command | Purpose |
|---|---|
| `pnpm install --frozen-lockfile` | Install the pinned dependencies. |
| `pnpm run dev` | Run the local development server. |
| `pnpm run build:pages` | Produce the GitHub Pages-ready static files in `dist/public`. |

> GitHub Pages is a static host, so this version keeps task data only in the browser's local storage. Data is not shared or synchronized between devices.

The main production workflow follows GitHub's official Pages deployment pattern. See [GitHub Pages documentation](https://docs.github.com/pages) for repository permissions, custom-domain configuration, and deployment troubleshooting.
