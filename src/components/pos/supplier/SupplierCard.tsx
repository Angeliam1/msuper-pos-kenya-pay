
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Building, CreditCard, Edit, Trash2 } from 'lucide-react';
import { Supplier } from '@/types';

interface SupplierCardProps {
  supplier: Supplier;
  onEdit: (supplier: Supplier) => void;
  onDelete: (id: string) => void;
}

export const SupplierCard: React.FC<SupplierCardProps> = ({
  supplier,
  onEdit,
  onDelete
}) => {
  return (
    <Card className="border-2">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold">{supplier.name}</h3>
            <Badge>{supplier.products?.length || 0} products</Badge>
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{supplier.phone}</span>
            </div>
            {supplier.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{supplier.email}</span>
              </div>
            )}
            {supplier.address && (
              <p>{supplier.address}</p>
            )}
            
            {/* Bank Details */}
            {supplier.bankDetails && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-1">
                  <Building className="h-4 w-4" />
                  <span className="font-medium">Bank Details</span>
                </div>
                <div className="text-xs space-y-1 ml-6">
                  <p>{supplier.bankDetails.bankName}</p>
                  <p>{supplier.bankDetails.accountNumber}</p>
                  <p>{supplier.bankDetails.accountName}</p>
                </div>
              </div>
            )}
            
            {/* M-Pesa Details */}
            {supplier.mpesaDetails && (
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 mb-1">
                  <CreditCard className="h-4 w-4" />
                  <span className="font-medium">M-Pesa</span>
                </div>
                <div className="text-xs space-y-1 ml-6">
                  <p>{supplier.mpesaDetails.phoneNumber}</p>
                  {supplier.mpesaDetails.businessNumber && (
                    <p>Till: {supplier.mpesaDetails.businessNumber}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(supplier)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button size="sm" variant="destructive" onClick={() => onDelete(supplier.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
