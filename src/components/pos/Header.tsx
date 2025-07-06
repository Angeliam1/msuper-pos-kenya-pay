
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Menu, Store } from 'lucide-react';

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({ setSidebarOpen }) => {
  return (
    <div className="bg-white border-b p-4">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <Store className="h-6 w-6 text-blue-600" />
          <div>
            <h2 className="font-bold text-lg">DIGITAL DEN POS</h2>
            <Badge variant="outline" className="bg-green-100 text-green-800">
              Multi-Store & Online Ready
            </Badge>
          </div>
        </div>
        
        <div className="hidden lg:block">
          <Badge variant="secondary">Full Features Active</Badge>
        </div>
      </div>
    </div>
  );
};
