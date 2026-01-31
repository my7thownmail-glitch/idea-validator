import { ScoreCard } from "@/components/ui/ScoreCard";
import { ResultCard } from "@/components/ui/ResultCard";
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Lightbulb,
  Target,
  TrendingUp
} from "lucide-react";

export interface ValidationResult {
  scores: {
    viralityPotential: number;
    originality: number;
    saturationRisk: number;
    executionDifficulty: number;
  };
  verdict: string;
  whyMayFailOrWin: {
    mayFail: string[];
    mayWin: string[];
  };
  fixSuggestions: {
    hookImprovements: string[];
    angleChanges: string[];
    platformSuggestions: string[];
  };
  finalRecommendation: "publish" | "publish-with-changes" | "drop";
}

interface ValidationResultsProps {
  result: ValidationResult;
}

const RecommendationBadge = ({ recommendation }: { recommendation: ValidationResult["finalRecommendation"] }) => {
  const config = {
    publish: {
      icon: <CheckCircle2 className="h-5 w-5" />,
      label: "Publish as-is",
      className: "bg-success/20 text-success border-success/40",
    },
    "publish-with-changes": {
      icon: <AlertTriangle className="h-5 w-5" />,
      label: "Publish after changes",
      className: "bg-warning/20 text-warning border-warning/40",
    },
    drop: {
      icon: <XCircle className="h-5 w-5" />,
      label: "Drop this idea",
      className: "bg-danger/20 text-danger border-danger/40",
    },
  };

  const { icon, label, className } = config[recommendation];

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border font-semibold ${className}`}>
      {icon}
      {label}
    </div>
  );
};

export function ValidationResults({ result }: ValidationResultsProps) {
  return (
    <div className="space-y-6">
      {/* Scores Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard 
          label="Virality Potential" 
          score={result.scores.viralityPotential}
        />
        <ScoreCard 
          label="Originality" 
          score={result.scores.originality}
        />
        <ScoreCard 
          label="Saturation Risk" 
          score={100 - result.scores.saturationRisk}
          description="Lower is riskier"
        />
        <ScoreCard 
          label="Execution Difficulty" 
          score={100 - result.scores.executionDifficulty}
          description="Lower is harder"
        />
      </div>

      {/* Brutal Verdict */}
      <ResultCard 
        title="Verdict" 
        icon={<Zap className="h-5 w-5" />}
        variant="verdict"
      >
        <p className="text-foreground font-medium text-lg">{result.verdict}</p>
      </ResultCard>

      {/* Why This May Fail or Win */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResultCard 
          title="Why This May Fail" 
          icon={<XCircle className="h-5 w-5 text-danger" />}
        >
          <ul className="space-y-2">
            {result.whyMayFailOrWin.mayFail.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-danger mt-1">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </ResultCard>

        <ResultCard 
          title="Why This May Win" 
          icon={<TrendingUp className="h-5 w-5 text-success" />}
        >
          <ul className="space-y-2">
            {result.whyMayFailOrWin.mayWin.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="text-success mt-1">•</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </ResultCard>
      </div>

      {/* Fix Suggestions */}
      <ResultCard 
        title="Actionable Fix Suggestions" 
        icon={<Lightbulb className="h-5 w-5" />}
      >
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Hook Improvements</h4>
            <ul className="space-y-1">
              {result.fixSuggestions.hookImprovements.map((suggestion, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Angle Changes</h4>
            <ul className="space-y-1">
              {result.fixSuggestions.angleChanges.map((suggestion, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Platform/Format Suggestions</h4>
            <ul className="space-y-1">
              {result.fixSuggestions.platformSuggestions.map((suggestion, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">→</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ResultCard>

      {/* Final Recommendation */}
      <ResultCard 
        title="Final Recommendation" 
        icon={<Target className="h-5 w-5" />}
        variant="recommendation"
      >
        <div className="pt-2">
          <RecommendationBadge recommendation={result.finalRecommendation} />
        </div>
      </ResultCard>
    </div>
  );
}
