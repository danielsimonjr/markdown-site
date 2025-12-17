# CLAUDE.md - AI Assistant Guide for markdown-site

This document provides guidance for AI assistants working with this codebase.

## Project Overview

A minimalist markdown blog built with React, Convex, and Vite. Content is stored in markdown files, synced to a Convex database, and served via a React SPA with Netlify edge functions for SEO.

**Key features:**
- Markdown-based blog posts and static pages
- Real-time data sync via Convex
- Real-time analytics at `/stats`
- SEO optimization (RSS, sitemap, Open Graph)
- AI/LLM-friendly API endpoints

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Backend:** Convex (serverless database + functions)
- **Hosting:** Netlify (with edge functions)
- **Styling:** CSS (global.css), no CSS framework
- **Routing:** react-router-dom

## Project Structure

```
markdown-site/
├── content/
│   ├── blog/           # Markdown blog posts
│   └── pages/          # Static pages (about, contact, etc.)
├── convex/
│   ├── _generated/     # Auto-generated Convex types (DO NOT EDIT)
│   ├── schema.ts       # Database schema
│   ├── posts.ts        # Post queries/mutations
│   ├── pages.ts        # Page queries/mutations
│   ├── stats.ts        # Analytics (page views, sessions)
│   ├── http.ts         # HTTP endpoints (API, sitemap, RSS)
│   ├── rss.ts          # RSS feed generation
│   └── crons.ts        # Scheduled jobs
├── netlify/
│   └── edge-functions/ # Netlify edge proxies for Convex HTTP
├── scripts/
│   └── sync-posts.ts   # Syncs markdown to Convex
├── src/
│   ├── components/     # React components
│   ├── context/        # React contexts (ThemeContext)
│   ├── hooks/          # Custom hooks (usePageTracking)
│   ├── pages/          # Page components (Home, Post, Stats)
│   └── styles/         # Global CSS
└── public/             # Static assets (images, robots.txt, llms.txt)
```

## Development Commands

```bash
# Start Vite dev server
npm run dev

# Start Convex dev backend (in separate terminal)
npm run dev:convex

# Sync markdown posts to development Convex
npm run sync

# Sync markdown posts to production Convex
npm run sync:prod

# Build for production
npm run build

# Type check
npm run typecheck

# Lint
npm run lint

# Deploy Convex functions + sync to production
npm run deploy:prod
```

## Key Conventions

### TypeScript

- Strict mode enabled
- Use explicit return types for Convex functions
- Prefix unused parameters with `_`
- Target ES2020

### Convex Functions

**Always specify return types using validators:**

```typescript
export const myQuery = query({
  args: { id: v.string() },
  returns: v.union(v.object({...}), v.null()),  // Required
  handler: async (ctx, args) => { ... }
});
```

**Use idempotent mutations to avoid write conflicts:**

```typescript
export const heartbeat = mutation({
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("table").withIndex(...).first();

    // Early return if no update needed
    if (existing && existing.value === args.value) {
      return null;
    }

    // Only write when necessary
    await ctx.db.patch(existing._id, { value: args.value });
    return null;
  },
});
```

**Use indexes for efficient queries:**

```typescript
// In schema.ts
posts: defineTable({...})
  .index("by_slug", ["slug"])
  .index("by_published", ["published"])
```

### React Components

- Functional components only
- Use hooks for state and effects
- Use refs to prevent duplicate mutation calls
- Debounce rapid mutations (300-500ms for typing, 5s for heartbeats)

### Preventing Write Conflicts

This is critical for Convex. Key patterns:

1. **Backend idempotency:** Check if update is needed before writing
2. **Frontend debouncing:** Use refs to track pending mutations
3. **Event records pattern:** Use separate tables for high-frequency counters instead of incrementing a field
4. **Indexed queries:** Always use indexes to minimize read scope

See `.cursor/rules/convex-write-conflicts.mdc` for detailed patterns.

## Database Schema

Located in `convex/schema.ts`:

