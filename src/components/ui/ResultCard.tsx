import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "verdict" | "recommendation";
  className?: string;
}

export function ResultCard({ 
  title, 
  icon, 
  children, 
  variant = "default",
  className 
}: ResultCardProps) {
  return (
    <div className={cn(
      "p-5 border border-border rounded-lg bg-card animate-fade-in",
      variant === "verdict" && "border-primary/50 bg-primary/5",
      variant === "recommendation" && "border-l-4 border-l-primary",
      className
    )}>
      <div className="flex items-center gap-2 mb-3">
        {icon && <span className="text-primary">{icon}</span>}
        <h3 className="font-semibold text-foreground">{title}</h3>
      </div>
      <div className="text-muted-foreground">
        {children}
      </div>
    </div>
  );
}
