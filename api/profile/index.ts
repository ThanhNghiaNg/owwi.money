import { axiosInstance } from "../axios";
import { ProfileResponse } from "../types";

export type SelectProfileResponse = {
    message: string;
    activeProfileId: string;
    profile: ProfileResponse;
}

export type ActiveProfileResponse = {
    activeProfileId: string;
    profile: ProfileResponse;
}

export type CreateProfilePayload = {
    name: string;
    avatarUrl?: string;
    color?: string;
}

export type UpdateProfilePayload = {
    id: string;
    name?: string;
    avatarUrl?: string;
    color?: string;
}

export const getProfiles = async (): Promise<ProfileResponse[]> => {
    return axiosInstance.get<ProfileResponse[], any>("/profiles");
}

export const getActiveProfile = async (): Promise<ActiveProfileResponse> => {
    return axiosInstance.get<ActiveProfileResponse, any>("/profiles/active");
}

export const selectProfile = async (profileId: string): Promise<SelectProfileResponse> => {
    return axiosInstance.post<SelectProfileResponse, any>("/profiles/select", { profileId });
}

export const createProfile = async (payload: CreateProfilePayload): Promise<ProfileResponse> => {
    return axiosInstance.post<ProfileResponse, any>("/profiles", payload);
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<ProfileResponse> => {
    return axiosInstance.put<ProfileResponse, any>(`/profiles/${payload.id}`, payload);
}

export const deleteProfile = async (id: string): Promise<{ message: string; activeProfileId: string | null }> => {
    return axiosInstance.delete<{ message: string; activeProfileId: string | null }, any>(`/profiles/${id}`);
}
