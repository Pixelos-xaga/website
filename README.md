# PixelOS Xaga Website

Material 3 website built with the recommended Material Web stack:

- Framework: Lit
- Component library: `@material/web`
- Tooling: Vite

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

## Updating Changelogs

Edit `src/content/changelog.md`. That is the single source of truth for the `/changelogs` page.

## Routes

- Home: `/`
- Instructions: `/instructions`
- Downloads & Resources: `/downloads`
- Changelogs: `/changelogs`
- Troubleshooting: `/troubleshooting`

`instructions.html` redirects to `/instructions` for compatibility.

## Deploy on Vercel

Use these project settings:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

`vercel.json` already includes rewrites for the routed pages so SPA navigation works on direct loads.
