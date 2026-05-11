import { axiosInstance } from "../axios";
import type { SixJarsConfigResponse, SixJarsMonthStatisticResponse, UpdateSixJarsConfigPayload } from "../types";

export const getSixJarsConfig = async (): Promise<SixJarsConfigResponse> => {
  return axiosInstance.get<SixJarsConfigResponse, any>("/six-jars/config");
};

export const updateSixJarsConfig = async (payload: UpdateSixJarsConfigPayload): Promise<SixJarsConfigResponse> => {
  return axiosInstance.put<SixJarsConfigResponse, any>("/six-jars/config", payload);
};

export const getSixJarsMonthStatistic = async (month: number, year: number): Promise<SixJarsMonthStatisticResponse> => {
  return axiosInstance.get<SixJarsMonthStatisticResponse, any>("/six-jars/statistic/month", {
    params: { month, year },
  });
};
