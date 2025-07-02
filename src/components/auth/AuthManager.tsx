
import React, { useState, useEffect } from 'react';
import { Registration } from './Registration';
import { PinLogin } from './PinLogin';
import { StaffLogin } from './StaffLogin';
import { Attendant } from '@/types';

interface User {
  id: string;
  storeName: string;
  adminEmail: string;
  password: string;
  pin: string;
  phone: string;
  currency: string;
  theme: string;
  createdAt: Date;
}

interface AuthManagerProps {
  onLogin: (user: User, attendant?: Attendant) => void;
  attendants?: Attendant[];
}

export const AuthManager: React.FC<AuthManagerProps> = ({ onLogin, attendants = [] }) => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'register' | 'login' | 'staff-login'>('welcome');
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loginError, setLoginError] = useState<string>('');

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('pos_users');
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers);
      setUsers(parsedUsers);
      if (parsedUsers.length > 0) {
        setCurrentScreen('login');
        setSelectedUser(parsedUsers[0]); // For demo, use first user
      }
    }
  }, []);

  const handleRegistration = (userData: any) => {
    const newUser: User = {
      id: Date.now().toString(),
      storeName: userData.storeName,
      adminEmail: userData.adminEmail,
      password: userData.password,
      pin: userData.pin,
      phone: userData.phone,
      currency: userData.currency,
      theme: 'light',
      createdAt: new Date()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('pos_users', JSON.stringify(updatedUsers));
    
    setSelectedUser(newUser);
    setCurrentScreen('login');
  };

  const handlePinLogin = (enteredPin: string) => {
    if (selectedUser && selectedUser.pin === enteredPin) {
      setLoginError('');
      onLogin(selectedUser);
    } else {
      setLoginError('Invalid PIN. Please try again.');
    }
  };

  const handleStaffLogin = (attendant: Attendant) => {
    if (selectedUser) {
      setLoginError('');
      onLogin(selectedUser, attendant);
    }
  };

  if (currentScreen === 'welcome') {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center p-4">
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground">MSUPER POS</h1>
          <p className="text-primary-foreground/80">Point of Sale System - Kenya</p>
          <div className="space-y-4">
            <button
              onClick={() => setCurrentScreen('register')}
              className="w-full bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
            >
              Register New Store
            </button>
            {users.length > 0 && (
              <>
                <button
                  onClick={() => {
                    setSelectedUser(users[0]);
                    setCurrentScreen('login');
                  }}
                  className="w-full bg-transparent border-2 border-white text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary"
                >
                  Owner Login
                </button>
                <button
                  onClick={() => {
                    setSelectedUser(users[0]);
                    setCurrentScreen('staff-login');
                  }}
                  className="w-full bg-transparent border-2 border-white text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary"
                >
                  Staff Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'register') {
    return (
      <Registration
        onComplete={handleRegistration}
        onBack={() => setCurrentScreen('welcome')}
      />
    );
  }

  if (currentScreen === 'login' && selectedUser) {
    return (
      <PinLogin
        onLogin={handlePinLogin}
        onBack={() => setCurrentScreen('welcome')}
        storeName={selectedUser.storeName}
        error={loginError}
      />
    );
  }

  if (currentScreen === 'staff-login' && selectedUser) {
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
