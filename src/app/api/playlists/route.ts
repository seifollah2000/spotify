import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId") || session?.user?.id

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const playlists = await prisma.playlist.findMany({
    where: { userId },
    include: { songs: { include: { song: { include: { artist: true } } } } },
    orderBy: { updatedAt: "desc" },
  })

  return NextResponse.json(playlists)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { title, description } = await req.json()
  if (!title) {
    return NextResponse.json({ error: "Title required" }, { status: 400 })
  }

  const playlist = await prisma.playlist.create({
    data: {
      title,
      description: description || "",
      userId: session.user.id,
    },
  })

  return NextResponse.json(playlist)
}
