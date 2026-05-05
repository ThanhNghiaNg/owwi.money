"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"

export type Language = "vi" | "en" | "zh-TW" | "zh-CN" | "ja" | "ko"

type Dictionary = Record<string, string>

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
  languages: { code: Language; label: string }[]
}

const STORAGE_KEY = "owwimoney.language"

const dictionaries: Record<Language, Dictionary> = {
  vi: {
    "nav.dashboard": "Tổng quan",
    "nav.transactions": "Giao dịch",
    "nav.partners": "Đối tác",
    "nav.categories": "Danh mục",
    "nav.sixJars": "6 Hũ",
    "nav.more": "Thêm",
    "nav.activeProfile": "Profile đang dùng",
    "nav.chooseProfile": "Chọn profile",
    "nav.switchProfile": "Đổi profile",
    "nav.darkMode": "Chế độ tối",
    "nav.lightMode": "Chế độ sáng",
    "nav.logout": "Đăng xuất",
    "header.home": "Trang chủ",
    "header.currentProfile": "Profile hiện tại",
    "header.notSelected": "Chưa chọn",
    "header.thisProfile": "Profile này",
    "header.allProfiles": "Tất cả profile",
    "dashboard.title": "Tổng quan",
    "dashboard.accountBanner": "Bạn đang xem dữ liệu tổng hợp của toàn bộ account trên tất cả profile.",
    "dashboard.weeklyExpenses": "Chi tiêu theo tuần",
    "dashboard.monthlyExpenses": "Chi tiêu theo tháng",
    "dashboard.expenseAcrossProfilesWeeks": "So sánh chi tiêu của tất cả profile trong các tuần gần đây",
    "dashboard.expenseAcrossProfilesMonths": "So sánh chi tiêu của tất cả profile trong các tháng gần đây",
    "dashboard.expenseThisProfileWeeks": "So sánh chi tiêu của profile này trong các tuần gần đây",
    "dashboard.expenseThisProfileMonths": "So sánh chi tiêu của profile này trong các tháng gần đây",
    "dashboard.weekly": "Theo tuần",
    "dashboard.monthly": "Theo tháng",
    "dashboard.expenseCategories": "Danh mục chi tiêu",
    "dashboard.categoryBreakdownAll": "Cơ cấu chi tiêu theo danh mục của tất cả profile trong tháng",
    "dashboard.categoryBreakdownProfile": "Cơ cấu chi tiêu theo danh mục của profile này trong tháng",
    "common.language": "Ngôn ngữ",
    "lang.vi": "Tiếng Việt",
    "lang.en": "English",
    "lang.zh-TW": "繁體中文",
    "lang.zh-CN": "简体中文",
    "lang.ja": "日本語",
    "lang.ko": "한국어"
  },
  en: {
    "nav.dashboard": "Dashboard",
    "nav.transactions": "Transactions",
    "nav.partners": "Partners",
    "nav.categories": "Categories",
    "nav.sixJars": "Six Jars",
    "nav.more": "More",
    "nav.activeProfile": "Active Profile",
    "nav.chooseProfile": "Choose profile",
    "nav.switchProfile": "Switch profile",
    "nav.darkMode": "Dark Mode",
    "nav.lightMode": "Light Mode",
    "nav.logout": "Logout",
    "header.home": "Home",
    "header.currentProfile": "Current profile",
    "header.notSelected": "Not selected",
    "header.thisProfile": "This profile",
    "header.allProfiles": "All profiles",
    "dashboard.title": "Dashboard",
    "dashboard.accountBanner": "You are viewing aggregated account data across all profiles.",
    "dashboard.weeklyExpenses": "Weekly Expenses",
    "dashboard.monthlyExpenses": "Monthly Expenses",
    "dashboard.expenseAcrossProfilesWeeks": "Expense comparison across all profiles over recent weeks",
    "dashboard.expenseAcrossProfilesMonths": "Expense comparison across all profiles over recent months",
    "dashboard.expenseThisProfileWeeks": "Expense comparison for this profile over recent weeks",
    "dashboard.expenseThisProfileMonths": "Expense comparison for this profile over recent months",
    "dashboard.weekly": "Weekly",
    "dashboard.monthly": "Monthly",
    "dashboard.expenseCategories": "Expense Categories",
    "dashboard.categoryBreakdownAll": "Month outcome breakdown across all profiles",
    "dashboard.categoryBreakdownProfile": "Month outcome breakdown by category for this profile",
    "common.language": "Language",
    "lang.vi": "Tiếng Việt",
    "lang.en": "English",
    "lang.zh-TW": "繁體中文",
    "lang.zh-CN": "简体中文",
    "lang.ja": "日本語",
    "lang.ko": "한국어"
  },
  "zh-TW": {
    "nav.dashboard": "儀表板",
    "nav.transactions": "交易",
    "nav.partners": "夥伴",
    "nav.categories": "分類",
    "nav.sixJars": "六罐",
    "nav.more": "更多",
    "nav.activeProfile": "目前 Profile",
    "nav.chooseProfile": "選擇 Profile",
    "nav.switchProfile": "切換 Profile",
    "nav.darkMode": "深色模式",
    "nav.lightMode": "淺色模式",
    "nav.logout": "登出",
    "header.home": "首頁",
    "header.currentProfile": "目前 Profile",
    "header.notSelected": "未選擇",
    "header.thisProfile": "此 Profile",
    "header.allProfiles": "所有 Profile",
    "dashboard.title": "儀表板",
    "dashboard.accountBanner": "你正在查看所有 Profile 的彙總帳戶資料。",
    "dashboard.weeklyExpenses": "每週支出",
    "dashboard.monthlyExpenses": "每月支出",
    "dashboard.expenseAcrossProfilesWeeks": "比較所有 Profile 最近幾週的支出",
    "dashboard.expenseAcrossProfilesMonths": "比較所有 Profile 最近幾個月的支出",
    "dashboard.expenseThisProfileWeeks": "比較此 Profile 最近幾週的支出",
    "dashboard.expenseThisProfileMonths": "比較此 Profile 最近幾個月的支出",
    "dashboard.weekly": "每週",
    "dashboard.monthly": "每月",
    "dashboard.expenseCategories": "支出分類",
    "dashboard.categoryBreakdownAll": "所有 Profile 的當月分類支出分佈",
    "dashboard.categoryBreakdownProfile": "此 Profile 的當月分類支出分佈",
    "common.language": "語言",
    "lang.vi": "Tiếng Việt",
    "lang.en": "English",
    "lang.zh-TW": "繁體中文",
    "lang.zh-CN": "简体中文",
    "lang.ja": "日本語",
    "lang.ko": "한국어"
  },
  "zh-CN": {
    "nav.dashboard": "仪表盘",
    "nav.transactions": "交易",
    "nav.partners": "伙伴",
    "nav.categories": "分类",
    "nav.sixJars": "六罐",
    "nav.more": "更多",
    "nav.activeProfile": "当前 Profile",
    "nav.chooseProfile": "选择 Profile",
    "nav.switchProfile": "切换 Profile",
    "nav.darkMode": "深色模式",
    "nav.lightMode": "浅色模式",
    "nav.logout": "退出登录",
    "header.home": "首页",
    "header.currentProfile": "当前 Profile",
    "header.notSelected": "未选择",
    "header.thisProfile": "这个 Profile",
    "header.allProfiles": "所有 Profile",
    "dashboard.title": "仪表盘",
    "dashboard.accountBanner": "你正在查看所有 Profile 的聚合账户数据。",
    "dashboard.weeklyExpenses": "每周支出",
    "dashboard.monthlyExpenses": "每月支出",
    "dashboard.expenseAcrossProfilesWeeks": "对比所有 Profile 最近几周的支出",
    "dashboard.expenseAcrossProfilesMonths": "对比所有 Profile 最近几个月的支出",
    "dashboard.expenseThisProfileWeeks": "对比这个 Profile 最近几周的支出",
    "dashboard.expenseThisProfileMonths": "对比这个 Profile 最近几个月的支出",
    "dashboard.weekly": "每周",
    "dashboard.monthly": "每月",
    "dashboard.expenseCategories": "支出分类",
    "dashboard.categoryBreakdownAll": "所有 Profile 的当月分类支出分布",
    "dashboard.categoryBreakdownProfile": "这个 Profile 的当月分类支出分布",
    "common.language": "语言",
    "lang.vi": "Tiếng Việt",
    "lang.en": "English",
    "lang.zh-TW": "繁體中文",
    "lang.zh-CN": "简体中文",
    "lang.ja": "日本語",
    "lang.ko": "한국어"
  },
  ja: {
    "nav.dashboard": "ダッシュボード",
    "nav.transactions": "取引",
    "nav.partners": "パートナー",
    "nav.categories": "カテゴリ",
    "nav.sixJars": "6つの瓶",
    "nav.more": "その他",
    "nav.activeProfile": "現在のプロフィール",
    "nav.chooseProfile": "プロフィールを選択",
    "nav.switchProfile": "プロフィールを切り替え",
    "nav.darkMode": "ダークモード",
    "nav.lightMode": "ライトモード",
    "nav.logout": "ログアウト",
    "header.home": "ホーム",
    "header.currentProfile": "現在のプロフィール",
    "header.notSelected": "未選択",
    "header.thisProfile": "このプロフィール",
    "header.allProfiles": "すべてのプロフィール",
    "dashboard.title": "ダッシュボード",
    "dashboard.accountBanner": "すべてのプロフィールをまたいだ集計アカウントデータを表示しています。",
    "dashboard.weeklyExpenses": "週間支出",
    "dashboard.monthlyExpenses": "月間支出",
    "dashboard.expenseAcrossProfilesWeeks": "全プロフィールの直近数週間の支出比較",
    "dashboard.expenseAcrossProfilesMonths": "全プロフィールの直近数か月の支出比較",
    "dashboard.expenseThisProfileWeeks": "このプロフィールの直近数週間の支出比較",
    "dashboard.expenseThisProfileMonths": "このプロフィールの直近数か月の支出比較",
    "dashboard.weekly": "週次",
    "dashboard.monthly": "月次",
    "dashboard.expenseCategories": "支出カテゴリ",
    "dashboard.categoryBreakdownAll": "全プロフィールの月別カテゴリ支出内訳",
    "dashboard.categoryBreakdownProfile": "このプロフィールの月別カテゴリ支出内訳",
    "common.language": "言語",
    "lang.vi": "Tiếng Việt",
    "lang.en": "English",
    "lang.zh-TW": "繁體中文",
    "lang.zh-CN": "简体中文",
    "lang.ja": "日本語",
    "lang.ko": "한국어"
  },
  ko: {
    "nav.dashboard": "대시보드",
    "nav.transactions": "거래",
    "nav.partners": "파트너",
    "nav.categories": "카테고리",
    "nav.sixJars": "6개 통장",
    "nav.more": "더보기",
    "nav.activeProfile": "현재 프로필",
    "nav.chooseProfile": "프로필 선택",
    "nav.switchProfile": "프로필 전환",
    "nav.darkMode": "다크 모드",
    "nav.lightMode": "라이트 모드",
    "nav.logout": "로그아웃",
    "header.home": "홈",
    "header.currentProfile": "현재 프로필",
    "header.notSelected": "선택 안 됨",
    "header.thisProfile": "이 프로필",
    "header.allProfiles": "모든 프로필",
    "dashboard.title": "대시보드",
    "dashboard.accountBanner": "모든 프로필의 집계 계정 데이터를 보고 있습니다.",
    "dashboard.weeklyExpenses": "주간 지출",
    "dashboard.monthlyExpenses": "월간 지출",
    "dashboard.expenseAcrossProfilesWeeks": "모든 프로필의 최근 몇 주 지출 비교",
    "dashboard.expenseAcrossProfilesMonths": "모든 프로필의 최근 몇 달 지출 비교",
    "dashboard.expenseThisProfileWeeks": "이 프로필의 최근 몇 주 지출 비교",
    "dashboard.expenseThisProfileMonths": "이 프로필의 최근 몇 달 지출 비교",
    "dashboard.weekly": "주간",
    "dashboard.monthly": "월간",
    "dashboard.expenseCategories": "지출 카테고리",
    "dashboard.categoryBreakdownAll": "모든 프로필의 월간 카테고리 지출 분포",
    "dashboard.categoryBreakdownProfile": "이 프로필의 월간 카테고리 지출 분포",
    "common.language": "언어",
    "lang.vi": "Tiếng Việt",
    "lang.en": "English",
    "lang.zh-TW": "繁體中文",
    "lang.zh-CN": "简体中文",
    "lang.ja": "日本語",
    "lang.ko": "한국어"
  }
}

const languageOptions: { code: Language; label: string }[] = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "zh-CN", label: "简体中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
]

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("vi")

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null
    if (stored && dictionaries[stored]) {
      setLanguageState(stored)
      document.documentElement.lang = stored
      return
    }
    document.documentElement.lang = "vi"
  }, [])

  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage)
    window.localStorage.setItem(STORAGE_KEY, nextLanguage)
    document.documentElement.lang = nextLanguage
  }

  const value = useMemo<LanguageContextType>(() => ({
    language,
    setLanguage,
    t: (key: string) => dictionaries[language]?.[key] || dictionaries.en[key] || key,
    languages: languageOptions,
  }), [language])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider")
  }

  return context
}
