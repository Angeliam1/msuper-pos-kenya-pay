
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Expense, Attendant } from '@/types';
import { ExpenseSummaryCards } from './expense/ExpenseSummaryCards';
import { ExpenseForm } from './expense/ExpenseForm';
import { ExpenseList } from './expense/ExpenseList';

interface ExpenseManagementProps {
  expenses: Expense[];
  attendants: Attendant[];
  currentAttendant: Attendant;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const ExpenseManagement: React.FC<ExpenseManagementProps> = ({
  expenses,
  attendants,
  currentAttendant,
  onAddExpense
}) => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-6">
      <ExpenseSummaryCards expenses={expenses} />

      <div className="flex justify-end">
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <ExpenseList expenses={expenses} attendants={attendants} />

      {showAddForm && (
        <ExpenseForm
          currentAttendant={currentAttendant}
          onAddExpense={onAddExpense}
          onCancel={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
};
