'use client';

import { query } from '@/api/query';
import { PieChart } from '@/components/charts/pie-chart';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';
import { Input } from '@/components/ui/input';
import { useProfile } from '@/contexts/profile-context';
import { currency } from '@/utils/formats/number';
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

type JarConfig = {
  id: string;
  name: string;
  targetPercent: number;
  categoryIds: string[];
};

type StatisticMonthResponse = {
  data?: Array<{
    name?: string;
    totalAmount?: number;
    color?: string;
  }>;
};

type MonthlyStatItem = {
  name?: string;
  totalAmount?: number;
  color?: string;
};

const STORAGE_KEY = 'owwi.newui:six-jars-config';

const DEFAULT_JARS: JarConfig[] = [
  { id: 'necessities', name: 'Thiết yếu', targetPercent: 55, categoryIds: [] },
  { id: 'education', name: 'Giáo dục', targetPercent: 10, categoryIds: [] },
  { id: 'play', name: 'Hưởng thụ', targetPercent: 10, categoryIds: [] },
  { id: 'financial-freedom', name: 'Tự do tài chính', targetPercent: 10, categoryIds: [] },
  { id: 'give', name: 'Cho đi', targetPercent: 5, categoryIds: [] },
  { id: 'long-term-saving', name: 'Tiết kiệm dài hạn', targetPercent: 10, categoryIds: [] },
];

const JAR_COLORS = ['#14B8A6', '#38BDF8', '#818CF8', '#F59E0B', '#F472B6', '#A3E635'];

function readSavedConfig() {
  if (typeof window === 'undefined') return DEFAULT_JARS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_JARS;
    const parsed = JSON.parse(raw) as JarConfig[];
    if (!Array.isArray(parsed) || parsed.length !== DEFAULT_JARS.length) {
      return DEFAULT_JARS;
    }
    return parsed;
  } catch {
    return DEFAULT_JARS;
  }
}

function writeSavedConfig(jars: JarConfig[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(jars));
}

function getStatValue(item: MonthlyStatItem) {
  return item.totalAmount ?? 0;
}

function getDayProgress() {
  const now = new Date();
  const passedDays = now.getDate();
  const totalDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  return { passedDays, totalDays };
}

