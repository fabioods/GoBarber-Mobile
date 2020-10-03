/* eslint-disable @typescript-eslint/ban-types */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface AuthContextData {
  signIn(data: AuthSignInData): Promise<void>;
  signOut(): void;
  user: object;
}

interface AuthSignInData {
  email: string;
  password: string;
}

interface AuthState {
  token: string;
  user: object;
}

export const AuthProvider: React.FC = ({ children }) => {
  const [data, setData] = useState<AuthState>({} as AuthState);

  useEffect(() => {
    async function loadStorageData(): Promise<void> {
      const [token, user] = await AsyncStorage.multiGet([
        '@GoBarber-token',
        '@GoBarber-user',
      ]);
      if (token[1] && user[1])
        setData({ token: token[1], user: JSON.parse(user[1]) });
    }
    loadStorageData();
  }, []);

  const signIn = useCallback(async ({ email, password }: AuthSignInData) => {
    const response = await api.post('/sessions', { email, password });

    const { token, user } = response.data;

    await AsyncStorage.multiSet([
      ['@GoBarber-token', token],
      ['@GoBarber-user', JSON.stringify(user)],
    ]);

    setData({ token, user });
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove(['@GoBarber-token', '@GoBarber-user']);
    setData({} as AuthState);
  }, []);

  return (
    <AuthContext.Provider value={{ signIn, signOut, user: data.user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext<AuthContextData>(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

export const AuthContext = createContext({} as AuthContextData);
