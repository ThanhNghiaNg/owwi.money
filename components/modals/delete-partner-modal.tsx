"use client"

import type React from "react"

import { mutation } from "@/api/mutate"
import toast from "react-hot-toast"
import { DeleteModal } from "./delete-modal"
import { AxiosError } from "axios"
import { useLanguage } from "@/contexts/language-context"

interface DeletePartnerModalProps {
  isOpen: boolean,
  id: string,
  onClose: () => void
}

export function DeletePartnerModal({ isOpen, id, onClose }: DeletePartnerModalProps) {
  const { mutateAsync: deletePartners, isPending } = mutation.partner.delete()
  const { t } = useLanguage()

  const handleSubmit = async () => {
    await deletePartners(id, {
      onSuccess: () => {
        toast.success(t("message.deletedSuccess", { entity: t("entity.partner") }))
        onClose()
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.data.message) {
          toast.error(error.response.data.message)
          return
        }
        console.error("Error deleting partner:", error)
        toast.error(t("message.deletedFailed", { entity: t("entity.partner") }))
      }
    })
  }

  return (
    <DeleteModal
      title={t("modal.deletePartnerTitle")}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      enterLabel={t("modal.deletePartnerAction")}
      isLoading={isPending}
      content={<div className="text-center">{t("modal.deletePartnerContent")}</div>}
    />
  )
}
