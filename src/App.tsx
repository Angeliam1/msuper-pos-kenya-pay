
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoginPage } from "@/components/auth/LoginPage";
import { RoleBasedDashboard } from "@/components/pos/RoleBasedDashboard";
import { StoreProvider } from "@/contexts/StoreContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <StoreProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<LoginPage />} />
            
            {/* Super Admin Routes */}
            <Route 
              path="/super-admin" 
              element={
                <AuthGuard requiredRole="super_admin">
                  <RoleBasedDashboard />
                </AuthGuard>
              } 
            />
            
            {/* Admin/Manager Routes */}
            <Route 
              path="/admin" 
              element={
                <AuthGuard>
                  <RoleBasedDashboard />
                </AuthGuard>
              } 
            />
            
            {/* POS Routes */}
            <Route 
              path="/pos" 
              element={
                <AuthGuard>
                  <RoleBasedDashboard />
                </AuthGuard>
              } 
            />
            
            {/* Default route - redirect to auth */}
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="*" element={<Navigate to="/auth" replace />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </StoreProvider>
  </QueryClientProvider>
);

export default App;
