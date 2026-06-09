"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { FiAward, FiCheck, FiStar } from "react-icons/fi"
import { useLang } from "@/lib/lang"

const plans = [
  {
    id: "free",
    nameKey: "free" as const,
    price: 0,
    features: ["دسترسی محدود به آهنگ‌ها", "کیفیت معمولی", "تبلیغات"],
  },
  {
    id: "premium_monthly",
    nameKey: "premium" as const,
    price: 69000,
    period: "monthly",
    popular: true,
    features: [
      "دسترسی نامحدود به آهنگ‌ها",
      "کیفیت بالا",
      "بدون تبلیغات",
      "گوش دادن آفلاین",
    ],
  },
  {
    id: "premium_yearly",
    nameKey: "premium" as const,
    price: 690000,
    period: "yearly",
    features: [
      "تمام مزایای پریمیوم",
      "۲ ماه رایگان",
      "قیمت ویژه سالانه",
    ],
  },
]

export default function SubscriptionPage() {
  const { data: session } = useSession()
  const { t } = useLang()
  const [subscription, setSubscription] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session) {
      fetch("/api/subscription")
        .then((r) => r.json())
        .then(setSubscription)
        .catch(console.error)
    }
  }, [session])

  const handleSubscribe = async (planId: string) => {
    setLoading(true)
    try {
      const res = await fetch("/api/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId }),
      })
      const data = await res.json()
      if (res.ok) setSubscription(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (!session) {
    return (
      <div className="p-6 text-center mt-20">
        <FiAward className="mx-auto mb-4 text-yellow-500" size={48} />
        <h2 className="text-2xl font-bold mb-2">{t("subscription")}</h2>
        <p className="text-spotify-lightestgray">{t("logInRequired")}</p>
      </div>
    )
  }

  const isPremium = subscription?.plan !== "free" && subscription?.plan !== undefined

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <FiAward className="mx-auto mb-4 text-yellow-500" size={48} />
        <h1 className="text-4xl font-bold mb-2">{t("subscription")}</h1>
        <p className="text-spotify-lightestgray">
          {isPremium ? t("subscriptionActive") : t("noSubscription")}
        </p>
      </div>

      {isPremium && (
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-lg p-6 mb-8 text-center">
          <FiCheck className="mx-auto mb-2" size={32} />
          <h2 className="text-2xl font-bold">{t("subscriptionActive")}</h2>
          <p className="text-white/80">
            {t("currentPlan")}: {subscription?.plan === "premium_yearly" ? t("yearly") : t("monthly")}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`bg-spotify-dark rounded-lg p-6 relative ${
              plan.popular ? "ring-2 ring-spotify-green scale-105" : ""
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-spotify-green text-black px-4 py-1 rounded-full text-xs font-bold">
                {t("popular")}
              </div>
            )}

            <div className="flex items-center gap-2 mb-4">
              <FiStar className={plan.id === "free" ? "text-spotify-lightestgray" : "text-yellow-500"} size={24} />
              <h3 className="text-xl font-bold">
                {plan.id === "free" ? t("free") : t("premium")}
              </h3>
            </div>

            <p className="text-3xl font-bold mb-1">
              {plan.price === 0 ? t("free") : `${plan.price.toLocaleString()} تومان`}
            </p>
            {plan.period && (
              <p className="text-spotify-lightestgray text-sm mb-4">
                / {plan.period === "monthly" ? t("monthly") : t("yearly")}
              </p>
            )}

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <FiCheck className="text-spotify-green flex-shrink-0" size={16} />
                  {feature}
                </li>
              ))}
            </ul>

            {plan.id !== "free" && (
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading}
                className="w-full py-3 bg-spotify-green hover:bg-spotify-greenhover text-black font-bold rounded-full transition-all hover:scale-105 disabled:opacity-50"
              >
                {t("purchase")}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
