import {
  ApiResponse,
  IAllDeliveryAddressesResponse,
  ICreateDeliveryAddressPayload,
  ICreateDeliveryAddressResponse,
  IFlatsByTowersResponse,
  ISearchSocietiesResponse,
  ITower,
  ITowersBySocietyResponse,
} from "@/types/deliveryAddress.types";
import { baseApi } from "./baseApi";

export const deliveryAddressApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // fetch Societies
    searchSocieties: builder.query<
      ApiResponse<ISearchSocietiesResponse>,
      { input: string }
    >({
      query: ({ input }) => ({
        url: `/user/search/society/${input}`,
        method: "GET",
      }),
      providesTags: ["DeliveryAddress"],
      keepUnusedDataFor: 300,
    }),

    // fetch tower by society
    getTowersBySociety: builder.query<
      ApiResponse<ITower[]>,
      { societyId: string }
    >({
      query: ({ societyId }) => ({
        url: `/user/search/tower/${societyId}`,
        method: "GET",
      }),
      providesTags: ["DeliveryAddress"],
      keepUnusedDataFor: 300,
    }),

    // fetch flat by tower
    getFlatsByTower: builder.query<IFlatsByTowersResponse, { towerId: string }>(
      {
        query: ({ towerId }) => ({
          url: `/user/search/flat/${towerId}`,
          method: "GET",
        }),
        providesTags: ["DeliveryAddress"],
        keepUnusedDataFor: 300,
      }
    ),

    // fetch all delivery address
    getAllDeliveryAddress: builder.query<
      ApiResponse<IAllDeliveryAddressesResponse>,
      void
    >({
      query: () => ({
        url: `/user/delivery-address`,
        method: "GET",
      }),
      providesTags: ["DeliveryAddress"],
      keepUnusedDataFor: 300,
    }),

    // add delivery address
    addDeliveryAddress: builder.mutation<
      ICreateDeliveryAddressResponse,
      ICreateDeliveryAddressPayload
    >({
      query: (body) => ({
        url: "/user/delivery-address",
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, arg) => [
        "DeliveryAddress",
        { type: "DeliveryAddress", id: result?.data.id },
      ],
    }),
  }),
});
export const {
  useSearchSocietiesQuery,
  useGetTowersBySocietyQuery,
  useGetFlatsByTowerQuery,
  useAddDeliveryAddressMutation,
  useGetAllDeliveryAddressQuery,
} = deliveryAddressApi;
