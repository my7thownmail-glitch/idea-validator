import { FormData } from "@/components/ValidatorForm";
import { ValidationResult } from "@/components/ValidationResults";

// Mock validation logic - will be replaced with AI analysis
export async function validateIdea(data: FormData): Promise<ValidationResult> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const ideaLength = data.idea.length;
  const hasHook = data.idea.toLowerCase().includes("hook") || 
                  data.idea.toLowerCase().includes("start") ||
                  data.idea.toLowerCase().includes("begin");
  const hasValue = data.idea.toLowerCase().includes("learn") ||
                   data.idea.toLowerCase().includes("how") ||
                   data.idea.toLowerCase().includes("why");

  // Calculate mock scores based on inputs
  const viralityBase = data.goal === "viral" ? 60 : 45;
  const viralityPotential = Math.min(100, viralityBase + (ideaLength > 100 ? 15 : 0) + (hasHook ? 20 : 0));

  const originalityBase = data.contentType === "ai-tech" ? 40 : 55;
  const originality = Math.min(100, originalityBase + Math.floor(Math.random() * 25));

  const saturationByType: Record<string, number> = {
    "ai-tech": 75,
    "motivation": 80,
    "educational": 50,
    "entertainment": 60,
    "storytelling": 45,
    "finance": 65,
    "horror": 40,
  };
  const saturationRisk = saturationByType[data.contentType] || 55;

  const difficultyByPlatform: Record<string, number> = {
    "youtube-shorts": 50,
    "tiktok": 45,
    "instagram-reels": 55,
    "x": 35,
    "linkedin": 60,
  };
  const executionDifficulty = difficultyByPlatform[data.platform] || 50;

  // Generate verdict based on scores
  const avgScore = (viralityPotential + originality + (100 - saturationRisk) + (100 - executionDifficulty)) / 4;
  
  let verdict: string;
  let finalRecommendation: ValidationResult["finalRecommendation"];

  if (avgScore >= 65) {
    verdict = "Solid concept with real potential. Execute with precision and you might have something.";
    finalRecommendation = "publish";
  } else if (avgScore >= 45) {
    verdict = "Mediocre at best. Needs significant work to stand out in a crowded feed.";
    finalRecommendation = "publish-with-changes";
  } else {
    verdict = "This idea is fighting an uphill battle. The market is saturated and your angle isn't fresh enough.";
    finalRecommendation = "drop";
  }

  // Generate failure/success reasons
  const mayFail: string[] = [];
  const mayWin: string[] = [];

  if (saturationRisk > 60) {
    mayFail.push("High content saturation in this niche - you're competing against thousands of similar posts");
  }
  if (!hasHook) {
    mayFail.push("No clear hook mentioned - viewers scroll past in 0.5 seconds without a strong opener");
  }
  if (data.audienceLevel === "advanced" && data.goal === "viral") {
    mayFail.push("Advanced content rarely goes viral - mass appeal requires accessibility");
  }
  if (executionDifficulty > 55) {
    mayFail.push("High production requirements may delay publishing and reduce consistency");
  }

  if (viralityPotential > 60) {
    mayWin.push("Strong viral mechanics if executed correctly");
  }
  if (originality > 55) {
    mayWin.push("Fresh enough angle to capture attention");
  }
  if (hasValue) {
    mayWin.push("Clear value proposition increases save and share rates");
  }
  if (data.platform === "linkedin" && data.contentType === "educational") {
    mayWin.push("Platform-content fit is strong - LinkedIn rewards educational content");
  }

  // Ensure at least one reason for each
  if (mayFail.length === 0) {
    mayFail.push("Market timing is everything - trends shift faster than execution speed");
  }
  if (mayWin.length === 0) {
    mayWin.push("Consistency beats virality - keep posting and iterating");
  }

  return {
    scores: {
      viralityPotential,
      originality,
      saturationRisk,
      executionDifficulty,
    },
    verdict,
    whyMayFailOrWin: {
      mayFail,
      mayWin,
    },
    fixSuggestions: {
      hookImprovements: [
        "Open with a contrarian statement or unexpected fact",
        "Use pattern interrupts in the first 2 seconds",
        "Start mid-story to create immediate curiosity",
      ],
      angleChanges: [
        `Consider targeting ${data.audienceLevel === "beginner" ? "intermediate" : "beginner"} audience for broader appeal`,
        "Add personal failure/success story for relatability",
        "Frame as a myth-busting or 'what they don't tell you' angle",
      ],
      platformSuggestions: [
        data.platform !== "tiktok" 
          ? "TikTok's algorithm rewards experimentation - test there first"
          : "Cross-post to YouTube Shorts for additional reach",
        "Optimize for vertical format (9:16) across all platforms",
        "Add captions - 85% of social video is watched without sound",
      ],
    },
    finalRecommendation,
  };
}
