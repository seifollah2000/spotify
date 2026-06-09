"use client"

import { useLang } from "@/lib/lang"

export default function LanguageSwitcher() {
  const { lang, setLang, t } = useLang()

  return (
    <button
      onClick={() => setLang(lang === "fa" ? "en" : "fa")}
      className="px-4 py-2 bg-spotify-gray hover:bg-spotify-lightgray rounded-full text-sm font-semibold transition-colors"
    >
      {lang === "fa" ? t("english") : t("persian")}
    </button>
  )
}
