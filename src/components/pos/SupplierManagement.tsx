
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Truck, Plus, Edit, Trash2, Phone, Mail, Building, CreditCard } from 'lucide-react';
import { Supplier } from '@/types';

interface SupplierManagementProps {
  suppliers: Supplier[];
  onAddSupplier: (supplier: Omit<Supplier, 'id' | 'createdAt'>) => void;
  onUpdateSupplier: (id: string, supplier: Partial<Supplier>) => void;
  onDeleteSupplier: (id: string) => void;
}

export const SupplierManagement: React.FC<SupplierManagementProps> = ({
  suppliers,
  onAddSupplier,
  onUpdateSupplier,
  onDeleteSupplier
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const supplierData = {
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      contactPerson: formData.name, // Use name as contact person if not specified
      products: editingSupplier?.products || [],
      bankDetails: formData.bankName || formData.accountNumber || formData.accountName ? {
        bankName: formData.bankName,
        accountNumber: formData.accountNumber,
        accountName: formData.accountName
      } : undefined,
      mpesaDetails: formData.mpesaPhone ? {
        phoneNumber: formData.mpesaPhone,
        businessNumber: formData.mpesaBusiness || undefined
      } : undefined
    };

    if (editingSupplier) {
      onUpdateSupplier(editingSupplier.id, supplierData);
      setEditingSupplier(null);
    } else {
      onAddSupplier(supplierData);
      setShowAddForm(false);
    }
    resetForm();
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

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setFormData({
      name: supplier.name,
      phone: supplier.phone,
      email: supplier.email || '',
      address: supplier.address || '',
      bankName: supplier.bankDetails?.bankName || '',
      accountNumber: supplier.bankDetails?.accountNumber || '',
      accountName: supplier.bankDetails?.accountName || '',
      mpesaPhone: supplier.mpesaDetails?.phoneNumber || '',
      mpesaBusiness: supplier.mpesaDetails?.businessNumber || ''
    });
    setShowAddForm(true);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Suppliers
            </CardTitle>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suppliers.map(supplier => (
              <Card key={supplier.id} className="border-2">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{supplier.name}</h3>
                      <Badge>{supplier.products.length} products</Badge>
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
                      <Button size="sm" variant="outline" onClick={() => handleEdit(supplier)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => onDeleteSupplier(supplier.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {showAddForm && (
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
                <Button type="button" variant="outline" onClick={() => {
                  setShowAddForm(false);
                  setEditingSupplier(null);
                  resetForm();
                }}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
