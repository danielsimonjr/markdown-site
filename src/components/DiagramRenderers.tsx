import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { instance as vizInstance } from "@viz-js/viz";

// Initialize mermaid with default config
mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "inherit",
});

// Mermaid Diagram Renderer
export function MermaidDiagram({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to render Mermaid diagram");
        setSvg("");
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="diagram-error">
        <span className="diagram-error-title">Mermaid Error:</span>
        <pre>{error}</pre>
        <details>
          <summary>Source</summary>
          <pre>{code}</pre>
        </details>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="diagram-container mermaid-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// Graphviz/DOT Diagram Renderer
export function GraphvizDiagram({ code }: { code: string }) {
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      try {
        const viz = await vizInstance();
        const result = viz.renderSVGElement(code);
        setSvg(result.outerHTML);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to render Graphviz diagram");
        setSvg("");
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="diagram-error">
        <span className="diagram-error-title">Graphviz Error:</span>
        <pre>{error}</pre>
        <details>
          <summary>Source</summary>
          <pre>{code}</pre>
        </details>
      </div>
    );
  }

  return (
    <div
      className="diagram-container graphviz-diagram"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// TikZ Diagram Renderer (uses tikzjax CDN)
export function TikZDiagram({ code }: { code: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rendered, setRendered] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load tikzjax script if not already loaded
    const loadTikZJax = () => {
      return new Promise<void>((resolve, reject) => {
        // Check if already loaded
        if ((window as Window & { tikzjax?: unknown }).tikzjax) {
          resolve();
          return;
        }

        // Check if script is already in DOM
        const existingScript = document.querySelector('script[src*="tikzjax"]');
        if (existingScript) {
          existingScript.addEventListener("load", () => resolve());
          return;
        }

        // Load the script
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href = "https://tikzjax.com/v1/fonts.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://tikzjax.com/v1/tikzjax.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load TikZJax"));
        document.head.appendChild(script);
      });
    };

    const renderDiagram = async () => {
      try {
        await loadTikZJax();

        if (containerRef.current) {
          // Create a script element with type text/tikz
          const tikzScript = document.createElement("script");
          tikzScript.type = "text/tikz";
          tikzScript.textContent = code;

          // Clear and append
          containerRef.current.innerHTML = "";
          containerRef.current.appendChild(tikzScript);

          // Trigger tikzjax to process
          const event = new CustomEvent("tikzjax-load-finished");
          document.dispatchEvent(event);

          setRendered(true);
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to render TikZ diagram");
      }
    };

    renderDiagram();
  }, [code]);

  if (error) {
    return (
      <div className="diagram-error">
        <span className="diagram-error-title">TikZ Error:</span>
        <pre>{error}</pre>
        <details>
          <summary>Source</summary>
          <pre>{code}</pre>
        </details>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`diagram-container tikz-diagram ${rendered ? "rendered" : "loading"}`}
    >
      {!rendered && <span className="diagram-loading">Loading TikZ...</span>}
    </div>
  );
}
