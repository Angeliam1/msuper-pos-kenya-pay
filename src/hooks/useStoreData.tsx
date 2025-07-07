
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Store {
  id: string;
  name: string;
  address: string;
  phone: string;
  kra_pin?: string;
  mpesa_paybill?: string;
  mpesa_account?: string;
  mpesa_till?: string;
  bank_account?: string;
  payment_instructions?: string;
  receipt_header?: string;
  receipt_footer?: string;
  currency?: string;
  tax_rate?: number;
  status: string;
  is_active: boolean;
}

export interface Customer {
  id: string;
  store_id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  loyalty_points?: number;
  credit_limit?: number;
  outstanding_balance?: number;
}

export const useStoreData = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchStores();
    fetchCustomers();
  }, []);

  const fetchStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching stores:', error);
        toast({
          title: "Error",
          description: "Failed to fetch stores",
          variant: "destructive"
        });
      } else {
        setStores(data || []);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*');

      if (error) {
        console.error('Error fetching customers:', error);
        toast({
          title: "Error",
          description: "Failed to fetch customers",
          variant: "destructive"
        });
      } else {
        setCustomers(data || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) {
        console.error('Error adding customer:', error);
        toast({
          title: "Error",
          description: "Failed to add customer",
          variant: "destructive"
        });
        return null;
      } else {
        setCustomers(prev => [...prev, data]);
        toast({
          title: "Success",
          description: "Customer added successfully",
        });
        return data;
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      return null;
    }
  };

  const updateCustomer = async (customerId: string, updates: Partial<Customer>) => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .update(updates)
        .eq('id', customerId)
        .select()
        .single();

      if (error) {
        console.error('Error updating customer:', error);
        toast({
          title: "Error",
          description: "Failed to update customer",
          variant: "destructive"
        });
      } else {
        setCustomers(prev => prev.map(c => c.id === customerId ? data : c));
        toast({
          title: "Success",
          description: "Customer updated successfully",
        });
      }
    } catch (error) {
      console.error('Error updating customer:', error);
    }
  };

  return {
    stores,
    customers,
    loading,
    addCustomer,
    updateCustomer
  };
};
