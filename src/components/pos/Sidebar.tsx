
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  ShoppingCart, 
  BarChart3, 
  History, 
  Package, 
  Users, 
  CreditCard, 
  Shield, 
  AlertTriangle, 
  Settings as SettingsIcon, 
  FileText,
  Menu,
  X,
  Gift,
  Store,
  Receipt,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  MessageSquare,
  Truck
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
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'history', label: 'History', icon: History },
  { id: 'products', label: 'Products', icon: Package },
  { id: 'customers', label: 'Customers', icon: Users },
  { id: 'suppliers', label: 'Suppliers', icon: Truck },
  { id: 'loyalty', label: 'Loyalty Points', icon: Gift },
  { id: 'stores', label: 'Multi Store', icon: Store },
  { id: 'returns', label: 'Returns', icon: Receipt },
  { id: 'expenses', label: 'Expenses', icon: DollarSign },
  { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
  { id: 'stock-take', label: 'Stock Take', icon: TrendingUp },
  { id: 'sms', label: 'SMS Center', icon: MessageSquare },
  { id: 'hire-purchase', label: 'Hire Purchase', icon: CreditCard },
  { id: 'staff', label: 'Staff', icon: Shield },
  { id: 'alerts', label: 'Alerts', icon: AlertTriangle },
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
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">MSUPER POS</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onToggle}
              className="lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <nav className="p-4 overflow-y-auto max-h-[calc(100vh-80px)]">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.id}>
                  <Button
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start text-sm"
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
