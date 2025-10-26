import type { Consultant } from "@/components/chat/ConsultantCard";

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  consultants?: Consultant[];
}

export interface Conversation {
  id: string;
  title: string;
  messages: ConversationMessage[];
  timestamp: string;
}

// Mock conversation history data
const mockConversations: Record<string, Conversation> = {
  "1": {
    id: "1",
    title: "Cloud migration consultants for Bank of America",
    timestamp: "2 min ago",
    messages: [
      {
        role: "user",
        content: "I need consultants with cloud migration experience for a Bank of America project. They need AWS expertise and financial services background."
      },
      {
        role: "assistant",
        content: "I found 12 consultants with AWS and financial services experience. Here are the top matches:",
        consultants: [
          {
            id: "1",
            name: "Sarah Chen",
            title: "Senior Cloud Architect",
            photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
            expertise: ["AWS", "Cloud Migration", "Financial Services", "DevOps"],
            years_experience: 12,
            hourly_rate: 225,
            availability_status: "available",
            certifications: ["AWS Solutions Architect Professional", "AWS DevOps Engineer"],
            bio: "Specialized in enterprise cloud migrations for Fortune 500 financial institutions."
          },
          {
            id: "2",
            name: "Michael Rodriguez",
            title: "Cloud Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
            expertise: ["AWS", "Azure", "Banking Systems", "Security"],
            years_experience: 10,
            hourly_rate: 200,
            availability_status: "available",
            certifications: ["AWS Solutions Architect", "CISSP"],
            bio: "Expert in secure cloud architectures for banking and financial services."
          }
        ]
      },
      {
        role: "user",
        content: "Can you filter to only show consultants with 10+ years of experience and who have worked specifically with banking institutions?"
      },
      {
        role: "assistant",
        content: "Narrowing down to senior consultants with 10+ years experience and banking sector projects, I have 5 highly qualified matches:",
        consultants: [
          {
            id: "1",
            name: "Sarah Chen",
            title: "Senior Cloud Architect",
            photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
            expertise: ["AWS", "Cloud Migration", "Financial Services", "DevOps"],
            years_experience: 12,
            hourly_rate: 225,
            availability_status: "available",
            certifications: ["AWS Solutions Architect Professional", "AWS DevOps Engineer"],
            bio: "Specialized in enterprise cloud migrations for Fortune 500 financial institutions."
          },
          {
            id: "2",
            name: "Michael Rodriguez",
            title: "Cloud Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
            expertise: ["AWS", "Azure", "Banking Systems", "Security"],
            years_experience: 10,
            hourly_rate: 200,
            availability_status: "available",
            certifications: ["AWS Solutions Architect", "CISSP"],
            bio: "Expert in secure cloud architectures for banking and financial services."
          },
          {
            id: "3",
            name: "Emily Watson",
            title: "Principal Cloud Engineer",
            photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop",
            expertise: ["AWS", "Cloud Migration", "Banking", "Infrastructure"],
            years_experience: 14,
            hourly_rate: 240,
            availability_status: "available",
            certifications: ["AWS Solutions Architect Professional", "PMP"],
            bio: "Led major cloud transformation projects for top-tier investment banks."
          }
        ]
      },
      {
        role: "user",
        content: "Great! Now show me only those who are available immediately and have AWS Solution Architect certification."
      },
      {
        role: "assistant",
        content: "Perfect! Here are 3 immediately available consultants with AWS Solution Architect certification and banking experience:",
        consultants: [
          {
            id: "1",
            name: "Sarah Chen",
            title: "Senior Cloud Architect",
            photo_url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=800&fit=crop",
            expertise: ["AWS", "Cloud Migration", "Financial Services", "DevOps"],
            years_experience: 12,
            hourly_rate: 225,
            availability_status: "available",
            certifications: ["AWS Solutions Architect Professional", "AWS DevOps Engineer"],
            bio: "Specialized in enterprise cloud migrations for Fortune 500 financial institutions."
          },
          {
            id: "2",
            name: "Michael Rodriguez",
            title: "Cloud Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
            expertise: ["AWS", "Azure", "Banking Systems", "Security"],
            years_experience: 10,
            hourly_rate: 200,
            availability_status: "available",
            certifications: ["AWS Solutions Architect", "CISSP"],
            bio: "Expert in secure cloud architectures for banking and financial services."
          },
          {
            id: "3",
            name: "Emily Watson",
            title: "Principal Cloud Engineer",
            photo_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800&h=800&fit=crop",
            expertise: ["AWS", "Cloud Migration", "Banking", "Infrastructure"],
            years_experience: 14,
            hourly_rate: 240,
            availability_status: "available",
            certifications: ["AWS Solutions Architect Professional", "PMP"],
            bio: "Led major cloud transformation projects for top-tier investment banks."
          }
        ]
      }
    ]
  },
  "2": {
    id: "2",
    title: "Healthcare transformation - Kaiser Permanente",
    timestamp: "15 min ago",
    messages: [
      {
        role: "user",
        content: "Show me consultants with healthcare transformation experience."
      },
      {
        role: "assistant",
        content: "I found 18 consultants with healthcare transformation experience across various specializations:",
        consultants: [
          {
            id: "4",
            name: "Dr. James Patterson",
            title: "Healthcare IT Director",
            photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop",
            expertise: ["Healthcare IT", "HIPAA", "EHR Systems", "Digital Health"],
            years_experience: 15,
            hourly_rate: 250,
            availability_status: "available",
            certifications: ["CPHIMS", "PMP", "CISSP"],
            bio: "Led digital transformation initiatives for major healthcare systems."
          },
          {
            id: "5",
            name: "Rachel Green",
            title: "Healthcare Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=800&fit=crop",
            expertise: ["EHR", "Healthcare Analytics", "HIPAA", "Interoperability"],
            years_experience: 11,
            hourly_rate: 210,
            availability_status: "available",
            certifications: ["Epic Certified", "HL7 Certified"],
            bio: "Specialized in Epic implementations and healthcare data integration."
          }
        ]
      },
      {
        role: "user",
        content: "Filter for those with HIPAA compliance expertise and who have worked with large healthcare providers."
      },
      {
        role: "assistant",
        content: "Filtering for HIPAA compliance and large provider experience, here are 8 qualified consultants:",
        consultants: [
          {
            id: "4",
            name: "Dr. James Patterson",
            title: "Healthcare IT Director",
            photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop",
            expertise: ["Healthcare IT", "HIPAA", "EHR Systems", "Digital Health"],
            years_experience: 15,
            hourly_rate: 250,
            availability_status: "available",
            certifications: ["CPHIMS", "PMP", "CISSP"],
            bio: "Led digital transformation initiatives for major healthcare systems."
          },
          {
            id: "5",
            name: "Rachel Green",
            title: "Healthcare Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=800&fit=crop",
            expertise: ["EHR", "Healthcare Analytics", "HIPAA", "Interoperability"],
            years_experience: 11,
            hourly_rate: 210,
            availability_status: "available",
            certifications: ["Epic Certified", "HL7 Certified"],
            bio: "Specialized in Epic implementations and healthcare data integration."
          }
        ]
      },
      {
        role: "user",
        content: "Now show only those with EHR system integration experience, preferably Epic or Cerner."
      },
      {
        role: "assistant",
        content: "Here are 4 consultants with EHR integration experience (Epic/Cerner) who meet all your criteria:",
        consultants: [
          {
            id: "5",
            name: "Rachel Green",
            title: "Healthcare Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=800&fit=crop",
            expertise: ["EHR", "Healthcare Analytics", "HIPAA", "Interoperability"],
            years_experience: 11,
            hourly_rate: 210,
            availability_status: "available",
            certifications: ["Epic Certified", "HL7 Certified"],
            bio: "Specialized in Epic implementations and healthcare data integration."
          },
          {
            id: "6",
            name: "David Kim",
            title: "Senior EHR Consultant",
            photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
            expertise: ["Epic", "Cerner", "Healthcare Integration", "FHIR"],
            years_experience: 9,
            hourly_rate: 195,
            availability_status: "available",
            certifications: ["Epic Certified", "Cerner Certified"],
            bio: "Expert in Epic and Cerner implementations with 50+ successful projects."
          }
        ]
      }
    ]
  },
  "3": {
    id: "3",
    title: "Fintech consultants with blockchain expertise",
    timestamp: "1 hour ago",
    messages: [
      {
        role: "user",
        content: "I need consultants for a fintech startup working on payment solutions."
      },
      {
        role: "assistant",
        content: "I found 15 consultants with fintech and payment systems experience:",
        consultants: [
          {
            id: "10",
            name: "Alex Morgan",
            title: "Fintech Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop",
            expertise: ["Fintech", "Payment Systems", "API Design", "Compliance"],
            years_experience: 8,
            hourly_rate: 185,
            availability_status: "available",
            certifications: ["PCI-DSS", "AWS Solutions Architect"],
            bio: "Specialized in payment gateway integrations and fintech platforms."
          },
          {
            id: "11",
            name: "Sophia Martinez",
            title: "Blockchain Consultant",
            photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop",
            expertise: ["Blockchain", "Cryptocurrency", "Smart Contracts", "DeFi"],
            years_experience: 6,
            hourly_rate: 195,
            availability_status: "available",
            certifications: ["Certified Blockchain Expert", "Ethereum Developer"],
            bio: "Expert in blockchain architecture and cryptocurrency solutions."
          }
        ]
      },
      {
        role: "user",
        content: "Narrow it down to those with blockchain or cryptocurrency experience."
      },
      {
        role: "assistant",
        content: "Filtering for blockchain/crypto expertise, here are 6 specialized consultants:",
        consultants: [
          {
            id: "11",
            name: "Sophia Martinez",
            title: "Blockchain Consultant",
            photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop",
            expertise: ["Blockchain", "Cryptocurrency", "Smart Contracts", "DeFi"],
            years_experience: 6,
            hourly_rate: 195,
            availability_status: "available",
            certifications: ["Certified Blockchain Expert", "Ethereum Developer"],
            bio: "Expert in blockchain architecture and cryptocurrency solutions."
          },
          {
            id: "12",
            name: "Kevin Lee",
            title: "Cryptocurrency Architect",
            photo_url: "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=800&h=800&fit=crop",
            expertise: ["Cryptocurrency", "Blockchain", "Web3", "NFT"],
            years_experience: 7,
            hourly_rate: 210,
            availability_status: "available",
            certifications: ["Certified Bitcoin Professional", "Solidity Developer"],
            bio: "Pioneer in cryptocurrency platforms and Web3 applications."
          }
        ]
      },
      {
        role: "user",
        content: "Which of these have startup experience and can work at a mid-level rate under $200/hour?"
      },
      {
        role: "assistant",
        content: "Here are 3 consultants with startup experience and rates under $200/hour:",
        consultants: [
          {
            id: "11",
            name: "Sophia Martinez",
            title: "Blockchain Consultant",
            photo_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=800&fit=crop",
            expertise: ["Blockchain", "Cryptocurrency", "Smart Contracts", "DeFi"],
            years_experience: 6,
            hourly_rate: 195,
            availability_status: "available",
            certifications: ["Certified Blockchain Expert", "Ethereum Developer"],
            bio: "Expert in blockchain architecture and cryptocurrency solutions."
          },
          {
            id: "10",
            name: "Alex Morgan",
            title: "Fintech Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&h=800&fit=crop",
            expertise: ["Fintech", "Payment Systems", "API Design", "Compliance"],
            years_experience: 8,
            hourly_rate: 185,
            availability_status: "available",
            certifications: ["PCI-DSS", "AWS Solutions Architect"],
            bio: "Specialized in payment gateway integrations and fintech platforms."
          }
        ]
      }
    ]
  },
  "4": {
    id: "4",
    title: "Digital transformation - JP Morgan",
    timestamp: "3 hours ago",
    messages: [
      {
        role: "user",
        content: "Find consultants with digital transformation experience in banking."
      },
      {
        role: "assistant",
        content: "I found 22 consultants with banking digital transformation experience:",
        consultants: [
          {
            id: "7",
            name: "Robert Johnson",
            title: "Digital Transformation Director",
            photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop",
            expertise: ["Digital Transformation", "Banking", "Agile", "Change Management"],
            years_experience: 18,
            hourly_rate: 275,
            availability_status: "available",
            certifications: ["PMP", "SAFe Agilist", "TOGAF"],
            bio: "Led enterprise transformations for multiple Fortune 100 banks."
          },
          {
            id: "8",
            name: "Lisa Anderson",
            title: "Principal Banking Consultant",
            photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop",
            expertise: ["Banking Systems", "Modernization", "API Design", "Microservices"],
            years_experience: 13,
            hourly_rate: 220,
            availability_status: "available",
            certifications: ["AWS Solutions Architect", "Scrum Master"],
            bio: "Specialist in modernizing legacy banking platforms and core systems."
          }
        ]
      },
      {
        role: "user",
        content: "Show only those with legacy system modernization expertise, specifically mainframe migration."
      },
      {
        role: "assistant",
        content: "Filtering for legacy modernization and mainframe experience, here are 7 consultants:",
        consultants: [
          {
            id: "8",
            name: "Lisa Anderson",
            title: "Principal Banking Consultant",
            photo_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop",
            expertise: ["Banking Systems", "Modernization", "API Design", "Microservices"],
            years_experience: 13,
            hourly_rate: 220,
            availability_status: "available",
            certifications: ["AWS Solutions Architect", "Scrum Master"],
            bio: "Specialist in modernizing legacy banking platforms and core systems."
          },
          {
            id: "9",
            name: "Thomas Wright",
            title: "Legacy Systems Architect",
            photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop",
            expertise: ["Mainframe Migration", "COBOL", "Banking", "Cloud Migration"],
            years_experience: 20,
            hourly_rate: 260,
            availability_status: "limited",
            certifications: ["IBM Certified", "AWS Migration Specialist"],
            bio: "Expert in mainframe to cloud migrations for financial institutions."
          }
        ]
      },
      {
        role: "user",
        content: "I need consultants at Principal or Director level with Fortune 100 banking experience."
      },
      {
        role: "assistant",
        content: "Here are 3 senior consultants (Principal/Director level) with Fortune 100 banking credentials:",
        consultants: [
          {
            id: "7",
            name: "Robert Johnson",
            title: "Digital Transformation Director",
            photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop",
            expertise: ["Digital Transformation", "Banking", "Agile", "Change Management"],
            years_experience: 18,
            hourly_rate: 275,
            availability_status: "available",
            certifications: ["PMP", "SAFe Agilist", "TOGAF"],
            bio: "Led enterprise transformations for multiple Fortune 100 banks."
          },
          {
            id: "9",
            name: "Thomas Wright",
            title: "Legacy Systems Architect",
            photo_url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&h=800&fit=crop",
            expertise: ["Mainframe Migration", "COBOL", "Banking", "Cloud Migration"],
            years_experience: 20,
            hourly_rate: 260,
            availability_status: "limited",
            certifications: ["IBM Certified", "AWS Migration Specialist"],
            bio: "Expert in mainframe to cloud migrations for financial institutions."
          }
        ]
      }
    ]
  },
  "5": {
    id: "5",
    title: "Available consultants for Q2 2025 projects",
    timestamp: "Yesterday",
    messages: [
      {
        role: "user",
        content: "Show me consultants who will be available starting April 2025."
      },
      {
        role: "assistant",
        content: "I found 24 consultants available from April 2025 onwards:",
        consultants: [
          {
            id: "13",
            name: "Jennifer Harris",
            title: "Cloud Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop",
            expertise: ["Azure", "Cloud Architecture", "DevOps", "Migration"],
            years_experience: 9,
            hourly_rate: 195,
            availability_status: "available",
            certifications: ["Azure Solutions Architect Expert", "Azure DevOps Engineer"],
            bio: "Experienced in large-scale Azure migrations and cloud-native architectures."
          },
          {
            id: "14",
            name: "Marcus Thompson",
            title: "Senior Cloud Engineer",
            photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
            expertise: ["Azure", "Kubernetes", "Containerization", "Microservices"],
            years_experience: 11,
            hourly_rate: 215,
            availability_status: "available",
            certifications: ["Azure Expert", "CKA", "CKAD"],
            bio: "Specialist in Kubernetes and containerized application deployment."
          }
        ]
      },
      {
        role: "user",
        content: "Filter to only cloud architects with Azure expertise."
      },
      {
        role: "assistant",
        content: "Here are 9 Azure cloud architects available in Q2 2025:",
        consultants: [
          {
            id: "13",
            name: "Jennifer Harris",
            title: "Cloud Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop",
            expertise: ["Azure", "Cloud Architecture", "DevOps", "Migration"],
            years_experience: 9,
            hourly_rate: 195,
            availability_status: "available",
            certifications: ["Azure Solutions Architect Expert", "Azure DevOps Engineer"],
            bio: "Experienced in large-scale Azure migrations and cloud-native architectures."
          },
          {
            id: "14",
            name: "Marcus Thompson",
            title: "Senior Cloud Engineer",
            photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
            expertise: ["Azure", "Kubernetes", "Containerization", "Microservices"],
            years_experience: 11,
            hourly_rate: 215,
            availability_status: "available",
            certifications: ["Azure Expert", "CKA", "CKAD"],
            bio: "Specialist in Kubernetes and containerized application deployment."
          }
        ]
      },
      {
        role: "user",
        content: "Which ones have Kubernetes and containerization experience at senior level?"
      },
      {
        role: "assistant",
        content: "Narrowing to senior-level with K8s/container expertise, here are 4 consultants:",
        consultants: [
          {
            id: "14",
            name: "Marcus Thompson",
            title: "Senior Cloud Engineer",
            photo_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop",
            expertise: ["Azure", "Kubernetes", "Containerization", "Microservices"],
            years_experience: 11,
            hourly_rate: 215,
            availability_status: "available",
            certifications: ["Azure Expert", "CKA", "CKAD"],
            bio: "Specialist in Kubernetes and containerized application deployment."
          }
        ]
      }
    ]
  },
  "6": {
    id: "6",
    title: "Retail transformation - Target Corporation",
    timestamp: "2 days ago",
    messages: [
      {
        role: "user",
        content: "I need consultants with retail industry experience."
      },
      {
        role: "assistant",
        content: "I found 20 consultants with retail sector experience:",
        consultants: [
          {
            id: "15",
            name: "Amanda Foster",
            title: "Retail Technology Director",
            photo_url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=800&h=800&fit=crop",
            expertise: ["Retail Technology", "E-commerce", "Omnichannel", "POS Systems"],
            years_experience: 12,
            hourly_rate: 220,
            availability_status: "available",
            certifications: ["Salesforce Commerce Cloud", "SAP Retail Certified"],
            bio: "Leader in retail digital transformation and omnichannel strategies."
          },
          {
            id: "16",
            name: "Daniel Cooper",
            title: "E-commerce Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop",
            expertise: ["E-commerce", "Supply Chain", "Retail Systems", "Integration"],
            years_experience: 10,
            hourly_rate: 200,
            availability_status: "available",
            certifications: ["Magento Certified", "AWS Solutions Architect"],
            bio: "Expert in e-commerce platforms and supply chain integration."
          }
        ]
      },
      {
        role: "user",
        content: "Show me those with omnichannel or e-commerce platform experience."
      },
      {
        role: "assistant",
        content: "Filtering for omnichannel/e-commerce expertise, here are 11 consultants:",
        consultants: [
          {
            id: "15",
            name: "Amanda Foster",
            title: "Retail Technology Director",
            photo_url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=800&h=800&fit=crop",
            expertise: ["Retail Technology", "E-commerce", "Omnichannel", "POS Systems"],
            years_experience: 12,
            hourly_rate: 220,
            availability_status: "available",
            certifications: ["Salesforce Commerce Cloud", "SAP Retail Certified"],
            bio: "Leader in retail digital transformation and omnichannel strategies."
          },
          {
            id: "16",
            name: "Daniel Cooper",
            title: "E-commerce Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop",
            expertise: ["E-commerce", "Supply Chain", "Retail Systems", "Integration"],
            years_experience: 10,
            hourly_rate: 200,
            availability_status: "available",
            certifications: ["Magento Certified", "AWS Solutions Architect"],
            bio: "Expert in e-commerce platforms and supply chain integration."
          }
        ]
      },
      {
        role: "user",
        content: "Which ones have worked with large retail chains (Fortune 500) and have supply chain integration experience?"
      },
      {
        role: "assistant",
        content: "Here are 5 consultants with Fortune 500 retail and supply chain integration credentials:",
        consultants: [
          {
            id: "15",
            name: "Amanda Foster",
            title: "Retail Technology Director",
            photo_url: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=800&h=800&fit=crop",
            expertise: ["Retail Technology", "E-commerce", "Omnichannel", "POS Systems"],
            years_experience: 12,
            hourly_rate: 220,
            availability_status: "available",
            certifications: ["Salesforce Commerce Cloud", "SAP Retail Certified"],
            bio: "Leader in retail digital transformation and omnichannel strategies."
          },
          {
            id: "16",
            name: "Daniel Cooper",
            title: "E-commerce Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&h=800&fit=crop",
            expertise: ["E-commerce", "Supply Chain", "Retail Systems", "Integration"],
            years_experience: 10,
            hourly_rate: 200,
            availability_status: "available",
            certifications: ["Magento Certified", "AWS Solutions Architect"],
            bio: "Expert in e-commerce platforms and supply chain integration."
          }
        ]
      }
    ]
  },
  "7": {
    id: "7",
    title: "AWS cloud architects with security clearance",
    timestamp: "3 days ago",
    messages: [
      {
        role: "user",
        content: "Find consultants with AWS cloud architecture experience."
      },
      {
        role: "assistant",
        content: "I found 28 consultants with AWS architecture expertise:",
        consultants: [
          {
            id: "17",
            name: "Colonel James Mitchell (Ret.)",
            title: "Federal Cloud Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop",
            expertise: ["AWS", "Federal Compliance", "Security", "DoD Cloud"],
            years_experience: 16,
            hourly_rate: 280,
            availability_status: "available",
            certifications: ["AWS Solutions Architect Professional", "Top Secret Clearance", "FedRAMP"],
            bio: "Former military with extensive DoD cloud migration experience."
          },
          {
            id: "18",
            name: "Patricia Reynolds",
            title: "Senior Federal Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop",
            expertise: ["AWS", "Government Cloud", "Security", "Compliance"],
            years_experience: 14,
            hourly_rate: 260,
            availability_status: "available",
            certifications: ["AWS Security Specialty", "Secret Clearance", "CISSP"],
            bio: "Specialized in secure cloud solutions for federal agencies."
          }
        ]
      },
      {
        role: "user",
        content: "I need only those with active security clearance for a federal government project."
      },
      {
        role: "assistant",
        content: "Filtering for active security clearance, here are 6 AWS architects:",
        consultants: [
          {
            id: "17",
            name: "Colonel James Mitchell (Ret.)",
            title: "Federal Cloud Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop",
            expertise: ["AWS", "Federal Compliance", "Security", "DoD Cloud"],
            years_experience: 16,
            hourly_rate: 280,
            availability_status: "available",
            certifications: ["AWS Solutions Architect Professional", "Top Secret Clearance", "FedRAMP"],
            bio: "Former military with extensive DoD cloud migration experience."
          },
          {
            id: "18",
            name: "Patricia Reynolds",
            title: "Senior Federal Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=800&h=800&fit=crop",
            expertise: ["AWS", "Government Cloud", "Security", "Compliance"],
            years_experience: 14,
            hourly_rate: 260,
            availability_status: "available",
            certifications: ["AWS Security Specialty", "Secret Clearance", "CISSP"],
            bio: "Specialized in secure cloud solutions for federal agencies."
          }
        ]
      },
      {
        role: "user",
        content: "Show me those with Top Secret clearance and DoD project experience."
      },
      {
        role: "assistant",
        content: "Here are 2 consultants with Top Secret clearance and DoD experience:",
        consultants: [
          {
            id: "17",
            name: "Colonel James Mitchell (Ret.)",
            title: "Federal Cloud Solutions Architect",
            photo_url: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800&h=800&fit=crop",
            expertise: ["AWS", "Federal Compliance", "Security", "DoD Cloud"],
            years_experience: 16,
            hourly_rate: 280,
            availability_status: "available",
            certifications: ["AWS Solutions Architect Professional", "Top Secret Clearance", "FedRAMP"],
            bio: "Former military with extensive DoD cloud migration experience."
          }
        ]
      }
    ]
  },
  "8": {
    id: "8",
    title: "Insurance industry digital modernization",
    timestamp: "5 days ago",
    messages: [
      {
        role: "user",
        content: "Show me consultants with insurance industry experience."
      },
      {
        role: "assistant",
        content: "I found 14 consultants with insurance sector experience:",
        consultants: [
          {
            id: "19",
            name: "Michelle Stevens",
            title: "Insurance Technology Director",
            photo_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=800&fit=crop",
            expertise: ["Insurance Technology", "Policy Systems", "Guidewire", "Digital Transformation"],
            years_experience: 13,
            hourly_rate: 235,
            availability_status: "available",
            certifications: ["Guidewire Certified", "CPCU", "PMP"],
            bio: "Specialist in insurance policy administration system implementations."
          },
          {
            id: "20",
            name: "Brandon Parker",
            title: "Senior Insurance Systems Consultant",
            photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
            expertise: ["Duck Creek", "Policy Administration", "Claims Systems", "Insurance"],
            years_experience: 11,
            hourly_rate: 215,
            availability_status: "available",
            certifications: ["Duck Creek Certified", "ACORD Standards"],
            bio: "Expert in Duck Creek platforms and insurance system integrations."
          }
        ]
      },
      {
        role: "user",
        content: "Filter for those with policy administration system experience."
      },
      {
        role: "assistant",
        content: "Here are 7 consultants with policy administration system expertise:",
        consultants: [
          {
            id: "19",
            name: "Michelle Stevens",
            title: "Insurance Technology Director",
            photo_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=800&fit=crop",
            expertise: ["Insurance Technology", "Policy Systems", "Guidewire", "Digital Transformation"],
            years_experience: 13,
            hourly_rate: 235,
            availability_status: "available",
            certifications: ["Guidewire Certified", "CPCU", "PMP"],
            bio: "Specialist in insurance policy administration system implementations."
          },
          {
            id: "20",
            name: "Brandon Parker",
            title: "Senior Insurance Systems Consultant",
            photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
            expertise: ["Duck Creek", "Policy Administration", "Claims Systems", "Insurance"],
            years_experience: 11,
            hourly_rate: 215,
            availability_status: "available",
            certifications: ["Duck Creek Certified", "ACORD Standards"],
            bio: "Expert in Duck Creek platforms and insurance system integrations."
          }
        ]
      },
      {
        role: "user",
        content: "Which ones have Guidewire or Duck Creek platform experience and are available within 2 weeks?"
      },
      {
        role: "assistant",
        content: "Here are 3 consultants with Guidewire/Duck Creek experience, available within 2 weeks:",
        consultants: [
          {
            id: "19",
            name: "Michelle Stevens",
            title: "Insurance Technology Director",
            photo_url: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&h=800&fit=crop",
            expertise: ["Insurance Technology", "Policy Systems", "Guidewire", "Digital Transformation"],
            years_experience: 13,
            hourly_rate: 235,
            availability_status: "available",
            certifications: ["Guidewire Certified", "CPCU", "PMP"],
            bio: "Specialist in insurance policy administration system implementations."
          },
          {
            id: "20",
            name: "Brandon Parker",
            title: "Senior Insurance Systems Consultant",
            photo_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=800&fit=crop",
            expertise: ["Duck Creek", "Policy Administration", "Claims Systems", "Insurance"],
            years_experience: 11,
            hourly_rate: 215,
            availability_status: "available",
            certifications: ["Duck Creek Certified", "ACORD Standards"],
            bio: "Expert in Duck Creek platforms and insurance system integrations."
          }
        ]
      }
    ]
  }
};

export function getConversation(id: string): Conversation | undefined {
  return mockConversations[id];
}

export function getAllConversations(): Conversation[] {
  return Object.values(mockConversations);
}
