"use client"

import type React from "react"

import { useEffect, useMemo, useRef, useState } from "react"
import { Modal } from "@/components/ui/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Combobox } from "@/components/ui/combobox"
import { useQuery } from "@tanstack/react-query"
import { query } from "@/api/query"
import { TransactionFormData } from "./types"
import { formatDate } from "@/utils/formats/date"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: TransactionFormData, reset: () => void) => void | Promise<void>
  initFormData?: TransactionFormData
  enterLabel?: string
  title?: string
  isLoading?: boolean
}

const INIT_FORM_DATA = {
  amount: "",
  type: "",
  category: "",
  partner: "",
  date: formatDate(new Date().toISOString(), "yyyy/MM/dd", '-'),
  description: "",
  isDone: true,
}

export function TransactionModal({ isOpen, onClose, onSubmit, enterLabel, title = "Modal", initFormData = INIT_FORM_DATA, isLoading }: TransactionModalProps) {
  const { data: types = [] } = useQuery(query.type.getAll())
  const { data: categories = [] } = useQuery(query.category.getAll())
  const { data: partners = [] } = useQuery(query.partner.getAll())
  const { t } = useLanguage()

  const [formData, setFormData] = useState(initFormData)
  const amountInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (!isOpen) return
    setFormData(initFormData)
  }, [initFormData, isOpen])

  const categoryOptions = categories.map((cat) => ({ value: cat._id, label: cat.name }))
  const partnerOptions = partners.map((partner) => ({ value: partner._id, label: partner.name }))
  const typeOptions = types.map(type => ({ value: type._id, label: type.name }))

  const outcomeType = useMemo(
    () => types.find((type) => type.name?.toLowerCase() === "outcome") || null,
    [types]
  )

  const recentOutcomeCategories = useMemo(() => {
    if (!outcomeType?._id || categories.length < 10) return []
    return categories
      .filter((category) => category.type?._id === outcomeType._id || category.type?.name?.toLowerCase() === "outcome")
      .slice(0, 10)
  }, [categories, outcomeType])

  const recentOutcomePartners = useMemo(() => {
    if (!outcomeType?._id || partners.length < 10) return []
    return partners
      .filter((partner) => partner.type?._id === outcomeType._id || partner.type?.name?.toLowerCase() === "outcome")
      .slice(0, 10)
  }, [partners, outcomeType])

  const topOutcomeCategory = useMemo(() => {
    if (!recentOutcomeCategories.length) return null
    return [...recentOutcomeCategories].sort((a, b) => (b.usedTime || 0) - (a.usedTime || 0))[0] || null
  }, [recentOutcomeCategories])

  const topOutcomePartner = useMemo(() => {
    if (!recentOutcomePartners.length) return null
    return [...recentOutcomePartners].sort((a, b) => (b.usedTime || 0) - (a.usedTime || 0))[0] || null
  }, [recentOutcomePartners])

  const showQuickFill = !!outcomeType && !!topOutcomeCategory && !!topOutcomePartner

  const resetFormData = (isKeepDate = true) => {
    setFormData((prev) => ({ amount: "", type: "", category: "", partner: "", date: isKeepDate ? prev.date : "", description: "", isDone: true }))
  }

  const handleQuickFill = () => {
    if (!outcomeType || !topOutcomeCategory || !topOutcomePartner) {
      return
    }

    setFormData((prev) => ({
      ...prev,
      type: outcomeType._id,
      category: topOutcomeCategory._id,
      partner: topOutcomePartner._id,
    }))

    requestAnimationFrame(() => {
      amountInputRef.current?.focus()
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData, resetFormData)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      headerActions={showQuickFill ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleQuickFill}
          className="h-8 border-amber-300 bg-amber-50 px-3 text-xs font-semibold text-amber-700 hover:bg-amber-100 hover:text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/50"
        >
          {t("modal.quickFill")}
        </Button>
      ) : null}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("modal.amount")} <span className="text-red-500">*</span></label>
            <Input ref={amountInputRef} type="number" placeholder="0.00" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("modal.date")} <span className="text-red-500">*</span></label>
            <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t("modal.statistic")} <span className="text-red-500">*</span></label>
            <div className="flex items-center flex-1 h-11">
              <input type="checkbox" checked={formData.isDone} onChange={(e) => setFormData({ ...formData, isDone: e.target.checked })} className="w-6 h-6 justify-start text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600" />
            </div>
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
