import React, { useState, useEffect } from 'react';
import { SimplePOS } from './SimplePOS';
import { Product, CartItem } from '@/types';
import { useToast } from '@/hooks/use-toast';

export const SimplePOSApp: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [businessName, setBusinessName] = useState('Your Business');

  // Initialize with sample products
  useEffect(() => {
    const sampleProducts: Product[] = [
      {
        id: '1',
        name: 'Coca Cola 500ml',
        price: 50,
        stock: 100,
        category: 'Beverages',
        barcode: '123456789',
        buyingCost: 35,
        wholesalePrice: 40,
        retailPrice: 50,
        unit: 'pcs',
        supplierId: '',
        description: 'Refreshing cola drink',
        minStock: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Bread - White',
        price: 60,
        stock: 50,
        category: 'Bakery',
        barcode: '987654321',
        buyingCost: 45,
        wholesalePrice: 50,
        retailPrice: 60,
        unit: 'pcs',
        supplierId: '',
        description: 'Fresh white bread',
        minStock: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Milk 1L',
        price: 80,
        stock: 30,
        category: 'Dairy',
        barcode: '456789123',
        buyingCost: 60,
        wholesalePrice: 70,
        retailPrice: 80,
        unit: 'pcs',
        supplierId: '',
        description: 'Fresh milk 1 liter',
        minStock: 8,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    setProducts(sampleProducts);
  }, []);

  // Load business name from localStorage
  useEffect(() => {
    const savedConfig = localStorage.getItem('storeConfig');
    if (savedConfig) {
      const config = JSON.parse(savedConfig);
      if (config.businessName) {
        setBusinessName(config.businessName);
      }
    }
  }, []);

  const handleAddProduct = (productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `product-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setProducts(prev => [...prev, newProduct]);
    console.log('Product added:', newProduct);
  };

  const handleUpdateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === id 
          ? { ...product, ...updates, updatedAt: new Date() }
          : product
      )
    );
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(product => product.id !== id));
  };

  const handleProcessSale = (items: CartItem[], total: number) => {
    // In a real app, this would save to a database
    console.log('Processing sale:', { items, total, timestamp: new Date() });
    
    toast({
      title: "Sale Processed",
      description: `Transaction completed for ${items.length} items totaling KSh${total.toLocaleString()}`,
    });
  };

  const handleBusinessNameChange = (name: string) => {
    setBusinessName(name);
  };

  return (
    <SimplePOS
      businessName={businessName}
      products={products}
      onAddProduct={handleAddProduct}
      onUpdateProduct={handleUpdateProduct}
      onDeleteProduct={handleDeleteProduct}
      onProcessSale={handleProcessSale}
      onBusinessNameChange={handleBusinessNameChange}
    />
  );
};
