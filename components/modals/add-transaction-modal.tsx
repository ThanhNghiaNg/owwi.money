"use client"

import type React from "react"

import { mutation } from "@/api/mutate"
import toast from "react-hot-toast"
import { MEMO_MESSAGE } from "@/utils/constants/memo-messsage"
import { TransactionModal } from "./transaction-modal"
import { TransactionFormData } from "./types"
import { AxiosError } from "axios"
import { ViewScope } from "@/contexts/profile-context"
import { useLanguage } from "@/contexts/language-context"

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
  const { t } = useLanguage()

  const handleSubmit = async (formData: TransactionFormData, reset: () => void) => {
    await createTransaction(formData, {
      onSuccess: () => {
        toast.success(t(MEMO_MESSAGE.CREATED_SUCCESS, { entity: t("entity.transaction") }))
        onClose()
        reset()
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.data.message) {
          toast.error(error.response.data.message)
          return
        }
        console.error("Error adding transaction:", error)
        toast.error(t(MEMO_MESSAGE.CREATED_FAILED, { entity: t("entity.transaction") }))
      }
    })
  }

  return (
    <div>
      {isOpen && viewScope === "account" && (
        <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300">
          {t("modal.activeProfileCreateHint")}
          <span className="ml-1 font-semibold">{activeProfileName || t("header.currentProfile")}</span>
        </div>
      )}
      <TransactionModal
        title={t("modal.addTransactionTitle")}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleSubmit}
        enterLabel={t("modal.addTransactionAction")}
        showQuickFill
      />
    </div>
  )
}
