
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Customer } from '@/types';
import { LoyaltyStats } from './loyalty/LoyaltyStats';
import { CustomerManagement } from './loyalty/CustomerManagement';
import { RewardsManagement } from './loyalty/RewardsManagement';
import { LoyaltySettings } from './loyalty/LoyaltySettings';
import { LoyaltyLeaderboard } from './loyalty/LoyaltyLeaderboard';

interface LoyaltyProgramProps {
  customers: Customer[];
  onUpdateCustomer: (id: string, data: Partial<Customer>) => void;
  onAddCustomer: (customer: Omit<Customer, 'id'>) => void;
}

export const LoyaltyProgram: React.FC<LoyaltyProgramProps> = ({
  customers,
  onUpdateCustomer,
  onAddCustomer
}) => {
  return (
    <div className="space-y-6">
      <LoyaltyStats customers={customers} />

      <Tabs defaultValue="customers" className="w-full">
        <TabsList>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        <TabsContent value="customers" className="space-y-4">
          <CustomerManagement
            customers={customers}
            onUpdateCustomer={onUpdateCustomer}
            onAddCustomer={onAddCustomer}
          />
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          <RewardsManagement />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <LoyaltySettings />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-4">
          <LoyaltyLeaderboard customers={customers} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
