"use client"

import { createContext, useContext, useState, useCallback } from "react"

const fa = {
  appName: "اسپاتیفای",
  home: "خانه",
  search: "جستجو",
  library: "کتابخانه",
  createPlaylist: "ساخت پلی‌لیست",
  likedSongs: "آهنگ‌های محبوب",
  popularSongs: "آهنگ‌های محبوب",
  albums: "آلبوم‌ها",
  popularArtists: "هنرمندان محبوب",
  searchPlaceholder: "چه می‌خواهی گوش کنی؟",
  noResults: "نتیجه‌ای یافت نشد",
  noResultsDesc: "لطفاً از کلمات متفاوت استفاده کنید",
  yourLibrary: "کتابخانه شما",
  logIn: "ورود",
  signUp: "ثبت نام",
  logInToSpotify: "ورود به اسپاتیفای",
  signUpForSpotify: "ثبت نام در اسپاتیفای",
  email: "ایمیل",
  password: "رمز عبور",
  name: "نام",
  dontHaveAccount: "حساب کاربری ندارید؟",
  alreadyHaveAccount: "قبلاً ثبت نام کرده‌اید؟",
  logInRequired: "برای استفاده از این ویژگی وارد شوید",
  guestMessage: "یک مهمان خوش‌آمد بگو",
  selectSong: "یک آهنگ انتخاب کنید",
  songs: "آهنگ",
  artists: "هنرمندان",
  playlist: "پلی‌لیست",
  create: "ساخت",
  cancel: "لغو",
  title: "عنوان",
  description: "توضیحات",
  minutes: "دقیقه",
  noLibrary: "کتابخانه شما خالی است",
  noLibraryDesc: "شروع به گوش دادن کنید",
  subscription: "اشتراک",
  subscribe: "خرید اشتراک",
  currentPlan: "طرح فعلی",
  free: "رایگان",
  premium: "پریمیوم",
  premiumDesc: "گوش دادن بدون محدودیت، بدون تبلیغات",
  monthly: "ماهانه",
  yearly: "سالیانه",
  purchase: "خرید",
  subscriptionActive: "اشتراک شما فعال است",
  noSubscription: "هنوز اشتراکی ندارید",
  popular: "محبوب",
  language: "زبان",
  persian: "فارسی",
  english: "English",
  settings: "تنظیمات",
  profile: "پروفایل",
  logout: "خروج",
}

const en = {
  appName: "Spotify",
  home: "Home",
  search: "Search",
  library: "Library",
  createPlaylist: "Create Playlist",
  likedSongs: "Liked Songs",
  popularSongs: "Popular Songs",
  albums: "Albums",
  popularArtists: "Popular Artists",
  searchPlaceholder: "What do you want to listen to?",
  noResults: "No results found",
  noResultsDesc: "Please try different keywords",
  yourLibrary: "Your Library",
  logIn: "Log In",
  signUp: "Sign Up",
  logInToSpotify: "Log in to Spotify",
  signUpForSpotify: "Sign up for Spotify",
  email: "Email",
  password: "Password",
  name: "Name",
  dontHaveAccount: "Don't have an account?",
  alreadyHaveAccount: "Already have an account?",
  logInRequired: "Log in to use this feature",
  guestMessage: "Say hello to a guest",
  selectSong: "Select a song to play",
  songs: "Songs",
  artists: "Artists",
  playlist: "Playlist",
  create: "Create",
  cancel: "Cancel",
  title: "Title",
  description: "Description",
  minutes: "min",
  noLibrary: "Your library is empty",
  noLibraryDesc: "Start listening",
  subscription: "Subscription",
  subscribe: "Subscribe",
  currentPlan: "Current Plan",
  free: "Free",
  premium: "Premium",
  premiumDesc: "Unlimited listening, ad-free",
  monthly: "Monthly",
  yearly: "Yearly",
  purchase: "Purchase",
  subscriptionActive: "Your subscription is active",
  noSubscription: "No subscription yet",
  popular: "Popular",
  language: "Language",
  persian: "Persian",
  english: "English",
  settings: "Settings",
  profile: "Profile",
  logout: "Logout",
}

export type Lang = "fa" | "en"
const translations = { fa, en } as const

interface LangContextType {
  lang: Lang
  dir: "rtl" | "ltr"
  t: (key: keyof typeof fa) => string
  setLang: (lang: Lang) => void
}

const LangContext = createContext<LangContextType>({
  lang: "fa",
  dir: "rtl",
  t: (key) => fa[key],
  setLang: () => {},
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fa")

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    document.documentElement.dir = l === "fa" ? "rtl" : "ltr"
    document.documentElement.lang = l
  }, [])

  const dir = lang === "fa" ? "rtl" : "ltr"
  const dict = translations[lang]

  const t = useCallback((key: keyof typeof fa) => dict[key], [lang])

  return (
    <LangContext.Provider value={{ lang, dir, t, setLang }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
