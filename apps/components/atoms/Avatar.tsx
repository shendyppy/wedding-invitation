// ============================================================
// Avatar — Atom
// Circle with the initial letter of a name.
// ============================================================

interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_CLASSES = {
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
};

export function Avatar({ name, size = "md", className = "" }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();

  return (
    <div
      className={`${SIZE_CLASSES[size]} rounded-full bg-[var(--color-warm-gray)] text-white flex items-center justify-center font-sans font-semibold flex-shrink-0 ${className}`.trim()}
      aria-label={name}
    >
      {initial}
    </div>
  );
}
