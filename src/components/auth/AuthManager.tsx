
import React, { useState } from 'react';
import { Registration } from './Registration';
import { PinLogin } from './PinLogin';
import { StaffLogin } from './StaffLogin';
import { SecureLogin } from './SecureLogin';
import { SecureRegistration } from './SecureRegistration';
import { SuperAdminLogin } from './SuperAdminLogin';
import { StoreSelector } from './StoreSelector';
import { SecurityConfigChecker } from './SecurityConfigChecker';
import { useAuth } from '@/hooks/useSupabaseAuth';
import { Attendant } from '@/types';

interface AuthManagerProps {
  onLogin: (attendant?: Attendant) => void;
  attendants?: Attendant[];
}

type UserRole = 'super_admin' | 'store_owner' | 'store_worker';
type AuthScreen = 'welcome' | 'super-admin' | 'store-selector' | 'store-owner-options' | 'store-owner-signup' | 'store-owner-login' | 'worker-login' | 'staff-login';

export const AuthManager: React.FC<AuthManagerProps> = ({ onLogin, attendants = [] }) => {
  const { user, isEnvironmentValid } = useAuth();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('welcome');
  const [selectedUserType, setSelectedUserType] = useState<UserRole | null>(null);
  const [loginError, setLoginError] = useState<string>('');

  // Show security configuration checker if environment is not valid
  if (!isEnvironmentValid) {
    return <SecurityConfigChecker />;
  }

  // If user is already authenticated, handle based on their role
  React.useEffect(() => {
    if (user) {
      const userRole = user.user_metadata?.role || 'store_owner';
      if (userRole === 'super_admin') {
        setCurrentScreen('store-selector');
      } else {
        // For store owners and workers, proceed to main app
        onLogin();
      }
    }
  }, [user, onLogin]);

  const handleUserTypeSelection = (userType: UserRole) => {
    setSelectedUserType(userType);
    
    switch (userType) {
      case 'super_admin':
        setCurrentScreen('super-admin');
        break;
      case 'store_owner':
        setCurrentScreen('store-owner-options');
        break;
      case 'store_worker':
        setCurrentScreen('worker-login');
        break;
    }
  };

  const handleRegistrationComplete = () => {
    setCurrentScreen('welcome');
  };

  const handleStaffLogin = (attendant: Attendant) => {
    setLoginError('');
    onLogin(attendant);
  };

  const handleStoreSelection = (storeId: string) => {
    // Super admin selected a store, proceed to staff login for that store
    setCurrentScreen('staff-login');
  };

  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
        <div className="text-center space-y-8 max-w-md w-full">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white">MSUPER POS</h1>
            <p className="text-xl text-blue-100">Secure Multi-Store Point of Sale System</p>
            <div className="h-1 bg-white/20 rounded-full">
              <div className="h-1 bg-white rounded-full w-3/4 animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-white/90 text-lg">Select your role to continue:</p>
            
            <button
              onClick={() => handleUserTypeSelection('super_admin')}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
            >
              🔐 Super Administrator
              <div className="text-sm text-red-100 mt-1">Manage all stores and systems</div>
            </button>
            
            <button
              onClick={() => handleUserTypeSelection('store_owner')}
              className="w-full bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
            >
              🏪 Store Owner / Manager
              <div className="text-sm text-green-100 mt-1">Own or manage a store</div>
            </button>
            
            <button
              onClick={() => handleUserTypeSelection('store_worker')}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-lg font-semibold transition-colors duration-200 shadow-lg"
            >
              👤 Store Employee
              <div className="text-sm text-blue-100 mt-1">Cashier, Supervisor, Staff</div>
            </button>
          </div>

          <div className="text-center text-white/60 text-sm">
            Secure authentication with encrypted data storage
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'super-admin') {
    return (
      <SuperAdminLogin
        onSuccess={() => setCurrentScreen('store-selector')}
        onBack={() => setCurrentScreen('welcome')}
      />
    );
  }

  if (currentScreen === 'store-selector') {
    return (
      <StoreSelector
        onStoreSelect={handleStoreSelection}
        onBack={() => setCurrentScreen('welcome')}
      />
    );
  }

  if (currentScreen === 'store-owner-options') {
    return (
      <div className="min-h-screen bg-green-500 flex items-center justify-center p-4">
        <div className="text-center space-y-6 max-w-md w-full">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-white">Store Owner Access</h2>
            <p className="text-green-100">Choose an option to continue</p>
          </div>
          
          <div className="space-y-4">
            <button
              onClick={() => setCurrentScreen('store-owner-login')}
              className="w-full bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign In to Existing Store
              <div className="text-sm text-green-500 mt-1">Access your registered store</div>
            </button>
            
            <button
              onClick={() => setCurrentScreen('store-owner-signup')}
              className="w-full bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Register New Store
              <div className="text-sm text-green-100 mt-1">Create a new store account</div>
            </button>
            
            <button
              onClick={() => setCurrentScreen('welcome')}
              className="w-full text-white/80 hover:text-white transition-colors"
            >
              ← Back to Role Selection
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'store-owner-signup') {
    return (
      <SecureRegistration
        onComplete={handleRegistrationComplete}
        onBack={() => setCurrentScreen('store-owner-options')}
      />
    );
  }

  if (currentScreen === 'store-owner-login') {
    return (
      <SecureLogin
        onBack={() => setCurrentScreen('store-owner-options')}
        userType="store_owner"
      />
    );
  }

  if (currentScreen === 'worker-login') {
    return (
      <SecureLogin
        onBack={() => setCurrentScreen('welcome')}
        userType="worker"
      />
    );
  }

  if (currentScreen === 'staff-login') {
    return (
      <StaffLogin
        onLogin={handleStaffLogin}
        onBack={() => setCurrentScreen('store-selector')}
        attendants={attendants}
        error={loginError}
      />
    );
  }

  // Default fallback
  return (
    <SecureLogin
      onBack={() => setCurrentScreen('welcome')}
    />
  );
};
