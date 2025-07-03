
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OnlineStore } from './OnlineStore';
import { Eye, Monitor, Smartphone, Tablet, Globe, ExternalLink } from 'lucide-react';

export const OnlineStoreFrontend: React.FC = () => {
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const getDeviceStyles = () => {
    switch (previewDevice) {
      case 'mobile':
        return 'max-w-sm mx-auto';
      case 'tablet':
        return 'max-w-2xl mx-auto';
      default:
        return 'w-full';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Store Preview</h2>
          <p className="text-gray-600">Preview how your online store looks to customers</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Visit Live Store
          </Button>
          <Badge variant="default" className="flex items-center gap-1">
            <Globe className="h-3 w-3" />
            Live
          </Badge>
        </div>
      </div>

      {/* Device Preview Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Preview Device:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant={previewDevice === 'desktop' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('desktop')}
                >
                  <Monitor className="h-4 w-4 mr-2" />
                  Desktop
                </Button>
                <Button
                  variant={previewDevice === 'tablet' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('tablet')}
                >
                  <Tablet className="h-4 w-4 mr-2" />
                  Tablet
                </Button>
                <Button
                  variant={previewDevice === 'mobile' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreviewDevice('mobile')}
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Mobile
                </Button>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              URL: www.digitalden.co.ke
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Live Store Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <div className={`border-2 border-gray-200 rounded-lg overflow-hidden ${getDeviceStyles()}`}>
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center gap-2">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
              <div className="flex-1 text-center text-sm text-gray-600">
                www.digitalden.co.ke
              </div>
            </div>
            
            <div className="bg-white" style={{ 
              height: previewDevice === 'mobile' ? '600px' : '800px',
              transform: previewDevice === 'mobile' ? 'scale(0.8)' : 'scale(1)',
              transformOrigin: 'top center'
            }}>
              <OnlineStore />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Store Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Store Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Store Status:</span>
              <Badge variant="default">Live</Badge>
            </div>
            <div className="flex justify-between">
              <span>Domain:</span>
              <span className="text-sm">www.digitalden.co.ke</span>
            </div>
            <div className="flex justify-between">
              <span>SSL Certificate:</span>
              <Badge variant="default">Active</Badge>
            </div>
            <div className="flex justify-between">
              <span>Last Updated:</span>
              <span className="text-sm">2 hours ago</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Page Load Speed:</span>
              <Badge variant="default">Fast</Badge>
            </div>
            <div className="flex justify-between">
              <span>Mobile Friendly:</span>
              <Badge variant="default">Yes</Badge>
            </div>
            <div className="flex justify-between">
              <span>SEO Score:</span>
              <Badge variant="default">Good</Badge>
            </div>
            <div className="flex justify-between">
              <span>Uptime:</span>
              <Badge variant="default">99.9%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
