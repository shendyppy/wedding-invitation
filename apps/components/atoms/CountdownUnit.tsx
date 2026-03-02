// ============================================================
// CountdownUnit — Atom
// Displays a large number + label (e.g. 42 Days).
// ============================================================

interface CountdownUnitProps {
  value: number;
  label: string;
  className?: string;
}

export function CountdownUnit({
  value,
  label,
  className = "",
}: CountdownUnitProps) {
  const displayValue = String(value).padStart(2, "0");

  return (
    <div className={`flex flex-col items-center gap-1 ${className}`.trim()}>
      <span className="font-serif text-[2.5rem] sm:text-4xl md:text-5xl font-bold text-[var(--color-warm-gray)] leading-none">
        {displayValue}
      </span>
      <span className="font-sans text-[10px] sm:text-xs tracking-widest uppercase text-[var(--color-warm-gray)]">
        {label}
      </span>
    </div>
  );
}
