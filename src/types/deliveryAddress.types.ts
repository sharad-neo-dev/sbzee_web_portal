export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface IDeliveryAddress {
  uniqueId: string;
  name: string;
  isDefault: boolean;
  addressType: string;
  user: string;
  flat: {
    number: string;
    id: string;
  } | null;
  tower: {
    name: string;
    id: string;
  } | null;
  society: {
    addressLine1: string;
    id: string;
  } | null;
  area: string;
  phoneNumber: string;
  contactPerson: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}
export type IAllDeliveryAddressesResponse = IDeliveryAddress[];

export interface ISociety {
  uniqueId: string;
  area: string;
  acceptingOrders: boolean;
  name: string;
  slug: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  coordinates: {
    type: string;
    coordinates: [number, number];
  };
  contactNumber: string;
  AOAName: string;
  AOAContactNumber: string;
  AOAEmail: string;
  email: string;
  images: string[];
  description: string;
  isActive: boolean;
  towers: {
    name: string;
    floors: number;
    id: string;
  }[];
  gates: any[];
  amenities: any[];
  suppliers: any[];
  prices: any[];
  establishedDate: string;
  createdAt: string;
  updatedAt: string;
  updatedBy?: string;
  thumbnail?: string;
  id: string;
}
export type ISearchSocietiesResponse = ISociety[];

export type ITower = {
  name: string;
  floors: number;
  id: string;
};

export type ITowersBySocietyResponse = ApiResponse<ITower[]>;

export type IFlat = {
  number: string;
  floor: number;
  id: string;
};

export interface IFlatsByTowersResponse {
  success: boolean;
  message: string;
  data: {
    success: boolean;
    message: string;
    data: IFlat[];
  };
}

export interface ICreateDeliveryAddressPayload {
  name: string;
  addressType: "home" | "office" | "friends and family" | "other";
  area: string;
  society: string | null;
  tower: string | null;
  flat: string | null;
  phoneNumber: string;
  contactPerson: string;
}

export interface ICreateDeliveryAddressResponse {
  success: boolean;
  message: string;
  data: {
    uniqueId: string;
    name: string;
    isDefault: boolean;
    addressType: "home" | "office" | "friends and family" | "other";
    user: string;
    flat: string | null;
    tower: string | null;
    society: string | null;
    area: string;
    phoneNumber: string;
    contactPerson: string;
    createdAt: string;
    updatedAt: string;
    id: string;
  };
}
