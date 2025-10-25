import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatComposer from "@/components/chat/ChatComposer";
import ConsultantDetailModal from "@/components/chat/ConsultantDetailModal";
import { streamChat } from "@/lib/chat-stream";
import { useToast } from "@/hooks/use-toast";
import { getConversation } from "@/lib/conversation-store";

import type { Consultant } from "@/components/chat/ConsultantCard";

type Message = { 
  role: "user" | "assistant"; 
  content: string;
  consultants?: Consultant[];
};

const ChatSession = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedConsultant, setSelectedConsultant] = useState<Consultant | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConsultantClick = (consultant: Consultant) => {
    setSelectedConsultant(consultant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedConsultant(null);
  };

  // Load conversation history when session ID changes
  useEffect(() => {
    if (id) {
      const conversation = getConversation(id);
      if (conversation) {
        setMessages(conversation.messages);
      }
    } else {
      setMessages([]);
    }
  }, [id]);

  const sendMessage = async (input: string) => {
    const userMsg: Message = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";
    let consultantData: Consultant[] | undefined;
    
    const upsertAssistant = (nextChunk: string, consultants?: Consultant[]) => {
      assistantContent += nextChunk;
      if (consultants) {
        consultantData = consultants;
      }
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => 
            i === prev.length - 1 
              ? { ...m, content: assistantContent, consultants: consultantData } 
              : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent, consultants: consultantData }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMsg],
        onDelta: (chunk, consultants) => upsertAssistant(chunk, consultants),
        onDone: () => setIsLoading(false),
        onError: (error) => {
          toast({
            title: "Error",
            description: error,
            variant: "destructive",
          });
          setIsLoading(false);
        },
      });
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-2xl space-y-6">
            <h2 className="text-3xl font-semibold text-foreground">
              Find the right consultant for your client
            </h2>
            <p className="text-muted-foreground text-lg">
              Search our consultant database, past contracts, and client history to make the perfect match.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8">
              {[
                "Hello! What can you help me with?",
                "Find a marketing strategy consultant",
                "Tell me about Alex Rich",
                "Who has healthcare experience?"
              ].map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="p-4 text-left rounded-2xl border border-border hover:bg-muted/50 transition-colors"
                  disabled={isLoading}
                >
                  <p className="text-sm">{prompt}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
          <ChatMessages 
            messages={messages} 
            isLoading={isLoading} 
            onConsultantClick={handleConsultantClick}
          />
          <ChatComposer onSend={sendMessage} isLoading={isLoading} />
        </>
      )}

      {messages.length === 0 && (
        <div className="pb-8">
          <ChatComposer onSend={sendMessage} isLoading={isLoading} />
        </div>
      )}

      {/* Consultant Detail Modal */}
      <ConsultantDetailModal
        consultant={selectedConsultant}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default ChatSession;
