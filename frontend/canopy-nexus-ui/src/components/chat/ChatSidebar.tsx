import { Plus, MessageSquare, Settings, LogOut, User } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import canopyLogo from "@/assets/canopy-logo-white.png";

export default function ChatSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("Griffen");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email || null);
        setUserName(user.user_metadata?.full_name || user.email?.split('@')[0] || "Griffen");
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    } else {
      navigate("/chat/login");
    }
  };

  const handleSettings = () => {
    navigate("/chat/settings");
  };

  const handleProfile = () => {
    navigate("/chat/profile");
  };
  
  const conversations = [
    { id: "1", title: "Cloud migration for BofA", timestamp: "2 min ago" },
    { id: "2", title: "Healthcare transformation", timestamp: "15 min ago" },
    { id: "3", title: "Fintech blockchain experts", timestamp: "1 hour ago" },
    { id: "4", title: "Digital transformation", timestamp: "3 hours ago" },
    { id: "5", title: "Q2 2025 consultants", timestamp: "Yesterday" },
    { id: "6", title: "Retail transformation", timestamp: "2 days ago" },
    { id: "7", title: "AWS security architects", timestamp: "3 days ago" },
    { id: "8", title: "Insurance modernization", timestamp: "5 days ago" },
  ];

  const startNewChat = () => {
    navigate("/chat");
  };

  return (
    <Sidebar className="border-r bg-sidebar w-80">
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        <div className="mb-4 flex justify-center">
          <img src={canopyLogo} alt="Canopy Advisory Group" className="h-10 w-auto" />
        </div>
        <Button
          onClick={startNewChat}
          className="w-full gap-2 rounded-xl bg-sidebar-accent hover:bg-sidebar-accent/80" 
          size="sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <ScrollArea className="h-[calc(100vh-240px)]">
              <SidebarMenu>
                {conversations.map((conv) => (
                  <SidebarMenuItem key={conv.id}>
                    <SidebarMenuButton 
                      asChild
                      isActive={location.pathname === `/chat/s/${conv.id}`}
                    >
                      <button
                        onClick={() => navigate(`/chat/s/${conv.id}`)}
                        className="flex flex-col items-start gap-1 p-3 rounded-lg hover:bg-sidebar-accent w-full text-left group transition-colors"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <MessageSquare className="w-4 h-4 text-sidebar-foreground/60 group-hover:text-sidebar-foreground flex-shrink-0" />
                          <span className="text-sm truncate flex-1">{conv.title}</span>
                        </div>
                        <span className="text-xs text-muted-foreground ml-7">{conv.timestamp}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleProfile}
          className="w-full justify-start gap-3 h-auto p-3 hover:bg-sidebar-accent"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop" alt={userName} />
            <AvatarFallback className="bg-primary/10 text-primary text-sm">
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start flex-1 min-w-0">
            <span className="text-sm font-medium truncate w-full">
              {userName}
            </span>
            <span className="text-xs text-muted-foreground truncate w-full">
              {userEmail || ""}
            </span>
          </div>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSettings}
          className="w-full justify-start gap-3 p-3 hover:bg-sidebar-accent"
        >
          <Settings className="h-5 w-5" />
          <span className="text-sm">Settings</span>
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="w-full justify-start gap-3 p-3 hover:bg-sidebar-accent text-destructive hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm">Log out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
