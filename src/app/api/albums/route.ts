import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const artistId = searchParams.get("artistId")

  if (artistId) {
    const albums = await prisma.album.findMany({
      where: { artistId },
      include: { artist: true, songs: { include: { artist: true } } },
    })
    return NextResponse.json(albums)
  }

  const albums = await prisma.album.findMany({
    include: { artist: true, songs: { include: { artist: true } } },
    orderBy: { year: "desc" },
  })

  return NextResponse.json(albums)
}
