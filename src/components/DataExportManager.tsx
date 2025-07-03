
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Upload, Database, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportData } from '@/lib/database';
import { LoadingSpinner } from '@/components/LoadingSpinner';

export const DataExportManager: React.FC = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<'products' | 'customers' | 'transactions' | 'all'>('all');

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await exportData(exportType);
      toast({
        title: "Export Successful",
        description: `${exportType === 'all' ? 'All data' : exportType} exported successfully`,
      });
    } catch (error) {
      console.error('Export failed:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = () => {
    toast({
      title: "Import Feature",
      description: "Data import functionality will be available in a future update.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-800">Important</h4>
              <p className="text-sm text-yellow-700">
                Regular backups help protect your business data. Export your data regularly and store it securely.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Export Data Type</label>
            <Select value={exportType} onValueChange={(value: any) => setExportType(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data</SelectItem>
                <SelectItem value="products">Products Only</SelectItem>
                <SelectItem value="customers">Customers Only</SelectItem>
                <SelectItem value="transactions">Transactions Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              disabled={isExporting}
              className="flex-1"
            >
              {isExporting ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              Export Data
            </Button>
            
            <Button
              onClick={handleImport}
              variant="outline"
              className="flex-1"
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Data
            </Button>
          </div>
        </div>

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Export creates a JSON file with your selected data</p>
          <p>• Keep backups in a secure location</p>
          <p>• Import feature coming soon</p>
        </div>
      </CardContent>
    </Card>
  );
};
