type Msg = { role: "user" | "assistant"; content: string };

export interface Consultant {
  id: string;
  name: string;
  email: string;
  title?: string;
  location?: string;
  phone?: string;
  practice_area?: string;
  consultant_status?: string;
  business_strategy_skills?: string;
  finance_skills?: string;
  law_skills?: string;
  marketing_pr_skills?: string;
  nonprofit_skills?: string;
  professional_passion?: string;
  projects_excite?: string;
  description?: string;
  keywords?: string;
  hourly_rate_low?: string;
  hourly_rate_high?: string;
  rate?: string;
  similarity?: number;
  skills?: string;
  experience?: string;
  availability?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('Environment:', import.meta.env);

export async function streamChat({
  messages,
  onDelta,
  onDone,
  onError,
}: {
  messages: Msg[];
  onDelta: (deltaText: string, consultants?: Consultant[]) => void;
  onDone: () => void;
  onError?: (error: string) => void;
}) {
  try {
    // Get the last user message
    const lastUserMessage = messages.filter(m => m.role === "user").pop();
    if (!lastUserMessage) {
      onError?.('No user message found');
      return;
    }

    const query = lastUserMessage.content.toLowerCase().trim();

    // Check if the query is asking for consultants or is a general conversation
  const consultantKeywords = [
    'consultant', 'expert', 'specialist', 'professional', 'advisor',
    'find', 'search', 'looking for', 'need', 'want', 'hire',
    'marketing', 'finance', 'strategy', 'operations', 'technology',
    'healthcare', 'nonprofit', 'business', 'legal', 'law',
    'who has', 'who can', 'who knows', 'available', 'experienced'
  ];

  const consultantQueryKeywords = [
    'tell me about', 'information about', 'details about', 'who is',
    'about', 'profile of', 'show me', 'give me info', 'more about',
    'contact info', 'phone', 'email', 'address', 'rate', 'skills',
    'experience', 'background', 'references', 'linkedin', 'what is',
    'how to contact', 'contact details', 'full profile', 'complete info'
  ];

    const isConsultantQuery = consultantKeywords.some(keyword => query.includes(keyword));
    const isSpecificConsultantQuery = consultantQueryKeywords.some(keyword => query.includes(keyword));

    // Check if query is asking about a specific consultant by name
    const isSpecificConsultantByName = async () => {
      if (!isSpecificConsultantQuery) return false;
      
      // Extract potential consultant name from query
      const words = lastUserMessage.content.split(' ');
      const nameCandidates = words.filter(word => 
        word.length > 2 && 
        !consultantQueryKeywords.some(keyword => keyword.includes(word.toLowerCase())) &&
        !consultantKeywords.includes(word.toLowerCase())
      );
      
      if (nameCandidates.length === 0) return false;
      
      // Try to find consultant by name
      try {
        console.log('Searching for consultant by name:', nameCandidates.join(' '));
        console.log('URL:', `${API_BASE_URL}/consultants/search?name=${encodeURIComponent(nameCandidates.join(' '))}&limit=1`);
        const searchResponse = await fetch(`${API_BASE_URL}/consultants/search?name=${encodeURIComponent(nameCandidates.join(' '))}&limit=1`);
        console.log('Search response status:', searchResponse.status);
        if (searchResponse.ok) {
          const data = await searchResponse.json();
          return data.consultants.length > 0 ? data.consultants[0] : null;
        } else {
          console.error('Search response not ok:', searchResponse.status, searchResponse.statusText);
        }
      } catch (error) {
        console.error('Error searching for consultant by name:', error);
      }
      
      return false;
    };

    // Handle specific consultant queries
    const specificConsultant = await isSpecificConsultantByName();
    if (specificConsultant) {
      // Generate detailed response about the specific consultant
      const consultant = specificConsultant;
      const responseText = `Here's detailed information about ${consultant.name}:`;
      
      const words = responseText.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        onDelta(words[i] + ' ');
      }

      // Create detailed consultant info for display
      const detailedConsultant: Consultant = {
        id: consultant.consultant_id,
        name: consultant.name,
        email: consultant.email,
        title: consultant.title || '',
        location: consultant.location || '',
        phone: consultant.phone || '',
        practice_area: consultant.practice_area || '',
        consultant_status: consultant.consultant_status || '',
        business_strategy_skills: consultant.business_strategy_skills || '',
        finance_skills: consultant.finance_skills || '',
        law_skills: consultant.law_skills || '',
        marketing_pr_skills: consultant.marketing_pr_skills || '',
        nonprofit_skills: consultant.nonprofit_skills || '',
        professional_passion: consultant.professional_passion || '',
        projects_excite: consultant.projects_excite || '',
        description: consultant.description || '',
        keywords: consultant.keywords || '',
        hourly_rate_low: consultant.hourly_rate_low || '',
        hourly_rate_high: consultant.hourly_rate_high || '',
        rate: consultant.hourly_rate_low ? `$${consultant.hourly_rate_low}-${consultant.hourly_rate_high}/hr` : 'Rate not specified',
        similarity: 1.0, // Perfect match since they asked specifically
        skills: [
          consultant.business_strategy_skills,
          consultant.finance_skills,
          consultant.law_skills,
          consultant.marketing_pr_skills,
          consultant.nonprofit_skills
        ].filter(Boolean).join(', '),
        experience: consultant.professional_passion || '',
        availability: consultant.consultant_status || 'Unknown'
      };

      onDelta('', [detailedConsultant]);
      onDone();
      return;
    }

    if (isConsultantQuery) {
      // Search for consultants
      console.log('Searching for consultants with query:', lastUserMessage.content);
      console.log('API URL:', `${API_BASE_URL}/search`);
      const searchResponse = await fetch(`${API_BASE_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: lastUserMessage.content,
          limit: 5,
          min_similarity: 0.7,
          filter_active: true  // Only show active consultants
        }),
      });
      
      console.log('Search response status:', searchResponse.status);

      if (!searchResponse.ok) {
        const errorMsg = `Search failed: ${searchResponse.statusText}`;
      onError?.(errorMsg);
      throw new Error(errorMsg);
    }

      const searchData = await searchResponse.json();
      const consultants: Consultant[] = searchData.consultants.map((c: any) => ({
        id: c.consultant_id,
        name: c.name,
        email: c.email,
        title: c.title || '',
        location: c.location || '',
        phone: c.phone || '',
        practice_area: c.practice_area || '',
        consultant_status: c.consultant_status || 'Unknown',
        business_strategy_skills: c.business_strategy_skills || '',
        finance_skills: c.finance_skills || '',
        law_skills: c.law_skills || '',
        marketing_pr_skills: c.marketing_pr_skills || '',
        nonprofit_skills: c.nonprofit_skills || '',
        professional_passion: c.professional_passion || '',
        projects_excite: c.projects_excite || '',
        description: c.description || '',
        keywords: c.keywords || '',
        hourly_rate_low: c.hourly_rate_low || '',
        hourly_rate_high: c.hourly_rate_high || '',
        rate: c.hourly_rate_low ? `$${c.hourly_rate_low}-${c.hourly_rate_high}/hr` : 'Rate not specified',
        similarity: c.similarity_score || 0,
        // Combine all skills for display
        skills: [
          c.business_strategy_skills,
          c.finance_skills,
          c.law_skills,
          c.marketing_pr_skills,
          c.nonprofit_skills
        ].filter(Boolean).join(', '),
        experience: c.professional_passion || '',
        availability: c.consultant_status || 'Unknown'
      }));

      // Generate consultant-focused response
      const responseText = `I found ${consultants.length} consultants matching your criteria: "${lastUserMessage.content}". Here are the top matches:`;
      
      // Stream the response
      const words = responseText.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        onDelta(words[i] + ' ');
      }

      // Add consultant data
      onDelta('', consultants);
      onDone();

    } else {
      // Handle general conversation
      const generalResponses = {
        'hello': "Hello! I'm the Canopy Assistant. I can help you find consultants for your projects. What kind of consultant are you looking for?",
        'hi': "Hi there! I'm here to help you find the right consultants. What expertise do you need?",
        'help': "I can help you find consultants based on their skills, experience, and expertise. Try asking me things like 'Find a marketing consultant', 'Who has healthcare experience?', or 'Tell me about Alex Rich'.",
        'thanks': "You're welcome! Feel free to ask me about finding consultants anytime.",
        'bye': "Goodbye! Feel free to come back when you need help finding consultants.",
        'how are you': "I'm doing well, thank you! I'm ready to help you find the perfect consultants for your needs.",
        'what can you do': "I can help you search through our database of consultants to find the right match for your projects. You can ask me to find consultants by skills, or ask about specific consultants by name. Try asking 'Find a marketing strategy consultant' or 'Tell me about John Smith'."
      };

      // Find the best response or use a default
      let response = generalResponses[query as keyof typeof generalResponses];
      if (!response) {
        response = "I'm the Canopy Assistant, specialized in helping you find the right consultants. You can ask me to find consultants with specific skills, experience, or expertise. You can also ask about specific consultants by name. For example, try asking 'Find a marketing strategy consultant', 'Who has healthcare experience?', or 'Tell me about Alex Rich'.";
      }

      // Stream the general response
      const words = response.split(' ');
      for (let i = 0; i < words.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 50));
        onDelta(words[i] + ' ');
      }

      onDone();
    }

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    onError?.(errorMsg);
    throw error;
  }
}
