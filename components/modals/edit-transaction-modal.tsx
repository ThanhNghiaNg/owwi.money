"use client"

import type React from "react"

import { mutation } from "@/api/mutate"
import toast from "react-hot-toast"
import { MEMO_MESSAGE } from "@/utils/constants/memo-messsage"
import { TransactionModal } from "./transaction-modal"
import { TransactionFormData } from "./types"
import { TODAY } from "@/utils/constants/variables"
import { formatDate } from "@/utils/formats/date"
import { AxiosError } from "axios"
import { TransactionResponse } from "@/api/types"
import { useLanguage } from "@/contexts/language-context"

interface EditTransactionModalProps {
  isOpen: boolean,
  transaction: TransactionResponse,
  onClose: () => void,
  queryKey: object
}

export function EditTransactionModal({ isOpen, transaction, onClose, queryKey }: EditTransactionModalProps) {
  const { mutateAsync: updateTransactions, isPending } = mutation.transaction.update(queryKey)
  const { t } = useLanguage()

  const handleSubmit = async (formData: TransactionFormData, reset: () => void) => {
    await updateTransactions({
      _id: transaction._id,
      ...formData
    }, {
      onSuccess: () => {
        toast.success(t(MEMO_MESSAGE.UPDATED_SUCCESS, { entity: t("entity.transaction") }))
        onClose()
        reset()
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.data.message) {
          toast.error(error.response.data.message)
          return
        }
        console.error("Error adding transaction:", error)
        toast.error(t(MEMO_MESSAGE.UPDATED_FAILED, { entity: t("entity.transaction") }))
      }
    })
  }

  const initFormData: TransactionFormData = {
    type: transaction.type._id,
    category: transaction.category._id,
    partner: transaction.partner._id,
    amount: transaction.amount.toString(),
    description: transaction.description || "",
    isDone: transaction.isDone,
    date: transaction.date ? formatDate(transaction.date, "yyyy/MM/dd", '-') : TODAY
  }

  return (
    <TransactionModal
      title={t("modal.editTransactionTitle")}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      enterLabel={t("modal.updateTransactionAction")}
      initFormData={initFormData}
      isLoading={isPending}
    />
  )
}
