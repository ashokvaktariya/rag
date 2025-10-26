// Mock data for prototyping

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  citations?: Citation[];
}

export interface Citation {
  id: string;
  text: string;
  source: string;
  collection: string;
  page?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  isPinned?: boolean;
  unread?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "BDM" | "PRACTICE_LEAD" | "CONSULTANT";
  status: "active" | "inactive";
  lastActive: Date;
}

export interface Document {
  id: string;
  name: string;
  status: "processing" | "ready" | "failed";
  collections: string[];
  uploadedBy: string;
  uploadedAt: Date;
  size: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  documentCount: number;
  createdAt: Date;
}

export interface Prompt {
  id: string;
  name: string;
  content: string;
  version: number;
  isDefault: boolean;
  createdAt: Date;
}

export interface Model {
  id: string;
  provider: string;
  name: string;
  isDefault: boolean;
  temperature: number;
  topP: number;
  maxTokens: number;
}

export const mockSessions: ChatSession[] = [
  {
    id: "1",
    title: "Cloud migration consultants for Bank of America",
    lastMessage: "Based on the requirements, I recommend Sarah Mitchell and David Park...",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isPinned: true,
  },
  {
    id: "2",
    title: "Healthcare transformation - Kaiser Permanente",
    lastMessage: "For this healthcare project, Jennifer Liu has extensive experience...",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unread: true,
  },
  {
    id: "3",
    title: "Fintech consultants with blockchain expertise",
    lastMessage: "We have three consultants with strong blockchain backgrounds...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
  {
    id: "4",
    title: "Digital transformation - JP Morgan engagement",
    lastMessage: "Michael Thompson worked on similar projects with Citibank...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
  },
  {
    id: "5",
    title: "Available consultants for Q2 2025 projects",
    lastMessage: "Currently we have 8 consultants available starting April...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
  },
  {
    id: "6",
    title: "Retail transformation - Target Corporation",
    lastMessage: "For omnichannel retail, I suggest consultants with e-commerce expertise...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
  },
  {
    id: "7",
    title: "AWS cloud architects with security clearance",
    lastMessage: "We have two consultants with both AWS certifications and clearance...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: "8",
    title: "Insurance industry digital modernization",
    lastMessage: "Rachel Kim has 12 years in insurance technology transformation...",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
];

export const mockMessages: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Can you explain how RAG systems work?",
    timestamp: new Date(Date.now() - 1000 * 60 * 10),
  },
  {
    id: "2",
    role: "assistant",
    content: "Retrieval-Augmented Generation (RAG) is a technique that combines information retrieval with language model generation. When a user asks a question, the system first searches through a knowledge base to find relevant documents or passages. These retrieved documents are then provided as context to a large language model, which uses this information to generate a more accurate and informative response.\n\nThe key benefits of RAG include:\n1. Access to up-to-date information beyond the model's training data\n2. Reduced hallucinations through grounded responses\n3. Ability to cite sources and provide transparency",
    timestamp: new Date(Date.now() - 1000 * 60 * 9),
    citations: [
      {
        id: "c1",
        text: "RAG combines retrieval and generation to provide factual responses...",
        source: "Introduction to RAG Systems.pdf",
        collection: "Technical Documentation",
        page: 12,
      },
      {
        id: "c2",
        text: "Studies show RAG reduces hallucination rates by 60-70%...",
        source: "LLM Research Paper 2024.pdf",
        collection: "Research Papers",
        page: 45,
      },
    ],
  },
  {
    id: "3",
    role: "user",
    content: "What are the best practices for implementing vector embeddings?",
    timestamp: new Date(Date.now() - 1000 * 60 * 7),
  },
  {
    id: "4",
    role: "assistant",
    content: "When implementing vector embeddings for RAG systems, here are the key best practices:\n\n**Chunking Strategy:**\n- Use semantic chunking instead of fixed-size chunks\n- Overlap chunks by 10-20% to maintain context\n- Aim for 256-512 tokens per chunk\n\n**Embedding Model Selection:**\n- Choose models based on your domain (general vs. specialized)\n- Consider models like OpenAI's text-embedding-3, Cohere's embed-v3, or open-source alternatives\n- Test different models on your specific use case\n\n**Indexing:**\n- Use approximate nearest neighbor (ANN) algorithms like HNSW or IVF\n- Implement metadata filtering for hybrid search\n- Consider dimensionality reduction if needed",
    timestamp: new Date(Date.now() - 1000 * 60 * 6),
    citations: [
      {
        id: "c3",
        text: "Semantic chunking preserves meaning across document boundaries...",
        source: "Vector Database Best Practices.pdf",
        collection: "Technical Documentation",
        page: 23,
      },
    ],
  },
];

