"use client"

import type React from "react"

import { mutation } from "@/api/mutate"
import toast from "react-hot-toast"
import { PartnerFormData } from "./types"
import { PartnerModal } from "./partner-modal"
import { AxiosError } from "axios"
import { useLanguage } from "@/contexts/language-context"

interface AddPartnerModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddPartnerModal({ isOpen, onClose }: AddPartnerModalProps) {
  const { mutateAsync: createPartner } = mutation.partner.create()
  const { t } = useLanguage()

  const handleSubmit = async (formData: PartnerFormData, reset: () => void) => {
    await createPartner(formData, {
      onSuccess: () => {
        toast.success(t("message.createdSuccess", { entity: t("entity.partner") }))
        onClose()
        reset()
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.data.message) {
          toast.error(error.response.data.message)
          return
        }
        console.error("Error adding partner:", error)
        toast.error(t("message.createdFailed", { entity: t("entity.partner") }))
      }
    })
  }

  return <PartnerModal title={t("modal.addPartnerTitle")} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} enterLabel={t("modal.addPartnerAction")} />
}
