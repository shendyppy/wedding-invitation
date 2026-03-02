"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

/**
 * Floating vinyl record music toggle.
 * Plays "Biggest Part of Me" by Ambrosia.
 * Place the MP3 at /public/assets/music.mp3
 */
export function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio("/assets/music.mp3");
    audio.loop = true;
    audio.volume = 0.4;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Auto-play after first user click (browser requires interaction)
  useEffect(() => {
    const play = () => {
      audioRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
      document.removeEventListener("click", play);
    };
    document.addEventListener("click", play);
    return () => document.removeEventListener("click", play);
  }, []);

  const toggle = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <button
      onClick={toggle}
      aria-label={isPlaying ? "Pause music" : "Play music"}
      className={`fixed bottom-6 right-4 z-50 size-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none ${isPlaying ? "music-btn-float" : "hover:scale-110"}`}
    >
      <div
        className={`relative size-10 rounded-full overflow-hidden shadow-lg ${isPlaying ? "music-btn-spin" : ""}`}
        style={{ background: "radial-gradient(circle at 35% 35%, #7a6550, #3d2f1e)" }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{ background: "repeating-radial-gradient(circle at center, transparent 0px, transparent 4px, rgba(255,255,255,0.06) 4px, rgba(255,255,255,0.06) 5px)" }}
        />

        <div className="absolute inset-[18%] rounded-full overflow-hidden">
          <Image src="/assets/together-to-be.GIF" alt="" fill className="object-cover" sizes="34px" unoptimized />
        </div>

        <div className="absolute inset-[44%] rounded-full bg-black/60" />

        {!isPlaying && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/35">
            <svg className="w-5 h-5 text-white ml-0.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {isPlaying && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/30">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
