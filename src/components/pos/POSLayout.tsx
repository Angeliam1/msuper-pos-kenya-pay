
import React from 'react';
import { Sidebar } from './Sidebar';
import { POSHeader } from './POSHeader';

interface POSLayoutProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  setShowBarcodeScanner: (show: boolean) => void;
  children: React.ReactNode;
}

export const POSLayout: React.FC<POSLayoutProps> = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  setShowBarcodeScanner,
  children
}) => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <POSHeader
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          setActiveTab={setActiveTab}
          setShowBarcodeScanner={setShowBarcodeScanner}
        />

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
