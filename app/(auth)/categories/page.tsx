"use client"

import { useCallback, useMemo, useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddCategoryModal } from "@/components/modals/add-category-modal"
import { useQuery } from "@tanstack/react-query"
import { query } from "@/api/query"
import { getTypeColor } from "@/utils/constants/styles"
import { DotLoader } from "@/components/ui/skeleton/dot-loader"
import { CategoryResponse } from "@/api/types"
import { EditCategoryModal } from "@/components/modals/edit-category-modal"
import { DeleteCategoryModal } from "@/components/modals/delete-category-modal"
import { Building, Pencil, PlusIcon, Search, Trash2, User, X } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function CategoriesPage() {
  const { data: categories = [], isRefetching } = useQuery(query.category.getAll())
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [editCategory, setEditCategory] = useState<CategoryResponse | null>(null)
  const [deleteCategoryId, setDeleteCategoryId] = useState("")

  const filteredCategories = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase()
    if (!keyword) return categories
    return categories.filter((category) =>
      [category.name, category.description, category.type?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))
    )
  }, [categories, searchTerm])

  const onDeleteCategory = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const categoryId = e.currentTarget.dataset.id
    if (!categoryId) return

    setDeleteCategoryId(categoryId)
  }, [])

  const onEditCategory = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const categoryId = e.currentTarget.dataset.id
    if (!categoryId) return
    const category = categories.find(t => t._id === categoryId)
    if (category) {
      setEditCategory(category)
    }
  }, [categories])

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      {isRefetching && <DotLoader />}
      <Header title={t("categories.title")} breadcrumbs={[{ name: t("categories.title") }]} />
      <div className="p-1 sm:p-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t("categories.title")}</CardTitle>
              <Button onClick={() => setIsAddModalOpen(true)}>
                <span className="mr-2"><PlusIcon size={18} /></span>
                {t("categories.add")}
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <div className="relative mb-6">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"><Search size={18} /></span>
              <Input
                placeholder={t("categories.search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("table.no")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("table.name")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("table.type")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white truncate">{t("table.description")}</th>
                    <th className="text-left px-3 py-2 sm:py-3 sm:px-4 font-medium text-gray-900 dark:text-white">{t("table.actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category, index) => (
                    <tr key={category._id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="px-3 py-2 sm:py-3 sm:px-4 text-gray-900 dark:text-white">{index + 1}</td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-900 dark:text-white truncate">{category.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4">
                        <Badge className={getTypeColor(category.type.name)}>{category.type.name}</Badge>
                      </td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4">
                        <span className="text-gray-900 dark:text-white truncate">{category.description}</span>
                      </td>
                      <td className="px-3 py-2 sm:py-3 sm:px-4">
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm" data-id={category._id} onClick={onEditCategory} title={t("transactions.edit")}>
                            <span className="text-blue-600"><Pencil size={18} /></span>
                          </Button>
                          <Button variant="ghost" size="sm" data-id={category._id} onClick={onDeleteCategory} title={t("transactions.delete")}>
                            <span className="text-red-600"><Trash2 size={18} /></span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      <AddCategoryModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} />
      {
        editCategory &&
        <EditCategoryModal
          isOpen={!!editCategory}
          onClose={() => setEditCategory(null)}
          category={editCategory}
        />
      }
      {
        deleteCategoryId &&
        <DeleteCategoryModal
          isOpen={!!deleteCategoryId}
          onClose={() => setDeleteCategoryId("")}
          id={deleteCategoryId}
        />
      }
    </div>
  )
}
