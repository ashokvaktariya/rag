import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.74.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Initialize Supabase client with user's auth token for RLS
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    // Fetch consultant profiles for RAG context
    const { data: consultants, error: consultantError } = await supabase
      .from("consultant_profiles")
      .select("*");

    if (consultantError) {
      console.error("Error fetching consultants:", consultantError);
    }

    console.log("Fetched consultants:", consultants?.length || 0);

    // Build RAG context from consultant profiles
    let ragContext = "";
    if (consultants && consultants.length > 0) {
      ragContext = "\n\nAvailable Consultants:\n" + consultants.map((c: any) => 
        `- ${c.name} (${c.title}) [ID: ${c.id}]\n` +
        `  Expertise: ${c.expertise.join(", ")}\n` +
        `  Experience: ${c.years_experience} years\n` +
        `  Skills: ${c.skills?.join(", ") || "N/A"}\n` +
        `  Certifications: ${c.certifications?.join(", ") || "N/A"}\n` +
        `  Status: ${c.availability_status}\n` +
        `  Rate: $${c.hourly_rate}/hour\n` +
        `  Bio: ${c.bio}\n`
      ).join("\n");
    }

    const systemPrompt = `You are Canopy Assistant, an internal AI tool for Canopy Advisory Group's sales team. Your primary purpose is to help match consultants to client requirements based on past contracts, client history, and consultant profiles.

Your Role:
- Help sales team members find the right consultants for specific client needs
- Provide insights based on past successful contracts and engagements
- Match consultant expertise with client requirements
- Surface relevant past projects and client relationships

Available Knowledge Base:
- Consultant profiles (skills, expertise, certifications, experience)
- Past contract details and outcomes
- Client history and preferences
- Industry-specific project experience
- Success metrics from previous engagements

When responding:
- Focus on consultant-client matching based on requirements
- Reference specific past contracts when relevant
- Highlight consultant expertise areas
- Suggest best-fit consultants with justification
- Be concise and sales-focused
- Ask clarifying questions about client requirements when needed
- Provide data-driven recommendations
- When recommending consultants, use the show_consultants tool to display their profiles

Example queries you should handle:
- "Find consultants with fintech experience"
- "Who worked on similar healthcare transformation projects?"
- "Which consultants are available for a 6-month engagement?"
- "Show me our track record with this client"
- "What expertise do we have in cloud migration?"

Maintain a professional, efficient tone focused on helping close deals with the right talent match.${ragContext}`;

    const tools = [
      {
        type: "function",
        function: {
          name: "show_consultants",
          description: "Display consultant profiles with full details when recommending consultants to the user",
          parameters: {
            type: "object",
            properties: {
              consultants: {
                type: "array",
                description: "Array of consultant profiles to display",
                items: {
                  type: "object",
                  properties: {
                    id: { type: "string", description: "Consultant ID from the database" },
                    name: { type: "string" },
                    title: { type: "string" },
                    photo_url: { type: "string" },
                    expertise: { type: "array", items: { type: "string" } },
                    skills: { type: "array", items: { type: "string" } },
                    years_experience: { type: "number" },
                    hourly_rate: { type: "number" },
                    availability_status: { type: "string" },
                    certifications: { type: "array", items: { type: "string" } },
                    bio: { type: "string" }
                  },
                  required: ["id", "name", "title", "expertise", "years_experience", "availability_status"]
                }
              }
            },
            required: ["consultants"]
          }
        }
      }
    ];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        tools,
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limits exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add funds to your Lovable AI workspace." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("chat error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
