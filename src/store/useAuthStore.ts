import { GoogleLoginResponse } from '@/types/auth.type';
import { create } from 'zustand';

type AuthDataType = Omit<GoogleLoginResponse, 'message'>;
type AuthStoreType = {
  authData: AuthDataType;
  setAuthData: (authData: AuthDataType) => void;
};

export const useAuthStore = create<AuthStoreType>((set) => ({
  authData: { provider: '', identify: '', email: '' },
  setAuthData: (authData) => set({ authData }),
}));
