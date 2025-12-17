import { useState, useEffect } from "react";
import PostList from "../components/PostList";

// Site configuration - customize this for your site
const siteConfig = {
  name: "Daniel Simon Jr",
  title: "Personal Blog",
  // Optional logo/header image (place in public/images/, set to null to hide)
  logo: "/images/logo.svg" as string | null,
  intro: (
    <>
      A static markdown blog powered by React and deployed on GitHub Pages.{" "}
      <a
        href="https://github.com/danielsimonjr/markdown-site"
        target="_blank"
        rel="noopener noreferrer"
        className="home-text-link"
      >
        Fork it
      </a>
      , customize it, ship it.
    </>
  ),
  bio: `Write in markdown, build to static files, and deploy in minutes. Built with React, TypeScript, and Vite.`,
  featuredEssays: [
    { title: "Setup Guide", slug: "setup-guide" },
    { title: "How to Publish", slug: "how-to-publish" },
    { title: "About This Site", slug: "about-this-blog" },
  ],
  // Links for footer section
  links: {
    docs: "/setup-guide",
    github: "https://github.com/danielsimonjr/markdown-site",
  },
};

interface PostMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  readTime: string;
  image?: string;
}

export default function Home() {
  const [posts, setPosts] = useState<PostMeta[] | null>(null);

  useEffect(() => {
    // Fetch posts from static JSON
    fetch(`${import.meta.env.BASE_URL}data/posts.json`)
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => {
        console.error("Failed to load posts:", err);
        setPosts([]);
      });
  }, []);

  return (
    <div className="home">
      {/* Header section with intro */}
      <header className="home-header">
        {/* Optional site logo */}
        {siteConfig.logo && (
          <img
            src={`${import.meta.env.BASE_URL}images/logo.svg`}
            alt={siteConfig.name}
            className="home-logo"
          />
        )}
        <h1 className="home-name">{siteConfig.name}</h1>

        <p className="home-intro">{siteConfig.intro}</p>

        <p className="home-bio">{siteConfig.bio}</p>

        {/* Featured essays section */}
        <div className="home-featured">
          <p className="home-featured-intro">Get started:</p>
          <ul className="home-featured-list">
            {siteConfig.featuredEssays.map((essay) => (
              <li key={essay.slug}>
                <a href={`${import.meta.env.BASE_URL}${essay.slug}`} className="home-featured-link">
                  {essay.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Blog posts section */}
      <section id="posts" className="home-posts">
        {posts === null ? null : posts.length === 0 ? (
          <p className="no-posts">No posts yet. Check back soon!</p>
        ) : (
          <PostList posts={posts} />
        )}
      </section>

      {/* Footer section */}
      <section className="home-footer">
        <p className="home-footer-text">
          Built with React and Vite, deployed on{" "}
          <a
            href="https://pages.github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub Pages
          </a>
          . View the{" "}
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
          >
            source on GitHub
          </a>
          .
        </p>
      </section>
    </div>
  );
}
