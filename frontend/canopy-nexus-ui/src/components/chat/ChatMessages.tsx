import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { User, Bot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import ConsultantCard, { type Consultant } from "./ConsultantCard";

interface Message {
  role: "user" | "assistant";
  content: string;
  consultants?: Consultant[];
}

interface ChatMessagesProps {
  messages: Message[];
  isLoading?: boolean;
  onConsultantClick?: (consultant: Consultant) => void;
}

export default function ChatMessages({ messages, isLoading, onConsultantClick }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <ScrollArea className="flex-1 px-4" ref={scrollRef}>
      <div className="max-w-3xl mx-auto space-y-8 py-8">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {message.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
            )}

            <div className="max-w-[80%] space-y-4">
              <div
                className={`rounded-2xl p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {message.content.split("\n\n").map((paragraph, i) => (
                    <p key={i} className="mb-2 last:mb-0 whitespace-pre-wrap">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {message.consultants && message.consultants.length > 0 && (
                <div className="space-y-3">
                  {message.consultants.map((consultant) => (
                    <ConsultantCard 
                      key={consultant.id} 
                      consultant={consultant} 
                      onConsultantClick={onConsultantClick}
                    />
                  ))}
                </div>
              )}
            </div>

            {message.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 mt-1">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="max-w-[80%] rounded-2xl p-4 bg-muted space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
