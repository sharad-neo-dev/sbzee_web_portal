export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}
