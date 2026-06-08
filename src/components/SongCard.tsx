"use client"

import { FiPlay } from "react-icons/fi"
import { usePlayerStore } from "@/lib/store"
import { SongType } from "@/lib/types"

export function SongCard({ song }: { song: SongType }) {
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayerStore()

  const isCurrentSong = currentSong?.id === song.id

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (isCurrentSong) {
      togglePlay()
    } else {
      playSong(song)
    }
  }

  return (
    <a
      href={`/album/${song.albumId}`}
      className="bg-spotify-dark hover:bg-spotify-gray transition-colors rounded-md p-4 group cursor-pointer"
    >
      <div className="relative mb-4">
        <img
          src={song.image || "/placeholder.jpg"}
          alt={song.title}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
        />
        <button
          onClick={handlePlay}
          className="absolute bottom-2 right-2 w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-105"
        >
          <FiPlay className="text-black ml-0.5" size={20} />
        </button>
      </div>
      <h3 className="font-bold text-sm truncate">{song.title}</h3>
      <p className="text-spotify-lightestgray text-sm truncate mt-1">{song.artist.name}</p>
    </a>
  )
}

export function AlbumCard({ album }: { album: any }) {
  return (
    <a
      href={`/album/${album.id}`}
      className="bg-spotify-dark hover:bg-spotify-gray transition-colors rounded-md p-4 group cursor-pointer"
    >
      <div className="relative mb-4">
        <img
          src={album.image || "/placeholder.jpg"}
          alt={album.title}
          className="w-full aspect-square object-cover rounded-md shadow-lg"
        />
        <button className="absolute bottom-2 right-2 w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-105">
          <FiPlay className="text-black ml-0.5" size={20} />
        </button>
      </div>
      <h3 className="font-bold text-sm truncate">{album.title}</h3>
      <p className="text-spotify-lightestgray text-sm truncate mt-1">{album.artist?.name}</p>
    </a>
  )
}

export function ArtistCard({ artist }: { artist: any }) {
  return (
    <a
      href={`/album/${artist.albums?.[0]?.id || ""}`}
      className="bg-spotify-dark hover:bg-spotify-gray transition-colors rounded-md p-4 group cursor-pointer text-center"
    >
      <div className="relative mb-4 flex justify-center">
        <div className="w-36 h-36 rounded-full overflow-hidden">
          <img
            src={artist.image || "/placeholder.jpg"}
            alt={artist.name}
            className="w-full h-full object-cover"
          />
        </div>
        <button className="absolute bottom-2 right-[calc(50%-5rem)] w-12 h-12 bg-spotify-green rounded-full flex items-center justify-center shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all hover:scale-105">
          <FiPlay className="text-black ml-0.5" size={20} />
        </button>
      </div>
      <h3 className="font-bold text-sm truncate">{artist.name}</h3>
      <p className="text-spotify-lightestgray text-sm mt-1">Artist</p>
    </a>
  )
}
