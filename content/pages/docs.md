---
title: "Docs"
slug: "docs"
published: true
order: 0
---

Reference documentation for setting up, customizing, and deploying this markdown blog.

**How publishing works:** Write posts in markdown, run `npm run build`, push to GitHub, and your site deploys automatically via GitHub Actions.

## Quick start

```bash
git clone https://github.com/danielsimonjr/markdown-site.git
cd markdown-site
npm install
npm run dev
```

Open `http://localhost:5173/blog/` to view locally.

## Requirements

- Node.js 18+
- GitHub account

## Project structure

```
markdown-site/
├── content/
│   ├── blog/           # Blog posts (.md)
│   └── pages/          # Static pages (.md)
├── public/
│   ├── data/           # Generated JSON (by build)
│   ├── images/         # Static images
│   ├── rss.xml         # Generated RSS
│   ├── sitemap.xml     # Generated sitemap
│   └── 404.html        # SPA fallback
├── scripts/
│   └── generate-static.ts  # Build script
├── src/
│   ├── components/     # React components
│   ├── context/        # Theme context
│   ├── pages/          # Route components
│   └── styles/         # CSS
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions
```

## Content

### Blog posts

Create files in `content/blog/` with frontmatter:

```markdown
---
title: "Post Title"
description: "SEO description"
date: "2025-01-15"
slug: "url-path"
published: true
tags: ["tag1", "tag2"]
readTime: "5 min read"
image: "/images/og-image.png"
---

Content here...
```

| Field         | Required | Description           |
| ------------- | -------- | --------------------- |
| `title`       | Yes      | Post title            |
| `description` | Yes      | SEO description       |
| `date`        | Yes      | YYYY-MM-DD format     |
| `slug`        | Yes      | URL path (unique)     |
| `published`   | Yes      | `true` to show        |
| `tags`        | Yes      | Array of strings      |
| `readTime`    | No       | Display time estimate |
| `image`       | No       | Open Graph image      |

### Static pages

Create files in `content/pages/` with frontmatter:

```markdown
---
title: "Page Title"
slug: "url-path"
published: true
order: 1
---

Content here...
```

| Field       | Required | Description               |
| ----------- | -------- | ------------------------- |
| `title`     | Yes      | Nav link text             |
| `slug`      | Yes      | URL path                  |
| `published` | Yes      | `true` to show            |
| `order`     | No       | Nav order (lower = first) |

### Building content

```bash
npm run build
```

This generates static JSON files and builds the production site.

## Configuration

### Site settings

Edit `src/pages/Home.tsx`:

```typescript
const siteConfig = {
  name: "Site Name",
  title: "Tagline",
  logo: "/images/logo.svg", // null to hide
  intro: "Introduction text...",
  bio: "Bio text...",
  featuredEssays: [{ title: "Post Title", slug: "post-slug" }],
  links: {
    docs: "/docs",
    github: "https://github.com/...",
  },
};
```

### Theme

Default: `tan`. Options: `dark`, `light`, `tan`, `cloud`.

Edit `src/context/ThemeContext.tsx`:

```typescript
const DEFAULT_THEME: Theme = "tan";
```

### Font

Edit `src/styles/global.css`:

```css
body {
  /* Sans-serif */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Serif (default) */
  font-family: "New York", ui-serif, Georgia, serif;
}
```

### Images

| Image            | Location                       | Size     |
| ---------------- | ------------------------------ | -------- |
| Favicon          | `public/favicon.svg`           | 512x512  |
| Site logo        | `public/images/logo.svg`       | 512x512  |
| Default OG image | `public/images/og-default.svg` | 1200x630 |
| Post images      | `public/images/`               | Any      |

## Static assets

| Path            | Description             |
| --------------- | ----------------------- |
| `/rss.xml`      | RSS feed (descriptions) |
| `/rss-full.xml` | RSS feed (full content) |
| `/sitemap.xml`  | XML sitemap             |
| `/llms.txt`     | AI agent discovery      |
| `/robots.txt`   | Crawler rules           |

## Deployment

### GitHub Pages setup

1. Go to repository Settings > Pages
2. Set Source to "GitHub Actions"
3. Push to main branch

GitHub Actions will automatically build and deploy.

## Troubleshooting

**Posts not appearing**

- Check `published: true` in frontmatter
- Run `npm run build` to regenerate
- Check build output for errors

**Build failures**

- Run `npm run typecheck` for TypeScript errors
- Run `npm run lint` for linting issues
- Ensure Node.js version is 18+
