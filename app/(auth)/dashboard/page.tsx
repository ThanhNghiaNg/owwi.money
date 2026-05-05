"use client"

import { Header } from "@/components/header"
import { ExpenseChart } from "@/components/dashboard/expense-chart"
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart"
import { useProfile } from "@/contexts/profile-context"
import { useLanguage } from "@/contexts/language-context"

function DashboardPage() {
  const { viewScope } = useProfile()
  const { t } = useLanguage()

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Header title={t("dashboard.title")} breadcrumbs={[{ name: t("dashboard.title") }]} />

      <div className="p-4 lg:p-6">
        {viewScope === "account" && (
          <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300">
            {t("dashboard.accountBanner")}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ExpenseChart />
          <CategoryPieChart />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
