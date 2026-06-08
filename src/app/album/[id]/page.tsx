"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { FiPlay, FiClock, FiMoreHorizontal } from "react-icons/fi"
import { usePlayerStore } from "@/lib/store"
import SongList from "@/components/SongList"
import { AlbumType } from "@/lib/types"
import { formatNumber } from "@/lib/utils"

export default function AlbumPage() {
  const params = useParams()
  const [album, setAlbum] = useState<AlbumType | null>(null)
  const { playSong } = usePlayerStore()

  useEffect(() => {
    if (!params.id) return
    fetch(`/api/albums/${params.id}`)
      .then((r) => r.json())
      .then(setAlbum)
      .catch(console.error)
  }, [params.id])

  if (!album) {
    return (
      <div className="p-6 text-center mt-20">
        <div className="animate-spin w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  const totalDuration = album.songs.reduce((acc, s) => acc + s.duration, 0)
  const minutes = Math.floor(totalDuration / 60)

  return (
    <div>
      <div className="bg-gradient-to-b from-spotify-green/30 to-spotify-black p-8">
        <div className="flex items-end gap-6">
          <img
            src={album.image || "/placeholder.jpg"}
            alt={album.title}
            className="w-56 h-56 object-cover rounded-lg shadow-2xl"
          />
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase mb-2">Album</p>
            <h1 className="text-6xl font-bold mb-4">{album.title}</h1>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-white">{album.artist.name}</span>
              <span className="text-spotify-lightestgray">· {album.year}</span>
              <span className="text-spotify-lightestgray">· {album.songs.length} songs, {minutes} min</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => playSong(album.songs[0], album.songs)}
            className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
          >
            <FiPlay className="text-black ml-1" size={24} />
          </button>
          <button className="text-spotify-lightestgray hover:text-white transition-colors">
            <FiMoreHorizontal size={28} />
          </button>
        </div>

        <SongList songs={album.songs} />
      </div>
    </div>
  )
}
