import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { mockPrompts } from "@/lib/mock-data";
import { Plus, Star } from "lucide-react";

const AdminPrompts = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">System Prompts</h1>
          <p className="text-muted-foreground">Configure AI assistant behavior and instructions</p>
        </div>
        <Button className="gap-2 rounded-lg">
          <Plus className="w-4 h-4" />
          New Prompt
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          {mockPrompts.map((prompt) => (
            <Card
              key={prompt.id}
              className={`rounded-2xl cursor-pointer transition-all ${
                prompt.isDefault ? "ring-2 ring-primary" : "hover:shadow-lg"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {prompt.name}
                      {prompt.isDefault && <Star className="w-4 h-4 fill-primary text-primary" />}
                    </CardTitle>
                    <CardDescription>Version {prompt.version}</CardDescription>
                  </div>
                  {prompt.isDefault && (
                    <Badge className="bg-primary">Default</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {prompt.content}
                </p>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-lg">
                    Edit
                  </Button>
                  {!prompt.isDefault && (
                    <Button size="sm" variant="outline" className="rounded-lg">
                      Set as Default
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="rounded-2xl h-fit sticky top-6">
          <CardHeader>
            <CardTitle>Prompt Editor</CardTitle>
            <CardDescription>Edit and test your system prompt</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Prompt Content</Label>
              <Textarea
                className="mt-2 min-h-[300px] rounded-lg"
                placeholder="Enter your system prompt..."
                defaultValue={mockPrompts[0].content}
              />
            </div>
            <div className="flex gap-2">
              <Button className="rounded-lg flex-1">Save</Button>
              <Button variant="outline" className="rounded-lg">Test</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPrompts;
