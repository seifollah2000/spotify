"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"
import { FiX } from "react-icons/fi"
import { useLang } from "@/lib/lang"

export default function AuthModal() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { t } = useLang()

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!session) {
        setIsOpen(true)
      }
    }, 5000)
    return () => clearTimeout(timer)
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    if (isLogin) {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError("ایمیل یا رمز عبور اشتباه است")
      } else {
        setIsOpen(false)
      }
    } else {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        })
        const data = await res.json()
        if (!res.ok) {
          setError(data.error || "خطایی رخ داد")
        } else {
          await signIn("credentials", { email, password, redirect: false })
          setIsOpen(false)
        }
      } catch (err) {
        setError("خطایی رخ داد")
      }
    }
    setLoading(false)
  }

  if (session || !isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <div className="bg-spotify-dark rounded-lg w-full max-w-md p-8 relative">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 left-4 text-spotify-lightestgray hover:text-white transition-colors"
        >
          <FiX size={24} />
        </button>

        <h1 className="text-3xl font-bold text-center mb-8">
          {isLogin ? t("logInToSpotify") : t("signUpForSpotify")}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4" dir="auto">
          {!isLogin && (
            <div>
              <label className="text-sm font-semibold block mb-1">{t("name")}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-spotify-gray rounded-md text-white placeholder-spotify-lightestgray outline-none focus:ring-2 focus:ring-spotify-green"
                placeholder={t("name")}
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm font-semibold block mb-1">{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-spotify-gray rounded-md text-white placeholder-spotify-lightestgray outline-none focus:ring-2 focus:ring-spotify-green"
              placeholder={t("email")}
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold block mb-1">{t("password")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-spotify-gray rounded-md text-white placeholder-spotify-lightestgray outline-none focus:ring-2 focus:ring-spotify-green"
              placeholder={t("password")}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-spotify-green hover:bg-spotify-greenhover text-black font-bold rounded-full text-sm transition-all hover:scale-105 disabled:opacity-50"
          >
            {loading ? "..." : isLogin ? t("logIn") : t("signUp")}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-spotify-lightestgray text-sm">
            {isLogin ? t("dontHaveAccount") : t("alreadyHaveAccount")}
            <button
              onClick={() => { setIsLogin(!isLogin); setError("") }}
              className="text-white font-semibold hover:underline mr-1"
            >
              {isLogin ? t("signUp") : t("logIn")}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
