
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Calendar } from 'lucide-react';
import { Expense } from '@/types';

interface ExpenseSummaryCardsProps {
  expenses: Expense[];
}

export const ExpenseSummaryCards: React.FC<ExpenseSummaryCardsProps> = ({ expenses }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const todayExpenses = expenses.filter(expense =>
    new Date(expense.date).toDateString() === new Date().toDateString()
  ).reduce((sum, expense) => sum + expense.amount, 0);

  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatPrice(totalExpenses)}</p>
            </div>
            <DollarSign className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Today's Expenses</p>
              <p className="text-2xl font-bold text-red-600">{formatPrice(todayExpenses)}</p>
            </div>
            <Calendar className="h-8 w-8 text-red-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
