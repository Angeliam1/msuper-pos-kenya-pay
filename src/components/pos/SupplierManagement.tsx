
import React, { useState } from 'react';
import { Supplier } from '@/types';
import { SupplierList } from './supplier/SupplierList';
import { SupplierForm } from './supplier/SupplierForm';

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

  const handleSubmit = (supplierData: any) => {
    if (editingSupplier) {
      onUpdateSupplier(editingSupplier.id, supplierData);
      setEditingSupplier(null);
    } else {
      onAddSupplier(supplierData);
      setShowAddForm(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setShowAddForm(true);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingSupplier(null);
  };

  return (
    <div className="space-y-6">
      <SupplierList
        suppliers={suppliers}
        onAddSupplier={() => setShowAddForm(true)}
        onEditSupplier={handleEdit}
        onDeleteSupplier={onDeleteSupplier}
      />

      {showAddForm && (
        <SupplierForm
          editingSupplier={editingSupplier}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};
