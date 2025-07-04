
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { TestTube2, Database, Users, ShoppingCart, Receipt } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';

export const DemoModeToggle: React.FC = () => {
  const { isDemoMode, toggleDemoMode, demoProducts, demoCustomers, demoTransactions, demoAttendants } = useDemoMode();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TestTube2 className="h-5 w-5" />
          Demo Mode
          {isDemoMode && <Badge variant="secondary">Active</Badge>}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="demo-mode"
            checked={isDemoMode}
            onCheckedChange={toggleDemoMode}
          />
          <Label htmlFor="demo-mode">
            {isDemoMode ? 'Disable Demo Mode' : 'Enable Demo Mode'}
          </Label>
        </div>

        <div className="text-sm text-gray-600">
          {isDemoMode 
            ? 'Demo mode is active. Using sample data for testing and demonstration.'
            : 'Enable demo mode to use sample data for testing the POS system.'
          }
        </div>

        {isDemoMode && (
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Database className="h-4 w-4 text-blue-600" />
              <div>
                <div className="font-medium">{demoProducts.length} Products</div>
                <div className="text-xs text-gray-500">Sample inventory</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <Users className="h-4 w-4 text-green-600" />
              <div>
                <div className="font-medium">{demoCustomers.length} Customers</div>
                <div className="text-xs text-gray-500">Demo customers</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <ShoppingCart className="h-4 w-4 text-purple-600" />
              <div>
                <div className="font-medium">{demoAttendants.length} Staff</div>
                <div className="text-xs text-gray-500">Demo attendants</div>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
              <Receipt className="h-4 w-4 text-orange-600" />
              <div>
                <div className="font-medium">{demoTransactions.length} Sales</div>
                <div className="text-xs text-gray-500">Demo transactions</div>
              </div>
            </div>
          </div>
        )}

        {isDemoMode && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode Features:</strong>
            </p>
            <ul className="text-xs text-yellow-700 mt-1 space-y-1">
              <li>• Sample products with realistic pricing</li>
              <li>• Demo customers with loyalty points</li>
              <li>• Test staff accounts (PIN: 1234, 5678)</li>
              <li>• Simulated transaction history</li>
              <li>• All changes are temporary</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
