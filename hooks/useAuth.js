import useAuthStore from '../store/authStore';

const useAuth = () => {
  const { token, user, isLoading, setAuth, logout, loadFromStorage } = useAuthStore();

  const isAuthenticated = !!token;
  const isFarmer        = user?.role === 'farmer';
  const isBuyer         = user?.role === 'buyer';

  return {
    token,
    user,
    isLoading,
    isAuthenticated,
    isFarmer,
    isBuyer,
    setAuth,
    logout,
    loadFromStorage,
  };
};

export default useAuth;