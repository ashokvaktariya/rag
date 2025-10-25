import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import canopyLogoDark from "@/assets/canopy-logo-blue.png";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="text-center max-w-2xl">
        <img 
          src={canopyLogoDark} 
          alt="Canopy Advisory Group" 
          className="h-26 mx-auto mb-6"
        />
        
        <p className="text-xl text-muted-foreground mb-8">
          AI-powered assistant with comprehensive admin tools for strategic advisory services
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            size="lg"
            className="gap-2 rounded-2xl"
            onClick={() => navigate("/chat/login")}
          >
            Chat Assistant
          </Button>
          
          <Button
            size="lg"
            variant="outline"
            className="gap-2 rounded-2xl"
            onClick={() => navigate("/admin/login")}
          >
            Admin Portal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
