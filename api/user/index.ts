import { axiosInstance } from "../axios";
import { TypeResponse } from "../types";

export type ProfileResponse = {
  _id: string;
  name: string;
  description?: string;
  isDefault?: boolean;
};

type UserLoginResponse = {
  sessionToken: string;
  token: string;
  userId: string;
  username: string;
  role: string;
  profiles: ProfileResponse[];
  activeProfile: ProfileResponse | null;
  requiresProfileSelection: boolean;
};
export const userLogin = async (params: { username: string; password: string; profileId?: string }): Promise<UserLoginResponse> => {
  return axiosInstance.post<UserLoginResponse, any>(`/login`, {
    ...params,
    role: "user",
  });
};

export const userLogout = async () => {
  return axiosInstance.post(`/logout`);
};

export const userRegister = async (params: { username: string; password: string }) => {
  return axiosInstance.post<any, UserLoginResponse>(`/register`, params);
};

type WhoamiResponse = {
  isLoggedIn: boolean;
  user?: {
    _id: string;
    username: string;
    fullName: string;
  } | null;
  profiles?: ProfileResponse[];
  activeProfile?: ProfileResponse | null;
  requiresProfileSelection?: boolean;
};
export const whoami = async () => {
  return axiosInstance.get<any, WhoamiResponse>("/whoami");
};

export const selectProfile = async (profileId: string) => {
  return axiosInstance.post<any, { message: string; profiles: ProfileResponse[]; activeProfile: ProfileResponse }>("/select-profile", { profileId });
};

export const getProfiles = async () => {
  return axiosInstance.get<any, { profiles: ProfileResponse[]; activeProfile: ProfileResponse | null }>("/user/profiles");
};

export const createProfile = async (params: { name: string; description?: string }) => {
  return axiosInstance.post<any, { message: string; profiles: ProfileResponse[] }>("/user/profiles", params);
};

type AllTypeResponse = TypeResponse[];
export const getAllTypes = async (): Promise<AllTypeResponse> => {
  return axiosInstance.get<any, AllTypeResponse>("/user/type/all");
};
