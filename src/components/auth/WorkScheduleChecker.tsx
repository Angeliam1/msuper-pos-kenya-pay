
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Attendant } from '@/types';
import { Clock, Lock, Calendar } from 'lucide-react';

interface WorkScheduleCheckerProps {
  attendant: Attendant;
  onLogout: () => void;
}

export const WorkScheduleChecker: React.FC<WorkScheduleCheckerProps> = ({ 
  attendant, 
  onLogout 
}) => {
  const isWithinWorkHours = () => {
    if (!attendant.workSchedule?.enforceSchedule) return true;
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    if (!attendant.workSchedule.workDays.includes(currentDay)) return false;
    
    return currentTime >= attendant.workSchedule.startTime && 
           currentTime <= attendant.workSchedule.endTime;
  };

  const getNextWorkTime = () => {
    if (!attendant.workSchedule) return null;
    
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const currentTime = now.toTimeString().slice(0, 5);
    
    // If today is a work day but after hours, show tomorrow's start time
    if (attendant.workSchedule.workDays.includes(currentDay) && 
        currentTime > attendant.workSchedule.endTime) {
      return `Tomorrow at ${attendant.workSchedule.startTime}`;
    }
    
    // Find next work day
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const currentDayIndex = days.indexOf(currentDay);
    
    for (let i = 1; i <= 7; i++) {
      const nextDayIndex = (currentDayIndex + i) % 7;
      const nextDay = days[nextDayIndex];
      
      if (attendant.workSchedule.workDays.includes(nextDay)) {
        const dayName = nextDay.charAt(0).toUpperCase() + nextDay.slice(1);
        return `${dayName} at ${attendant.workSchedule.startTime}`;
      }
    }
    
    return null;
  };

  if (isWithinWorkHours()) {
    return null; // Don't render if within work hours
  }

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Lock className="h-12 w-12 text-red-500" />
          </div>
          <CardTitle className="text-xl text-red-600">
            POS System Locked
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-red-100 p-4 rounded-lg">
            <p className="text-red-800 font-medium">
              Access restricted outside work hours
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Your Work Schedule:</span>
            </div>
            <div className="text-sm">
              <div className="font-medium">
                {attendant.workSchedule?.startTime} - {attendant.workSchedule?.endTime}
              </div>
              <div className="text-gray-600 capitalize">
                {attendant.workSchedule?.workDays.join(', ')}
              </div>
            </div>
          </div>

          {getNextWorkTime() && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-blue-800">
                  Next access: {getNextWorkTime()}
                </span>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button 
              onClick={onLogout} 
              variant="outline" 
              className="w-full"
            >
              Logout
            </Button>
          </div>

          <p className="text-xs text-gray-500">
            Contact your manager if you need access outside scheduled hours.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
