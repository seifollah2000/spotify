export interface SongType {
  id: string
  title: string
  duration: number
  image: string | null
  audioUrl: string
  plays: number
  artistId: string
  albumId: string
  artist: { id: string; name: string; image: string | null }
  album: { id: string; title: string; image: string | null }
}

export interface AlbumType {
  id: string
  title: string
  image: string | null
  year: number
  artistId: string
  color: string
  artist: { id: string; name: string; image: string | null }
  songs: SongType[]
}

export interface ArtistType {
  id: string
  name: string
  image: string | null
  bio: string | null
  color: string
  albums: AlbumType[]
  songs: SongType[]
}

export interface PlaylistType {
  id: string
  title: string
  description: string | null
  image: string | null
  userId: string
  color: string
  public: boolean
  createdAt: string
  songs: PlaylistSongType[]
}

export interface PlaylistSongType {
  id: string
  playlistId: string
  songId: string
  addedAt: string
  position: number
  song: SongType
}
