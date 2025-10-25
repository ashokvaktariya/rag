import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockCollections } from "@/lib/mock-data";
import { Plus, FolderOpen } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const AdminCollections = () => {
  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Collections</h1>
          <p className="text-muted-foreground">Organize documents into collections</p>
        </div>
        <Button className="gap-2 rounded-lg">
          <Plus className="w-4 h-4" />
          New Collection
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockCollections.map((collection) => (
          <Card key={collection.id} className="rounded-2xl hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-6 h-6 text-primary" />
                </div>
                <Badge variant="secondary">{collection.documentCount} docs</Badge>
              </div>
              <CardTitle className="mt-4">{collection.name}</CardTitle>
              <CardDescription className="line-clamp-2">
                {collection.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">
                Created {formatDistanceToNow(collection.createdAt, { addSuffix: true })}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminCollections;
