"use client"

import type React from "react"

import { mutation } from "@/api/mutate"
import toast from "react-hot-toast"
import { MEMO_MESSAGE } from "@/utils/constants/memo-messsage"
import { DeleteModal } from "./delete-modal"
import { AxiosError } from "axios"
import { useLanguage } from "@/contexts/language-context"

interface DeleteTransactionModalProps {
  isOpen: boolean,
  id: string,
  onClose: () => void,
  queryKey?: object
}

export function DeleteTransactionModal({ isOpen, id, onClose, queryKey }: DeleteTransactionModalProps) {
  const { mutateAsync: deleteTransactions, isPending } = mutation.transaction.delete(queryKey)
  const { t } = useLanguage()

  const handleSubmit = async () => {
    await deleteTransactions(id, {
      onSuccess: () => {
        toast.success(t(MEMO_MESSAGE.DELETED_SUCCESS, { entity: t("entity.transaction") }))
        onClose()
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.data.message) {
          toast.error(error.response.data.message)
          return
        }
        console.error("Error adding transaction:", error)
        toast.error(t(MEMO_MESSAGE.DELETED_FAILED, { entity: t("entity.transaction") }))
      }
    })
  }

  return (
    <DeleteModal
      title={t("modal.deleteTransactionTitle")}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      enterLabel={t("modal.deleteTransactionAction")}
      isLoading={isPending}
      content={<div className="text-center">{t("modal.deleteTransactionContent")}</div>}
    />
  )
}
