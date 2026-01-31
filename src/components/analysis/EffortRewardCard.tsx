import { Progress } from "@/components/ui/progress";
import { ResultCard } from "@/components/ui/ResultCard";
import { Scale } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EffortRewardAnalysis {
  effortScore: number;
  rewardScore: number;
  ratioVerdict: "worth-it" | "risky" | "not-worth-it";
}

interface EffortRewardCardProps {
  analysis: EffortRewardAnalysis;
}

const verdictConfig = {
  "worth-it": {
    label: "Worth it",
    className: "text-success",
  },
  "risky": {
    label: "Risky",
    className: "text-warning",
  },
  "not-worth-it": {
    label: "Not worth the effort",
    className: "text-danger",
  },
};

export function EffortRewardCard({ analysis }: EffortRewardCardProps) {
  const config = verdictConfig[analysis.ratioVerdict];

  return (
    <ResultCard title="Effort vs Reward" icon={<Scale className="h-5 w-5" />}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Effort</span>
              <span className="font-mono text-sm font-bold text-foreground">
                {analysis.effortScore}
              </span>
            </div>
            <Progress 
              value={analysis.effortScore} 
              className="h-2 bg-muted [&>div]:bg-danger"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Reward</span>
              <span className="font-mono text-sm font-bold text-foreground">
                {analysis.rewardScore}
              </span>
            </div>
            <Progress 
              value={analysis.rewardScore} 
              className="h-2 bg-muted [&>div]:bg-success"
            />
          </div>
        </div>

        <p className={cn("text-sm font-semibold", config.className)}>
          {config.label}
        </p>
      </div>
    </ResultCard>
  );
}
