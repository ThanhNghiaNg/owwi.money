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
import { TransactionFormData } from "./types"
import { formatDate } from "@/utils/formats/date"
import { cn } from "@/lib/utils"

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

export function TransactionModal({ isOpen, onClose, onSubmit, enterLabel = "Confirm", title = "Modal", initFormData = INIT_FORM_DATA, isLoading }: TransactionModalProps) {
  const { data: types = [] } = useQuery(query.type.getAll())
  const { data: categories = [] } = useQuery(query.category.getAll())
  const { data: partners = [] } = useQuery(query.partner.getAll())

  const [formData, setFormData] = useState(initFormData)

  useEffect(() => {
    if (!isOpen) return
    setFormData(initFormData)
  }, [initFormData, isOpen])

  const categoryOptions = categories.map((cat) => ({
    value: cat._id,
    label: cat.name,
  }))

  const partnerOptions = partners.map((partner) => ({
    value: partner._id,
    label: partner.name,
  }))

  const typeOptions = types.map(type => ({
    value: type._id,
    label: type.name,
  }))

  const resetFormData = (isKeepDate = true) => {
    setFormData((prev) => (
      {
        amount: "",
        type: "",
        category: "",
        partner: "",
        date: isKeepDate ? prev.date : "",
        description: "",
        isDone: true,
      }
    ))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData, resetFormData)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount <span className="text-red-500">*</span></label>
            <Input
              type="number"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type <span className="text-red-500">*</span></label>
            <Combobox
              options={typeOptions}
              value={formData.type}
              onChange={(value) => setFormData({ ...formData, type: value })}
              placeholder="Select type"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category <span className="text-red-500">*</span></label>
            <Combobox
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => setFormData({ ...formData, category: value })}
              placeholder="Select category"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Partner <span className="text-red-500">*</span></label>
            <Combobox
              options={partnerOptions}
              value={formData.partner}
              onChange={(value) => setFormData({ ...formData, partner: value })}
              placeholder="Select partner"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date <span className="text-red-500">*</span></label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Statistic <span className="text-red-500">*</span></label>
            <div className="flex items-center flex-1 h-11">
              <input
                type="checkbox"
                checked={formData.isDone}
                onChange={(e) => setFormData({ ...formData, isDone: e.target.checked })}
                className="w-6 h-6 justify-start text-blue-600 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <Textarea
            placeholder="Add a note..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <div className={cn("flex gap-2 pt-4", isLoading && "pointer-events-none opacity-80")}>
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 bg-transparent">
            Cancel
          </Button>
          <Button type="submit" className="flex-1">
            {enterLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
