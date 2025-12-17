---
title: "About This Markdown Site"
description: "How this open source static blog works with React, Vite, and GitHub Pages."
date: "2025-01-16"
slug: "about-this-blog"
published: true
tags: ["github-pages", "react", "open-source", "markdown"]
readTime: "4 min read"
---

# About This Markdown Site

This is an open-source static markdown blog built with React, TypeScript, and Vite. Write posts in markdown, build to static files, and deploy to GitHub Pages.

## How It Works

The architecture is straightforward:

1. **Markdown files** live in `content/blog/`
2. **Build script** generates static JSON at build time
3. **React** renders the frontend
4. **GitHub Pages** hosts the static files

When you add a new markdown file and run `npm run build`, your post is included in the static output. Push to GitHub and it deploys automatically.

## The Stack

| Layer    | Technology                |
| -------- | ------------------------- |
| Frontend | React + TypeScript        |
| Build    | Vite                      |
| Styling  | CSS (no framework)        |
| Hosting  | GitHub Pages              |
| Content  | Markdown with frontmatter |

## Why Static?

Static sites are fast, secure, and free to host:

- No server to maintain
- No database to manage
- Free hosting on GitHub Pages
- Fast load times from CDN

## Why Markdown?

Markdown files in your repo are simpler than a CMS:

- Version controlled with git
- Edit with any text editor
- AI agents can create and modify posts
- No separate login or admin panel

## Features

This site includes:

- **Static site generation** from markdown
- **Static pages** for About, Projects, Contact (optional)
- **RSS feeds** at `/rss.xml` and `/rss-full.xml`
- **Sitemap** at `/sitemap.xml`
- **Theme switching** between dark, light, tan, and cloud
- **SEO optimization** with meta tags and structured data
- **AI discovery** via `llms.txt`

## Fork and Deploy

The setup takes about 5 minutes:

1. Fork the repo
2. Run `npm install`
3. Run `npm run build`
4. Enable GitHub Pages in repository settings
5. Push to main branch

Read the [setup guide](/setup-guide) for detailed steps.

## Customization

Edit `src/pages/Home.tsx` to change:

- Site name and description
- Featured posts
- Footer links

Edit `src/styles/global.css` to change:

- Colors and typography
- Theme variables
- Layout spacing

## Links

- [Setup Guide](/setup-guide)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
