"use client"

import { useEffect, useRef } from "react"
import { usePlayerStore } from "@/lib/store"
import { FiPlay, FiPause, FiSkipBack, FiSkipForward, FiVolume2, FiVolumeX } from "react-icons/fi"
import Image from "next/image"
import { formatTime } from "@/lib/utils"

export default function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLInputElement>(null)
  const volumeRef = useRef<HTMLInputElement>(null)

  const {
    currentSong,
    isPlaying,
    volume,
    progress,
    setProgress,
    setIsPlaying,
    setVolume,
    nextSong,
    prevSong,
    togglePlay,
  } = usePlayerStore()

  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.audioUrl
      audioRef.current.volume = volume
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      }
    }
  }, [currentSong])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false))
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100
      setProgress(currentProgress)
      if (progressRef.current) {
        progressRef.current.style.setProperty("--progress", `${currentProgress}%`)
      }
    }
  }

  const handleEnded = () => {
    nextSong()
  }

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    if (audioRef.current && audioRef.current.duration) {
      audioRef.current.currentTime = (value / 100) * audioRef.current.duration
      setProgress(value)
      e.target.style.setProperty("--progress", `${value}%`)
    }
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value)
    setVolume(value)
    e.target.style.setProperty("--progress", `${value * 100}%`)
  }

  if (!currentSong) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-20 bg-spotify-darker border-t border-spotify-gray flex items-center justify-center">
        <p className="text-spotify-lightestgray text-sm">Select a song to play</p>
      </div>
    )
  }

  const currentTime = audioRef.current ? audioRef.current.currentTime : 0
  const duration = audioRef.current ? audioRef.current.duration : 0

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-spotify-darker border-t border-spotify-gray flex items-center px-4 z-50">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <div className="flex items-center gap-3 w-72">
        {currentSong.image && (
          <Image
            src={currentSong.image}
            alt={currentSong.title}
            width={48}
            height={48}
            className="rounded"
          />
        )}
        <div className="min-w-0">
          <p className="text-sm text-white font-semibold truncate">{currentSong.title}</p>
          <p className="text-xs text-spotify-lightestgray truncate">{currentSong.artist.name}</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center gap-1 max-w-xl mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={prevSong} className="text-spotify-lightestgray hover:text-white transition-colors">
            <FiSkipBack size={18} />
          </button>
          <button
            onClick={togglePlay}
            className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <FiPause className="text-black" size={16} /> : <FiPlay className="text-black ml-0.5" size={16} />}
          </button>
          <button onClick={nextSong} className="text-spotify-lightestgray hover:text-white transition-colors">
            <FiSkipForward size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <span className="text-xs text-spotify-lightestgray w-8 text-right">{formatTime(currentTime)}</span>
          <input
            ref={progressRef}
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleProgressChange}
            className="flex-1 h-1"
            style={{ "--progress": `${progress || 0}%` } as React.CSSProperties}
          />
          <span className="text-xs text-spotify-lightestgray w-8">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="w-72 flex items-center justify-end gap-2">
        {volume === 0 ? <FiVolumeX size={18} className="text-spotify-lightestgray" /> : <FiVolume2 size={18} className="text-spotify-lightestgray" />}
        <input
          ref={volumeRef}
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24 h-1"
          style={{ "--progress": `${volume * 100}%` } as React.CSSProperties}
        />
      </div>
    </div>
  )
}
