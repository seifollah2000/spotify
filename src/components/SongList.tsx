'use client';

import { FiPlay, FiHeart, FiClock } from 'react-icons/fi';
import { usePlayerStore } from '@/lib/store';
import { SongType } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function SongList({ songs }: { songs: SongType[] }) {
  const { data: session } = useSession();
  const { playSong, currentSong, isPlaying, togglePlay } = usePlayerStore();
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const toggleLike = async (songId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) return;

    try {
      const res = await fetch('/api/liked', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ songId }),
      });
      const data = await res.json();
      if (data.liked) {
        setLikedIds((prev) => new Set(prev).add(songId));
      } else {
        setLikedIds((prev) => {
          const next = new Set(prev);
          next.delete(songId);
          return next;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-[16px_1fr_1fr_80px] gap-4 px-4 py-2 text-spotify-lightestgray text-xs uppercase tracking-wider border-b border-spotify-gray">
        <span>#</span>
        <span>Title</span>
        <span>Album</span>
        <span className="justify-self-end">
          <FiClock size={14} />
        </span>
      </div>

      {songs.map((song, index) => {
        const isCurrent = currentSong?.id === song.id;
        return (
          <div
            key={song.id}
            onClick={() => playSong(song, songs)}
            className={`grid grid-cols-[16px_1fr_1fr_80px] gap-4 px-4 py-2 rounded-md hover:bg-spotify-gray/60 cursor-pointer group ${
              isCurrent ? 'bg-spotify-gray/40' : ''
            }`}
          >
            <div className="flex items-center">
              <span className="group-hover:hidden text-spotify-lightestgray text-sm">
                {index + 1}
              </span>
              <FiPlay
                className={`hidden group-hover:block text-white ${isCurrent ? 'block group-hover:block' : ''}`}
                size={14}
              />
            </div>
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={song.image || '/placeholder.jpg'}
                alt={song.title}
                className="w-10 h-10 object-cover rounded"
              />
              <div className="min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${isCurrent ? 'text-spotify-green' : 'text-white'}`}
                >
                  {song.title}
                </p>
                <p className="text-xs text-spotify-lightestgray truncate">
                  {song?.artist?.name}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-spotify-lightestgray truncate">
                {song?.album?.title}
              </p>
            </div>
            <div className="flex items-center justify-end gap-2">
              {session && (
                <button
                  onClick={(e) => toggleLike(song?.id, e)}
                  className="hidden group-hover:block"
                >
                  <FiHeart
                    size={14}
                    className={
                      likedIds.has(song.id)
                        ? 'text-spotify-green fill-spotify-green'
                        : 'text-spotify-lightestgray'
                    }
                  />
                </button>
              )}
              <span className="text-sm text-spotify-lightestgray">
                {formatTime(song.duration)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
