import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get("q")

  if (!query) {
    return NextResponse.json({ songs: [], artists: [], albums: [] })
  }

  const [songs, artists, albums] = await Promise.all([
    prisma.song.findMany({
      where: { title: { contains: query } },
      include: { artist: true, album: true },
      take: 10,
    }),
    prisma.artist.findMany({
      where: { name: { contains: query } },
      include: { albums: true, songs: true },
      take: 5,
    }),
    prisma.album.findMany({
      where: { title: { contains: query } },
      include: { artist: true, songs: { include: { artist: true } } },
      take: 5,
    }),
  ])

  return NextResponse.json({ songs, artists, albums })
}
