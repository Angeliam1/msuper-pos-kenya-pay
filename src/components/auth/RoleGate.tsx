
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Lock } from 'lucide-react';
import { useAuth } from '@/hooks/useSupabaseAuth';

interface RoleGateProps {
  allowedRoles?: ('super_admin' | 'owner' | 'admin' | 'manager' | 'cashier' | 'staff')[];
  requiredPermission?: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showFallback?: boolean;
}

export const RoleGate: React.FC<RoleGateProps> = ({
  allowedRoles = [],
  requiredPermission,
  children,
  fallback,
  showFallback = true
}) => {
  const { userRole, hasPermission } = useAuth();

  // Check role-based access
  const hasRoleAccess = allowedRoles.length === 0 || 
    (userRole && allowedRoles.includes(userRole.role));

  // Check permission-based access
  const hasPermissionAccess = !requiredPermission || 
    hasPermission(requiredPermission);

  // Allow access if both checks pass
  if (hasRoleAccess && hasPermissionAccess) {
    return <>{children}</>;
  }

  // Show custom fallback if provided
  if (fallback) {
    return <>{fallback}</>;
  }

  // Don't show anything if showFallback is false
  if (!showFallback) {
    return null;
  }

  // Default access denied message
  return (
    <Card className="border-dashed border-gray-300">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-2">
          <Lock className="h-5 w-5 text-gray-500" />
        </div>
        <CardTitle className="text-lg text-gray-600">Access Restricted</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          You don't have permission to access this content.
        </p>
        
        {userRole && (
          <Badge variant="outline">
            Your Role: {userRole.role.replace('_', ' ').toUpperCase()}
          </Badge>
        )}

        {allowedRoles.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Required roles: {allowedRoles.join(', ').replace(/_/g, ' ').toUpperCase()}
          </div>
        )}

        {requiredPermission && (
          <div className="text-xs text-muted-foreground">
            Required permission: {requiredPermission.replace(/_/g, ' ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
