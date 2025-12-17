---
title: "Fork and Deploy Your Own Markdown Blog"
description: "Step-by-step guide to fork this blog and deploy to GitHub Pages in under 5 minutes."
date: "2025-01-14"
slug: "setup-guide"
published: true
tags: ["github-pages", "tutorial", "deployment"]
readTime: "5 min read"
---

# Fork and Deploy Your Own Markdown Blog

This guide walks you through forking this markdown blog and deploying to GitHub Pages. The entire process takes about 5 minutes.

**How publishing works:** Write posts in markdown, run `npm run build`, push to GitHub, and your site deploys automatically via GitHub Actions.

## Prerequisites

Before you start, make sure you have:

- Node.js 18 or higher installed
- A GitHub account

## Step 1: Fork the Repository

Fork the repository to your GitHub account:

```bash
# Clone your forked repo
git clone https://github.com/YOUR-USERNAME/markdown-site.git
cd markdown-site

# Install dependencies
npm install
```

## Step 2: Run Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:5173/blog/](http://localhost:5173/blog/) to see your blog.

## Step 3: Customize Your Site

Update the site configuration in `src/pages/Home.tsx`:

```typescript
const siteConfig = {
  name: "Your Name",
  title: "Your Title",
  intro: "Your introduction...",
  bio: "Your bio...",
  featuredEssays: [{ title: "Post Title", slug: "post-slug" }],
  links: {
    docs: "/docs",
    github: "https://github.com/YOUR-USERNAME/markdown-site",
  },
};
```

Update the site URL in these files:
- `scripts/generate-static.ts` - `SITE_URL` constant
- `src/pages/Post.tsx` - `SITE_URL` constant
- `index.html` - meta tags and JSON-LD

## Step 4: Deploy to GitHub Pages

1. Go to your repository Settings > Pages
2. Set Source to "GitHub Actions"
3. Push to main branch

GitHub Actions will automatically build and deploy your site.

Your blog will be available at: `https://YOUR-USERNAME.github.io/blog/`

## Writing Blog Posts

Create new posts in `content/blog/`:

```markdown
---
title: "Your Post Title"
description: "A brief description for SEO and social sharing"
date: "2025-01-15"
slug: "your-post-url"
published: true
tags: ["tag1", "tag2"]
readTime: "5 min read"
image: "/images/my-post-image.png"
---

Your markdown content here...
```

### Frontmatter Fields

| Field         | Required | Description                   |
| ------------- | -------- | ----------------------------- |
| `title`       | Yes      | Post title                    |
| `description` | Yes      | Short description for SEO     |
| `date`        | Yes      | Publication date (YYYY-MM-DD) |
| `slug`        | Yes      | URL path (must be unique)     |
| `published`   | Yes      | Set to `true` to publish      |
| `tags`        | Yes      | Array of topic tags           |
| `readTime`    | No       | Estimated reading time        |
| `image`       | No       | Header/Open Graph image URL   |

### Adding Images

Place images in `public/images/` and reference them in your posts:

**Header/OG Image (in frontmatter):**

```yaml
image: "/images/my-header.png"
```

This image appears when sharing on social media. Recommended: 1200x630 pixels.

**Inline Images (in content):**

```markdown
![Alt text description](/images/screenshot.png)
```

### Build After Adding Posts

After adding or editing posts, build and push:

```bash
npm run build
git add .
git commit -m "Add new post"
git push
```

GitHub Actions will deploy your changes automatically.

## Customizing Your Blog

### Change the Favicon

Replace `public/favicon.svg` with your own SVG icon.

### Change the Site Logo

Edit `src/pages/Home.tsx`:

```typescript
const siteConfig = {
  logo: "/images/logo.svg", // Set to null to hide the logo
  // ...
};
```

Replace `public/images/logo.svg` with your own logo file.

### Change the Default Open Graph Image

Replace `public/images/og-default.svg` with your own image (1200x630 pixels recommended).

### Change the Default Theme

Edit `src/context/ThemeContext.tsx`:

```typescript
const DEFAULT_THEME: Theme = "tan"; // Options: "dark", "light", "tan", "cloud"
```

### Change the Font

Edit `src/styles/global.css`:

```css
body {
  /* Sans-serif */
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;

  /* Serif (default) */
  font-family: "New York", ui-serif, Georgia, serif;
}
```

### Add Static Pages (Optional)

Create pages in `content/pages/`:

```markdown
---
title: "About"
slug: "about"
published: true
order: 1
---

Your page content here...
```

Pages appear automatically in the navigation when published.

### Update SEO Meta Tags

Edit `index.html` to update:

- Site title
- Meta description
- Open Graph tags
- JSON-LD structured data

### Update llms.txt and robots.txt

Edit `public/llms.txt` and `public/robots.txt` with your site information.

## Static Assets

Your blog includes these static assets:

| Path              | Description             |
| ----------------- | ----------------------- |
| `/rss.xml`        | RSS feed (descriptions) |
| `/rss-full.xml`   | RSS feed (full content) |
| `/sitemap.xml`    | XML sitemap             |
| `/llms.txt`       | AI agent discovery      |
| `/robots.txt`     | Crawler rules           |

## Troubleshooting

### Posts not appearing

1. Check that `published: true` in frontmatter
2. Run `npm run build` to regenerate static files
3. Check the build output for errors

### Build failures

1. Run `npm run typecheck` to check for TypeScript errors
2. Run `npm run lint` to check for linting issues
3. Ensure Node.js version is 18 or higher

## Project Structure

```
markdown-site/
├── content/
│   ├── blog/           # Markdown blog posts
│   └── pages/          # Static pages
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
│   ├── pages/          # Page components
│   └── styles/         # CSS
└── .github/
    └── workflows/
        └── deploy.yml  # GitHub Actions
```

## Next Steps

After deploying:

1. Add your own blog posts
2. Customize the theme colors in `global.css`
3. Update the featured essays list
4. Submit your sitemap to Google Search Console
5. Share your first post

Your blog is now live with static site generation, RSS feeds, and SEO optimization. Push new posts and they deploy automatically.
