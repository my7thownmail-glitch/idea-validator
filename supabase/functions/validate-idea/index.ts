import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const baseSystemPrompt = `You are a brutally honest content strategist and data analyst. Your job is to evaluate content ideas critically without any motivational fluff.

You must respond with ONLY valid JSON (no markdown, no code blocks, no explanations outside the JSON).

Be harsh but constructive. Consider:
- Platform-specific algorithms and best practices
- Current market saturation for the content type
- Audience attention spans and preferences
- Trending patterns and timing
- Execution complexity and production requirements

Never use motivational language. Be direct, analytical, and creator-focused.`;

const getSystemPrompt = (trendAwareness: boolean) => {
  const baseStructure = `{
  "scores": {
    "viralityPotential": <number 0-100>,
    "originality": <number 0-100>,
    "saturationRisk": <number 0-100, higher means more saturated/risky>,
    "executionDifficulty": <number 0-100, higher means harder to execute>
  },
  "verdict": "<1-2 sentence brutal, honest assessment>",
  "whyMayFailOrWin": {
    "mayFail": ["<reason 1>", "<reason 2>", ...],
    "mayWin": ["<reason 1>", "<reason 2>", ...]
  },
  "fixSuggestions": {
    "hookImprovements": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
    "angleChanges": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"],
    "platformSuggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>"]
  },
  "hookAnalysis": {
    "hookStrengthScore": <number 0-100>,
    "detectedHookType": "<one of: shock | curiosity | contrast | authority | story>",
    "strengthExplanation": ["<reason 1>", "<reason 2>"],
    "improvedHookExample": "<single sentence improved hook>"
  },
  "effortRewardAnalysis": {
    "effortScore": <number 0-100, higher means more effort required>,
    "rewardScore": <number 0-100, higher means more potential reward>,
    "ratioVerdict": "<one of: worth-it | risky | not-worth-it>"
  },
  "seriesPotentialAnalysis": {
    "seriesPotential": "<one of: high | medium | low>",
    "suggestedSeriesAngle": "<optional: suggested series angle if high/medium>",
    "episodeIdeas": ["<optional: episode idea 1>", "<episode idea 2>", "<episode idea 3>"]
  },
  "finalRecommendation": "<one of: publish | publish-with-changes | drop>"`;

  const hookAnalysisInstructions = `
HOOK STRENGTH ANALYSIS:
- Infer the implied hook from the idea's opening angle
- Evaluate: curiosity gap, emotional trigger, pattern interrupt strength
- Do NOT rewrite the full idea, just analyze the hook
- Provide 1-2 bullet explanations of why it's weak or strong
- Give ONE improved hook example as a single sentence
- Hook types: shock (alarming), curiosity (mystery), contrast (before/after), authority (expert), story (narrative)

EFFORT VS REWARD ANALYSIS:
- Evaluate: time required, skill complexity, production difficulty, expected reach
- Short-form ideas should penalize high effort
- Long execution chains reduce reward score
- Be blunt about whether the effort is justified

SERIES POTENTIAL DETECTION:
- Analyze: topic depth, angle expandability, audience retention potential
- If high/medium potential: provide a series angle and 2-3 episode title ideas
- If low: omit the optional fields`;

  const finalRecommendationInstructions = `
FINAL RECOMMENDATION MUST CONSIDER ALL FACTORS:
- Trend timing (if trend awareness enabled)
- Virality potential
- Saturation risk
- Hook strength
- Effort vs reward ratio
- Series potential

Examples of integrated recommendations:
- "Good idea, weak hook — rework opening."
- "Strong concept, bad effort-to-reward ratio."
- "Convert this into a series before publishing."
- "Trend is dying and hook is generic — drop it."`;

  if (trendAwareness) {
    return `${baseSystemPrompt}

TREND AWARENESS MODE ENABLED:
- Infer the relevant trend category for this content idea automatically
- Analyze the idea's timing relative to current content trends
- Evaluate trend status (rising, peaked, declining, or evergreen)
- Factor trend saturation and timing into your scoring
- Adjust viralityPotential and saturationRisk scores based on trend timing
- If the trend is declining or oversaturated, lower scores accordingly
- If the trend is rising with low saturation, boost scores appropriately
${hookAnalysisInstructions}
${finalRecommendationInstructions}

Analyze the content idea and return a JSON object with this exact structure:
${baseStructure},
  "trendAnalysis": {
    "trendStatus": "<one of: rising | peaked | declining | evergreen>",
    "trendSaturation": <number 0-100, how saturated this trend is>,
    "timingEffectiveness": <number 0-100, how well-timed this idea is>,
    "trendInsight": "<1-2 sentences analyzing the current state of this trend>",
    "trendRiskWarning": "<optional: warning if timing is risky, omit if not applicable>",
    "trendAdjustedAdvice": ["<timing-specific advice 1>", "<timing-specific advice 2>", "<timing-specific advice 3>"]
  }
}

IMPORTANT for trend analysis:
- Be realistic about trend lifecycles
- No hype - if a trend is dying, say so directly
- Consider platform-specific trend dynamics
- Account for geographic and demographic trend variations
- Evergreen content should be marked as such, not forced into trend categories`;
  }

  return `${baseSystemPrompt}
${hookAnalysisInstructions}
${finalRecommendationInstructions}

Analyze the content idea and return a JSON object with this exact structure:
${baseStructure}
}`;
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { idea, platform, contentType, audienceLevel, goal, trendAwareness = false } = await req.json();

    if (!idea || !platform || !contentType || !audienceLevel || !goal) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const systemPrompt = getSystemPrompt(trendAwareness);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = `Evaluate this content idea:

Content Idea: ${idea}

Platform: ${platform}
Content Type: ${contentType}
Audience Level: ${audienceLevel}
Goal: ${goal}
${trendAwareness ? "\nTrend Awareness: ENABLED - Analyze timing and trend factors" : ""}

Analyze this critically and provide your assessment.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "AI analysis failed. Please try again." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response from the AI
    let validationResult;
    try {
      // Clean up the response in case it has markdown code blocks
      const cleanedContent = content
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();
      validationResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse AI response");
    }

    return new Response(
      JSON.stringify(validationResult),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Validation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
