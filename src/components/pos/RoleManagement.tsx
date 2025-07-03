import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Attendant } from '@/types';
import { Plus, Edit, Shield, User, Clock, Lock } from 'lucide-react';

interface RoleManagementProps {
  attendants: Attendant[];
  currentAttendant: Attendant;
  onAddAttendant: (attendant: Omit<Attendant, 'id' | 'createdAt'>) => void;
  onUpdateAttendant: (id: string, attendant: Partial<Attendant>) => void;
}

const AVAILABLE_PERMISSIONS = [
  { id: 'pos', label: 'Point of Sale' },
  { id: 'products', label: 'Product Management' },
  { id: 'customers', label: 'Customer Management' },
  { id: 'suppliers', label: 'Supplier Management' },
  { id: 'reports', label: 'View Reports' },
  { id: 'staff', label: 'Staff Management' },
  { id: 'settings', label: 'System Settings' },
  { id: 'hirePurchase', label: 'Hire Purchase' },
  { id: 'splitPayment', label: 'Split Payments' }
];

export const RoleManagement: React.FC<RoleManagementProps> = ({
  attendants,
  currentAttendant,
  onAddAttendant,
  onUpdateAttendant
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAttendant, setEditingAttendant] = useState<Attendant | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'cashier' as 'admin' | 'manager' | 'cashier',
    permissions: [] as string[],
    isActive: true,
    pin: '',
    password: '',
    workSchedule: {
      startTime: '08:00',
      endTime: '20:00',
      workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'] as string[],
      enforceSchedule: true
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAttendant) {
      onUpdateAttendant(editingAttendant.id, formData);
    } else {
      onAddAttendant(formData);
    }
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'cashier',
      permissions: [],
      isActive: true,
      pin: '',
      password: '',
      workSchedule: {
        startTime: '08:00',
        endTime: '20:00',
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        enforceSchedule: true
      }
    });
    setEditingAttendant(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (attendant: Attendant) => {
    setEditingAttendant(attendant);
    setFormData({
      name: attendant.name,
      email: attendant.email,
      phone: attendant.phone,
      role: attendant.role,
      permissions: [...attendant.permissions],
      isActive: attendant.isActive,
      pin: attendant.pin,
      password: '',
      workSchedule: attendant.workSchedule || {
        startTime: '08:00',
        endTime: '20:00',
        workDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
        enforceSchedule: true
      }
    });
    setIsDialogOpen(true);
  };

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permissionId]
      });
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter(p => p !== permissionId)
      });
    }
  };

  const handleWorkDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        workSchedule: {
          ...formData.workSchedule,
          workDays: [...formData.workSchedule.workDays, day]
        }
      });
    } else {
      setFormData({
        ...formData,
        workSchedule: {
          ...formData.workSchedule,
          workDays: formData.workSchedule.workDays.filter(d => d !== day)
        }
      });
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'manager': return 'default';
      default: return 'secondary';
    }
  };

  const canManageStaff = currentAttendant.role === 'admin' || 
                        currentAttendant.permissions.includes('staff');

  const isWithinWorkHours = (attendant: Attendant) => {
    if (!attendant.workSchedule?.enforceSchedule) return true;
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5);
    
    if (!attendant.workSchedule.workDays.includes(currentDay)) return false;
    
    return currentTime >= attendant.workSchedule.startTime && 
           currentTime <= attendant.workSchedule.endTime;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Staff & Role Management
          </CardTitle>
          {canManageStaff && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Staff
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingAttendant ? 'Edit Staff Member' : 'Add New Staff Member'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pin">PIN *</Label>
                      <Input
                        id="pin"
                        type="password"
                        maxLength={4}
                        value={formData.pin}
                        onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                        placeholder="4-digit PIN"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editingAttendant ? "Leave blank to keep current" : "Enter password"}
                      required={!editingAttendant}
                    />
                  </div>

                  <div>
                    <Label>Role</Label>
                    <Select value={formData.role} onValueChange={(value: any) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cashier">Cashier</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        {currentAttendant.role === 'admin' && (
                          <SelectItem value="admin">Admin</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Work Schedule</Label>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div>
                        <Label htmlFor="startTime" className="text-sm">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={formData.workSchedule.startTime}
                          onChange={(e) => setFormData({
                            ...formData,
                            workSchedule: { ...formData.workSchedule, startTime: e.target.value }
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="endTime" className="text-sm">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={formData.workSchedule.endTime}
                          onChange={(e) => setFormData({
                            ...formData,
                            workSchedule: { ...formData.workSchedule, endTime: e.target.value }
                          })}
                        />
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <Label className="text-sm">Work Days</Label>
                      <div className="grid grid-cols-4 gap-2 mt-2">
                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map(day => (
                          <div key={day} className="flex items-center space-x-2">
                            <Checkbox
                              id={day}
                              checked={formData.workSchedule.workDays.includes(day)}
                              onCheckedChange={(checked) => handleWorkDayChange(day, checked as boolean)}
                            />
                            <Label htmlFor={day} className="text-xs capitalize">
                              {day.slice(0, 3)}
                            </Label>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-3">
                      <Checkbox
                        id="enforceSchedule"
                        checked={formData.workSchedule.enforceSchedule}
                        onCheckedChange={(checked) => setFormData({
                          ...formData,
                          workSchedule: { ...formData.workSchedule, enforceSchedule: checked as boolean }
                        })}
                      />
                      <Label htmlFor="enforceSchedule" className="text-sm">
                        Enforce work schedule (lock POS outside work hours)
                      </Label>
                    </div>
                  </div>

                  <div>
                    <Label>Permissions</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {AVAILABLE_PERMISSIONS.map(permission => (
                        <div key={permission.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(permission.id, checked as boolean)
                            }
                          />
                          <Label htmlFor={permission.id} className="text-xs">
                            {permission.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {editingAttendant ? 'Update Staff' : 'Add Staff'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Work Hours</TableHead>
              <TableHead>Access</TableHead>
              {canManageStaff && <TableHead>Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {attendants.map(attendant => (
              <TableRow key={attendant.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {attendant.name}
                    {attendant.id === currentAttendant.id && (
                      <Badge variant="outline" className="text-xs">You</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    <div>{attendant.email}</div>
                    <div className="text-gray-600">{attendant.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(attendant.role)}>
                    {attendant.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge variant={attendant.isActive ? 'default' : 'secondary'}>
                      {attendant.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {attendant.workSchedule?.enforceSchedule && (
                      <Badge variant={isWithinWorkHours(attendant) ? 'default' : 'destructive'} className="text-xs">
                        {isWithinWorkHours(attendant) ? (
                          <><Clock className="h-3 w-3 mr-1" />Available</>
                        ) : (
                          <><Lock className="h-3 w-3 mr-1" />Locked</>
                        )}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {attendant.workSchedule ? (
                    <div className="text-xs">
                      <div>{attendant.workSchedule.startTime} - {attendant.workSchedule.endTime}</div>
                      <div className="text-gray-600">{attendant.workSchedule.workDays.length} days/week</div>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">No schedule</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-xs">
                    {attendant.permissions.length} permissions
                  </div>
                </TableCell>
                {canManageStaff && (
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleEdit(attendant)}
                      disabled={attendant.id === currentAttendant.id && attendant.role === 'admin'}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
