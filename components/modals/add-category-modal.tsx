"use client"

import type React from "react"

import { mutation } from "@/api/mutate"
import toast from "react-hot-toast"
import { CategoryFormData } from "./types"
import { AxiosError } from "axios"
import { CategoryModal } from "./category-modal"
import { useLanguage } from "@/contexts/language-context"

interface AddCategoryModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const { mutateAsync: createCategory } = mutation.category.create()
  const { t } = useLanguage()

  const handleSubmit = async (formData: CategoryFormData, reset: () => void) => {
    await createCategory(formData, {
      onSuccess: () => {
        toast.success(t("message.createdSuccess", { entity: t("entity.category") }))
        onClose()
        reset()
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.data.message) {
          toast.error(error.response.data.message)
          return
        }
        console.error("Error adding category:", error)
        toast.error(t("message.createdFailed", { entity: t("entity.category") }))
      }
    })
  }

  return <CategoryModal title={t("modal.addCategoryTitle")} isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} enterLabel={t("modal.addCategoryAction")} />
}
