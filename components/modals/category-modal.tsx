"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { useQuery } from "@tanstack/react-query"
import { query } from "@/api/query"
import { CategoryFormData } from "./types"
import { cn } from "@/lib/utils"
import toast from "react-hot-toast"
import { useLanguage } from "@/contexts/language-context"

interface CategoryModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData, reset: () => void) => void | Promise<void>
  initFormData?: CategoryFormData
  enterLabel?: string
  title?: string
  isLoading?: boolean
}

const INIT_FORM_DATA = {
  name: "",
  type: "",
  description: "",
}

export function CategoryModal({ isOpen, onClose, onSubmit, enterLabel, title = "Modal", initFormData = INIT_FORM_DATA, isLoading }: CategoryModalProps) {
  const { data: types = [] } = useQuery(query.type.getAll())
  const { data: categories = [] } = useQuery(query.category.getAll())
  const { t } = useLanguage()

  const [formData, setFormData] = useState(initFormData)

  useEffect(() => {
    if (!isOpen) return
    setFormData(initFormData)
  }, [initFormData, isOpen])

  const typeOptions = types.map(type => ({ value: type._id, label: type.name }))

  const resetFormData = () => {
    setFormData(INIT_FORM_DATA)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const isDuplicate = categories.some(category => category.name === formData.name && category.name === formData.type)
    if (isDuplicate) {
      toast.error(t("modal.duplicateCategory"))
      return
    }
    onSubmit(formData, resetFormData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("modal.name")} <span className="text-red-500">*</span></label>
            <Input type="text" placeholder={t("profile.enterName")} value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("modal.type")} <span className="text-red-500">*</span></label>
            <Combobox options={typeOptions} value={formData.type} onChange={(value) => setFormData({ ...formData, type: value })} placeholder={t("modal.selectType")} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("modal.description")}</label>
          <Textarea placeholder={t("modal.addNote")} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
        </div>

        <div className={cn("flex gap-2 pt-4", isLoading && "pointer-events-none opacity-80")}>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">{t("modal.cancel")}</Button>
          <Button type="submit" className="flex-1">{enterLabel || t("modal.confirm")}</Button>
        </div>
      </form>
    </Modal>
  )
}
