import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const ProfileTab = () => {
  return (
    <div className="space-y-6">
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Display Name</Label>
            <Input id="name" defaultValue="John Doe" className="mt-2 rounded-lg" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="john@example.com" className="mt-2 rounded-lg" />
          </div>
          <Button className="rounded-lg">Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize your chat experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Dark Mode</Label>
              <p className="text-sm text-muted-foreground">Use dark theme</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Citations</Label>
              <p className="text-sm text-muted-foreground">Display source citations in responses</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enable RAG by Default</Label>
              <p className="text-sm text-muted-foreground">Use retrieval augmentation for all queries</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>Control your data and conversation history</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="rounded-lg">Download My Data</Button>
          <Button variant="destructive" className="rounded-lg">Clear Conversation History</Button>
        </CardContent>
      </Card>
    </div>
  );
};
