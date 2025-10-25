import { SidebarTrigger } from "@/components/ui/sidebar";
import { useEffect, useState } from "react";

export default function ChatHeader() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <header className="h-14 border-b flex items-center px-4 gap-4 bg-background">
      <SidebarTrigger />
      <div className="flex-1 text-center">
        <h2 className="font-semibold text-2xl">Canopy Assistant</h2>
      </div>
      {user && (
        <div className="text-sm text-muted-foreground">
          Welcome, {user.name}
        </div>
      )}
    </header>
  );
}
