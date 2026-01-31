import { Progress } from "@/components/ui/progress";
import { ResultCard } from "@/components/ui/ResultCard";
import { Zap } from "lucide-react";

export interface HookAnalysis {
  hookStrengthScore: number;
  detectedHookType: "shock" | "curiosity" | "contrast" | "authority" | "story";
  strengthExplanation: string[];
  improvedHookExample: string;
}

interface HookStrengthCardProps {
  analysis: HookAnalysis;
}

const hookTypeLabels: Record<HookAnalysis["detectedHookType"], string> = {
  shock: "Shock",
  curiosity: "Curiosity",
  contrast: "Contrast",
  authority: "Authority",
  story: "Story",
};

export function HookStrengthCard({ analysis }: HookStrengthCardProps) {
  const getScoreVerdict = (score: number) => {
    if (score >= 70) return "Strong hook — likely to stop scrollers.";
    if (score >= 40) return "Decent hook — needs refinement.";
    return "Weak hook — most viewers will scroll past.";
  };

  return (
    <ResultCard title="Hook Strength" icon={<Zap className="h-5 w-5" />}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            Type: <span className="text-foreground">{hookTypeLabels[analysis.detectedHookType]}</span>
          </span>
          <span className="font-mono text-xl font-bold text-primary">
            {analysis.hookStrengthScore}
          </span>
        </div>

        <Progress 
          value={analysis.hookStrengthScore} 
          className="h-2 bg-muted [&>div]:bg-primary"
        />

        <p className="text-sm text-muted-foreground">
          {getScoreVerdict(analysis.hookStrengthScore)}
        </p>

        <div className="space-y-2">
          {analysis.strengthExplanation.map((point, i) => (
            <p key={i} className="text-sm flex items-start gap-2">
              <span className="text-primary mt-0.5">•</span>
              <span>{point}</span>
            </p>
          ))}
        </div>

        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-1">Improved hook example:</p>
          <p className="text-sm text-foreground italic">"{analysis.improvedHookExample}"</p>
        </div>
      </div>
    </ResultCard>
  );
}
