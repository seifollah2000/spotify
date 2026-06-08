"use client"

import { useState, useEffect } from "react"
import { FiSearch, FiPlay } from "react-icons/fi"
import { usePlayerStore } from "@/lib/store"
import { SongType, AlbumType, ArtistType } from "@/lib/types"
import { SongCard, AlbumCard, ArtistCard } from "@/components/SongCard"

export default function SearchPage() {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<{ songs: SongType[]; artists: ArtistType[]; albums: AlbumType[] }>({
    songs: [],
    artists: [],
    albums: [],
  })
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (query.length < 2) {
      setResults({ songs: [], artists: [], albums: [] })
      setSearched(false)
      return
    }

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
        setSearched(true)
      } catch (error) {
        console.error(error)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="p-6">
      <div className="relative mb-6 max-w-md">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-spotify-lightestgray" size={20} />
        <input
          type="text"
          placeholder="What do you want to listen to?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-spotify-gray rounded-full text-white placeholder-spotify-lightestgray outline-none focus:ring-2 focus:ring-spotify-white text-sm"
          autoFocus
        />
      </div>

      {!searched && !query && (
        <div className="text-center mt-20">
          <FiSearch className="mx-auto mb-4 text-spotify-lightestgray" size={48} />
          <h2 className="text-2xl font-bold mb-2">Search</h2>
          <p className="text-spotify-lightestgray">Find your favorite songs, albums, and artists</p>
        </div>
      )}

      {query.length > 0 && query.length < 2 && (
        <div className="text-center mt-20">
          <p className="text-spotify-lightestgray">Type at least 2 characters to search...</p>
        </div>
      )}

      {searched && results.songs.length === 0 && (
        <div className="text-center mt-20">
          <h2 className="text-2xl font-bold mb-2">No results found for &ldquo;{query}&rdquo;</h2>
          <p className="text-spotify-lightestgray">Please make sure your words are spelled correctly, or use fewer or different keywords</p>
        </div>
      )}

      {results.songs.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Songs</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.songs.slice(0, 10).map((song) => (
              <SongCard key={song.id} song={song} />
            ))}
          </div>
        </section>
      )}

      {results.artists.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Artists</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.artists.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>
      )}

      {results.albums.length > 0 && (
        <section className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Albums</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {results.albums.map((album) => (
              <AlbumCard key={album.id} album={album} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
