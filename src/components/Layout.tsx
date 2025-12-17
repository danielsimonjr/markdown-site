import { ReactNode, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

interface LayoutProps {
  children: ReactNode;
}

interface PageMeta {
  slug: string;
  title: string;
  order?: number;
}

export default function Layout({ children }: LayoutProps) {
  const [pages, setPages] = useState<PageMeta[]>([]);

  useEffect(() => {
    // Fetch pages from static JSON
    fetch(`${import.meta.env.BASE_URL}data/pages.json`)
      .then((res) => res.json())
      .then((data) => setPages(data))
      .catch(() => setPages([]));
  }, []);

  return (
    <div className="layout">
      {/* Top navigation bar with page links and theme toggle */}
      <div className="top-nav">
        {/* Page navigation links (optional pages like About, Projects, Contact) */}
        {pages && pages.length > 0 && (
          <nav className="page-nav">
            {pages.map((page) => (
              <Link
                key={page.slug}
                to={`/${page.slug}`}
                className="page-nav-link"
              >
                {page.title}
              </Link>
            ))}
          </nav>
        )}
        {/* Theme toggle */}
        <div className="theme-toggle-container">
          <ThemeToggle />
        </div>
      </div>
      <main className="main-content">{children}</main>
    </div>
  );
}
