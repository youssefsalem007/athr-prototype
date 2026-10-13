// ATHR logo lockup — hand-drawn VECTOR SVG (crisp at any size, no raster).
// Gold-gradient "ATHR" in Cinzel, Arabic "أثر" in Amiri, "FRAGRANCES" in Jost,
// with ornate flourish curves. All fonts are loaded in index.html.
import { useId } from "react";

export default function Logo({ compact = false, className = "" }) {
  const uid = useId().replace(/[:]/g, "");
  const gold = `gold-${uid}`;

  // Flourish: a symmetric ornate swash drawn to the left of the wordmark.
  // (mirrored for the right side with a scaleX(-1) transform)
  const Flourish = ({ side }) => (
    <path
      transform={side === "left" ? "translate(0,0)" : "translate(360,0) scale(-1,1)"}
      d="M168 74
         C150 66 130 66 112 74
         C124 76 134 82 142 90
         C130 84 116 84 104 90
         C118 90 130 96 138 106
         L143 102 L141 108 L147 104"
      fill="none"
      stroke={`url(#${gold})`}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  );

  return (
    <svg
      viewBox="0 0 360 176"
      className={`${className} ${
        compact ? "h-9 w-auto" : "h-20 sm:h-28 w-auto"
      }`}
      role="img"
      aria-label="ATHR · أثر Fragrances"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8A6A2A" />
          <stop offset="28%" stopColor="#C9A24B" />
          <stop offset="48%" stopColor="#F0DCA0" />
          <stop offset="62%" stopColor="#E8C872" />
          <stop offset="82%" stopColor="#C9A24B" />
          <stop offset="100%" stopColor="#8A6A2A" />
        </linearGradient>
      </defs>

      {/* Wordmark ATHR */}
      <g textAnchor="middle">
        <text
          x="180"
          y="76"
          fontFamily="Cinzel, 'Cormorant Garamond', serif"
          fontWeight="700"
          fontSize="70"
          letterSpacing="6"
          fill={`url(#${gold})`}
        >
          ATHR
        </text>
      </g>

      {/* Ornate side flourishes */}
      <Flourish side="left" />
      <Flourish side="right" />

      {/* Divider with center diamond */}
      <g>
        <line x1="96" y1="96" x2="176" y2="96" stroke={`url(#${gold})`} strokeWidth="1" opacity="0.7" />
        <line x1="184" y1="96" x2="264" y2="96" stroke={`url(#${gold})`} strokeWidth="1" opacity="0.7" />
        <rect x="176" y="92" width="8" height="8" transform="rotate(45 180 96)" fill={`url(#${gold})`} />
      </g>

      {compact ? (
        /* Compact: Arabic monogram only */
        <text
          x="180"
          y="128"
          textAnchor="middle"
          fontFamily="Amiri, serif"
          fontWeight="700"
          fontSize="24"
          fill="#E8C872"
          opacity="0.95"
        >
          أثر
        </text>
      ) : (
        <>
          {/* Arabic + FRAGRANCES row */}
          <text
            x="180"
            y="126"
            textAnchor="middle"
            fontFamily="Amiri, serif"
            fontWeight="700"
            fontSize="26"
            fill="#E8C872"
            opacity="0.95"
          >
            أثر
          </text>

          <text
            x="180"
            y="152"
            textAnchor="middle"
            fontFamily="Jost, sans-serif"
            fontWeight="500"
            fontSize="13"
            letterSpacing="9"
            fill="#C9A24B"
            opacity="0.9"
          >
            FRAGRANCES
          </text>

          {/* Bottom flourish */}
          <g>
            <line x1="120" y1="166" x2="176" y2="166" stroke={`url(#${gold})`} strokeWidth="0.8" opacity="0.5" />
            <line x1="184" y1="166" x2="240" y2="166" stroke={`url(#${gold})`} strokeWidth="0.8" opacity="0.5" />
            <circle cx="180" cy="166" r="1.8" fill={`url(#${gold})`} />
          </g>
        </>
      )}
    </svg>
  );
}


