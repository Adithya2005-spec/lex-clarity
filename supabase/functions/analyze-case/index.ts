import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { caseType, summary, incidentDate, keyFacts, party1Name, party1Role, party2Name, party2Role, legalSections, jurisdiction } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const prompt = `You are a legal analysis AI. Analyze the following case and provide structured output.

Case Type: ${caseType}
Summary: ${summary}
Date of Incident: ${incidentDate || "Not specified"}
Key Facts: ${keyFacts?.filter((f: string) => f.trim()).join("; ") || "None provided"}
Party 1: ${party1Name} (${party1Role})
Party 2: ${party2Name} (${party2Role})
Legal Sections: ${legalSections || "Not specified"}
Jurisdiction: ${jurisdiction}

Provide analysis in the following categories. Be specific and practical.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: "You are a legal analysis assistant. You provide informational analysis only, not legal advice." },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "provide_analysis",
              description: "Provide structured legal case analysis",
              parameters: {
                type: "object",
                properties: {
                  verdictLikelihood: { type: "number", description: "Likelihood of favorable verdict 0-100" },
                  riskLevel: { type: "string", enum: ["Low", "Medium", "High"] },
                  keyFactors: { type: "array", items: { type: "string" }, description: "3-5 key factors affecting the case" },
                  suggestedArguments: { type: "array", items: { type: "string" }, description: "3-5 suggested legal arguments" },
                  similarPrecedents: { type: "array", items: { type: "string" }, description: "2-4 similar case precedents with brief descriptions" },
                  recommendedNextSteps: { type: "array", items: { type: "string" }, description: "3-5 recommended next steps" },
                },
                required: ["verdictLikelihood", "riskLevel", "keyFactors", "suggestedArguments", "similarPrecedents", "recommendedNextSteps"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "provide_analysis" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No analysis returned from AI");

    const analysis = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify({ analysis }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-case error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
