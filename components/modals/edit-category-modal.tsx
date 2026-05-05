"use client"

import type React from "react"

import { mutation } from "@/api/mutate"
import toast from "react-hot-toast"
import { CategoryModal } from "./category-modal"
import { CategoryFormData } from "./types"
import { CategoryResponse } from "@/api/types"
import { AxiosError } from "axios"
import { useLanguage } from "@/contexts/language-context"

interface EditCategoryModalProps {
  isOpen: boolean,
  category: CategoryResponse,
  onClose: () => void
}

export function EditCategoryModal({ isOpen, category, onClose }: EditCategoryModalProps) {
  const { mutateAsync: updateCategories, isPending } = mutation.category.update()
  const { t } = useLanguage()

  const handleSubmit = async (formData: CategoryFormData, reset: () => void) => {
    await updateCategories({ id: category._id, ...formData }, {
      onSuccess: () => {
        toast.success(t("message.updatedSuccess", { entity: t("entity.category") }))
        onClose()
        reset()
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.data.message) {
          toast.error(error.response.data.message)
          return
        }
        console.error("Error adding category:", error)
        toast.error(t("message.updatedFailed", { entity: t("entity.category") }))
      }
    })
  }

  const initFormData: CategoryFormData = {
    name: category.name,
    type: category.type._id,
    description: category.description || "",
  }

  return (
    <CategoryModal
      title={t("modal.editCategoryTitle")}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      enterLabel={t("modal.updateCategoryAction")}
      initFormData={initFormData}
      isLoading={isPending}
    />
  )
}
