import { AxiosInstance } from 'axios';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { ERROR_MESSAGE } from "@/utils/constants/message";
import toast from 'react-hot-toast';
import { SESSION_ID } from '@/utils/constants/keys';

let toastTimeout: NodeJS.Timeout | null = null;
const interceptorIds = new WeakMap<AxiosInstance, { request: number; response: number }>();

const showToastTimeout = (message: string) => {
    if (toastTimeout) {
        clearTimeout(toastTimeout);
    }
    toastTimeout = setTimeout(() => {
        toast.error(message);
    }, 150);
}

export const setupAxiosInterceptors = (router: AppRouterInstance, axiosInstance: AxiosInstance) => {
    const previous = interceptorIds.get(axiosInstance);
    if (previous) {
        axiosInstance.interceptors.request.eject(previous.request);
        axiosInstance.interceptors.response.eject(previous.response);
    }

    const response = axiosInstance.interceptors.response.use(
        (response) => response.data,
        (error) => {
            if (error.response?.status === 401) {
                const isLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';
                localStorage.removeItem(SESSION_ID);

                if (!isLoginPage) {
                    router.push("/login");
                    if (toastTimeout) {
                        clearTimeout(toastTimeout);
                    }
                    showToastTimeout(ERROR_MESSAGE.UNAUTHORIZED);
                }
                throw error;
            }
            if (error.response?.status === 500 || error.status === 500) {
                showToastTimeout(ERROR_MESSAGE.SYSTEM_ERROR);
                throw error;
            }
            throw error;
        }
    );

    const request = axiosInstance.interceptors.request.use((req) => {
        const sessionId = localStorage.getItem(SESSION_ID) || ''
        if (sessionId) {
            req.headers['Bearer'] = sessionId;
        }
        return req;
    })

    interceptorIds.set(axiosInstance, { request, response });
};
