import { ReactNode } from "react";

interface SectionCardProps {
  children: ReactNode;
  className?: string;
}

export default function SectionCard({
  children,
  className = "",
}: SectionCardProps) {
  return (
    <div
      className={`bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6 transition-all hover:translate-y-[-2px] hover:shadow-xl ${className}`}
    >
      {children}
    </div>
  );
}