| Table | Purpose |
|-------|---------|
| `posts` | Blog posts with content, metadata |
| `pages` | Static pages (about, contact) |
| `pageViews` | Analytics events (event records pattern) |
| `activeSessions` | Real-time visitor tracking |
| `viewCounts` | Legacy view counters |
| `siteConfig` | Key-value site settings |

## Environment Variables

| Variable | File | Purpose |
|----------|------|---------|
| `VITE_CONVEX_URL` | `.env.local` | Development Convex URL |
| `VITE_CONVEX_URL` | `.env.production.local` | Production Convex URL |
| `CONVEX_DEPLOY_KEY` | Netlify dashboard | Deploy key for CI |

## Content Workflow

### Writing Posts

1. Create markdown file in `content/blog/`:

```markdown
---
title: "Post Title"
description: "Brief description"
date: "2025-01-15"
slug: "post-slug"
published: true
tags: ["tag1", "tag2"]
readTime: "5 min read"
image: "/images/og-image.png"  # Optional
---

Your content here...
```

2. Sync to Convex:
   - Development: `npm run sync`
   - Production: `npm run sync:prod`

### Writing Static Pages

Create in `content/pages/` with frontmatter:

```markdown
---
title: "About"
slug: "about"
published: true
order: 1  # Nav display order
---
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/posts` | JSON list of all published posts |
| `/api/post?slug=xxx` | Single post as JSON |
| `/api/post?slug=xxx&format=md` | Single post as markdown |
| `/rss.xml` | RSS feed (descriptions only) |
| `/rss-full.xml` | RSS feed (full content) |
| `/sitemap.xml` | Dynamic XML sitemap |
| `/meta/post?slug=xxx` | Open Graph HTML for crawlers |
| `/stats` | Real-time analytics page |

## Netlify Edge Functions

Edge functions in `netlify/edge-functions/` proxy requests to Convex HTTP endpoints:

- `rss.ts` - Proxies `/rss.xml` and `/rss-full.xml`
- `sitemap.ts` - Proxies `/sitemap.xml`
- `api.ts` - Proxies `/api/*` endpoints
- `botMeta.ts` - Serves OG meta tags to crawlers

**Important:** Edge functions require `VITE_CONVEX_URL` in Netlify environment variables.

## Testing

No automated test suite currently. Manual testing workflow:

1. Run `npm run dev` and `npm run dev:convex`
2. Verify posts display at `http://localhost:5173`
3. Check `/stats` for analytics
4. Run `npm run typecheck` before committing
5. Run `npm run lint` to check for issues

## Deployment

### Netlify Auto-Deploy

Push to main branch triggers:
1. `npm ci --include=dev` (install deps including devDeps)
2. `npx convex deploy` (deploy Convex functions)
3. `npm run build` (build Vite app)

### Manual Production Sync

To update content without rebuilding:
```bash
npm run sync:prod
```

## Common Tasks

### Add a new blog post

1. Create `content/blog/my-post.md` with frontmatter
2. Run `npm run sync` (dev) or `npm run sync:prod` (prod)

### Add a new static page

1. Create `content/pages/my-page.md` with frontmatter
2. Run sync command

### Modify database schema

1. Edit `convex/schema.ts`
2. Run `npm run dev:convex` to apply changes
3. Update related queries/mutations in `convex/*.ts`

### Add a new Convex function

1. Add to appropriate file in `convex/`
2. Export with `query`, `mutation`, or `httpAction`
3. Always include `returns` validator
4. Use indexes for queries

### Fix write conflicts

1. Check Convex dashboard for affected mutations
2. Add idempotency checks (early returns)
3. Add frontend debouncing with refs
4. Consider event records pattern for high-frequency updates

## Files to Never Edit

- `convex/_generated/*` - Auto-generated by Convex
- `dist/*` - Build output
- `node_modules/*`

## Important Documentation

- `README.md` - User-facing documentation
- `prds/howtoavoidwriteconflicts.md` - Write conflict resolution guide
- `.cursor/rules/convex-write-conflicts.mdc` - Convex best practices rules
