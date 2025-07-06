
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthManager } from '@/components/auth/AuthManager';
import { DemoProductManagement } from '@/components/pos/DemoProductManagement';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Payment from '@/pages/Payment';
import PaymentSuccess from '@/pages/PaymentSuccess';
import PaymentCancelled from '@/pages/PaymentCancelled';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { DemoModeProvider, useDemoMode } from '@/contexts/DemoModeContext';
import { Attendant } from '@/types';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Component to handle demo mode routing
const AppContent = () => {
  const [currentUser, setCurrentUser] = useState<Attendant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isDemoMode } = useDemoMode();

  useEffect(() => {
    // Check if user is logged in demo mode
    const savedDemoUser = localStorage.getItem('demo_user');
    if (savedDemoUser) {
      try {
        const demoUser = JSON.parse(savedDemoUser);
        setCurrentUser(demoUser);
      } catch (error) {
        console.error('Error parsing demo user:', error);
        localStorage.removeItem('demo_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (attendant?: Attendant) => {
    if (attendant && attendant.isDemoMode) {
      // Save demo user to localStorage
      localStorage.setItem('demo_user', JSON.stringify(attendant));
      setCurrentUser(attendant);
      console.log('Demo user logged in:', attendant.name);
    } else if (attendant) {
      setCurrentUser(attendant);
      console.log('Regular user logged in:', attendant.name);
    } else {
      setCurrentUser(null);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('demo_user');
    console.log('User logged out');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If user is logged in and in demo mode, show demo POS
  if (currentUser && currentUser.isDemoMode) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Demo Header */}
        <div className="bg-green-600 text-white p-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">🚀 MSUPER POS - DEMO MODE</h1>
            <p className="text-sm opacity-90">Welcome, {currentUser.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded text-sm"
          >
            Exit Demo
          </button>
        </div>
        <DemoProductManagement />
      </div>
    );
  }

  // If user is logged in normally, show full POS system
  if (currentUser && !currentUser.isDemoMode) {
    return <Index />;
  }

  // Show login screen
  return (
    <AuthManager 
      onLogin={handleLogin}
      attendants={[]} 
    />
  );
};

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <DemoModeProvider>
          <Router>
            <Routes>
              <Route path="/" element={<AppContent />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment/success" element={<PaymentSuccess />} />
              <Route path="/payment/cancelled" element={<PaymentCancelled />} />
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
            <Toaster />
          </Router>
        </DemoModeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
