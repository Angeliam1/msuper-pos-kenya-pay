
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign, User } from 'lucide-react';
import { Expense, Attendant } from '@/types';

interface ExpenseListProps {
  expenses: Expense[];
  attendants: Attendant[];
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, attendants }) => {
  const formatPrice = (price: number) => `KES ${price.toLocaleString()}`;

  const getAttendantName = (attendantId: string) => {
    const attendant = attendants.find(a => a.id === attendantId);
    return attendant?.name || 'Unknown';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Expenses
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {expenses.map(expense => (
            <div key={expense.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium">{expense.description}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline">{expense.category}</Badge>
                    <span className="text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <span className="font-semibold text-red-600">
                  {formatPrice(expense.amount)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>Added by: {getAttendantName(expense.attendantId)}</span>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <p className="text-center text-gray-500 py-8">No expenses recorded</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
