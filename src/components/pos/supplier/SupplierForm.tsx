
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Supplier } from '@/types';

interface SupplierFormProps {
  editingSupplier: Supplier | null;
  onSubmit: (supplierData: any) => void;
  onCancel: () => void;
}

export const SupplierForm: React.FC<SupplierFormProps> = ({
  editingSupplier,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    bankName: '',
    accountNumber: '',
    accountName: '',
    mpesaPhone: '',
    mpesaBusiness: ''
  });

  useEffect(() => {
    if (editingSupplier) {
      setFormData({
        name: editingSupplier.name,
        phone: editingSupplier.phone,
        email: editingSupplier.email || '',
        address: editingSupplier.address || '',
        bankName: editingSupplier.bankDetails?.bankName || '',
        accountNumber: editingSupplier.bankDetails?.accountNumber || '',
        accountName: editingSupplier.bankDetails?.accountName || '',
        mpesaPhone: editingSupplier.mpesaDetails?.phoneNumber || '',
        mpesaBusiness: editingSupplier.mpesaDetails?.businessNumber || ''
      });
    }
  }, [editingSupplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const supplierData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      contactPerson: formData.name,
      products: editingSupplier?.products || [],
      isActive: true,
      updatedAt: new Date(),
      bankDetails: formData.bankName || formData.accountNumber || formData.accountName ? {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName
      } : undefined,
      mpesaDetails: formData.mpesaPhone ? {
        phoneNumber: formData.mpesaPhone,
        accountName: formData.name,
        businessNumber: formData.mpesaBusiness || undefined
      } : undefined
    };

    onSubmit(supplierData);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      address: '',
      bankName: '',
      accountNumber: '',
      accountName: '',
      mpesaPhone: '',
      mpesaBusiness: ''
    });
  };

  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editingSupplier ? 'Edit Supplier' : 'Add New Supplier'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Supplier Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Supplier name"
                required
              />
            </div>
            <div>
              <Label>Phone</Label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="Phone number"
                required
              />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="Email address"
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={formData.address}
              onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Supplier address"
            />
          </div>

          <Separator />
          <h4 className="font-medium">Bank Details (Optional)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Bank Name</Label>
              <Input
                value={formData.bankName}
                onChange={(e) => setFormData(prev => ({ ...prev, bankName: e.target.value }))}
                placeholder="Bank name"
              />
            </div>
            <div>
              <Label>Account Number</Label>
              <Input
                value={formData.accountNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, accountNumber: e.target.value }))}
                placeholder="Account number"
              />
            </div>
          </div>
          <div>
            <Label>Account Name</Label>
            <Input
              value={formData.accountName}
              onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
              placeholder="Account holder name"
            />
          </div>

          <Separator />
          <h4 className="font-medium">M-Pesa Details (Optional)</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>M-Pesa Phone</Label>
              <Input
                value={formData.mpesaPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, mpesaPhone: e.target.value }))}
                placeholder="M-Pesa phone number"
              />
            </div>
            <div>
              <Label>Till/Business Number</Label>
              <Input
                value={formData.mpesaBusiness}
                onChange={(e) => setFormData(prev => ({ ...prev, mpesaBusiness: e.target.value }))}
                placeholder="Till or business number"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {editingSupplier ? 'Update Supplier' : 'Add Supplier'}
            </Button>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