export function SixJarsBuilder() {
  const { activeProfile, viewScope } = useProfile();
  const currentMonth = new Date().getMonth() + 1;
  const { data: categories = [] } = useQuery(query.category.getAll());
  const { data: monthlyStatsResponse } = useQuery(query.transaction.statistic.month(currentMonth, viewScope));
  const [savedJars, setSavedJars] = useState<JarConfig[]>(DEFAULT_JARS);
  const [draftJars, setDraftJars] = useState<JarConfig[]>(DEFAULT_JARS);
  const [editingJarId, setEditingJarId] = useState<string | null>(DEFAULT_JARS[0].id);

  useEffect(() => {
    const saved = readSavedConfig();
    setSavedJars(saved);
    setDraftJars(saved);
  }, []);

  const selectedCategoryIds = useMemo(
    () => draftJars.flatMap((jar) => jar.categoryIds),
    [draftJars]
  );

  const monthlyStats = ((monthlyStatsResponse as StatisticMonthResponse | undefined)?.data ?? []) as MonthlyStatItem[];

  const statsByCategoryName = useMemo(() => {
    const map = new Map<string, number>();
    monthlyStats.forEach((item) => {
      if (item.name) {
        map.set(item.name, getStatValue(item));
      }
    });
    return map;
  }, [monthlyStats]);

  const totalIncome = useMemo(() => 27000000, []);
  const { passedDays, totalDays } = useMemo(() => getDayProgress(), []);
  const averageDailyIncome = totalIncome / totalDays;

  const jarsWithMetrics = useMemo(() => {
    return draftJars.map((jar, index) => {
      const totalSpent = jar.categoryIds.reduce((sum, categoryId) => {
        const category = categories.find((item) => item._id === categoryId);
        if (!category?.name) return sum;
        return sum + (statsByCategoryName.get(category.name) || 0);
      }, 0);
      const expectedSpend = totalIncome * (jar.targetPercent / 100);
      const allowedToDate = totalDays > 0 ? (expectedSpend / totalDays) * passedDays : expectedSpend;

      let tone: 'default' | 'warning' | 'danger' = 'default';
      if (totalSpent > expectedSpend) {
        tone = 'danger';
      } else if (totalSpent > allowedToDate) {
        tone = 'warning';
      }

      return {
        ...jar,
        color: JAR_COLORS[index % JAR_COLORS.length],
        totalSpent,
        tone,
      };
    });
  }, [draftJars, passedDays, statsByCategoryName, totalIncome, totalDays, categories]);

  const currentJar = jarsWithMetrics.find((jar) => jar.id === editingJarId) || jarsWithMetrics[0];

  const assignedCategories = useMemo(
    () => categories.filter((category) => currentJar?.categoryIds.includes(category._id)),
    [categories, currentJar]
  );

  const availableCategoryOptions = useMemo(() => {
    if (!currentJar) return [];
    return categories
      .filter((category) => {
        if (currentJar.categoryIds.includes(category._id)) return false;
        return !selectedCategoryIds.includes(category._id);
      })
      .map((category) => ({
        value: category._id,
        label: category.name,
      }));
  }, [categories, currentJar, selectedCategoryIds]);

  const pieData = useMemo(
    () => jarsWithMetrics.map((jar) => ({ name: jar.name, value: jar.totalSpent, color: jar.color })),
    [jarsWithMetrics]
  );

  const updateJar = (jarId: string, updater: (jar: JarConfig) => JarConfig) => {
    setDraftJars((prev) => prev.map((jar) => (jar.id === jarId ? updater(jar) : jar)));
  };

  const handleAddCategory = (categoryId: string) => {
    if (!currentJar || !categoryId) return;
    updateJar(currentJar.id, (jar) => ({ ...jar, categoryIds: [...jar.categoryIds, categoryId] }));
  };

  const handleRemoveCategory = (jarId: string, categoryId: string) => {
    updateJar(jarId, (jar) => ({ ...jar, categoryIds: jar.categoryIds.filter((id) => id !== categoryId) }));
  };

  const handleSave = () => {
    try {
      setSavedJars(draftJars);
      writeSavedConfig(draftJars);
      toast.success('Đã lưu cấu hình 6 hũ')
    } catch {
      toast.error('Lưu cấu hình 6 hũ thất bại')
    }
  };

  const handleCancel = () => {
    setDraftJars(savedJars);
    toast.success('Đã hoàn tác thay đổi chưa lưu')
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 dark:bg-slate-950 md:px-6">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="h-fit self-start rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6 dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-5">
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">6 Jars</h1>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Gom nhóm category detail thành 6 hũ và preview cơ cấu chi tiêu ngay trên UI.
            </p>
          </div>

          <div className="space-y-3">
            {jarsWithMetrics.map((jar) => {
              const toneClass = jar.tone === 'danger'
                ? 'border-rose-300 bg-rose-50 dark:border-rose-800 dark:bg-rose-950/30'
                : jar.tone === 'warning'
                  ? 'border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30'
                  : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900';

              return (
                <div key={jar.id} className={`rounded-2xl border p-4 transition ${toneClass}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="inline-block h-3 w-3 rounded-full" style={{ backgroundColor: jar.color }} />
                        <h2 className="font-semibold text-slate-900 dark:text-white">{jar.name}</h2>
                      </div>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {jar.categoryIds.length} category · {currency(jar.totalSpent)}
                      </p>
                    </div>
                    <Button type="button" variant="outline" size="sm" onClick={() => setEditingJarId(jar.id)}>
                      Edit
                    </Button>
                  </div>

                  {editingJarId === jar.id && (
                    <div className="mt-4 space-y-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                      <div>
                        <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-200">Categories đã chọn</p>
                        <div className="flex flex-wrap gap-2">
                          {assignedCategories.length ? assignedCategories.map((category) => (
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
                          onChange={handleAddCategory}
                          placeholder="Chọn category chưa thuộc nhóm nào"
                        />
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                          % thu nhập
                          <span className="group relative inline-flex h-4 w-4 cursor-help items-center justify-center rounded-full bg-slate-200 text-[10px] text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                            i
                            <span className="absolute left-1/2 top-6 z-10 hidden w-56 -translate-x-1/2 rounded-xl bg-slate-900 px-3 py-2 text-xs text-white shadow-lg group-hover:block">
                              Phần trăm chi tiêu dự kiến trên thu nhập
                            </span>
                          </span>
                        </label>
                        <Input
                          type="number"
                          value={jar.targetPercent}
                          onChange={(event) => updateJar(jar.id, (item) => ({ ...item, targetPercent: Number(event.target.value || 0) }))}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button type="button" onClick={handleSave}>Save</Button>
            <Button type="button" variant="outline" onClick={handleCancel}>Hủy</Button>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Preview 6 hũ</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Pie chart mô phỏng từ grouping hiện tại {activeProfile ? `của ${activeProfile.name}` : ''}.
            </p>
          </div>
          <PieChart data={pieData} size={320} />
        </section>
      </div>
    </div>
  );
}
