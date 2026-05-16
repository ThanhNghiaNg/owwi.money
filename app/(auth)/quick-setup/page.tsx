"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DotLoader } from "@/components/ui/skeleton/dot-loader"
import { QuickTransactionSetupModal } from "@/components/modals/quick-transaction-setup-modal"
import { mutation } from "@/api/mutate"
import { query } from "@/api/query"
import { QuickTransactionSetupResponse } from "@/api/types"
import { useLanguage } from "@/contexts/language-context"
import { Pencil, PlusIcon, Trash2 } from "lucide-react"

function colorToRgba(color: string, alpha = 0.8) {
  const hex = color.replace("#", "")
  if (hex.length !== 6) return color
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export default function QuickSetupPage() {
  const { t } = useLanguage()
  const { data, isFetching } = useQuery(query.quickTransactionSetup.getAll())
  const { mutateAsync: deleteSetup } = mutation.quickTransactionSetup.delete()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSetup, setEditingSetup] = useState<QuickTransactionSetupResponse | null>(null)
  const setups = data?.data || []

  const openAddModal = () => {
    setEditingSetup(null)
    setIsModalOpen(true)
  }

  const openEditModal = (setup: QuickTransactionSetupResponse) => {
    setEditingSetup(setup)
    setIsModalOpen(true)
  }

  const handleDelete = async (setup: QuickTransactionSetupResponse) => {
    const ok = window.confirm(t("quickSetup.deleteConfirm", { title: setup.title }))
    if (!ok) return

    try {
      await deleteSetup(setup._id)
      toast.success(t("quickSetup.deleteSuccess"))
    } catch (error) {
      toast.error(t("quickSetup.deleteError"))
    }
  }

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      {isFetching && <DotLoader />}
      <Header title={t("quickSetup.title")} breadcrumbs={[{ name: t("quickSetup.title") }]} />
      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("quickSetup.title")}</CardTitle>
              <Button onClick={openAddModal}>
                <span className="mr-2"><PlusIcon size={18} /></span>
                {t("quickSetup.add")}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("table.no")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("quickSetup.titleField")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("quickSetup.preview")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("transactions.amount")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("transactions.type")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("transactions.category")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white truncate">{t("transactions.partner")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("table.description")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("table.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {setups.map((setup, index) => (
                    <tr key={setup._id} className="border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white">
                      <td className="px-3 py-2 sm:py-3 sm:px-4 truncate">{index + 1}</td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4 truncate font-medium">{setup.title}</td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4 truncate">
                        <span
                          className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-white"
                          style={{ backgroundColor: colorToRgba(setup.color), borderColor: setup.color }}
                        >
                          {setup.title}
                        </span>
                      </td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4 truncate">{setup.amount.toLocaleString()}đ</td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4 truncate">{setup.type?.name}</td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4 truncate">{setup.category?.name}</td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4 truncate">{setup.partner?.name}</td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4 truncate">{setup.description}</td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4 truncate">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" onClick={() => openEditModal(setup)} title={t("transactions.edit")}>
                            <span className="text-blue-600"><Pencil size={18} /></span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(setup)} title={t("transactions.delete")}>
                            <span className="text-red-600"><Trash2 size={18} /></span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!setups.length && (
                    <tr>
                      <td colSpan={9} className="px-3 py-8 sm:px-4 text-center text-gray-500 dark:text-gray-400">{t("quickSetup.empty")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <QuickTransactionSetupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        setup={editingSetup}
      />
    </div>
  )
}
