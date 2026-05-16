"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { AxiosError } from "axios"
import { mutation } from "@/api/mutate"
import { query } from "@/api/query"
import { QuickTransactionSetupFormData, QuickTransactionSetupResponse } from "@/api/types"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface QuickTransactionSetupModalProps {
  isOpen: boolean
  onClose: () => void
  setup?: QuickTransactionSetupResponse | null
}

const DEFAULT_COLOR = "#0EA5E9"

const INIT_FORM_DATA: QuickTransactionSetupFormData = {
  title: "",
  color: DEFAULT_COLOR,
  amount: "",
  type: "",
  category: "",
  partner: "",
  description: "",
}

export function QuickTransactionSetupModal({ isOpen, onClose, setup }: QuickTransactionSetupModalProps) {
  const { t } = useLanguage()
  const { data: types = [] } = useQuery(query.type.getAll())
  const { data: categories = [] } = useQuery(query.category.getAll())
  const { data: partners = [] } = useQuery(query.partner.getAll())
  const { mutateAsync: createSetup, isPending: isCreating } = mutation.quickTransactionSetup.create()
  const { mutateAsync: updateSetup, isPending: isUpdating } = mutation.quickTransactionSetup.update()
  const [formData, setFormData] = useState<QuickTransactionSetupFormData>(INIT_FORM_DATA)

  useEffect(() => {
    if (!isOpen) return
    if (!setup) {
      setFormData(INIT_FORM_DATA)
      return
    }

    setFormData({
      title: setup.title,
      color: setup.color || DEFAULT_COLOR,
      amount: String(setup.amount ?? ""),
      type: setup.type?._id || "",
      category: setup.category?._id || "",
      partner: setup.partner?._id || "",
      description: setup.description || "",
    })
  }, [isOpen, setup])

  const typeOptions = types.map(type => ({ value: type._id, label: type.name }))
  const categoryOptions = categories.map(category => ({ value: category._id, label: category.name }))
  const partnerOptions = partners.map(partner => ({ value: partner._id, label: partner.name }))
  const isLoading = isCreating || isUpdating

  const handleError = (error: unknown) => {
    if (error instanceof AxiosError && error.response?.data?.message) {
      toast.error(error.response.data.message)
      return
    }
    toast.error(t(setup ? "quickSetup.updateError" : "quickSetup.createError"))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = { ...formData, amount: Number(formData.amount) }
    try {
      if (setup?._id) {
        await updateSetup({ ...payload, amount: payload.amount, _id: setup._id })
        toast.success(t("quickSetup.updateSuccess"))
      } else {
        await createSetup({ ...payload, amount: payload.amount })
        toast.success(t("quickSetup.createSuccess"))
      }
      onClose()
    } catch (error) {
      handleError(error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={setup ? t("quickSetup.editTitle") : t("quickSetup.addTitle")}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("quickSetup.titleField")} <span className="text-red-500">*</span></label>
            <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("quickSetup.color")} <span className="text-red-500">*</span></label>
            <div className="flex gap-2">
              <Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="h-11 w-16 p-1" required />
              <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} required />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("modal.amount")} <span className="text-red-500">*</span></label>
            <Input type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("modal.type")} <span className="text-red-500">*</span></label>
            <Combobox options={typeOptions} value={formData.type} onChange={(value) => setFormData({ ...formData, type: value })} placeholder={t("modal.selectType")} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("modal.category")} <span className="text-red-500">*</span></label>
            <Combobox options={categoryOptions} value={formData.category} onChange={(value) => setFormData({ ...formData, category: value })} placeholder={t("modal.selectCategory")} />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("modal.partner")} <span className="text-red-500">*</span></label>
            <Combobox options={partnerOptions} value={formData.partner} onChange={(value) => setFormData({ ...formData, partner: value })} placeholder={t("modal.selectPartner")} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("modal.description")}</label>
          <Textarea placeholder={t("modal.addNote")} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
        </div>

        <div className={cn("flex gap-2 pt-4", isLoading && "pointer-events-none opacity-80")}>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">{t("modal.cancel")}</Button>
          <Button type="submit" className="flex-1">{setup ? t("quickSetup.saveAction") : t("quickSetup.addAction")}</Button>
        </div>
      </form>
    </Modal>
  )
}
