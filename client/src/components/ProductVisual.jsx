// Product visual. When a product has a real photo (seed `image`), we show it
// on a luxury surface; otherwise we fall back to the pure-CSS/SVG bottle tinted
// by the product's gradient. No external URLs — every photo is a local /products asset.
export default function ProductVisual({ product, className = "" }) {
  const hasImage = Boolean(product.image);
  const tall = product.sizes?.some((s) => s.label !== "5ml");

  if (hasImage) {
    return (
      <div
        className={`relative overflow-hidden ${className}`}
        style={{ background: product.gradient || "#0A0A0A" }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* soft gold sheen + vignette so photos sit in the brand palette */}
        <div
          className="absolute inset-0 opacity-50 mix-blend-soft-light"
          style={{
            background:
              "radial-gradient(120px 90px at 28% 18%, rgba(232,200,114,0.30), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: product.gradient || "#0A0A0A" }}
    >
      {/* subtle sheen */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(120px 80px at 30% 20%, rgba(232,200,114,0.18), transparent 70%)",
        }}
      />
      <svg
        viewBox="0 0 120 160"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`cap-${product.id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8C872" />
            <stop offset="55%" stopColor="#C9A24B" />
            <stop offset="100%" stopColor="#8A6A2A" />
          </linearGradient>
          <linearGradient id={`body-${product.id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(245,241,232,0.14)" />
            <stop offset="100%" stopColor="rgba(10,10,10,0.55)" />
          </linearGradient>
        </defs>
        {/* cap */}
        <rect
          x="48"
          y={tall ? 18 : 40}
          width="24"
          height={tall ? 22 : 20}
          rx="3"
          fill={`url(#cap-${product.id})`}
        />
        {/* neck */}
        <rect x="54" y={tall ? 38 : 58} width="12" height="8" fill="#C9A24B" opacity="0.8" />
        {/* body */}
        <rect
          x="34"
          y={tall ? 44 : 64}
          width="52"
          height={tall ? 92 : 70}
          rx="8"
          fill={`url(#body-${product.id})`}
          stroke="rgba(201,162,75,0.5)"
          strokeWidth="1"
        />
        {/* label monogram */}
        <text
          x="60"
          y={tall ? 96 : 106}
          textAnchor="middle"
          fontFamily="Cinzel, serif"
          fontSize="16"
          fill="#E8C872"
          opacity="0.9"
        >
          A
        </text>
      </svg>
    </div>
  );
}

