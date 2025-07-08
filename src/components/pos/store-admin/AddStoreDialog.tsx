
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface AddStoreDialogProps {
  onAddStore: (store: any) => void;
}

export const AddStoreDialog: React.FC<AddStoreDialogProps> = ({ onAddStore }) => {
  const [showDialog, setShowDialog] = useState(false);
  const [newStore, setNewStore] = useState({
    name: '',
    address: '',
    phone: '',
    manager: '',
    managerEmail: ''
  });

  const handleAddStore = () => {
    if (newStore.name && newStore.address) {
      onAddStore(newStore);
      setNewStore({ name: '', address: '', phone: '', manager: '', managerEmail: '' });
      setShowDialog(false);
    }
  };

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add New Store
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Store</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Store Name</Label>
            <Input
              value={newStore.name}
              onChange={(e) => setNewStore(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter store name"
            />
          </div>
          <div>
            <Label>Address</Label>
            <Input
              value={newStore.address}
              onChange={(e) => setNewStore(prev => ({ ...prev, address: e.target.value }))}
              placeholder="Store address"
            />
          </div>
          <div>
            <Label>Phone</Label>
            <Input
              value={newStore.phone}
              onChange={(e) => setNewStore(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="Phone number"
            />
          </div>
          <div>
            <Label>Manager Name</Label>
            <Input
              value={newStore.manager}
              onChange={(e) => setNewStore(prev => ({ ...prev, manager: e.target.value }))}
              placeholder="Manager name"
            />
          </div>
          <div>
            <Label>Manager Email</Label>
            <Input
              value={newStore.managerEmail}
              onChange={(e) => setNewStore(prev => ({ ...prev, managerEmail: e.target.value }))}
              placeholder="manager@email.com"
            />
          </div>
          <Button onClick={handleAddStore} className="w-full">
            Create Store & Generate Code
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
