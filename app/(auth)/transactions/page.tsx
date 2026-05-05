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
import toast from "react-hot-toast"

function TransactionsPage() {
  const [filters, setFilters] = useState<{ [key: string]: string | number | boolean }>({})
  const { viewScope, activeProfileId, activeProfile } = useProfile()

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
      label: "Category", name: "category", type: "combobox", options: categories.map(c => ({ value: c._id, label: c.name }))
    },
    {
      label: "Partner", name: "partner", type: "combobox", options: partners.map(p => ({ value: p._id, label: p.name }))
    },
    {
      label: "Type", name: "type", type: "combobox", options: types.map(t => ({ value: t._id, label: t.name }))
    },
    {
      label: "Description", name: "description", type: "text"
    },
  ], [categories, partners, types])

  const onDeleteTransaction = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const transactionId = e.currentTarget.dataset.id
    if (!transactionId) return

    const transaction = tableData.find(t => t._id === transactionId)
    const canManage = transaction?.createdByProfile?._id === activeProfileId
    if (!canManage) {
      toast.error("Switch to that profile to delete this transaction.")
      return
    }

    setDeleteTransactionId(transactionId)
  }, [tableData, activeProfileId])

  const onEditTransaction = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const transactionId = e.currentTarget.dataset.id
    if (!transactionId) return
    const transaction = tableData.find(t => t._id === transactionId)
    const canManage = transaction?.createdByProfile?._id === activeProfileId
    if (!canManage) {
      toast.error("Switch to that profile to edit this transaction.")
      return
    }
    if (transaction) {
      setEditTransaction(transaction)
    }
  }, [tableData, activeProfileId])

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
      <Header title="Transactions" breadcrumbs={[{ name: "Transactions" }]} />

      <div className="p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                {viewScope === "account" && (
                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Viewing all profiles. New transactions will still be created under the active profile,
                    and you can only edit or delete transactions from that profile.
                  </p>
                )}
              </div>
              <div className="flex md:flex-row items-center space-x-2 w-full md:w-auto md:mt-0 mt-4">
                <Button onClick={() => setHideSensitive(prev => !prev)} title="Show sensitive information">
                  <span>{hideSensitive ? <EyeIcon size={18} /> : <EyeOff size={18} />}</span>
                </Button>
                <Button onClick={() => setShowSupportLine(prev => !prev)} title="Show support line">
                  <span>{showSupportLine ? <Captions size={18} /> : <CaptionsOff size={18} />}</span>
                </Button>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  title={viewScope === "account" ? `Create under ${activeProfile?.name || "active profile"}` : "Add transaction"}
                >
                  <span><PlusIcon size={18} /></span>
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <TableFilter disableEnter={isFetchingFilters} className="relative mb-6" enterLabel="Search" filters={filters} setFilters={setFilters} filterOptions={filterOptions} />

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-400 dark:border-gray-700">
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">No</th>
                    {viewScope === "account" && <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Profile</th>}
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Partner</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isError || !tableData ? null : tableData?.map((transaction, index) => {
                    border = index !== tableData.length - 1 && transaction.date !== tableData[index + 1].date ? "border-t border-gray-300 dark:border-gray-700" : ""
                    totalOutcome += transaction.type.name.toLowerCase() === "outcome" ? transaction.amount : 0
                    const canManage = transaction.createdByProfile?._id === activeProfileId
                    return (
                      <tr key={transaction._id} data-id={transaction._id} className={cn("border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white", showSupportLine && border)} onDoubleClick={onDoubleClickRow}>
                        <td className="py-3 px-4">{index}</td>
                        {viewScope === "account" && (
                          <td className="py-3 px-4">
                            {transaction.createdByProfile?.name ? (
                              <Badge variant="outline">{transaction.createdByProfile.name}</Badge>
                            ) : (
                              <Badge variant="outline">Legacy</Badge>
                            )}
                          </td>
                        )}
                        <td className="py-3 px-4">{transaction.category.name}</td>
                        <td className="py-3 px-4">{transaction.partner.name}</td>
                        <td className="py-3 px-4">
                          <Badge className={`${getTypeColor(transaction.type.name)}`}>{transaction.type.name}</Badge>
                        </td>
                        <td className="py-3 px-4">{formatDate(transaction.date, "dd/mm/yyyy")}</td>
                        <td className="py-3 px-4">
                          {transaction.type.name.toLowerCase() === "income" && hideSensitive ? "******" : transaction.amount.toLocaleString()}đ
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" data-id={transaction._id} onClick={onEditTransaction} disabled={!canManage} title={canManage ? "Edit transaction" : "Switch to that profile to edit"}>
                              <span className={canManage ? "text-blue-600" : "text-gray-400"}><Pencil size={18} /></span>
                            </Button>
                            <Button variant="ghost" size="sm" data-id={transaction._id} onClick={onDeleteTransaction} disabled={!canManage} title={canManage ? "Delete transaction" : "Switch to that profile to delete"}>
                              <span className={canManage ? "text-red-600" : "text-gray-400"}><Trash2 size={18} /></span>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                  <tr className={cn("border-b border-gray-100 dark:border-gray-800 text-gray-900 dark:text-white", showSupportLine && border)}>
                    <td className="py-3 px-4"></td>
                    {viewScope === "account" && <td className="py-3 px-4"></td>}
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4"></td>
                    <td className="py-3 px-4">Tổng chi:</td>
                    <td className="py-3 px-4">{totalOutcome.toLocaleString()}đ</td>
                    <td className="py-3 px-4"></td>
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
