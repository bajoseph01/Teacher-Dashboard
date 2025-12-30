import type { ReactNode } from "react";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
};

export function GlassCard({ children, className = "" }: GlassCardProps) {
  return (
    <div
      className={[
        "rounded-3xl border border-glass-border bg-glass backdrop-blur-xl",
        "shadow-soft transition-transform duration-200 ease-out",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
