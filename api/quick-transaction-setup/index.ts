import { axiosInstance } from "../axios"
import { QuickTransactionSetupFormData, QuickTransactionSetupResponse } from "../types"

export const getQuickTransactionSetups = async (): Promise<{ data: QuickTransactionSetupResponse[] }> => {
  return axiosInstance.get<any, { data: QuickTransactionSetupResponse[] }>("/quick-transaction-setups")
}

export const createQuickTransactionSetup = async (payload: QuickTransactionSetupFormData) => {
  return axiosInstance.post("/quick-transaction-setups", payload)
}

export const updateQuickTransactionSetup = async (payload: QuickTransactionSetupFormData & { _id: string }) => {
  return axiosInstance.put(`/quick-transaction-setups/${payload._id}`, payload)
}

export const deleteQuickTransactionSetup = async (id: string) => {
  return axiosInstance.delete(`/quick-transaction-setups/${id}`)
}
