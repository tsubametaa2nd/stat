interface SectionTitleProps {
  children: React.ReactNode;
  number?: string;
}

export default function SectionTitle({ children, number }: SectionTitleProps) {
  return (
    <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
      {number && (
        <span className="text-[var(--accent-blue)] text-2xl">{number}</span>
      )}
      <span>{children}</span>
    </h2>
  );
}
