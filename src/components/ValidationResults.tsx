import { ScoreCard } from "@/components/ui/ScoreCard";
import { ResultCard } from "@/components/ui/ResultCard";
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Zap, 
  Lightbulb,
  Target,
  TrendingUp,
  TrendingDown,
  Clock,
  Minus
} from "lucide-react";

export interface TrendAnalysis {
  trendStatus: "rising" | "peaked" | "declining" | "evergreen";
  trendSaturation: number;
  timingEffectiveness: number;
  trendInsight: string;
  trendRiskWarning?: string;
  trendAdjustedAdvice: string[];
}

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
  trendAnalysis?: TrendAnalysis;
}

interface ValidationResultsProps {
  result: ValidationResult;
}

const TrendStatusBadge = ({ status }: { status: TrendAnalysis["trendStatus"] }) => {
  const config = {
    rising: {
      icon: <TrendingUp className="h-4 w-4" />,
      label: "Rising",
      className: "bg-success/20 text-success border-success/40",
    },
    peaked: {
      icon: <Minus className="h-4 w-4" />,
      label: "Peaked",
      className: "bg-warning/20 text-warning border-warning/40",
    },
    declining: {
      icon: <TrendingDown className="h-4 w-4" />,
      label: "Declining",
      className: "bg-danger/20 text-danger border-danger/40",
    },
    evergreen: {
      icon: <Clock className="h-4 w-4" />,
      label: "Evergreen",
      className: "bg-primary/20 text-primary border-primary/40",
    },
  };

  const { icon, label, className } = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md border text-sm font-medium ${className}`}>
      {icon}
      {label}
    </div>
  );
};

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

      {/* Trend Analysis Section */}
      {result.trendAnalysis && (
        <>
          <ResultCard 
            title="Trend Insight" 
            icon={<TrendingUp className="h-5 w-5" />}
          >
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <TrendStatusBadge status={result.trendAnalysis.trendStatus} />
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">
                    Saturation: <span className="text-foreground font-medium">{result.trendAnalysis.trendSaturation}%</span>
                  </span>
                  <span className="text-muted-foreground">
                    Timing: <span className="text-foreground font-medium">{result.trendAnalysis.timingEffectiveness}%</span>
                  </span>
                </div>
              </div>
              <p className="text-sm">{result.trendAnalysis.trendInsight}</p>
            </div>
          </ResultCard>

          {result.trendAnalysis.trendRiskWarning && (
            <ResultCard 
              title="Trend Risk Warning" 
              icon={<AlertTriangle className="h-5 w-5 text-warning" />}
            >
              <p className="text-sm text-warning">{result.trendAnalysis.trendRiskWarning}</p>
            </ResultCard>
          )}

          <ResultCard 
            title="Trend-Adjusted Advice" 
            icon={<Clock className="h-5 w-5" />}
          >
            <ul className="space-y-2">
              {result.trendAnalysis.trendAdjustedAdvice.map((advice, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-primary mt-1">→</span>
                  <span>{advice}</span>
                </li>
              ))}
            </ul>
          </ResultCard>
        </>
      )}

      {/* Final Recommendation */}
      <ResultCard 
        title="Final Recommendation" 
        icon={<Target className="h-5 w-5" />}
        variant="recommendation"
      >
        <div className="pt-2">
          <RecommendationBadge recommendation={result.finalRecommendation} />
          {result.trendAnalysis && (
            <p className="text-xs text-muted-foreground mt-2">
              This recommendation factors in current trend timing and saturation.
            </p>
          )}
        </div>
      </ResultCard>
    </div>
  );
}
