export interface NotificationsResponse {
  success: boolean;
  data: NotificationsData;
}

export interface NotificationsData {
  notifications: Notification[];
  totalCount: number;
  pages: number;
  page: number;
  limit: number;
}

export interface Notification {
  _id: string;
  receiver: string;
  title: string;
  body: string;
  data: NotificationMeta;
  read: boolean;
  type: NotificationType;
  status: NotificationStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface NotificationMeta {
  screen: string;
}

export interface NotificationCountResponse {
  success: boolean;
  count: NotificationCount;
}

export interface NotificationCount {
  success: boolean;
  count: number;
}

export interface MarkAsReadResponse {
  success: boolean;
  message: string;
  data: Notification[];
}

export interface MarkAsOpenedResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    receiver: string;
    title: string;
    body: string;
    data: NotificationMeta;
    read: boolean;
    type: NotificationType;
    status: NotificationStatus;
    createdAt: string;
    updatedAt: string;
    __v: number;
    openedAt: string;
  }[];
}

export type NotificationType = "logged_in";

export type NotificationStatus = "unopened" | "opened";

export interface PaginationParams {
  page?: number;
  limit?: number;
}
export interface NotificationParams extends PaginationParams {}
