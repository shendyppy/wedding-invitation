"use client";

import { type RefObject, type Dispatch, type SetStateAction } from "react";
import Image from "next/image";

interface MusicToggleProps {
  audioRef: RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  setIsPlaying: Dispatch<SetStateAction<boolean>>;
}

/**
 * Floating vinyl record music toggle.
 * Audio is controlled by the parent (InvitationTemplate).
 * Music starts as soon as "Buka Undangan" is clicked.
 */
export function MusicToggle({
  audioRef,
  isPlaying,
  setIsPlaying,
}: MusicToggleProps) {
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
      className={`fixed bottom-4 right-3 z-50 size-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none sm:bottom-6 sm:right-4 ${isPlaying ? "music-btn-float" : "hover:scale-110"}`}
    >
      <div
        className={`relative size-10 rounded-full overflow-hidden shadow-lg ${isPlaying ? "music-btn-spin" : ""}`}
        style={{
          background: "radial-gradient(circle at 35% 35%, #7a6550, #3d2f1e)",
        }}
      >
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "repeating-radial-gradient(circle at center, transparent 0px, transparent 4px, rgba(255,255,255,0.06) 4px, rgba(255,255,255,0.06) 5px)",
          }}
        />

        <div className="absolute inset-[44%] rounded-full bg-black/60" />

        {!isPlaying && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/35">
            <svg
              className="w-5 h-5 text-white ml-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {isPlaying && (
          <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 bg-black/30">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
          </div>
        )}
      </div>
    </button>
  );
}
