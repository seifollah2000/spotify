import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        songs: {
          include: { song: { include: { artist: true, album: true } } },
          orderBy: { position: "asc" },
        },
      },
    })

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 })
    }

    return NextResponse.json(playlist)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { songId } = await req.json()
    if (!songId) {
      return NextResponse.json({ error: "songId required" }, { status: 400 })
    }

    const playlist = await prisma.playlist.findUnique({
      where: { id: params.id },
      include: { songs: true },
    })

    if (!playlist) {
      return NextResponse.json({ error: "Playlist not found" }, { status: 404 })
    }

    const existing = playlist.songs.find((s) => s.songId === songId)
    if (existing) {
      return NextResponse.json({ error: "Song already in playlist" }, { status: 400 })
    }

    const maxPosition = playlist.songs.reduce((max, s) => Math.max(max, s.position), 0)

    const playlistSong = await prisma.playlistSong.create({
      data: {
        playlistId: params.id,
        songId,
        position: maxPosition + 1,
      },
      include: { song: { include: { artist: true, album: true } } },
    })

    return NextResponse.json(playlistSong)
  } catch (error) {
    return NextResponse.json({ error: "Failed to add song" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const songId = searchParams.get("songId")
    const { id } = params

    if (!songId) {
      return NextResponse.json({ error: "songId required" }, { status: 400 })
    }

    await prisma.playlistSong.deleteMany({
      where: { playlistId: id, songId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to remove song" }, { status: 500 })
  }
}
