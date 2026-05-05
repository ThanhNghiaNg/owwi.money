import { authDictionary } from "./dictionaries/auth"
import { commonDictionary } from "./dictionaries/common"
import { dashboardDictionary } from "./dictionaries/dashboard"
import { managementDictionary } from "./dictionaries/management"
import { profilesDictionary } from "./dictionaries/profiles"
import { Dictionaries, Dictionary, Language, languages } from "./types"

const mergeLanguage = (...parts: Dictionary[]) => Object.assign({}, ...parts)

export const dictionaries: Dictionaries = {
  vi: mergeLanguage(
    commonDictionary.vi,
    dashboardDictionary.vi,
    authDictionary.vi,
    profilesDictionary.vi,
    managementDictionary.vi,
  ),
  en: mergeLanguage(
    commonDictionary.en,
    dashboardDictionary.en,
    authDictionary.en,
    profilesDictionary.en,
    managementDictionary.en,
  ),
  "zh-TW": mergeLanguage(
    commonDictionary["zh-TW"],
    dashboardDictionary["zh-TW"],
    authDictionary["zh-TW"],
    profilesDictionary["zh-TW"],
    managementDictionary["zh-TW"],
  ),
  "zh-CN": mergeLanguage(
    commonDictionary["zh-CN"],
    dashboardDictionary["zh-CN"],
    authDictionary["zh-CN"],
    profilesDictionary["zh-CN"],
    managementDictionary["zh-CN"],
  ),
  ja: mergeLanguage(
    commonDictionary.ja,
    dashboardDictionary.ja,
    authDictionary.ja,
    profilesDictionary.ja,
    managementDictionary.ja,
  ),
  ko: mergeLanguage(
    commonDictionary.ko,
    dashboardDictionary.ko,
    authDictionary.ko,
    profilesDictionary.ko,
    managementDictionary.ko,
  ),
}

export type { Language }
export { languages }
