"use client"

import { useEffect, useState } from "react"
import { SongCard, AlbumCard, ArtistCard } from "@/components/SongCard"
import { SongType, AlbumType, ArtistType } from "@/lib/types"
import { useSession } from "next-auth/react"

export default function HomePage() {
  const { data: session } = useSession()
  const [songs, setSongs] = useState<SongType[]>([])
  const [albums, setAlbums] = useState<AlbumType[]>([])
  const [artists, setArtists] = useState<ArtistType[]>([])

  useEffect(() => {
    fetch("/api/songs")
      .then((res) => res.json())
      .then((data) => {
        setSongs(data.songs || [])
        setAlbums(data.albums || [])
        setArtists(data.artists || [])
      })
      .catch(console.error)
  }, [])

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Good {session ? "evening" : "morning"}</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {artists.slice(0, 6).map((artist) => (
            <a
              key={artist.id}
              href={`/album/${artist.albums[0]?.id || ""}`}
              className="bg-spotify-gray bg-opacity-60 hover:bg-opacity-100 transition-all rounded-md p-3 flex items-center gap-3 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-spotify-lightgray overflow-hidden flex-shrink-0">
                {artist.image && (
                  <img src={artist.image} alt={artist.name} className="w-full h-full object-cover" />
                )}
              </div>
              <span className="font-bold text-sm truncate">{artist.name}</span>
            </a>
          ))}
        </div>
      </div>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Popular Songs</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {songs.slice(0, 10).map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Albums</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {albums.map((album) => (
            <AlbumCard key={album.id} album={album} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">Popular Artists</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {artists.slice(0, 8).map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>
    </div>
  )
}
