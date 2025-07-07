
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Eye, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface SecurityEvent {
  id: string;
  event_type: string;
  resource_type?: string;
  resource_id?: string;
  severity: 'info' | 'medium' | 'high' | 'critical';
  details: any;
  created_at: string;
}

export const SecurityMonitor: React.FC = () => {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    critical: 0,
    high: 0,
    medium: 0,
    info: 0
  });

  useEffect(() => {
    fetchSecurityEvents();
    const interval = setInterval(fetchSecurityEvents, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error('Failed to fetch security events:', error);
        return;
      }

      setEvents(data || []);
      
      // Calculate stats
      const newStats = { critical: 0, high: 0, medium: 0, info: 0 };
      data?.forEach(event => {
        newStats[event.severity as keyof typeof newStats]++;
      });
      setStats(newStats);

    } catch (error) {
      console.error('Security monitoring error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'info': return 'outline';
      default: return 'outline';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
      case 'high':
        return <AlertTriangle className="h-4 w-4" />;
      case 'medium':
        return <Eye className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  const formatEventType = (eventType: string) => {
    return eventType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading security events...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div className="text-2xl font-bold text-red-600">{stats.critical}</div>
            </div>
            <p className="text-xs text-muted-foreground">Critical Events</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <div className="text-2xl font-bold text-orange-600">{stats.high}</div>
            </div>
            <p className="text-xs text-muted-foreground">High Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-4 w-4 text-yellow-600" />
              <div className="text-2xl font-bold text-yellow-600">{stats.medium}</div>
            </div>
            <p className="text-xs text-muted-foreground">Medium Priority</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-green-600" />
              <div className="text-2xl font-bold text-green-600">{stats.info}</div>
            </div>
            <p className="text-xs text-muted-foreground">Info Events</p>
          </CardContent>
        </Card>
      </div>

      {/* Critical Events Alert */}
      {stats.critical > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Alert:</strong> There are {stats.critical} critical security events that require immediate attention.
          </AlertDescription>
        </Alert>
      )}

      {/* Security Events List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Recent Security Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {events.map(event => (
              <div key={event.id} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(event.severity)}
                    <h4 className="font-medium">{formatEventType(event.event_type)}</h4>
                    <Badge variant={getSeverityColor(event.severity) as any}>
                      {event.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    {new Date(event.created_at).toLocaleString()}
                  </div>
                </div>
                
                {event.resource_type && (
                  <p className="text-sm text-gray-600 mb-1">
                    Resource: {event.resource_type} {event.resource_id && `(${event.resource_id})`}
                  </p>
                )}
                
                {event.details && Object.keys(event.details).length > 0 && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded mt-2">
                    <strong>Details:</strong> {JSON.stringify(event.details, null, 2)}
                  </div>
                )}
              </div>
            ))}
            
            {events.length === 0 && (
              <p className="text-center text-gray-500 py-8">No security events recorded</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
