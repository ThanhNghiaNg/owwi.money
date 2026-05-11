'use client';

import { mutation } from '@/api/mutate';
import { query } from '@/api/query';
import type { CategoryResponse, SixJarConfigItem, SixJarStatisticItem } from '@/api/types';
import { PieChart } from '@/components/charts/pie-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { currency } from '@/utils/formats/number';
import { useQuery } from '@tanstack/react-query';
import { Check, Pencil } from 'lucide-react';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

type JarConfig = SixJarConfigItem;

const JAR_COLORS = ['#14B8A6', '#38BDF8', '#818CF8', '#F59E0B', '#F472B6', '#A3E635'];

function buildFallbackJarsFromStatistic(statisticJars: SixJarStatisticItem[]): JarConfig[] {
  return statisticJars.map((jar) => ({
    id: jar.id,
    name: jar.name,
    plannedAmount: jar.plannedAmount,
    categoryIds: jar.categoryIds,
  }));
}

export function SixJarsBuilder() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const { data: categories = [] } = useQuery(query.category.getAll());
  const { data: configResponse } = useQuery(query.sixJars.config());
  const { data: statisticResponse } = useQuery(query.sixJars.monthStatistic(currentMonth, currentYear));
  const { mutateAsync: updateConfigMutation, isPending: isSaving } = mutation.sixJars.updateConfig();
  const [draftJars, setDraftJars] = useState<JarConfig[]>([]);
  const [editingJarId, setEditingJarId] = useState<string | null>(null);

  const savedJars = useMemo(() => {
    if (configResponse?.jars?.length) {
      return configResponse.jars;
    }
    if (statisticResponse?.jars?.length) {
      return buildFallbackJarsFromStatistic(statisticResponse.jars);
    }
    return [];
  }, [configResponse, statisticResponse]);

  useEffect(() => {
    if (savedJars.length) {
      setDraftJars(savedJars);
    }
  }, [savedJars]);

  const selectedCategoryIds = useMemo(
    () => draftJars.flatMap((jar) => jar.categoryIds),
    [draftJars]
  );

  const jarsWithMetrics = useMemo(() => {
    const statisticMap = new Map((statisticResponse?.jars || []).map((jar) => [jar.id, jar]));

    return draftJars.map((jar, index) => {
      const statisticJar = statisticMap.get(jar.id);
      return {
        ...jar,
        color: JAR_COLORS[index % JAR_COLORS.length],
        totalSpent: statisticJar?.totalSpent || 0,
        allowedToDate: statisticJar?.allowedToDate || 0,
        tone: statisticJar?.tone || 'default',
      };
    });
  }, [draftJars, statisticResponse]);

  const pieData = useMemo(
    () => jarsWithMetrics.map((jar) => ({ name: jar.name, value: jar.totalSpent, color: jar.color })),
    [jarsWithMetrics]
  );

  const updateJar = (jarId: string, updater: (jar: JarConfig) => JarConfig) => {
    setDraftJars((prev) => prev.map((jar) => (jar.id === jarId ? updater(jar) : jar)));
  };

  const getAssignedCategories = (jar: JarConfig) => {
    return categories.filter((category) => jar.categoryIds.includes(category._id));
  };

  const getAvailableCategoryOptions = (jar: JarConfig) => {
    return categories
      .filter((category) => {
        if (jar.categoryIds.includes(category._id)) return false;
        return !selectedCategoryIds.includes(category._id);
      })
      .map((category) => ({
        value: category._id,
        label: category.name,
      }));
  };

  const handleAddCategory = (jarId: string, categoryId: string) => {
    if (!categoryId) return;
    updateJar(jarId, (jar) => ({ ...jar, categoryIds: [...jar.categoryIds, categoryId] }));
  };

  const handleRemoveCategory = (jarId: string, categoryId: string) => {
    updateJar(jarId, (jar) => ({ ...jar, categoryIds: jar.categoryIds.filter((id) => id !== categoryId) }));
  };

  const handleToggleEdit = async (jarId: string) => {
    if (editingJarId === jarId) {
      try {
        const response = await updateConfigMutation({ jars: draftJars });
        setDraftJars(response.jars);
        setEditingJarId(null);
        toast.success('Đã lưu cấu hình 6 hũ');
      } catch (error: any) {
        toast.error(error?.response?.data?.message || 'Lưu cấu hình 6 hũ thất bại');
      }
      return;
    }

    setEditingJarId(jarId);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">6 Jars</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Gom nhóm category detail thành 6 hũ theo account scope.
            </p>
          </div>

          <div className="space-y-3">
            {jarsWithMetrics.map((jar) => {
              const toneClass = jar.tone === 'danger'
                ? 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30'
                : jar.tone === 'warning'
                  ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900';
              const assignedCategories = getAssignedCategories(jar);
              const availableCategoryOptions = getAvailableCategoryOptions(jar);
              const isEditing = editingJarId === jar.id;
              const progressPercent = jar.plannedAmount > 0 ? Math.min((jar.totalSpent / jar.plannedAmount) * 100, 100) : 0;
              const progressBarClass = jar.tone === 'danger'
                ? 'bg-rose-500'
                : jar.tone === 'warning'
                  ? 'bg-amber-400'
                  : 'bg-emerald-500';

              return (
                <div key={jar.id} className={`rounded-2xl border p-4 transition ${toneClass}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: jar.color }} />
                        <h2 className="font-semibold text-slate-900 dark:text-white">{jar.name}</h2>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {jar.categoryIds.length} category · {currency(jar.totalSpent)} / {currency(jar.plannedAmount)}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => void handleToggleEdit(jar.id)}
                      className="h-9 w-9"
                      disabled={isSaving}
                    >
                      {isEditing ? <Check className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
                    </Button>
                  </div>

                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                    <div
                      className={`h-full rounded-full transition-all ${progressBarClass}`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  {isEditing && (
                    <div className="mt-4 space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                      <div>
                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Categories đã chọn</p>
                        <div className="flex flex-wrap gap-2">
                          {assignedCategories.length ? assignedCategories.map((category: CategoryResponse) => (
                            <span key={category._id} className="relative inline-flex">
                              <Badge className="bg-sky-100 pr-6 text-sky-700 dark:bg-sky-900/40 dark:text-sky-200">
                                {category.name}
                              </Badge>
                              <button
                                type="button"
                                onClick={() => handleRemoveCategory(jar.id, category._id)}
                                className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-700 dark:bg-slate-700 dark:text-white"
                              >
                                ×
                              </button>
                            </span>
                          )) : <p className="text-sm text-slate-400">Chưa có category nào.</p>}
                        </div>
                      </div>

                      <div>
                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Thêm category</p>
                        <Combobox
                          options={availableCategoryOptions}
                          value=""
                          onChange={(value) => handleAddCategory(jar.id, value)}
                          placeholder="Chọn category chưa thuộc nhóm nào"
                        />
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          Số tiền dự kiến dùng trong tháng
                        </label>
                        <Input
                          type="number"
                          value={jar.plannedAmount}
                          onChange={(event) => updateJar(jar.id, (item) => ({ ...item, plannedAmount: Number(event.target.value || 0) }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="h-fit self-center rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Preview 6 hũ</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Pie chart theo config account hiện tại.
            </p>
          </div>
          <PieChart data={pieData} size={320} />
        </section>
      </div>
    </div>
  );
}
