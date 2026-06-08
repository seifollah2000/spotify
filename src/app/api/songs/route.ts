import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      include: { artist: true, album: true },
      orderBy: { plays: "desc" },
      take: 20,
    })

    const albums = await prisma.album.findMany({
      include: { artist: true, songs: { include: { artist: true } } },
      orderBy: { year: "desc" },
      take: 10,
    })

    const artists = await prisma.artist.findMany({
      include: { albums: true, songs: true },
      take: 10,
    })

    return NextResponse.json({ songs, albums, artists })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
