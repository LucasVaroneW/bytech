import React, { createContext, useContext, ReactNode, useState } from 'react';
import axios from 'axios';

type User = {
  id: number;
  name: string;
  email: string;
};

type AuthContextProps = {
  children: ReactNode;
};

type AuthContextType = {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string; }>;
  logout: () => void;
  createUser: (name: string, email: string, password: string) => Promise<{ success: boolean; message: string; }>;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthContextProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/login', {
        email,
        password,
      });
      const { token, user } = response.data;
      setToken(token);
      setUser(user);
      return { success: true, message: 'Login successful' };
    } catch (error) {
      console.error('Error during login:', error);
      return { success: false, message: 'Error during login' };
    }
  };

  const createUser = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post('http://localhost:3000/api/user/createUser', {
        name,
        email,
        password,
      });
      console.log('User created successfully', response.data);
      await login(email, password);
      return { success: true, message: 'User created successfully' };
    } catch (error: any) {
      console.error('Error during create user:', error.response.data);
      return { success: false, message: 'Error during create user' };
    }
  };


  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, createUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
