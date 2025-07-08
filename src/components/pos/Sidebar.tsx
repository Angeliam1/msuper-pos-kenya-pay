
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ShoppingCart, 
  BarChart3, 
  FileText, 
  Settings as SettingsIcon, 
  Menu,
  X,
  Globe,
  Store,
  Gift,
  Printer,
  Package,
  AlertTriangle
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

const navigationItems = [
  { id: 'pos', label: 'POS', icon: ShoppingCart },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'stores', label: 'Multi Store', icon: Store },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'online-store', label: 'Online Store', icon: Globe },
  { id: 'loyalty', label: 'Loyalty Program', icon: Gift },
  { id: 'printer', label: 'Thermal Printer', icon: Printer },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, isOpen, onToggle }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 h-full bg-white border-r shadow-lg z-50 transition-transform duration-300 ease-in-out",
        "w-64",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "lg:relative lg:translate-x-0"
      )}>
        <div className="p-4 border-b bg-primary">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-primary-foreground">MSUPER POS</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggle}
              className="lg:hidden text-primary-foreground hover:bg-primary/80"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          <ul className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm h-11 rounded-lg",
                      isActive 
                        ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                        : "text-gray-700 hover:bg-gray-100"
                    )}
                    onClick={() => {
                      onTabChange(item.id);
                      // Close sidebar on mobile after selection
                      if (window.innerWidth < 1024) {
                        onToggle();
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
