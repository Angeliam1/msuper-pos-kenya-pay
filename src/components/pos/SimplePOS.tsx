import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Plus, 
  Minus, 
  ShoppingCart, 
  X,
  Package,
  Receipt,
  Store,
  Settings
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Product, CartItem } from '@/types';
import { StoreSettings } from './StoreSettings';

interface SimplePOSProps {
  businessName?: string;
  products: Product[];
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onUpdateProduct: (id: string, updates: Partial<Product>) => void;
  onProcessSale: (items: CartItem[], total: number) => void;
  onBusinessNameChange: (name: string) => void;
}

export const SimplePOS: React.FC<SimplePOSProps> = ({
  businessName = "Your Business",
  products,
  onAddProduct,
  onUpdateProduct,
  onProcessSale,
  onBusinessNameChange
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('pos');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: 'General'
  });

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase();
    return product.name.toLowerCase().includes(searchLower) ||
           product.category.toLowerCase().includes(searchLower) ||
           product.barcode?.includes(searchTerm);
  });

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      toast({
        title: "Out of Stock",
        description: `${product.name} is not available`,
        variant: "destructive",
      });
      return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        toast({
          title: "Stock Limit",
          description: `Only ${product.stock} units available`,
          variant: "destructive",
        });
        return;
      }
      setCart(prev => 
        prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      const cartItem: CartItem = { 
        ...product, 
        quantity: 1 
      };
      setCart(prev => [...prev, cartItem]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const adjustQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = products.find(p => p.id === productId);
    if (product && quantity > product.stock) {
      toast({
        title: "Stock Limit",
        description: `Only ${product.stock} units available`,
        variant: "destructive",
      });
      return;
    }

    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const processSale = () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Add items to cart before processing sale",
        variant: "destructive",
      });
      return;
    }

    // Update stock for each item
    cart.forEach(item => {
      const product = products.find(p => p.id === item.id);
      if (product) {
        onUpdateProduct(item.id, { stock: product.stock - item.quantity });
      }
    });

    // Process the sale
    onProcessSale(cart, calculateTotal());
    
    // Clear cart and customer
    setCart([]);
    setCustomerName('');
    
    toast({
      title: "Sale Completed",
      description: `Total: KSh${calculateTotal().toLocaleString()}`,
    });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || newProduct.price <= 0) {
      toast({
        title: "Invalid Product",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    onAddProduct({
      name: newProduct.name,
      price: newProduct.price,
      stock: newProduct.stock,
      category: newProduct.category,
      barcode: `${Date.now()}`,
      buyingCost: newProduct.price * 0.7, // Default markup
      wholesalePrice: newProduct.price * 0.8,
      retailPrice: newProduct.price,
      unit: 'pcs',
      supplierId: '',
      description: '',
      minStock: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    setNewProduct({ name: '', price: 0, stock: 0, category: 'General' });
    setShowAddProduct(false);
    
    toast({
      title: "Product Added",
      description: `${newProduct.name} added successfully`,
    });
  };

  const formatPrice = (price: number) => `KSh${price.toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Store className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{businessName}</h1>
                <p className="text-sm text-gray-600">Point of Sale System</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Products</p>
                <p className="text-lg font-semibold">{products.length}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pos" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Point of Sale
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pos" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Products Section */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Products
                    </CardTitle>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[500px]">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredProducts.map(product => (
                          <div key={product.id} className="border rounded-lg p-4 hover:bg-gray-50">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{product.name}</h4>
                              <Badge variant="secondary" className="text-xs">
                                {product.category}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-lg font-bold text-green-600">
                                  {formatPrice(product.price)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Stock: {product.stock}
                                </p>
                              </div>
                              <Button
                                onClick={() => addToCart(product)}
                                size="sm"
                                disabled={product.stock <= 0}
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {filteredProducts.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No products found
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>

              {/* Cart Section */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Cart ({cart.length})
                    </CardTitle>
                    <Input
                      placeholder="Customer name (optional)"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                    />
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] mb-4">
                      {cart.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          Cart is empty
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {cart.map(item => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <h5 className="font-medium">{item.name}</h5>
                                <p className="text-sm text-gray-600">
                                  {formatPrice(item.price)} each
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => adjustQuantity(item.id, item.quantity - 1)}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center">{item.quantity}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => adjustQuantity(item.id, item.quantity + 1)}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeFromCart(item.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>

                    <Separator className="my-4" />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span>Total:</span>
                        <span className="text-green-600">{formatPrice(calculateTotal())}</span>
                      </div>
                      
                      <Button
                        onClick={processSale}
                        className="w-full bg-green-600 hover:bg-green-700"
                        size="lg"
                        disabled={cart.length === 0}
                      >
                        <Receipt className="h-4 w-4 mr-2" />
                        Process Sale
                      </Button>
                      
                      {cart.length > 0 && (
                        <Button
                          onClick={() => setCart([])}
                          variant="outline"
                          className="w-full"
                        >
                          Clear Cart
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Product Management</h3>
              <Button 
                onClick={() => setShowAddProduct(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center py-8">
                  <Package className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Product management features will be available here</p>
                  <p className="text-sm text-gray-500 mt-2">View, edit, and manage your inventory</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <StoreSettings 
              businessName={businessName}
              onBusinessNameChange={onBusinessNameChange}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Product Name *</label>
                <Input
                  value={newProduct.name}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Price *</label>
                <Input
                  type="number"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Stock Quantity</label>
                <Input
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  placeholder="0"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input
                  value={newProduct.category}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, category: e.target.value }))}
                  placeholder="General"
                />
              </div>
              
              <div className="flex gap-2 pt-4">
                <Button
                  onClick={handleAddProduct}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Add Product
                </Button>
                <Button
                  onClick={() => {
                    setShowAddProduct(false);
                    setNewProduct({ name: '', price: 0, stock: 0, category: 'General' });
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
