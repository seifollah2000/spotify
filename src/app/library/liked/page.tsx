"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { SongType } from "@/lib/types"
import SongList from "@/components/SongList"
import { FiHeart } from "react-icons/fi"

export default function LikedSongsPage() {
  const { data: session } = useSession()
  const [songs, setSongs] = useState<SongType[]>([])

  useEffect(() => {
    if (!session?.user?.id) return
    fetch("/api/liked")
      .then((r) => r.json())
      .then(setSongs)
      .catch(console.error)
  }, [session])

  const totalDuration = songs.reduce((acc, s) => acc + s.duration, 0)
  const minutes = Math.floor(totalDuration / 60)

  return (
    <div>
      <div className="bg-gradient-to-b from-purple-800 to-spotify-black p-8">
        <div className="flex items-end gap-6">
          <div className="w-56 h-56 bg-gradient-to-br from-purple-700 to-blue-400 rounded-lg flex items-center justify-center shadow-2xl">
            <FiHeart className="text-white" size={64} />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold uppercase mb-2">Playlist</p>
            <h1 className="text-6xl font-bold mb-4">Liked Songs</h1>
            <p className="text-spotify-lightestgray text-sm">
              {songs.length} songs{minutes > 0 ? ` · ${minutes} min` : ""}
            </p>
          </div>
        </div>
      </div>
      <div className="p-6">
        <SongList songs={songs} />
      </div>
    </div>
  )
}
