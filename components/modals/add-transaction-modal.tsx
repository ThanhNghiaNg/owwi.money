"use client"

import type React from "react"

import { mutation } from "@/api/mutate"
import toast from "react-hot-toast"
import { MEMO_MESSAGE } from "@/utils/constants/memo-messsage"
import { TransactionModal } from "./transaction-modal"
import { TransactionFormData } from "./types"
import { AxiosError } from "axios"
import { ViewScope } from "@/contexts/profile-context"

interface AddTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  queryKey?: object
  viewScope?: ViewScope
  activeProfileName?: string | null
}

export function AddTransactionModal({
  isOpen,
  onClose,
  queryKey,
  viewScope = "profile",
  activeProfileName,
}: AddTransactionModalProps) {
  const { mutateAsync: createTransaction } = mutation.transaction.create(queryKey)

  const handleSubmit = async (formData: TransactionFormData, reset: () => void) => {
    await createTransaction(formData, {
      onSuccess: () => {
        toast.success(MEMO_MESSAGE.CREATED_SUCCESS("Transaction"))
        onClose()
        reset()
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.data.message) {
          toast.error(error.response.data.message)
          return
        }
        console.error("Error adding transaction:", error)
        toast.error(MEMO_MESSAGE.CREATED_FAILED("Transaction"))
      }
    })
  }

  return (
    <div>
      {isOpen && viewScope === "account" && (
        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
          New transactions are still created under the active profile:
          <span className="ml-1 font-semibold">{activeProfileName || "Current profile"}</span>
        </div>
      )}
      <TransactionModal
        title="Add new transaction"
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        enterLabel="Add Transaction"
      />
    </div>
  )
}
