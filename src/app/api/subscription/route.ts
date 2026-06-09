import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  return NextResponse.json(subscription || { plan: "free", status: "active" })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { plan } = await req.json()

  if (!plan || !["premium_monthly", "premium_yearly"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 })
  }

  const existing = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  })

  const endDate = new Date()
  if (plan === "premium_yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1)
  } else {
    endDate.setMonth(endDate.getMonth() + 1)
  }

  if (existing) {
    const updated = await prisma.subscription.update({
      where: { userId: session.user.id },
      data: {
        plan,
        status: "active",
        endDate,
        startDate: new Date(),
      },
    })
    return NextResponse.json(updated)
  }

  const subscription = await prisma.subscription.create({
    data: {
      userId: session.user.id,
      plan,
      status: "active",
      endDate,
    },
  })

  return NextResponse.json(subscription)
}
