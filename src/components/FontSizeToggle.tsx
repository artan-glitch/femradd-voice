import { Type } from "lucide-react";

type FontSize = "normal" | "large" | "x-large";

interface Props {
  size: FontSize;
  onChange: (size: FontSize) => void;
}

const sizes: { key: FontSize; label: string; scale: string }[] = [
  { key: "normal", label: "A", scale: "text-xs" },
  { key: "large", label: "A", scale: "text-sm" },
  { key: "x-large", label: "A", scale: "text-base" },
];

export default function FontSizeToggle({ size, onChange }: Props) {
  return (
    <div className="flex items-center gap-1 border border-border rounded-full px-1.5 py-0.5" role="group" aria-label="Madhësia e shkronjave">
      <Type className="w-3.5 h-3.5 text-muted-foreground mr-0.5" />
      {sizes.map((s) => (
        <button
          key={s.key}
          onClick={() => onChange(s.key)}
          aria-label={`Shkronja ${s.key}`}
          aria-pressed={size === s.key}
          className={`${s.scale} font-semibold w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
            size === s.key
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
