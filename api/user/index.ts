import { axiosInstance } from "../axios"
import { AuthPayload, TypeResponse } from "../types";

type UserLoginResponse = AuthPayload & {
    message: string;
    sessionToken: string;
    token: string;
    name: string;
    role: string;
}

type UserRegisterResponse = {
    message: string;
}

export const userLogin = async (params: {username: string, password: string}): Promise<UserLoginResponse> => {
    return axiosInstance.post<UserLoginResponse, any>(`/login`, {
        ...params,
        role: "user"
    });
}

export const userLogout = async () => {
    return axiosInstance.post(`/logout`);
}

export const userRegister = async (params: {username: string, password: string}): Promise<UserRegisterResponse> => {
    return axiosInstance.post<any, UserRegisterResponse>(`/register`, params);
}

type WhoamiResponse = {
    isLoggedIn: boolean;
} & Partial<AuthPayload>
export const whoami = async () => {
    return axiosInstance.get<any, WhoamiResponse>("/whoami");
}

type AllTypeResponse = TypeResponse[]
export const getAllTypes = async (): Promise<AllTypeResponse> => {
    return axiosInstance.get<any, AllTypeResponse>('/user/type/all');
}
