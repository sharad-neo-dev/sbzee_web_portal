import { baseApi } from "./baseApi";
import {
  MarkAsOpenedResponse,
  MarkAsReadResponse,
  NotificationCountResponse,
  NotificationParams,
  NotificationsResponse,
} from "@/types/notifications.types";

export const notificationsApi = baseApi.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Get All Notifications
    getAllNotifications: builder.query<
      NotificationsResponse,
      NotificationParams
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/notification",
        method: "GET",
        params: { page, limit },
      }),
      providesTags: ["Notifications"],
      keepUnusedDataFor: 300,
    }),

    // fetch unread count
    getUnreadCount: builder.query<NotificationCountResponse, void>({
      query: () => ({
        url: "/notification/unread-count",
        method: "GET",
      }),
      providesTags: ["Notifications"],
      keepUnusedDataFor: 300,
    }),

    // fetch unopened count
    getUnopenedCount: builder.query<NotificationCountResponse, void>({
      query: () => ({
        url: "/notification/unopened-count",
        method: "GET",
      }),
      providesTags: ["Notifications"],
      keepUnusedDataFor: 300,
    }),

    // mark all as read
    markAllRead: builder.query<MarkAsReadResponse, void>({
      query: () => ({
        url: "/notification/read",
        method: "GET",
      }),
      providesTags: ["Notifications"],
      keepUnusedDataFor: 300,
    }),

    // mark all as read
    markNotificationOpened: builder.mutation<
      MarkAsOpenedResponse,
      { id: string }
    >({
      query: ({ id }) => ({
        url: `/notification/open/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [
        "Favorites",
        { type: "Notifications", id },
      ],
    }),
  }),
});
export const {
  useGetAllNotificationsQuery,
  useGetUnreadCountQuery,
  useGetUnopenedCountQuery,
  useMarkAllReadQuery,
  useMarkNotificationOpenedMutation,
} = notificationsApi;
