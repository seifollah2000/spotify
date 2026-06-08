import { PrismaClient } from "@prisma/client"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import bcrypt from "bcryptjs"

const connectionString = process.env.DATABASE_URL || "file:./prisma/dev.db"
const adapter = new PrismaBetterSqlite3({ url: connectionString })
const prisma = new PrismaClient({ adapter })

async function main() {
  await prisma.likedSong.deleteMany()
  await prisma.playlistSong.deleteMany()
  await prisma.playlist.deleteMany()
  await prisma.song.deleteMany()
  await prisma.album.deleteMany()
  await prisma.artist.deleteMany()
  await prisma.user.deleteMany()

  const hashedPassword = await bcrypt.hash("password123", 12)
  const user = await prisma.user.create({
    data: {
      name: "Demo User",
      email: "demo@example.com",
      password: hashedPassword,
    },
  })

  const artists = await Promise.all([
    prisma.artist.create({
      data: {
        name: "Luna Echo",
        image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
        bio: "Electronic music producer and vocalist",
        color: "#1db954",
      },
    }),
    prisma.artist.create({
      data: {
        name: "The Midnight Riders",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop",
        bio: "Rock band from Nashville",
        color: "#e13300",
      },
    }),
    prisma.artist.create({
      data: {
        name: "Neo Wave",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
        bio: "Synthwave artist",
        color: "#8400e7",
      },
    }),
    prisma.artist.create({
      data: {
        name: "Soul Kitchen",
        image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop",
        bio: "R&B and soul collective",
        color: "#e7008a",
      },
    }),
    prisma.artist.create({
      data: {
        name: "Arctic Horizon",
        image: "https://images.unsplash.com/photo-1524650359799-842906ca1c06?w=400&h=400&fit=crop",
        bio: "Indie folk band",
        color: "#0088e7",
      },
    }),
    prisma.artist.create({
      data: {
        name: "DJ Phantom",
        image: "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?w=400&h=400&fit=crop",
        bio: "Electronic DJ and producer",
        color: "#e7a100",
      },
    }),
  ])

  const albumData = [
    { title: "Neon Dreams", year: 2024, artistIdx: 0, color: "#1db954", image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop" },
    { title: "Electric Nights", year: 2023, artistIdx: 0, color: "#0891b2", image: "https://images.unsplash.com/photo-1589903308904-1010c2294adc?w=400&h=400&fit=crop" },
    { title: "Highway Thunder", year: 2024, artistIdx: 1, color: "#e13300", image: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop" },
    { title: "Digital Horizon", year: 2024, artistIdx: 2, color: "#8400e7", image: "https://images.unsplash.com/photo-1566275520983-5f85b4b0fc35?w=400&h=400&fit=crop" },
    { title: "Heart & Soul", year: 2023, artistIdx: 3, color: "#e7008a", image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop" },
    { title: "Frozen Waves", year: 2024, artistIdx: 4, color: "#0088e7", image: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop" },
    { title: "Bass District", year: 2024, artistIdx: 5, color: "#e7a100", image: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop" },
  ]

  const albums = await Promise.all(
    albumData.map((a) =>
      prisma.album.create({
        data: {
          title: a.title,
          year: a.year,
          artistId: artists[a.artistIdx].id,
          color: a.color,
          image: a.image,
        },
      })
    )
  )

  const songData = [
    { title: "Starlight", duration: 204, albumIdx: 0, plays: 15420000 },
    { title: "Neon Dreams", duration: 248, albumIdx: 0, plays: 12300000 },
    { title: "Electric Pulse", duration: 195, albumIdx: 0, plays: 9800000 },
    { title: "Midnight Drive", duration: 267, albumIdx: 0, plays: 8700000 },
    { title: "Crystal Waves", duration: 222, albumIdx: 0, plays: 7600000 },
    { title: "Voltage", duration: 218, albumIdx: 1, plays: 6500000 },
    { title: "Cyber Love", duration: 235, albumIdx: 1, plays: 5900000 },
    { title: "Digital Rain", duration: 198, albumIdx: 1, plays: 5200000 },
    { title: "Highway Thunder", duration: 245, albumIdx: 2, plays: 11200000 },
    { title: "Rebel Heart", duration: 223, albumIdx: 2, plays: 9800000 },
    { title: "Burning Road", duration: 267, albumIdx: 2, plays: 8400000 },
    { title: "Midnight Rider", duration: 312, albumIdx: 2, plays: 7900000 },
    { title: "Retro Future", duration: 234, albumIdx: 3, plays: 8900000 },
    { title: "Pixel Dreams", duration: 198, albumIdx: 3, plays: 7600000 },
    { title: "Neon Sunset", duration: 256, albumIdx: 3, plays: 6700000 },
    { title: "Digital Horizon", duration: 289, albumIdx: 3, plays: 6100000 },
    { title: "Smooth Operator", duration: 234, albumIdx: 4, plays: 14500000 },
    { title: "Soul Train", duration: 267, albumIdx: 4, plays: 12300000 },
    { title: "Heart Strings", duration: 198, albumIdx: 4, plays: 9800000 },
    { title: "Groove Theory", duration: 223, albumIdx: 4, plays: 8700000 },
    { title: "Northern Lights", duration: 278, albumIdx: 5, plays: 7200000 },
    { title: "Frozen Waves", duration: 245, albumIdx: 5, plays: 6500000 },
    { title: "Snowfall", duration: 312, albumIdx: 5, plays: 5800000 },
    { title: "Aurora", duration: 198, albumIdx: 5, plays: 5100000 },
    { title: "Drop Zone", duration: 189, albumIdx: 6, plays: 16700000 },
    { title: "Bass Cannon", duration: 215, albumIdx: 6, plays: 13400000 },
    { title: "Wobble", duration: 198, albumIdx: 6, plays: 11200000 },
    { title: "Phantom Beat", duration: 201, albumIdx: 6, plays: 9800000 },
    { title: "Techno Sunrise", duration: 256, albumIdx: 6, plays: 8500000 },
  ]

  const songs = await Promise.all(
    songData.map((s) => {
      const album = albums[s.albumIdx]
      const songIdx = songData.indexOf(s)
      return prisma.song.create({
        data: {
          title: s.title,
          duration: s.duration,
          image: album.image,
          audioUrl: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${(songIdx % 16) + 1}.mp3`,
          artistId: album.artistId,
          albumId: album.id,
          plays: s.plays,
        },
      })
    })
  )

  const playlist = await prisma.playlist.create({
    data: {
      title: "My Favorites",
      description: "My favorite tracks",
      userId: user.id,
      color: "#8400e7",
    },
  })

  await Promise.all(
    songs.slice(0, 5).map((song, index) =>
      prisma.playlistSong.create({
        data: {
          playlistId: playlist.id,
          songId: song.id,
          position: index + 1,
        },
      })
    )
  )

  console.log("Seed data created successfully!")
  console.log(`  - ${artists.length} artists`)
  console.log(`  - ${albums.length} albums`)
  console.log(`  - ${songs.length} songs`)
  console.log(`  - 1 user (demo@example.com / password123)`)
  console.log(`  - 1 playlist`)
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e)
    prisma.$disconnect()
    process.exit(1)
  })
