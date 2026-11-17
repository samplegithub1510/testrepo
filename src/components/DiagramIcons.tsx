import type { IconName } from "@/content";

/**
 * Small line icons for diagram nodes, drawn on a 24 × 24 grid.
 * Parts with a `dg-*` class animate while their node is the active step
 * (see the "Diagram icon motion" block in globals.css).
 */
export function DiagramIcon({ name }: { name: IconName }) {
  switch (name) {
    case "phone":
      return (
        <g className="dg-ring">
          <path d="M6.6 3.5h2.6l1.4 4-2 1.3a10.5 10.5 0 0 0 6.6 6.6l1.3-2 4 1.4v2.6a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.6 5.7a2 2 0 0 1 2-2.2z" />
          <path className="dg-blink" d="M15 3.5a6 6 0 0 1 5.5 5.5M15 7a2.5 2.5 0 0 1 2 2" />
        </g>
      );
    case "wave":
      return (
        <g>
          {[4, 8, 12, 16, 20].map((x, i) => (
            <line key={x} className="dg-bar" style={{ animationDelay: `${i * 0.12}s` }} x1={x} y1={i % 2 ? 7 : 9} x2={x} y2={i % 2 ? 17 : 15} />
          ))}
        </g>
      );
    case "router":
      return (
        <g>
          <circle cx="12" cy="12" r="2.6" className="dg-pulse" />
          <path d="M9.6 10.6 5 6M14.4 10.6 19 6M12 14.6V20M5 6h3M5 6v3M19 6h-3M19 6v3" />
          <circle cx="12" cy="20" r="1" />
        </g>
      );
    case "database":
      return (
        <g>
          <ellipse cx="12" cy="5.5" rx="7" ry="2.5" />
          <path d="M5 5.5v13c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-13" />
          <path className="dg-blink" d="M5 12c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5" />
        </g>
      );
    case "brain":
      return (
        <g>
          <path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a2 2 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1" />
          <circle className="dg-pulse" cx="15.5" cy="11" r="1.2" />
          <circle className="dg-pulse" style={{ animationDelay: "0.4s" }} cx="8.5" cy="13" r="1.2" />
        </g>
      );
    case "calendar":
      return (
        <g>
          <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
          <path d="M3.5 9.5h17M8 3v4M16 3v4" />
          <path className="dg-pop" d="m9 14.5 2 2 4-4" />
        </g>
      );
    case "menu":
      return (
        <g>
          <path d="M7 3v8a2 2 0 0 0 2 2v8M7 3v4M11 3v4M9 3v4M7 7h4" />
          <path className="dg-bob" d="M16 3c-1.7 1.3-2.5 3.2-2.5 6 0 1.7 1 2.5 2.5 2.5V21" />
        </g>
      );
    case "clock":
      return (
        <g>
          <circle cx="12" cy="12" r="8.5" />
          <line className="dg-hand" x1="12" y1="12" x2="12" y2="6.5" />
          <line x1="12" y1="12" x2="15.5" y2="13.5" />
        </g>
      );
    case "user":
      return (
        <g className="dg-bob">
          <circle cx="12" cy="8" r="3.8" />
          <path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" />
        </g>
      );
    case "users":
      return (
        <g>
          <circle cx="9" cy="8.5" r="3.3" />
          <path d="M3 20a6 6 0 0 1 12 0" />
          <g className="dg-bob" style={{ animationDelay: "0.3s" }}>
            <circle cx="16.5" cy="9" r="2.6" />
            <path d="M16 14a5 5 0 0 1 5.5 5" />
          </g>
        </g>
      );
    case "bot":
      return (
        <g>
          <rect x="4" y="7.5" width="16" height="12" rx="3.5" />
          <path d="M12 7.5V4M2 13v3M22 13v3" />
          <circle cx="12" cy="3.5" r="1" />
          <g className="dg-eyes">
            <line x1="9" y1="12.5" x2="9" y2="14.5" />
            <line x1="15" y1="12.5" x2="15" y2="14.5" />
          </g>
        </g>
      );
    case "sync":
      return (
        <g className="dg-spin">
          <path d="M19.5 9A8 8 0 0 0 5 7.5L3.5 9M4.5 15A8 8 0 0 0 19 16.5l1.5-1.5" />
          <path d="M3.5 4.5V9H8M20.5 19.5V15H16" />
        </g>
      );
    case "chart":
      return (
        <g>
          <path d="M3.5 3.5v17h17" />
          <path className="dg-draw" d="m7 15 4-4.5 3 3 5.5-6.5" />
        </g>
      );
    case "edit":
      return (
        <g>
          <path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16v4z" />
          <path className="dg-blink" d="M13.5 6.5l4 4" />
        </g>
      );
    case "layers":
      return (
        <g>
          <path d="m12 3 9 4.5-9 4.5-9-4.5z" />
          <path className="dg-bob" d="m3 12 9 4.5 9-4.5" />
          <path className="dg-bob" style={{ animationDelay: "0.2s" }} d="m3 16.5 9 4.5 9-4.5" />
        </g>
      );
    case "target":
      return (
        <g>
          <circle cx="12" cy="12" r="8.5" />
          <circle cx="12" cy="12" r="4.5" className="dg-pulse" />
          <circle cx="12" cy="12" r="1" />
        </g>
      );
    case "scale":
      return (
        <g>
          <path d="M12 3.5V20M7 20h10M4.5 7h15" />
          <g className="dg-tilt">
            <path d="M4.5 7 2 13a3 3 0 0 0 5 0zM19.5 7 17 13a3 3 0 0 0 5 0z" />
          </g>
        </g>
      );
    case "gauge":
      return (
        <g>
          <path d="M3.5 16a8.5 8.5 0 1 1 17 0" />
          <line className="dg-needle" x1="12" y1="16" x2="16.5" y2="10" />
          <circle cx="12" cy="16" r="1.3" />
        </g>
      );
    case "plug":
      return (
        <g>
          <path d="M9 3v4M15 3v4M6.5 7h11v4a5.5 5.5 0 0 1-11 0z" />
          <path className="dg-blink" d="M12 16.5V21" />
        </g>
      );
    case "key":
      return (
        <g className="dg-tilt">
          <circle cx="8" cy="15" r="4.5" />
          <path d="m11.2 11.8 8.3-8.3M16.5 6.5l2.5 2.5M14 9l2 2" />
        </g>
      );
    case "cloud":
      return (
        <g className="dg-bob">
          <path d="M7 18.5a4.5 4.5 0 0 1-.5-9 6 6 0 0 1 11.5 1.5 3.8 3.8 0 0 1-.5 7.5z" />
        </g>
      );
    case "snow":
      return (
        <g className="dg-spin">
          <path d="M12 2.5v19M3.8 7.2l16.4 9.6M3.8 16.8l16.4-9.6M9.5 4 12 6.5 14.5 4M9.5 20l2.5-2.5 2.5 2.5" />
        </g>
      );
    case "file":
      return (
        <g>
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path className="dg-blink" d="M8.5 13h7M8.5 16.5h5" />
        </g>
      );
    case "scan":
      return (
        <g>
          <path d="M3.5 8V5.5a2 2 0 0 1 2-2H8M16 3.5h2.5a2 2 0 0 1 2 2V8M20.5 16v2.5a2 2 0 0 1-2 2H16M8 20.5H5.5a2 2 0 0 1-2-2V16" />
          <line className="dg-scan" x1="6" y1="12" x2="18" y2="12" />
        </g>
      );
    case "checks":
      return (
        <g>
          <path className="dg-pop" d="m2.5 12.5 4 4 8-9" />
          <path className="dg-pop" style={{ animationDelay: "0.25s" }} d="m10.5 15.5 1 1 8-9" />
        </g>
      );
    case "stamp":
      return (
        <g>
          <g className="dg-stamp">
            <path d="M9 12.5V9a3 3 0 1 1 6 0v3.5" />
            <path d="M5 13h14v3.5H5z" />
          </g>
          <path d="M5 20.5h14" />
        </g>
      );
    case "shield":
      return (
        <g>
          <path d="M12 2.8 19.5 6v5.5c0 4.6-3.2 8.2-7.5 9.7-4.3-1.5-7.5-5.1-7.5-9.7V6z" />
          <path className="dg-pop" d="m8.8 12 2.3 2.3 4.2-4.6" />
        </g>
      );
    case "alert":
      return (
        <g className="dg-shake">
          <path d="M10.3 4.2 2.6 18a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z" />
          <path d="M12 9.5v4.5M12 17.5v.1" />
        </g>
      );
    case "list":
      return (
        <g>
          <rect x="4" y="3" width="16" height="18" rx="2.5" />
          <path className="dg-blink" d="M8 8h8" />
          <path className="dg-blink" style={{ animationDelay: "0.3s" }} d="M8 12h8" />
          <path className="dg-blink" style={{ animationDelay: "0.6s" }} d="M8 16h5" />
        </g>
      );
    case "window":
      return (
        <g>
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <path d="M3 8.5h18" />
          <circle cx="6" cy="6.3" r="0.4" />
          <circle cx="8" cy="6.3" r="0.4" />
          <path className="dg-blink" d="M7 13h6M7 16h10" />
        </g>
      );
    case "workflow":
      return (
        <g>
          <rect x="3" y="3.5" width="7" height="6" rx="1.5" />
          <rect x="14" y="14.5" width="7" height="6" rx="1.5" />
          <path className="dg-draw" d="M6.5 9.5v3.5a2 2 0 0 0 2 2h5.5" />
        </g>
      );
    case "sparkle":
      return (
        <g>
          <path className="dg-twinkle" d="M12 3c.7 4.2 2.3 6 6.5 6.5-4.2.7-5.8 2.3-6.5 6.5-.7-4.2-2.3-5.8-6.5-6.5C9.7 9 11.3 7.2 12 3z" />
          <path className="dg-twinkle" style={{ animationDelay: "0.5s" }} d="M18.5 15.5c.3 1.6.9 2.2 2.5 2.5-1.6.3-2.2.9-2.5 2.5-.3-1.6-.9-2.2-2.5-2.5 1.6-.3 2.2-.9 2.5-2.5z" />
        </g>
      );
    case "bolt":
      return (
        <g className="dg-flicker">
          <path d="M13.5 2.5 4.5 13.5H12l-1.5 8 9-11H12z" />
        </g>
      );
    case "server":
      return (
        <g>
          <rect x="3.5" y="4" width="17" height="7" rx="2" />
          <rect x="3.5" y="13" width="17" height="7" rx="2" />
          <path className="dg-blink" d="M7 7.5h.1M7 16.5h.1" />
        </g>
      );
    case "gateway":
      return (
        <g>
          <path d="M4 20V8l8-4.5L20 8v12" />
          <path d="M8.5 20v-6.5h7V20" />
          <path className="dg-flow" d="M2 16.5h20" />
        </g>
      );
    case "globe":
      return (
        <g>
          <circle cx="12" cy="12" r="8.5" />
          <ellipse className="dg-turn" cx="12" cy="12" rx="3.8" ry="8.5" />
          <path d="M3.5 12h17" />
        </g>
      );
    case "wrench":
      return (
        <g className="dg-tilt">
          <path d="M14.7 6.3a4 4 0 0 0 5 5l1-1a5.5 5.5 0 0 1-7.3 6.5L7 23.2a2.1 2.1 0 0 1-3-3l6.4-6.4A5.5 5.5 0 0 1 16.9 6.5l-1 1z" />
        </g>
      );
    case "book":
      return (
        <g>
          <path d="M4 5a2 2 0 0 1 2-2h13v15H6a2 2 0 0 0-2 2z" />
          <path d="M4 20a2 2 0 0 0 2 2h13v-4" />
          <path className="dg-blink" d="M8.5 8h6M8.5 11.5h4" />
        </g>
      );
    case "box":
      return (
        <g className="dg-bob">
          <path d="m12 2.8 8.5 4.6v9.2L12 21.2l-8.5-4.6V7.4z" />
          <path d="m3.5 7.4 8.5 4.6 8.5-4.6M12 12v9.2" />
        </g>
      );
    case "tag":
      return (
        <g className="dg-tilt">
          <path d="M3 12.2V4.5A1.5 1.5 0 0 1 4.5 3h7.7l8.8 8.8a1.8 1.8 0 0 1 0 2.5l-6.7 6.7a1.8 1.8 0 0 1-2.5 0z" />
          <circle cx="7.8" cy="7.8" r="1.3" />
        </g>
      );
    case "check":
      return (
        <g>
          <circle cx="12" cy="12" r="8.5" />
          <path className="dg-pop" d="m8 12.3 2.7 2.7 5.3-5.6" />
        </g>
      );
    case "eye":
      return (
        <g>
          <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
          <circle className="dg-look" cx="12" cy="12" r="2.8" />
        </g>
      );
    default:
      return <circle cx="12" cy="12" r="6" />;
  }
}
