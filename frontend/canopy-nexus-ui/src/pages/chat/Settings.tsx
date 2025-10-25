import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "@/components/settings/ProfileTab";
import { UsersTab } from "@/components/settings/UsersTab";
import { PromptsTab } from "@/components/settings/PromptsTab";
import { ModelsTab } from "@/components/settings/ModelsTab";
import { HistoryTab } from "@/components/settings/HistoryTab";
import { useUserRole } from "@/hooks/use-user-role";
import { Loader2 } from "lucide-react";

const ChatSettings = () => {
  const { isAdmin, loading } = useUserRole();

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">
            {isAdmin ? "Manage system settings and preferences" : "Manage your chat preferences and account"}
          </p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {isAdmin && (
              <>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="prompts">Prompts</TabsTrigger>
                <TabsTrigger value="models">Models</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>

          {isAdmin && (
            <>
              <TabsContent value="users">
                <UsersTab />
              </TabsContent>

              <TabsContent value="prompts">
                <PromptsTab />
              </TabsContent>

              <TabsContent value="models">
                <ModelsTab />
              </TabsContent>

              <TabsContent value="history">
                <HistoryTab />
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default ChatSettings;
