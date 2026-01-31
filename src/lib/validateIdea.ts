import { FormData } from "@/components/ValidatorForm";
import { ValidationResult } from "@/components/ValidationResults";

export async function validateIdea(data: FormData): Promise<ValidationResult> {
  const response = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/validate-idea`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
      },
      body: JSON.stringify({
        idea: data.idea,
        platform: data.platform,
        contentType: data.contentType,
        audienceLevel: data.audienceLevel,
        goal: data.goal,
        trendAwareness: data.trendAwareness,
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Request failed with status ${response.status}`);
  }

  const result = await response.json();
  
  // Validate the response structure
  if (!result.scores || !result.verdict || !result.finalRecommendation || 
      !result.hookAnalysis || !result.effortRewardAnalysis || !result.seriesPotentialAnalysis) {
    throw new Error("Invalid response structure from AI");
  }

  return result as ValidationResult;
}
