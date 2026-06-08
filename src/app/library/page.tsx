"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { SongType } from "@/lib/types"
import { SongCard } from "@/components/SongCard"
import { FiBook } from "react-icons/fi"

export default function LibraryPage() {
  const { data: session } = useSession()
  const [likedSongs, setLikedSongs] = useState<SongType[]>([])
  const [playlists, setPlaylists] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session?.user?.id) return

    Promise.all([
      fetch("/api/liked").then((r) => r.json()),
      fetch(`/api/playlists?userId=${session.user.id}`).then((r) => r.json()),
    ])
      .then(([songs, pls]) => {
        setLikedSongs(songs || [])
        setPlaylists(pls || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [session])

  if (!session) {
    return (
      <div className="p-6 text-center mt-20">
        <FiBook className="mx-auto mb-4 text-spotify-lightestgray" size={48} />
        <h2 className="text-2xl font-bold mb-2">Your Library</h2>
        <p className="text-spotify-lightestgray">Log in to see your library</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-6 text-center mt-20">
        <div className="animate-spin w-8 h-8 border-2 border-spotify-green border-t-transparent rounded-full mx-auto" />
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Your Library</h1>

      <div className="mb-8">
        <a
          href="/library/liked"
          className="bg-gradient-to-br from-purple-700 to-blue-400 rounded-lg p-4 flex items-center gap-4 hover:opacity-90 transition-opacity"
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-700 to-blue-400 rounded flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold">Liked Songs</h2>
            <p className="text-sm text-white/70">{likedSongs.length} songs</p>
          </div>
        </a>
      </div>

      {playlists.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Playlists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {playlists.map((playlist) => (
              <a
                key={playlist.id}
                href={`/playlist/${playlist.id}`}
                className="bg-spotify-dark hover:bg-spotify-gray transition-colors rounded-md p-4 group cursor-pointer"
              >
                <div className="relative mb-4">
                  <div className="w-full aspect-square bg-spotify-gray rounded-md flex items-center justify-center shadow-lg">
                    <FiBook className="text-spotify-lightestgray" size={32} />
                  </div>
                </div>
                <h3 className="font-bold text-sm truncate">{playlist.title}</h3>
                <p className="text-spotify-lightestgray text-sm truncate mt-1">
                  {playlist.songs?.length || 0} songs
                </p>
              </a>
            ))}
          </div>
        </section>
      )}

      {playlists.length === 0 && likedSongs.length === 0 && (
        <div className="text-center mt-10">
          <p className="text-spotify-lightestgray">Your library is empty. Start listening!</p>
        </div>
      )}
    </div>
  )
}
