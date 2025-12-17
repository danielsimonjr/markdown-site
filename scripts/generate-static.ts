import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");
const PAGES_DIR = path.join(process.cwd(), "content", "pages");
const OUTPUT_DIR = path.join(process.cwd(), "public", "data");

// Site configuration - update these for your site
const SITE_URL = "https://danielsimonjr.github.io/markdown-site";
const SITE_NAME = "Daniel Simon Jr";
const SITE_DESCRIPTION = "Personal blog and projects";

interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  slug: string;
  published: boolean;
  tags: string[];
  readTime?: string;
  image?: string;
}

interface Post {
  slug: string;
  title: string;
  description: string;
  content: string;
  date: string;
  published: boolean;
  tags: string[];
  readTime: string;
  image?: string;
}

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: string;
  image?: string;
}

interface PageFrontmatter {
  title: string;
  slug: string;
  published: boolean;
  order?: number;
}

interface Page {
  slug: string;
  title: string;
  content: string;
  published: boolean;
  order?: number;
}

// Calculate reading time based on word count
function calculateReadTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Parse a single markdown file for posts
function parsePostFile(filePath: string): Post | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const frontmatter = data as Partial<PostFrontmatter>;

    if (!frontmatter.title || !frontmatter.date || !frontmatter.slug) {
      console.warn(`Skipping ${filePath}: missing required frontmatter fields`);
      return null;
    }

    return {
      slug: frontmatter.slug,
      title: frontmatter.title,
      description: frontmatter.description || "",
      content: content.trim(),
      date: frontmatter.date,
      published: frontmatter.published ?? true,
      tags: frontmatter.tags || [],
      readTime: frontmatter.readTime || calculateReadTime(content),
      image: frontmatter.image,
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

// Parse a single markdown file for pages
function parsePageFile(filePath: string): Page | null {
  try {
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const frontmatter = data as Partial<PageFrontmatter>;

    if (!frontmatter.title || !frontmatter.slug) {
      console.warn(`Skipping page ${filePath}: missing required frontmatter`);
      return null;
    }

    return {
      slug: frontmatter.slug,
      title: frontmatter.title,
      content: content.trim(),
      published: frontmatter.published ?? true,
      order: frontmatter.order,
    };
  } catch (error) {
    console.error(`Error parsing page ${filePath}:`, error);
    return null;
  }
}

// Get all markdown files from a directory
function getMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const files = fs.readdirSync(dir);
  return files
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(dir, file));
}

// Escape XML special characters
function escapeXml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Generate RSS feed
function generateRss(posts: Post[], fullContent: boolean = false): string {
  const items = posts
    .filter((p) => p.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((post) => {
      const description = fullContent
        ? `<![CDATA[${post.content}]]>`
        : escapeXml(post.description);

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/${post.slug}</link>
      <guid>${SITE_URL}/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${description}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

// Generate sitemap
function generateSitemap(posts: Post[], pages: Page[]): string {
  const urls = [
    `  <url>
    <loc>${SITE_URL}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`,
    ...posts
      .filter((p) => p.published)
      .map(
        (post) => `  <url>
    <loc>${SITE_URL}/${post.slug}</loc>
    <lastmod>${post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
      ),
    ...pages
      .filter((p) => p.published)
      .map(
        (page) => `  <url>
    <loc>${SITE_URL}/${page.slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`
      ),
  ];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;
}

// Main generation function
async function generate() {
  console.log("Generating static data...\n");

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Create posts subdirectory
  const postsDir = path.join(OUTPUT_DIR, "posts");
  if (!fs.existsSync(postsDir)) {
    fs.mkdirSync(postsDir, { recursive: true });
  }

  // Create pages subdirectory
  const pagesDir = path.join(OUTPUT_DIR, "pages");
  if (!fs.existsSync(pagesDir)) {
    fs.mkdirSync(pagesDir, { recursive: true });
  }

  // Parse all blog posts
  const postFiles = getMarkdownFiles(CONTENT_DIR);
  console.log(`Found ${postFiles.length} blog posts`);

  const posts: Post[] = [];
  for (const filePath of postFiles) {
    const post = parsePostFile(filePath);
    if (post) {
      posts.push(post);
      console.log(`  Parsed: ${post.title} (${post.slug})`);
    }
  }

  // Sort posts by date descending
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Generate posts list (metadata only, no content)
  const postsMeta: PostMeta[] = posts
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      date: p.date,
      tags: p.tags,
      readTime: p.readTime,
      image: p.image,
    }));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "posts.json"),
    JSON.stringify(postsMeta, null, 2)
  );
  console.log(`\nGenerated posts.json with ${postsMeta.length} posts`);

  // Generate individual post files (with content)
  for (const post of posts.filter((p) => p.published)) {
    fs.writeFileSync(
      path.join(postsDir, `${post.slug}.json`),
      JSON.stringify(post, null, 2)
    );
  }
  console.log(`Generated ${posts.filter((p) => p.published).length} individual post files`);

  // Parse all pages
  const pageFiles = getMarkdownFiles(PAGES_DIR);
  console.log(`\nFound ${pageFiles.length} static pages`);

  const pages: Page[] = [];
  for (const filePath of pageFiles) {
    const page = parsePageFile(filePath);
    if (page) {
      pages.push(page);
      console.log(`  Parsed: ${page.title} (${page.slug})`);
    }
  }

  // Sort pages by order
  pages.sort((a, b) => (a.order ?? 99) - (b.order ?? 99));

  // Generate pages list
  const pagesMeta = pages
    .filter((p) => p.published)
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      order: p.order,
    }));

  fs.writeFileSync(
    path.join(OUTPUT_DIR, "pages.json"),
    JSON.stringify(pagesMeta, null, 2)
  );
  console.log(`Generated pages.json with ${pagesMeta.length} pages`);

  // Generate individual page files
  for (const page of pages.filter((p) => p.published)) {
    fs.writeFileSync(
      path.join(pagesDir, `${page.slug}.json`),
      JSON.stringify(page, null, 2)
    );
  }
  console.log(`Generated ${pages.filter((p) => p.published).length} individual page files`);

  // Generate RSS feeds
  const rss = generateRss(posts, false);
  fs.writeFileSync(path.join(process.cwd(), "public", "rss.xml"), rss);
  console.log("\nGenerated rss.xml");

  const rssFull = generateRss(posts, true);
  fs.writeFileSync(path.join(process.cwd(), "public", "rss-full.xml"), rssFull);
  console.log("Generated rss-full.xml");

  // Generate sitemap
  const sitemap = generateSitemap(posts, pages);
  fs.writeFileSync(path.join(process.cwd(), "public", "sitemap.xml"), sitemap);
  console.log("Generated sitemap.xml");

  console.log("\nStatic generation complete!");
}

// Run generation
generate().catch(console.error);
