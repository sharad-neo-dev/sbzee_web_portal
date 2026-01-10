export interface ProfileResponse {
  success: boolean;
  message: string;
  data: UserProfile;
}

export interface UserProfile {
  _id: string;
  uniqueId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  phone: string;
  isPhoneVerified: boolean;
  isAddressAdded: boolean;
  deliveryAddresses: string[];
  favorites: string[];
  profilePhoto: string;
  isDeleted: boolean;
  conversation: string;
  primaryDeliveryAddress: string;
  role: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data: UpdatedUserProfile;
}

export interface UpdatedUserProfile {
  id: string;
  uniqueId: string;
  firstName: string;
  lastName: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
  phone: string;
  isPhoneVerified: boolean;
  isAddressAdded: boolean;
  deliveryAddresses: string[];
  favorites: string[];
  profilePhoto: string;
  isDeleted: boolean;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  conversation: string;
  primaryDeliveryAddress: string;
  role: string;
}
