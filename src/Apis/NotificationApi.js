import API_ROUTES from "../Config/ApiRoutes";
import { EMPTY_ARRAY, REQUEST_METHODS } from "../Utils/Constant";
import { apiHandler, getNotificationApiHandler } from "../Utils/Helpers";

export const getNotification = async () => {
    try {
        const url = API_ROUTES.NOTIFICATION.GET_NOTIFICATION;
        const result = await getNotificationApiHandler(
            REQUEST_METHODS.GET,
            url,
            {}
        );
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};
export const markReadAllNotification = async () => {
    try {
        const url = API_ROUTES.NOTIFICATION.READ_ALL_NOTIFICATION;
        const result = await apiHandler(
            REQUEST_METHODS.GET,
            url,
            {}
        );
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};
export const markReadSingleNotification = async (notificationId) => {
    try {
        const url = `${API_ROUTES.NOTIFICATION.READ_SINGLE_NOTIFICATION}/${notificationId}`;
        const result = await apiHandler(
            REQUEST_METHODS.POST,
            url,
            {}
        );
        return result;
    } catch {
        return EMPTY_ARRAY;
    }
};