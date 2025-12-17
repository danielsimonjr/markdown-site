---
title: "Writing Markdown with Code Examples"
description: "A sample post showing how to write markdown with syntax-highlighted code blocks, tables, and more."
date: "2025-01-17"
slug: "markdown-with-code-examples"
published: true
tags: ["markdown", "tutorial", "code"]
readTime: "5 min read"
---

# Writing Markdown with Code Examples

This post demonstrates how to write markdown content with code blocks, tables, and formatting. Use it as a reference when creating your own posts.

## Frontmatter

Every post starts with frontmatter between `---` delimiters:

```yaml
---
title: "Your Post Title"
description: "A brief description for SEO"
date: "2025-01-17"
slug: "your-url-slug"
published: true
tags: ["tag1", "tag2"]
readTime: "5 min read"
---
```

## Code Blocks

### TypeScript

```typescript
interface Post {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  tags: string[];
}

async function fetchPosts(): Promise<Post[]> {
  const response = await fetch("/data/posts.json");
  return response.json();
}
```

### React Component

```tsx
import { useState, useEffect } from "react";

interface Post {
  slug: string;
  title: string;
}

export function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch("/data/posts.json")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.slug}>
          <a href={`/${post.slug}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  );
}
```

### Bash Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### JSON

```json
{
  "name": "markdown-blog",
  "version": "1.0.0",
  "scripts": {
    "dev": "npm run generate && vite",
    "build": "npm run generate && vite build",
    "generate": "npx tsx scripts/generate-static.ts"
  }
}
```

## Inline Code

Use backticks for inline code like `npm install` or `useState`.

Reference files with inline code: `scripts/generate-static.ts`, `src/pages/Home.tsx`.

## Tables

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start development server   |
| `npm run build`   | Build for production       |
| `npm run generate`| Generate static JSON       |
| `npm run preview` | Preview production build   |

## Lists

### Unordered

- Write posts in markdown
- Build generates static JSON
- Deploy to GitHub Pages
- Updates deploy automatically

### Ordered

1. Fork the repository
2. Customize your site
3. Write your posts
4. Push to deploy

## Blockquotes

> Markdown files in your repo are simpler than a CMS. Version controlled, AI-editable, and no separate admin panel.

## Links

External links: [GitHub Pages Docs](https://docs.github.com/en/pages)

Internal links: [Setup Guide](/setup-guide)

## Emphasis

Use **bold** for strong emphasis and _italics_ for lighter emphasis.

## Horizontal Rule

---

## Images

Place images in `public/images/` and reference them:

```markdown
![Alt text](/images/screenshot.png)
```

## File Structure Reference

```
content/blog/
├── about-this-blog.md
├── markdown-with-code-examples.md
├── setup-guide.md
└── your-new-post.md
```

## Tips

1. Keep slugs URL-friendly (lowercase, hyphens)
2. Set `published: false` for drafts
3. Run `npm run build` after adding posts
4. Use descriptive titles for SEO
