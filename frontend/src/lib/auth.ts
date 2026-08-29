interface User {
  name: string;
  avatar: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

// Development-only placeholder state
let authState: AuthState = {
  user: null,
  isAuthenticated: false,
};

// Simple getter for auth state
export const useAuthStore = {
  getState: () => authState,
  subscribe: () => () => {},
  login: () => {
    authState = {
      user: { name: "John Doe", avatar: "/images/avatar.jpg", roles: ["user"] },
      isAuthenticated: true,
    };
  },
  logout: () => {
    authState = { user: null, isAuthenticated: false };
  },
};

// Export the state directly for Header.tsx
export const user = authState.user;
export const isAuthenticated = authState.isAuthenticated;
export const login = () => useAuthStore.login();
export const logout = () => useAuthStore.logout();