"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { FiHome, FiSearch, FiBook, FiPlus, FiHeart } from "react-icons/fi"

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [showNewPlaylist, setShowNewPlaylist] = useState(false)
  const [playlistTitle, setPlaylistTitle] = useState("")
  const [playlists, setPlaylists] = useState<any[]>([])

  const createPlaylist = async () => {
    if (!playlistTitle.trim()) return
    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: playlistTitle }),
      })
      if (res.ok) {
        const playlist = await res.json()
        setPlaylists((prev) => [playlist, ...prev])
        setPlaylistTitle("")
        setShowNewPlaylist(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const links = [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/search", label: "Search", icon: FiSearch },
    { href: "/library", label: "Your Library", icon: FiBook },
  ]

  return (
    <aside className="w-64 bg-black flex-shrink-0 flex flex-col h-full">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
            <FiHeart className="text-black" size={18} />
          </div>
          <span className="text-white font-bold text-xl">Spotify</span>
        </Link>

        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive
                    ? "text-white bg-spotify-gray"
                    : "text-spotify-lightestgray hover:text-white"
                }`}
              >
                <link.icon size={22} />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="px-6 mb-4">
        <div className="border-t border-spotify-gray pt-4">
          {session ? (
            <button
              onClick={() => setShowNewPlaylist(true)}
              className="flex items-center gap-4 px-3 py-2 text-spotify-lightestgray hover:text-white transition-colors w-full text-sm font-semibold"
            >
              <div className="w-8 h-8 bg-spotify-lightestgray bg-opacity-30 rounded flex items-center justify-center">
                <FiPlus size={18} />
              </div>
              Create Playlist
            </button>
          ) : (
            <div className="text-xs text-spotify-lightestgray px-3">
              Log in to create playlists
            </div>
          )}

          {session && (
            <Link
              href="/library"
              className="flex items-center gap-4 px-3 py-2 text-spotify-lightestgray hover:text-white transition-colors text-sm font-semibold"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-700 to-blue-400 rounded flex items-center justify-center">
                <FiHeart size={18} />
              </div>
              Liked Songs
            </Link>
          )}
        </div>
      </div>

      {session && (
        <div className="flex-1 overflow-y-auto px-6">
          {playlists.map((playlist) => (
            <Link
              key={playlist.id}
              href={`/playlist/${playlist.id}`}
              className="block px-3 py-2 text-sm text-spotify-lightestgray hover:text-white transition-colors truncate"
            >
              {playlist.title}
            </Link>
          ))}
        </div>
      )}

      {showNewPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => setShowNewPlaylist(false)}>
          <div className="bg-spotify-dark p-6 rounded-lg w-96" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-4">Create Playlist</h2>
            <input
              type="text"
              placeholder="My Playlist"
              value={playlistTitle}
              onChange={(e) => setPlaylistTitle(e.target.value)}
              className="w-full px-4 py-2 bg-spotify-gray rounded-md text-white placeholder-spotify-lightestgray outline-none mb-4"
              onKeyDown={(e) => e.key === "Enter" && createPlaylist()}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowNewPlaylist(false)}
                className="px-4 py-2 text-sm font-semibold text-spotify-lightestgray hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createPlaylist}
                className="px-6 py-2 bg-white text-black rounded-full text-sm font-semibold hover:scale-105 transition-transform"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
