"use client"

import type React from "react"

import { mutation } from "@/api/mutate"
import toast from "react-hot-toast"
import { DeleteModal } from "./delete-modal"
import { AxiosError } from "axios"
import { useLanguage } from "@/contexts/language-context"

interface DeleteCategoryModalProps {
  isOpen: boolean,
  id: string,
  onClose: () => void
}

export function DeleteCategoryModal({ isOpen, id, onClose }: DeleteCategoryModalProps) {
  const { mutateAsync: deleteCategories, isPending } = mutation.category.delete()
  const { t } = useLanguage()

  const handleSubmit = async () => {
    await deleteCategories(id, {
      onSuccess: () => {
        toast.success(t("message.deletedSuccess", { entity: t("entity.category") }))
        onClose()
      },
      onError: (error) => {
        if (error instanceof AxiosError && error.response?.data.message) {
          toast.error(error.response.data.message)
          return
        }
        console.error("Error deleting category:", error)
        toast.error(t("message.deletedFailed", { entity: t("entity.category") }))
      }
    })
  }

  return (
    <DeleteModal
      title={t("modal.deleteCategoryTitle")}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      enterLabel={t("modal.deleteCategoryAction")}
      isLoading={isPending}
      content={<div className="text-center">{t("modal.deleteCategoryContent")}</div>}
    />
  )
}
