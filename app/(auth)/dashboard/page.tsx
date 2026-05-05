"use client"

import { Header } from "@/components/header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { ExpenseChart } from "@/components/dashboard/expense-chart"
import { CategoryPieChart } from "@/components/dashboard/category-pie-chart"
import { useProfile } from "@/contexts/profile-context"

function DashboardPage() {
  const { viewScope } = useProfile()

  return (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900">
      <Header title="Dashboard" breadcrumbs={[{ name: "Dashboard" }]} />

      <div className="p-4 lg:p-6">
        {viewScope === "account" && (
          <div className="mb-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-700 dark:border-sky-900/60 dark:bg-sky-950/30 dark:text-sky-300">
            You are viewing aggregated account data across all profiles.
          </div>
        )}

        <div className="mb-6">
          <StatsCards />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ExpenseChart />
          <CategoryPieChart />
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
