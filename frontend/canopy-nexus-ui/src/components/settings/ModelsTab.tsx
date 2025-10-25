import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { mockModels } from "@/lib/mock-data";
import { Brain, Star } from "lucide-react";

export const ModelsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">AI Models</h2>
        <p className="text-muted-foreground">Configure language models and parameters</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-semibold">Available Models</h3>
          {mockModels.map((model) => (
            <Card
              key={model.id}
              className={`rounded-2xl cursor-pointer transition-all ${
                model.isDefault ? "ring-2 ring-primary" : "hover:shadow-lg"
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {model.name}
                        {model.isDefault && <Star className="w-4 h-4 fill-primary text-primary" />}
                      </CardTitle>
                      <CardDescription>{model.provider}</CardDescription>
                    </div>
                  </div>
                  {model.isDefault && (
                    <Badge className="bg-primary">Active</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Temperature</p>
                    <p className="font-medium">{model.temperature}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Top P</p>
                    <p className="font-medium">{model.topP}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Max Tokens</p>
                    <p className="font-medium">{model.maxTokens}</p>
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button size="sm" variant="outline" className="rounded-lg">
                    Configure
                  </Button>
                  {!model.isDefault && (
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
            <CardTitle>Model Configuration</CardTitle>
            <CardDescription>Adjust parameters for {mockModels[0].name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Temperature: 0.7</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Controls randomness. Lower is more focused, higher is more creative.
              </p>
              <Slider defaultValue={[0.7]} max={2} step={0.1} />
            </div>

            <div>
              <Label>Top P: 0.9</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Controls diversity via nucleus sampling.
              </p>
              <Slider defaultValue={[0.9]} max={1} step={0.05} />
            </div>

            <div>
              <Label>Max Tokens: 4096</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Maximum length of generated response.
              </p>
              <Slider defaultValue={[4096]} max={8192} step={256} />
            </div>

            <Button className="w-full rounded-lg">Save Configuration</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
