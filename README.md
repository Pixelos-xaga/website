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

## Routes

- Home: `/`
- Instructions: `/instructions`
- Downloads & Resources: `/downloads`

`instructions.html` redirects to `/instructions` for compatibility.

## Deploy on Vercel

Use these project settings:

- Framework Preset: `Vite`
- Install Command: `npm install`
- Build Command: `npm run build`
- Output Directory: `dist`

`vercel.json` already includes rewrites for `/instructions` and `/downloads` to `/` so SPA routing works on direct loads.
