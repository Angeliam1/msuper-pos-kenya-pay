
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  ShoppingCart, 
  BarChart3, 
  FileText, 
  Settings as SettingsIcon,
  Package,
  Building,
  Globe,
  Eye,
  X
} from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navigationItems = [
  { id: 'pos', label: 'POS', icon: ShoppingCart },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'multi-store', label: 'Multi Store', icon: Building },
  { id: 'online-store', label: 'Online Store', icon: Globe },
  { id: 'store-preview', label: 'Store Preview', icon: Eye },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen
}) => {
  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed left-0 top-0 h-full bg-white border-r shadow-lg z-50 transition-transform duration-300 ease-in-out
        w-64 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0
      `}>
        <div className="p-4 border-b bg-blue-600">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">DIGITAL DEN POS</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:bg-blue-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-sm h-11 ${
                      isActive 
                        ? "bg-blue-100 text-blue-700 hover:bg-blue-200" 
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => {
                      setActiveTab(item.id);
                      if (window.innerWidth < 1024) {
                        setSidebarOpen(false);
                      }
                    }}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
};
