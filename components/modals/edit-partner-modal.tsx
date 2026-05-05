"use client"

import type React from "react"

import { mutation } from "@/api/mutate"
import toast from "react-hot-toast"
import { PartnerModal } from "./partner-modal"
import { PartnerFormData } from "./types"
import { PartnerResponse } from "@/api/types"
import { AxiosError } from "axios"
import { useLanguage } from "@/contexts/language-context"

interface EditPartnerModalProps {
  isOpen: boolean,
  partner: PartnerResponse,
  onClose: () => void
}

export function EditPartnerModal({ isOpen, partner, onClose }: EditPartnerModalProps) {
  const { mutateAsync: updatePartners, isPending } = mutation.partner.update()
  const { t } = useLanguage()

  const handleSubmit = async (formData: PartnerFormData, reset: () => void) => {
    await updatePartners({ id: partner._id, ...formData }, {
      onSuccess: () => {
        toast.success(t("message.updatedSuccess", { entity: t("entity.partner") }))
        onClose()
        reset()
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.data.message) {
          toast.error(error.response.data.message)
          return
        }
        console.error("Error adding partner:", error)
        toast.error(t("message.updatedFailed", { entity: t("entity.partner") }))
      }
    })
  }

  const initFormData: PartnerFormData = {
    name: partner.name,
    type: partner.type._id,
    description: partner.description || "",
  }

  return (
    <PartnerModal
      title={t("modal.editPartnerTitle")}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      enterLabel={t("modal.updatePartnerAction")}
      initFormData={initFormData}
      isLoading={isPending}
    />
  )
}
