/**
 * ThepointLogo — SVG del logo oficial
 * "The" en outline/gris, "point" en azul sólido con punto sobre la i
 * Funciona en modo dark y light automáticamente
 */

interface Props {
  /** Ancho en px. El alto se calcula proporcional. Default: 260 */
  width?: number;
  className?: string;
}

export function ThepointLogo({ width = 260, className = "" }: Props) {
  const h = Math.round(width * 0.38);

  return (
    <svg
      width={width}
      height={h}
      viewBox="0 0 260 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Thepoint"
    >
      {/* ── "The" — outline, color adaptativo al tema ── */}
      <text
        x="2"
        y="82"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="82"
        letterSpacing="-2"
        fill="none"
        stroke="var(--tp-fg2, #71717A)"
        strokeWidth="2.5"
        opacity="0.55"
      >
        The
      </text>

      {/* ── "point" — sólido azul ── */}
      <text
        x="104"
        y="82"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="82"
        letterSpacing="-2"
        fill="#2563EB"
      >
        point
      </text>

      {/* ── Punto decorativo encima de la "i" ── */}
      <circle cx="197" cy="10" r="7" fill="#2563EB" />
    </svg>
  );
}

/**
 * Versión compacta para splash screen y PWA
 */
export function ThepointLogoSplash() {
  return (
    <svg
      width="320"
      height="122"
      viewBox="0 0 320 122"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Thepoint"
    >
      {/* "The" outline blanco semitransparente */}
      <text
        x="2"
        y="100"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="100"
        letterSpacing="-3"
        fill="none"
        stroke="rgba(255,255,255,0.35)"
        strokeWidth="2.5"
      >
        The
      </text>

      {/* "point" azul sólido */}
      <text
        x="127"
        y="100"
        fontFamily="'Arial Black', 'Helvetica Neue', Arial, sans-serif"
        fontWeight="900"
        fontSize="100"
        letterSpacing="-3"
        fill="#2563EB"
      >
        point
      </text>

      {/* Punto sobre la i */}
      <circle cx="240" cy="12" r="9" fill="#2563EB" />
    </svg>
  );
}
