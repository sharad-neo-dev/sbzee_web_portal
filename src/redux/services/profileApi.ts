import { baseApi } from "./baseApi";

export const profileApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get user profile
    getProfile: builder.query<any, void>({
      query: () => ({
        url: "/user/profile",
        method: "GET",
      }),
      providesTags: ["User"],
    }),

    // Update user profile
    updateProfile: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "/user/profile",
        method: "PATCH",
        body: formData,
        headers: {},
      }),
      invalidatesTags: ["User", "Auth"],
    }),

    // Delete user profile
    deleteProfile: builder.mutation<any, void>({
      query: () => ({
        url: "/user",
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Auth"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
} = profileApi;
