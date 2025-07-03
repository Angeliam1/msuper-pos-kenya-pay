
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Upload, 
  X, 
  Eye, 
  Edit, 
  Star,
  ImageIcon,
  Plus
} from 'lucide-react';

interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  hasWatermark: boolean;
}

interface ProductImageManagerProps {
  images: ProductImage[];
  onAddImage: (image: Omit<ProductImage, 'id'>) => void;
  onRemoveImage: (imageId: string) => void;
  onSetPrimary: (imageId: string) => void;
  onToggleWatermark: (imageId: string) => void;
}

export const ProductImageManager: React.FC<ProductImageManagerProps> = ({
  images,
  onAddImage,
  onRemoveImage,
  onSetPrimary,
  onToggleWatermark
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageAlt, setNewImageAlt] = useState('');
  const [hasWatermark, setHasWatermark] = useState(true);

  const handleAddImage = () => {
    if (newImageUrl && newImageAlt) {
      onAddImage({
        url: newImageUrl,
        alt: newImageAlt,
        isPrimary: images.length === 0,
        hasWatermark
      });
      setNewImageUrl('');
      setNewImageAlt('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Product Images</h3>
          <p className="text-sm text-gray-600">Add up to 10 images for this product</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              disabled={images.length >= 10}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Product Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div>
                <Label htmlFor="imageAlt">Image Description</Label>
                <Input
                  id="imageAlt"
                  value={newImageAlt}
                  onChange={(e) => setNewImageAlt(e.target.value)}
                  placeholder="Product image description"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="watermark"
                  checked={hasWatermark}
                  onCheckedChange={setHasWatermark}
                />
                <Label htmlFor="watermark">Add watermark</Label>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddImage}>
                  Add Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <Card key={image.id} className="relative overflow-hidden">
            <CardContent className="p-2">
              <div className="aspect-square bg-gray-100 rounded-lg relative overflow-hidden">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {image.hasWatermark && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <div className="text-white text-xs font-bold opacity-50 rotate-12">
                      DIGITALDEN.CO.KE
                    </div>
                  </div>
                )}
                {image.isPrimary && (
                  <Badge className="absolute top-2 left-2 text-xs">
                    <Star className="h-3 w-3 mr-1" />
                    Primary
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSetPrimary(image.id)}
                    disabled={image.isPrimary}
                  >
                    <Star className={`h-4 w-4 ${image.isPrimary ? 'fill-current text-yellow-500' : ''}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleWatermark(image.id)}
                  >
                    <ImageIcon className={`h-4 w-4 ${image.hasWatermark ? 'text-blue-500' : 'text-gray-400'}`} />
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveImage(image.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {images.length < 10 && (
          <Card className="border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors">
            <CardContent className="p-4 flex items-center justify-center h-full min-h-[120px]">
              <Button
                variant="ghost"
                onClick={() => setIsDialogOpen(true)}
                className="flex flex-col items-center space-y-2 text-gray-500 hover:text-gray-700"
              >
                <Upload className="h-8 w-8" />
                <span className="text-sm">Add Image</span>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="text-sm text-gray-500">
        {images.length}/10 images uploaded
      </div>
    </div>
  );
};
