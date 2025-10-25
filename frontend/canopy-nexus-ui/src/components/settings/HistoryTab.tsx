import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Calendar, User, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export const HistoryTab = () => {
  const mockHistory = [
    {
      id: "1",
      user: "Sarah Johnson",
      query: "Explain RAG systems",
      collection: "Technical Documentation",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      tokensUsed: 1250,
    },
    {
      id: "2",
      user: "Michael Chen",
      query: "Database best practices",
      collection: "Best Practices",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      tokensUsed: 890,
    },
    {
      id: "3",
      user: "Emily Rodriguez",
      query: "API rate limiting",
      collection: "Technical Documentation",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      tokensUsed: 1560,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Chat History</h2>
        <p className="text-muted-foreground">View and analyze conversation logs</p>
      </div>

      <Card className="rounded-2xl p-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-10 rounded-lg"
            />
          </div>
          <Button variant="outline" className="gap-2 rounded-lg">
            <Calendar className="w-4 h-4" />
            Date Range
          </Button>
          <Button variant="outline" className="gap-2 rounded-lg">
            <User className="w-4 h-4" />
            Filter by User
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Query</TableHead>
              <TableHead>Collection</TableHead>
              <TableHead>Tokens</TableHead>
              <TableHead>Time</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockHistory.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.user}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-muted-foreground" />
                    {item.query}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{item.collection}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {item.tokensUsed.toLocaleString()}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDistanceToNow(item.timestamp, { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" className="rounded-lg">
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};
