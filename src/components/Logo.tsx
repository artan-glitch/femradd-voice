import { Link } from "react-router-dom";

interface LogoProps {
  /** Tailwind text size class for the wordmark, e.g. "text-2xl" */
  size?: string;
  /** Use "light" on dark backgrounds (footer) to make "Femra" white */
  variant?: "default" | "light";
  /** Whether to link to the homepage */
  linked?: boolean;
  /** Extra classes on the outer element */
  className?: string;
}

/**
 * FemraDD brand logo — "The Italic Blend"
 *
 * Italic "Femra" flows into upright bold "DD" using the Lora typeface.
 * A subtle heart accent floats above the transition point.
 */
export default function Logo({
  size = "text-2xl md:text-3xl",
  variant = "default",
  linked = true,
  className = "",
}: LogoProps) {
  const femraColor =
    variant === "light" ? "text-[hsl(36,33%,97%)]" : "text-foreground";

  const logoContent = (
    <span
      className={`inline-flex items-baseline tracking-tight ${size} ${className}`}
      style={{ fontFamily: "'Lora', serif" }}
    >
      <span className={`italic font-medium ${femraColor}`}>Femra</span>
      <span className="not-italic font-bold text-primary relative">
        DD
        {/* Heart accent */}
        <svg
          className="absolute -top-2 -right-2.5 w-2.5 h-2.5 text-primary opacity-30"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 2C9 0 12 0 12 3C12 6 8 9 8 9C8 9 4 6 4 3C4 0 7 0 8 2Z" />
        </svg>
      </span>
    </span>
  );

  if (!linked) return logoContent;

  return (
    <Link to="/" aria-label="FemraDD — Kthehu në faqen kryesore">
      {logoContent}
    </Link>
  );
}
