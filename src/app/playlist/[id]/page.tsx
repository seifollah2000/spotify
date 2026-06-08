"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { FiPlay, FiClock, FiMoreHorizontal, FiTrash2 } from "react-icons/fi"
import { usePlayerStore } from "@/lib/store"
import SongList from "@/components/SongList"
import { PlaylistType } from "@/lib/types"

export default function PlaylistPage() {
  const params = useParams()
  const [playlist, setPlaylist] = useState<PlaylistType | null>(null)
  const { playSong } = usePlayerStore()

  const fetchPlaylist = () => {
    if (!params.id) return
    fetch(`/api/playlists/${params.id}`)
      .then((r) => r.json())
      .then((data) => {
        const formatted = {
          ...data,
          songs: data.songs?.map((ps: any) => ps.song) || [],
        }
        setPlaylist(formatted)
      })
      .catch(console.error)
  }

  useEffect(() => {
    fetchPlaylist()
  }, [params.id])

  if (!playlist) {
    return (
      <div className="p-6 text-center mt-20">
        <div className="animate-spin w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  const totalDuration = playlist.songs.reduce((acc, s) => acc + s.duration, 0)
  const minutes = Math.floor(totalDuration / 60)

  return (
    <div>
      <div className="bg-gradient-to-b from-blue-800 to-spotify-black p-8">
        <div className="flex items-end gap-6">
          <div className="w-56 h-56 bg-spotify-gray rounded-lg flex items-center justify-center shadow-2xl">
            <span className="text-6xl">🎵</span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase mb-2">Playlist</p>
            <h1 className="text-6xl font-bold mb-4">{playlist.title}</h1>
            {playlist.description && (
              <p className="text-sm text-spotify-lightestgray mb-2">{playlist.description}</p>
            )}
            <p className="text-spotify-lightestgray text-sm">
              {playlist.songs.length} songs{minutes > 0 ? ` · ${minutes} min` : ""}
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          {playlist.songs.length > 0 && (
            <button
              onClick={() => playSong(playlist.songs[0], playlist.songs)}
              className="w-14 h-14 bg-spotify-green rounded-full flex items-center justify-center hover:scale-105 transition-transform shadow-xl"
            >
              <FiPlay className="text-black ml-1" size={24} />
            </button>
          )}
        </div>

        <SongList songs={playlist.songs} />
      </div>
    </div>
  )
}
