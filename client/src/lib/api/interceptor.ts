import axiosInstance from "./instance";
import { getToken } from "../session/session";

export const setupAuthInterceptor = () => {
    axiosInstance.interceptors.request.use(async (config) => {
        const token = await getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};
