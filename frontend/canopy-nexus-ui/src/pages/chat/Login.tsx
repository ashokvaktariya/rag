import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import canopyLogoDark from "@/assets/canopy-logo-blue.png";

const ChatLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple bypass for testing - just check if email is provided
      if (email) {
        // Store user info in localStorage for demo purposes
        localStorage.setItem('user', JSON.stringify({
          email: email,
          name: email.split('@')[0],
          role: 'user'
        }));
        
        toast({
          title: "Login successful",
          description: "Welcome to the consultant search system!",
        });
        
        navigate("/chat");
      } else {
        throw new Error("Please enter an email");
      }
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Please enter a valid email",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img 
            src={canopyLogoDark} 
            alt="Canopy Advisory Group" 
            className="h-20 mx-auto mb-4"
          />
          <p className="text-muted-foreground">Sign in to continue to Assistant</p>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password (Optional for demo)</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password (optional)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="rounded-lg"
              />
            </div>

            <Button type="submit" className="w-full rounded-lg" size="lg" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Continue"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Don't have an account? Contact your administrator</p>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <a href="/admin/login" className="hover:text-foreground transition-colors">
            Admin Portal →
          </a>
        </div>
      </div>
    </div>
  );
};

export default ChatLogin;
