"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart } from "@/components/charts/bar-chart"
import { useQuery } from "@tanstack/react-query"
import { query } from "@/api/query"
import { useProfile } from "@/contexts/profile-context"

export function ExpenseChart() {
  const { viewScope } = useProfile()
  const { data } = useQuery(query.transaction.statistic.weekly(viewScope))

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white">Weekly Expenses</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {viewScope === "account"
            ? "Aggregated weekly expense across all profiles"
            : "Weekly expense tracking for this profile"}
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <BarChart data={data} />
      </CardContent>
    </Card>
  )
}
