export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  otp: {
    phone: string;
    userId: string | null;
    isLoading: boolean;
    error: string | null;
    isOtpSent: boolean;
    isVerifying: boolean;
    verifyError: string | null;
  };
}
