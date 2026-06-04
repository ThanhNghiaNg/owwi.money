"use client"

import { useCallback, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddTransactionModal } from "@/components/modals/add-transaction-modal"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { query } from "@/api/query"
import { formatDate } from "@/utils/formats/date"
import TableLoadMore from "@/components/table/pagination"
import { usePagination } from "@/components/table/usePagination"
import { EditTransactionModal } from "@/components/modals/edit-transaction-modal"
import { DeleteTransactionModal } from "@/components/modals/delete-transaction-modal"
import { DotLoader } from "@/components/ui/skeleton/dot-loader"
import { TransactionResponse } from "@/api/types"
import { Captions, CaptionsOff, EyeIcon, EyeOff, Pencil, PlusIcon, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import TableFilter, { FilterOption } from "@/components/table/filter"
import { useProfile } from "@/contexts/profile-context"
import { useLanguage } from "@/contexts/language-context"
import toast from "react-hot-toast"

function formatInputDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function getCurrentMonthDateRange() {
  const now = new Date()
  return {
    startDate: formatInputDate(new Date(now.getFullYear(), now.getMonth(), 1)),
    endDate: formatInputDate(new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  }
}

function TransactionsPage() {
  const [filters, setFilters] = useState<{ [key: string]: string | number | boolean }>(() => getCurrentMonthDateRange())
  const { viewScope, activeProfileId, activeProfile } = useProfile()
  const { t } = useLanguage()

  const pagination = usePagination()
  const { limit, setLimit } = pagination

  const queryParams = useMemo(() => ({ limit, filters, scope: viewScope }), [limit, filters, viewScope])

  const {
    data,
    fetchNextPage,
    isError,
    isFetching,
    isRefetching,
  } = useInfiniteQuery(query.transaction.getAllTransaction(queryParams))

  const { data: partners = [], isFetching: isFetchingPartners } = useQuery(query.partner.getAll())
  const { data: categories = [], isFetching: isFetchingCategories } = useQuery(query.category.getAll())
  const { data: types = [], isFetching: isFetchingTypes } = useQuery(query.type.getAll())

  const isFetchingFilters = isFetchingPartners || isFetchingCategories || isFetchingTypes

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [showSupportLine, setShowSupportLine] = useState(true)
  const [hideSensitive, setHideSensitive] = useState(true)
  const [editTransaction, setEditTransaction] = useState<TransactionResponse | null>(null)
  const [deleteTransactionId, setDeleteTransactionId] = useState<string>("")

  const tableData = useMemo(() => data?.pages?.flatMap(page => page?.data) || [], [data?.pages])

  const filterOptions: FilterOption[] = useMemo(() => [
    {
      label: t("transactions.startDate"), name: "startDate", type: "date"
    },
    {
      label: t("transactions.endDate"), name: "endDate", type: "date"
    },
    {
      label: t("transactions.category"), name: "category", type: "combobox", options: categories.map(c => ({ value: c._id, label: c.name }))
    },
    {
      label: t("transactions.partner"), name: "partner", type: "combobox", options: partners.map(p => ({ value: p._id, label: p.name }))
    },
    {
      label: t("transactions.type"), name: "type", type: "combobox", options: types.map(t => ({ value: t._id, label: t.name }))
    },
    {
      label: t("transactions.description"), name: "description", type: "text"
    },
  ], [categories, partners, types, t])

  const onDeleteTransaction = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const transactionId = e.currentTarget.dataset.id
    if (!transactionId) return

    const transaction = tableData.find(t => t._id === transactionId)
    const canManage = transaction?.createdByProfile?._id === activeProfileId
    if (!canManage) {
      toast.error(t("transactions.switchToDelete"))
      return
    }

    setDeleteTransactionId(transactionId)
  }, [tableData, activeProfileId, t])

  const onEditTransaction = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const transactionId = e.currentTarget.dataset.id
    if (!transactionId) return
    const transaction = tableData.find(t => t._id === transactionId)
    const canManage = transaction?.createdByProfile?._id === activeProfileId
    if (!canManage) {
      toast.error(t("transactions.switchToEdit"))
      return
    }
    if (transaction) {
      setEditTransaction(transaction)
    }
  }, [tableData, activeProfileId, t])

  const onDoubleClickRow = useCallback((e: React.MouseEvent<HTMLTableRowElement>) => {
    const transactionId = e.currentTarget.dataset.id
    if (!transactionId) return
    const transaction = tableData.find(t => t._id === transactionId)
    const canManage = transaction?.createdByProfile?._id === activeProfileId
    if (!canManage) {
      return
    }
    if (transaction) {
      setEditTransaction(transaction)
    }
  }, [tableData, activeProfileId])

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "income":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "outcome":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "loan":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "borrow":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  let border = ""
  let totalOutcome = 0

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      {(isRefetching || isFetching) && <DotLoader />}
      <Header title={t("transactions.title")} breadcrumbs={[{ name: t("transactions.title") }]} />

      <div className="p-1 sm:p-6">
        <Card >
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle>{t("transactions.recent")}</CardTitle>
                {viewScope === "account" && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {t("transactions.accountHint")}
                  </p>
                )}
              </div>
              <div className="flex md:flex-row items-center space-x-2 w-full md:w-auto md:mt-0 mt-4">
                <Button onClick={() => setHideSensitive(prev => !prev)} title={t("transactions.showSensitive")}>
                  <span>{hideSensitive ? <EyeIcon size={18} /> : <EyeOff size={18} />}</span>
                </Button>
                <Button onClick={() => setShowSupportLine(prev => !prev)} title={t("transactions.showSupportLine")}>
                  <span>{showSupportLine ? <Captions size={18} /> : <CaptionsOff size={18} />}</span>
                </Button>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  title={viewScope === "account" ? t("transactions.createUnder", { name: activeProfile?.name || "active profile" }) : t("transactions.add")}
                >
                  <span><PlusIcon size={18} /></span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <TableFilter disableEnter={isFetchingFilters} className="relative mb-6" enterLabel={t("transactions.search")} resetLabel={t("transactions.resetToThisMonth")} filters={filters} setFilters={setFilters} defaultFilters={getCurrentMonthDateRange()} filterOptions={filterOptions} />

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-400 dark:border-gray-700">
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("transactions.no")}</th>
                    {viewScope === "account" && <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("transactions.profile")}</th>}
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("transactions.category")}</th>
                    {/* <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("transactions.partner")}</th> */}
                    {/* <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("transactions.type")}</th> */}
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("transactions.date")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("transactions.amount")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white max-w-52">{t("transactions.description")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("transactions.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {isError || !tableData ? null : tableData?.map((transaction, index) => {
                    border = index !== tableData.length - 1 && transaction.date !== tableData[index + 1].date ? "border-t border-gray-300 dark:border-gray-700" : ""
                    totalOutcome += transaction.type.name.toLowerCase() === "outcome" ? transaction.amount : 0
                    const canManage = transaction.createdByProfile?._id === activeProfileId
                    return (
                      <tr key={transaction._id} data-id={transaction._id} className={cn("border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white", showSupportLine && border)} onDoubleClick={onDoubleClickRow}>
                        <td className="px-3 py-2 sm:py-3 sm:px-4">{index}</td>
                        {viewScope === "account" && (
                          <td className="px-3 py-2 sm:py-3 sm:px-4">
                            {transaction.createdByProfile?.name ? (
                              <Badge className={`${getTypeColor("")}`}>{transaction.createdByProfile.name}</Badge>
                            ) : (
                              <Badge className={`${getTypeColor("")}`}>{t("transactions.legacy")}</Badge>
                            )}
                          </td>
                        )}
                        <td className="px-3 py-2 sm:py-3 sm:px-4 truncate">{transaction.category.name}</td>
                        {/* <td className="px-3 py-2 sm:py-3 sm:px-4">{transaction.partner.name}</td> */}
                        {/* <td className="px-3 py-2 sm:py-3 sm:px-4">
                          <Badge className={`${getTypeColor(transaction.type.name)}`}>{transaction.type.name}</Badge>
                        </td> */}
                        <td className="px-3 py-2 sm:py-3 sm:px-4">{formatDate(transaction.date, "dd/mm/yyyy")}</td>
                        <td className="px-3 py-2 sm:py-3 sm:px-4">
                          {transaction.type.name.toLowerCase() === "income" && hideSensitive ? "******" : transaction.amount.toLocaleString()}đ
                        </td>
                        <td className="px-3 py-2 sm:py-3 sm:px-4 truncate max-w-52">{transaction.description}</td>
                        <td className="px-3 py-2 sm:py-3 sm:px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" data-id={transaction._id} onClick={onEditTransaction} disabled={!canManage} title={canManage ? t("transactions.edit") : t("transactions.switchToEdit")}>
                              <span className={canManage ? "text-blue-600" : "text-gray-400"}><Pencil size={18} /></span>
                            </Button>
                            <Button variant="ghost" size="sm" data-id={transaction._id} onClick={onDeleteTransaction} disabled={!canManage} title={canManage ? t("transactions.delete") : t("transactions.switchToDelete")}>
                              <span className={canManage ? "text-red-600" : "text-gray-400"}><Trash2 size={18} /></span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  <tr className={cn("border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white", showSupportLine && border)}>
                    <td className="px-3 py-2 sm:py-3 sm:px-4"></td>
                    {viewScope === "account" && <td className="px-3 py-2 sm:py-3 sm:px-4"></td>}
                    <td className="px-3 py-2 sm:py-3 sm:px-4"></td>
                    <td className="px-3 py-2 sm:py-3 sm:px-4"></td>
                    <td className="px-3 py-2 sm:py-3 sm:px-4"></td>
                    <td className="px-3 py-2 sm:py-3 sm:px-4">{t("transactions.totalOutcome")}</td>
                    <td className="px-3 py-2 sm:py-3 sm:px-4">{totalOutcome.toLocaleString()}đ</td>
                    <td className="px-3 py-2 sm:py-3 sm:px-4"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {data?.pages[data?.pages?.length - 1].hasNextPage && <TableLoadMore fetchNextPage={fetchNextPage} isLoading={isFetching} setLimit={setLimit} defaultLimit={limit} />}
          </CardContent>
        </Card>
      </div>
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        queryKey={queryParams}
        viewScope={viewScope}
        activeProfileName={activeProfile?.name}
      />
      {
        editTransaction &&
        <EditTransactionModal
          isOpen={!!editTransaction}
          onClose={() => setEditTransaction(null)}
          transaction={editTransaction}
          queryKey={queryParams}
        />
      }
      {
        deleteTransactionId &&
        <DeleteTransactionModal
          isOpen={!!deleteTransactionId}
          onClose={() => setDeleteTransactionId("")}
          id={deleteTransactionId}
          queryKey={queryParams}
        />
      }
    </div>
  )
}

export default TransactionsPage
