import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const AdminSettings = () => {
  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Configure system-wide preferences</p>
      </div>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Brand Colors</CardTitle>
          <CardDescription>Current Canopy theme tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Teal", color: "bg-canopy-teal", hex: "#113b52" },
              { name: "Carbon", color: "bg-canopy-carbon", hex: "#2b2529" },
              { name: "Leather", color: "bg-canopy-leather", hex: "#cd8130" },
              { name: "Tan", color: "bg-canopy-tan", hex: "#e9d9d0" },
            ].map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={`${color.color} h-20 rounded-2xl shadow-sm`} />
                <div>
                  <p className="font-medium text-sm">{color.name}</p>
                  <p className="text-xs text-muted-foreground">{color.hex}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Feature Flags</CardTitle>
          <CardDescription>Enable or disable system features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>RAG System</Label>
              <p className="text-sm text-muted-foreground">Enable retrieval-augmented generation</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Citation Display</Label>
              <p className="text-sm text-muted-foreground">Show source citations in responses</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>File Uploads</Label>
              <p className="text-sm text-muted-foreground">Allow users to upload files in chat</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Analytics Tracking</Label>
              <p className="text-sm text-muted-foreground">Collect usage analytics</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>System Information</CardTitle>
          <CardDescription>Current deployment status</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Environment</Label>
            <Badge variant="secondary">Production</Badge>
          </div>
          <div className="flex items-center justify-between">
            <Label>Version</Label>
            <span className="text-sm text-muted-foreground">1.2.4</span>
          </div>
          <div className="flex items-center justify-between">
            <Label>Last Deployment</Label>
            <span className="text-sm text-muted-foreground">2 days ago</span>
          </div>
          <Button variant="outline" className="w-full rounded-lg">
            View System Logs
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSettings;
