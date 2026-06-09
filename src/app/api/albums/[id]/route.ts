import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const album = await prisma.album.findUnique({
      where: { id: params.id },
      include: {
        artist: true,
        songs: { include: { artist: true } },
      },
    })

    if (!album) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 })
    }

    return NextResponse.json(album)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 })
  }
}
