"use client"

import { useEffect, useState } from "react"
import { SongCard } from "@/components/SongCard"
import { SongType, AlbumType, ArtistType } from "@/lib/types"
import { useSession } from "next-auth/react"
import { useLang } from "@/lib/lang"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function HomePage() {
  const { data: session } = useSession()
  const { t } = useLang()
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{session ? t("popular") : t("guestMessage")}</h1>
        <LanguageSwitcher />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
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

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{t("popularSongs")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {songs.slice(0, 10).map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{t("albums")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {albums.map((album) => (
            <SongCard
              key={album.id}
              song={{
                id: album.id,
                title: album.title,
                duration: 0,
                image: album.image,
                audioUrl: "",
                plays: 0,
                artistId: album.artistId,
                albumId: album.id,
                artist: album.artist,
                album: { id: album.id, title: album.title, image: album.image },
              }}
            />
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{t("popularArtists")}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {artists.slice(0, 8).map((artist) => (
            <a
              key={artist.id}
              href={`/album/${artist.albums?.[0]?.id || ""}`}
              className="bg-spotify-dark hover:bg-spotify-gray transition-colors rounded-md p-4 group cursor-pointer text-center"
            >
              <div className="relative mb-4 flex justify-center">
                <div className="w-36 h-36 rounded-full overflow-hidden">
                  <img src={artist.image || "/placeholder.jpg"} alt={artist.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <h3 className="font-bold text-sm truncate">{artist.name}</h3>
              <p className="text-spotify-lightestgray text-sm mt-1">{t("artists")}</p>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
