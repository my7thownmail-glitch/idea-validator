import { cn } from "@/lib/utils";

interface ScoreCardProps {
  label: string;
  score: number;
  description?: string;
}

const getScoreColor = (score: number) => {
  if (score >= 70) return "text-success";
  if (score >= 40) return "text-warning";
  return "text-danger";
};

const getScoreBg = (score: number) => {
  if (score >= 70) return "bg-success/10 border-success/30";
  if (score >= 40) return "bg-warning/10 border-warning/30";
  return "bg-danger/10 border-danger/30";
};

export function ScoreCard({ label, score, description }: ScoreCardProps) {
  return (
    <div className={cn(
      "p-4 border rounded-lg",
      getScoreBg(score)
    )}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <span className={cn("font-mono text-2xl font-bold", getScoreColor(score))}>
          {score}
        </span>
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
