# GoMaTT Solutions Ltd website

Static site (plain HTML, CSS and JavaScript). No framework, no dependencies.

- `src/` holds the site: `index.html`, one page per discipline, one page per project, `assets/` (css, js, images, favicon), `404.html`, `robots.txt`
- `scripts/build.js` copies `src/` to `dist/` and fails on broken links, missing assets or exposed secrets
- `npm run build` creates `dist/`

## Deploy on Vercel
1. Push this folder to a GitHub repository (the `dist/` folder is ignored, Vercel builds it).
2. In Vercel choose Add New, Project, import the repository.
3. Framework Preset: Other. Build Command: `npm run build`. Output Directory: `dist`. Install Command: leave default.
4. Deploy. `vercel.json` already sets these and the security headers.

## Deploy on Netlify or Cloudflare Pages
Build command `npm run build`, output directory `dist`, Node version 20.
