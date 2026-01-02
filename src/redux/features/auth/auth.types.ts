export interface User {
  id: string;
  uniqueId: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  isEmailVerified: boolean;
  isPhoneVerified: boolean;
  isAddressAdded: boolean;
  profilePhoto: string;
  deliveryAddresses: any[];
  favorites: string[];
  conversation: string;
  primaryDeliveryAddress: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: {
    token: string;
    expiresIn: string;
  };
  refreshToken: {
    token: string;
    expiresIn: string;
  };
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken?: {
      token: string;
      expiresIn: string;
    };
    refreshToken?: {
      token: string;
      expiresIn: string;
    };
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
  otpSentTo?: string;
  userId?: string;
}

export interface LoginRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  otp: string;
  ipAddress?: string;
  userId: string;
}
