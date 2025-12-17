# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **LaTeX Math Support** - Render mathematical equations using KaTeX
  - Inline math with `$...$` syntax
  - Block math with `$$...$$` syntax
  - Full KaTeX function support

- **Mermaid Diagrams** - Create diagrams from text
  - Flowcharts
  - Sequence diagrams
  - State diagrams
  - Class diagrams
  - Entity relationship diagrams
  - And more (see [Mermaid docs](https://mermaid.js.org/))

- **Graphviz/DOT Support** - Graph visualization
  - Use `dot` or `graphviz` code blocks
  - Full DOT language support via @viz-js/viz

- **TikZ Diagrams** - LaTeX graphics
  - Use `tikz` or `latex-tikz` code blocks
  - Rendered via tikzjax CDN
  - Supports standard TikZ commands

- **Inline SVG** - Embed SVG directly in markdown
  - Raw HTML/SVG support via rehype-raw
  - Respects theme colors with `currentColor`

### Changed

- Updated BlogPost component to handle special code block languages
- Added diagram-specific CSS styles with theme support
- Updated CLAUDE.md with rich content documentation

### Dependencies Added

- `katex` - Math typesetting
- `remark-math` - Parse math in markdown
- `rehype-katex` - Render math with KaTeX
- `rehype-raw` - Allow raw HTML/SVG in markdown
- `mermaid` - Diagram rendering
- `@viz-js/viz` - Graphviz rendering

## [1.0.0] - 2025-01-15

### Added

- Initial release
- Static site generation from markdown
- GitHub Pages deployment
- Four themes: Dark, Light, Tan, Cloud
- RSS feeds (summary and full content)
- SEO optimization (sitemap, Open Graph, JSON-LD)
- Syntax highlighting for code blocks
- Responsive design
