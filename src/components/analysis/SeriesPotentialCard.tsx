import { ResultCard } from "@/components/ui/ResultCard";
import { Layers } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SeriesPotentialAnalysis {
  seriesPotential: "high" | "medium" | "low";
  suggestedSeriesAngle?: string;
  episodeIdeas?: string[];
}

interface SeriesPotentialCardProps {
  analysis: SeriesPotentialAnalysis;
}

const potentialConfig = {
  high: {
    label: "High",
    className: "bg-success/20 text-success border-success/40",
  },
  medium: {
    label: "Medium",
    className: "bg-warning/20 text-warning border-warning/40",
  },
  low: {
    label: "Low",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function SeriesPotentialCard({ analysis }: SeriesPotentialCardProps) {
  const config = potentialConfig[analysis.seriesPotential];
  const showSeriesDetails = analysis.seriesPotential !== "low" && analysis.suggestedSeriesAngle;

  return (
    <ResultCard title="Series Potential" icon={<Layers className="h-5 w-5" />}>
      <div className="space-y-4">
        <div className={cn(
          "inline-flex items-center px-3 py-1 rounded-md border text-sm font-medium",
          config.className
        )}>
          {config.label}
        </div>

        {showSeriesDetails && (
          <>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Suggested angle:</p>
              <p className="text-sm text-foreground">{analysis.suggestedSeriesAngle}</p>
            </div>

            {analysis.episodeIdeas && analysis.episodeIdeas.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-2">Episode ideas:</p>
                <ul className="space-y-1">
                  {analysis.episodeIdeas.map((idea, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-0.5">{i + 1}.</span>
                      <span>{idea}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}

        {analysis.seriesPotential === "low" && (
          <p className="text-sm text-muted-foreground">
            This idea works best as a one-off. Limited expansion potential.
          </p>
        )}
      </div>
    </ResultCard>
  );
}
