interface StatBadgeProps {
  label: string;
  value: string | number;
  color?: "blue" | "green" | "yellow" | "red" | "cyan";
}

export default function StatBadge({
  label,
  value,
  color = "blue",
}: StatBadgeProps) {
  const colorMap = {
    blue: "bg-[var(--accent-blue)]",
    green: "bg-[var(--accent-green)]",
    yellow: "bg-[var(--accent-gold)]",
    red: "bg-[var(--accent-red)]",
    cyan: "bg-[var(--accent-cyan)]",
  };

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-accent)]">
      <div className={`w-2 h-2 rounded-full ${colorMap[color]}`}></div>
      <span className="text-sm text-[var(--text-secondary)]">{label}:</span>
      <span className="text-sm font-semibold text-[var(--text-primary)]">
        {value}
      </span>
    </div>
  );
}