export const mockUsers: User[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    email: "sarah.johnson@canopy.com",
    role: "ADMIN",
    status: "active",
    lastActive: new Date(),
  },
  {
    id: "2",
    name: "Michael Chen",
    email: "michael.chen@canopy.com",
    role: "BDM",
    status: "active",
    lastActive: new Date(Date.now() - 1000 * 60 * 15),
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    email: "emily.r@canopy.com",
    role: "PRACTICE_LEAD",
    status: "active",
    lastActive: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: "4",
    name: "David Kim",
    email: "david.kim@canopy.com",
    role: "CONSULTANT",
    status: "active",
    lastActive: new Date(Date.now() - 1000 * 60 * 120),
  },
  {
    id: "5",
    name: "Alex Thompson",
    email: "alex.t@canopy.com",
    role: "CONSULTANT",
    status: "inactive",
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
  },
];

export const mockDocuments: Document[] = [
  {
    id: "1",
    name: "Q4_Financial_Report.pdf",
    status: "ready",
    collections: ["Financial Reports", "Q4 2024"],
    uploadedBy: "Sarah Johnson",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Product_Roadmap_2025.docx",
    status: "ready",
    collections: ["Product"],
    uploadedBy: "Michael Chen",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    size: "856 KB",
  },
  {
    id: "3",
    name: "Technical_Architecture.pdf",
    status: "processing",
    collections: ["Technical Documentation"],
    uploadedBy: "Emily Rodriguez",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 30),
    size: "5.2 MB",
  },
  {
    id: "4",
    name: "Client_Proposal_Draft.pdf",
    status: "ready",
    collections: ["Sales"],
    uploadedBy: "David Kim",
    uploadedAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
    size: "1.8 MB",
  },
];

export const mockCollections: Collection[] = [
  {
    id: "1",
    name: "Technical Documentation",
    description: "Internal technical guides, architecture docs, and API references",
    documentCount: 45,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
  },
  {
    id: "2",
    name: "Financial Reports",
    description: "Quarterly and annual financial statements",
    documentCount: 12,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 180),
  },
  {
    id: "3",
    name: "Product",
    description: "Product specs, roadmaps, and feature documentation",
    documentCount: 28,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
  },
  {
    id: "4",
    name: "Sales",
    description: "Sales materials, proposals, and case studies",
    documentCount: 67,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120),
  },
];

export const mockPrompts: Prompt[] = [
  {
    id: "1",
    name: "Default System Prompt",
    content: "You are Canopy Assistant, an AI helper designed to provide accurate, helpful responses based on the provided context. Always cite your sources when referencing specific information.",
    version: 3,
    isDefault: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
  },
  {
    id: "2",
    name: "Technical Support",
    content: "You are a technical support specialist. Provide step-by-step solutions and ask clarifying questions when needed.",
    version: 1,
    isDefault: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
  },
];

export const mockModels: Model[] = [
  {
    id: "1",
    provider: "OpenAI",
    name: "gpt-4-turbo",
    isDefault: true,
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 4096,
  },
  {
    id: "2",
    provider: "OpenAI",
    name: "gpt-3.5-turbo",
    isDefault: false,
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 4096,
  },
  {
    id: "3",
    provider: "Anthropic",
    name: "claude-3-opus",
    isDefault: false,
    temperature: 0.7,
    topP: 0.9,
    maxTokens: 4096,
  },
];

export const mockDashboardData = {
  ragHitRate: 87.5,
  avgLatency: 342,
  tokenSpend: 145230,
  activeUsers: 38,
  topQueries: [
    { query: "How do I implement authentication?", count: 124 },
    { query: "Database schema best practices", count: 98 },
    { query: "API rate limiting strategies", count: 76 },
    { query: "React performance optimization", count: 65 },
    { query: "Docker deployment guide", count: 52 },
  ],
  weeklyData: [
    { day: "Mon", queries: 145, hitRate: 85 },
    { day: "Tue", queries: 198, hitRate: 88 },
    { day: "Wed", queries: 167, hitRate: 86 },
    { day: "Thu", queries: 223, hitRate: 90 },
    { day: "Fri", queries: 189, hitRate: 87 },
    { day: "Sat", queries: 98, hitRate: 84 },
    { day: "Sun", queries: 76, hitRate: 82 },
  ],
};
