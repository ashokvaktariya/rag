import { SidebarTrigger } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminHeader() {
  const navigate = useNavigate();

  return (
    <header className="h-14 border-b flex items-center justify-between px-4 bg-card">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <Badge variant="secondary" className="text-xs">Admin Portal</Badge>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/admin/login")}
        className="gap-2"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </Button>
    </header>
  );
}
