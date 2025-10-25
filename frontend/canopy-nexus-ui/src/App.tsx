import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChatLogin from "./pages/chat/Login";
import ChatLayout from "./pages/chat/Layout";
import ChatSession from "./pages/chat/Session";
import ChatSettings from "./pages/chat/Settings";
import ChatProfile from "./pages/chat/Profile";
import AdminLogin from "./pages/admin/Login";
import AdminLayout from "./pages/admin/Layout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminUsers from "./pages/admin/Users";
import AdminRoles from "./pages/admin/Roles";
import AdminDocuments from "./pages/admin/Documents";
import AdminCollections from "./pages/admin/Collections";
import AdminPrompts from "./pages/admin/Prompts";
import AdminModels from "./pages/admin/Models";
import AdminHistory from "./pages/admin/History";
import AdminSettings from "./pages/admin/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Chat Assistant Routes */}
          <Route path="/chat/login" element={<ChatLogin />} />
          <Route path="/chat" element={<ChatLayout />}>
            <Route index element={<ChatSession />} />
            <Route path="s/:id" element={<ChatSession />} />
            <Route path="settings" element={<ChatSettings />} />
            <Route path="profile" element={<ChatProfile />} />
          </Route>

          {/* Admin Portal Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="roles" element={<AdminRoles />} />
            <Route path="documents" element={<AdminDocuments />} />
            <Route path="collections" element={<AdminCollections />} />
            <Route path="prompts" element={<AdminPrompts />} />
            <Route path="models" element={<AdminModels />} />
            <Route path="history" element={<AdminHistory />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/chat/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
