import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

const useAuthStore = create((set) => ({
  token:     null,
  user:      null,
  isLoading: true,

  loadFromStorage: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      const user  = await SecureStore.getItemAsync('user');
      set({
        token:     token  || null,
        user:      user   ? JSON.parse(user) : null,
        isLoading: false,
      });
    } catch {
      set({ token: null, user: null, isLoading: false });
    }
  },

  setAuth: async (token, user) => {
    await SecureStore.setItemAsync('token', token);
    await SecureStore.setItemAsync('user', JSON.stringify(user));
    set({ token, user });
  },

  logout: async () => {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('user');
    set({ token: null, user: null });
  },
}));

export default useAuthStore;