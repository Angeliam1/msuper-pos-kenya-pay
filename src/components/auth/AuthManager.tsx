
import React, { useState } from 'react';
import { Registration } from './Registration';
import { PinLogin } from './PinLogin';
import { StaffLogin } from './StaffLogin';
import { SecureLogin } from './SecureLogin';
import { SecureRegistration } from './SecureRegistration';
import { SecurityConfigChecker } from './SecurityConfigChecker';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Attendant } from '@/types';

interface AuthManagerProps {
  onLogin: (attendant?: Attendant) => void;
  attendants?: Attendant[];
}

export const AuthManager: React.FC<AuthManagerProps> = ({ onLogin, attendants = [] }) => {
  const { user, isEnvironmentValid } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'register' | 'login' | 'staff-login'>('welcome');
  const [loginError, setLoginError] = useState<string>('');

  // Show security configuration checker if environment is not valid
  if (!isEnvironmentValid) {
    return <SecurityConfigChecker />;
  }

  // If user is already authenticated, handle login
  React.useEffect(() => {
    if (user) {
      onLogin();
    }
  }, [user, onLogin]);

  const handleRegistrationComplete = () => {
    setCurrentScreen('welcome');
  };

  const handleStaffLogin = (attendant: Attendant) => {
    if (user) {
      setLoginError('');
      onLogin(attendant);
    } else {
      setLoginError('System authentication required first');
    }
  };

  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground">MSUPER POS</h1>
          <p className="text-primary-foreground/80">Secure Point of Sale System - Kenya</p>
          <div className="space-y-4">
            <button
              onClick={() => setCurrentScreen('register')}
              className="w-full bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Register New Store
            </button>
            <button
              onClick={() => setCurrentScreen('login')}
              className="w-full bg-transparent border-2 border-white text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary"
            >
              Secure Login
            </button>
            {user && (
              <button
                onClick={() => setCurrentScreen('staff-login')}
                className="w-full bg-transparent border-2 border-white text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary"
              >
                Staff Login
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'register') {
    return (
      <SecureRegistration
        onComplete={handleRegistrationComplete}
        onBack={() => setCurrentScreen('welcome')}
      />
    );
  }

  if (currentScreen === 'login') {
    return (
      <SecureLogin
        onBack={() => setCurrentScreen('welcome')}
      />
    );
  }

  if (currentScreen === 'staff-login') {
    return (
      <StaffLogin
        onLogin={handleStaffLogin}
        onBack={() => setCurrentScreen('welcome')}
        attendants={attendants}
        error={loginError}
      />
    );
  }

  return null;
};
