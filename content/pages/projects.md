---
title: "Projects"
slug: "projects"
published: true
order: 2
---

This markdown blog is open source and built to be extended. Here is what ships out of the box.

## Core Features

**Static site generation**
Markdown converts to static JSON at build time. Fast, simple, no server required.

**Four themes**
Dark, light, tan, and cloud. Switch with one click.

**Markdown authoring**
Write in your editor. Frontmatter handles metadata.

**Static pages**
About, Projects, Contact. Add your own.

## Static Assets

The site generates these files at build time:

- `/rss.xml` for RSS readers
- `/rss-full.xml` with full post content
- `/sitemap.xml` for search engines
- `/llms.txt` for AI discovery

## Technical Architecture

```
content/           <- Markdown files
  blog/            <- Blog posts
  pages/           <- Static pages
scripts/           <- Build scripts
src/               <- React frontend
public/data/       <- Generated JSON
```

The build script reads markdown, generates JSON files, and Vite bundles everything into static HTML/CSS/JS. GitHub Pages serves the result.

## Extend It

Fork the repo. Add features. The codebase is TypeScript end to end with full type safety.

Some ideas:
- Add search functionality
- Integrate analytics
- Add comments with a service like Giscus
- Create custom themes
