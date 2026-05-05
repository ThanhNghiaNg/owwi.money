"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart } from "@/components/charts/pie-chart"
import { useQuery } from "@tanstack/react-query"
import { query } from "@/api/query"
import { useMemo, useState } from "react"
import { PASTEL_COLORS } from "@/utils/constants/variables"
import { useProfile } from "@/contexts/profile-context"

export function CategoryPieChart() {
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const { viewScope } = useProfile()
  const { data } = useQuery(query.transaction.statistic.month(month, viewScope))
  const chartData = data?.data || []
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), [])
  const transformData = useMemo(
    () => chartData?.map((item, index) => ({
      name: item.name,
      value: item.totalAmount,
      color: PASTEL_COLORS[index % PASTEL_COLORS.length]
    })),
    [chartData]
  )

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-white flex justify-between">
          <p>Expense Categories</p>
          <select
            onChange={(e) => { setMonth(Number(e.target.value)) }}
            defaultValue={month}
            className="text-sm text-gray-500 dark:text-gray-400 bg-transparent border border-gray-300 dark:border-gray-700 rounded px-0 py-1"
          >
            {months.map((m) => <option key={m} value={m}>Tháng {m}</option>)}
          </select>
        </CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {viewScope === "account"
            ? "Month outcome breakdown across all profiles"
            : "Month outcome breakdown by category for this profile"}
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="w-full flex justify-center">
          <PieChart data={transformData} size={260} />
        </div>
      </CardContent>
    </Card>
  )
}
