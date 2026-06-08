import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const likedSongs = await prisma.likedSong.findMany({
    where: { userId: session.user.id },
    include: { song: { include: { artist: true, album: true } } },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json(likedSongs.map((ls) => ls.song))
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { songId } = await req.json()
  if (!songId) {
    return NextResponse.json({ error: "songId required" }, { status: 400 })
  }

  const existing = await prisma.likedSong.findUnique({
    where: { userId_songId: { userId: session.user.id, songId } },
  })

  if (existing) {
    await prisma.likedSong.delete({ where: { id: existing.id } })
    return NextResponse.json({ liked: false })
  }

  await prisma.likedSong.create({
    data: { userId: session.user.id, songId },
  })

  return NextResponse.json({ liked: true })
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const songId = searchParams.get("songId")

  if (!songId) {
    return NextResponse.json({ error: "songId required" }, { status: 400 })
  }

  await prisma.likedSong.deleteMany({
    where: { userId: session.user.id, songId },
  })

  return NextResponse.json({ liked: false })
}
