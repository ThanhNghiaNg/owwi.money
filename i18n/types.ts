export type Language = "vi" | "en" | "zh-TW" | "zh-CN" | "ja" | "ko"

export type Dictionary = Record<string, string>
export type Dictionaries = Record<Language, Dictionary>

export const languages = [
  { code: "vi", label: "Tiếng Việt" },
  { code: "en", label: "English" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "zh-CN", label: "简体中文" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
] as const
