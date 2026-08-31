import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight, Film, Clock, RotateCw } from "lucide-react";

export type TimelineShot = {
  id: string;
  name: string;
  duration: number; // in seconds
  lens?: string;
  movement?: string;
  framing?: string;
  status?: "ready" | "rendering" | "draft";
};

type TimelineScrubberProps = {
  shots: TimelineShot[];
  currentShotId: string;
  onSelectShot: (shotId: string) => void;
  fps?: number;
};

export function TimelineScrubber({
  shots,
  currentShotId,
  onSelectShot,
  fps = 24
}: TimelineScrubberProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0); // in seconds
  const totalDuration = shots.reduce((acc, s) => acc + (s.duration || 4), 0) || 12;
  const trackRef = useRef<HTMLDivElement>(null);

  // Playhead animation loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: number;

    const tick = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;

      setCurrentTime((prev) => {
        const next = prev + delta;
        if (next >= totalDuration) {
          setIsPlaying(false);
          return totalDuration;
        }
        return next;
      });

      if (isPlaying) {
        animationFrameId = requestAnimationFrame(tick);
      }
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(tick);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, totalDuration]);

  // Sync active shot based on currentTime during playback
  useEffect(() => {
    let accumulated = 0;
    for (const shot of shots) {
      const shotDur = shot.duration || 4;
      if (currentTime >= accumulated && currentTime < accumulated + shotDur) {
        if (shot.id !== currentShotId) {
          onSelectShot(shot.id);
        }
        break;
      }
      accumulated += shotDur;
    }
  }, [currentTime, currentShotId, onSelectShot, shots]);

  // Standard SMPTE timecode (HH:MM:SS:FF)
  const formatSMPTETimecode = (seconds: number) => {
    const totalFrames = Math.floor(seconds * fps);
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const f = totalFrames % fps;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
  };

  const isAtEnd = currentTime >= totalDuration;

  const handlePlayToggle = () => {
    if (isAtEnd) {
      setCurrentTime(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const ratio = clickX / rect.width;
    const newTime = ratio * totalDuration;
    setCurrentTime(newTime);
  };

  const handlePreviousShot = () => {
    const currentIndex = shots.findIndex((s) => s.id === currentShotId);
    if (currentIndex > 0) {
      const prevShot = shots[currentIndex - 1];
      onSelectShot(prevShot.id);
      const prevTime = shots.slice(0, currentIndex - 1).reduce((acc, s) => acc + (s.duration || 4), 0);
      setCurrentTime(prevTime);
    }
  };

  const handleNextShot = () => {
    const currentIndex = shots.findIndex((s) => s.id === currentShotId);
    if (currentIndex < shots.length - 1) {
      const nextShot = shots[currentIndex + 1];
      onSelectShot(nextShot.id);
      const nextTime = shots.slice(0, currentIndex + 1).reduce((acc, s) => acc + (s.duration || 4), 0);
      setCurrentTime(nextTime);
    }
  };

  const playheadPercent = (currentTime / totalDuration) * 100;

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#0B1017] p-4 shadow-card-elevation">
      {/* Top Header: Transport & SMPTE Timecode */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={handlePreviousShot}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition"
              title="Previous Shot"
              aria-label="Previous Shot"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              type="button"
              onClick={handlePlayToggle}
              className="flex size-8 items-center justify-center rounded-xl bg-accent text-background font-semibold hover:bg-white transition shadow-glow"
              title={isAtEnd ? "Replay Sequence" : isPlaying ? "Pause Timeline" : "Play Sequence Timing"}
              aria-label={isAtEnd ? "Replay Sequence" : isPlaying ? "Pause Timeline" : "Play Sequence Timing"}
            >
              {isAtEnd ? (
                <RotateCw className="size-4" />
              ) : isPlaying ? (
                <Pause className="size-4 fill-current" />
              ) : (
                <Play className="size-4 fill-current ml-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleNextShot}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition"
              title="Next Shot"
              aria-label="Next Shot"
            >
              <ChevronRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => {
                setCurrentTime(0);
                setIsPlaying(false);
              }}
              className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition ml-1"
              title="Reset to 00:00:00:00"
              aria-label="Reset Playhead"
            >
              <RotateCcw className="size-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1">
            <Film className="size-3.5 text-accent" />
            <span className="text-xs font-mono text-white">
              {shots.length} {shots.length === 1 ? "Shot" : "Shots"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Clock className="size-3.5 text-gold" />
          <div className="text-right">
            <span className="font-mono text-xs sm:text-sm font-semibold tracking-wider text-white">
              {formatSMPTETimecode(currentTime)}
            </span>
            <span className="font-mono text-xs text-slate-400"> / {formatSMPTETimecode(totalDuration)}</span>
          </div>
          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 border border-white/10">
            SMPTE {fps} FPS
          </span>
        </div>
      </div>

      {/* Timeline Track & Film Strip */}
      <div className="relative mt-4 pt-4">
        {/* Human-readable second ticks ruler */}
        <div className="absolute top-0 inset-x-0 flex justify-between px-1 text-[10px] font-mono text-slate-400">
          <span>0s</span>
          <span>{Math.round(totalDuration * 0.25)}s</span>
          <span>{Math.round(totalDuration * 0.5)}s</span>
          <span>{Math.round(totalDuration * 0.75)}s</span>
          <span>{Math.round(totalDuration)}s</span>
        </div>

        {/* Shots Strip Container */}
        <div
          ref={trackRef}
          onClick={handleTrackClick}
          className="relative mt-2 flex min-h-[76px] w-full cursor-pointer overflow-hidden rounded-xl border border-white/10 bg-black/60"
        >
          {shots.map((shot, idx) => {
            const shotDur = shot.duration || 4;
            const shotWidthPct = (shotDur / totalDuration) * 100;
            const isSelected = shot.id === currentShotId;

            return (
              <button
                key={shot.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectShot(shot.id);
                  const startTime = shots.slice(0, idx).reduce((acc, s) => acc + (s.duration || 4), 0);
                  setCurrentTime(startTime);
                }}
                style={{ width: `${shotWidthPct}%` }}
                className={`relative flex flex-col justify-between border-r border-white/15 p-2.5 text-left transition-all min-w-[110px] ${
                  isSelected
                    ? "bg-accent/20 border-t-2 border-t-accent shadow-[inset_0_0_12px_rgba(56,189,248,0.15)]"
                    : "bg-white/[0.03] hover:bg-white/[0.08]"
                }`}
                aria-label={`Shot ${idx + 1}: ${shot.name}`}
                aria-pressed={isSelected}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[11px] font-semibold text-white leading-tight">
                    #{idx + 1} {shot.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{shotDur}s</span>
                </div>

                <div className="flex flex-wrap items-center gap-1 mt-1">
                  {shot.lens && (
                    <span className="rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-mono text-gold border border-white/10 whitespace-nowrap">
                      {shot.lens}
                    </span>
                  )}
                  {shot.movement && (
                    <span className="rounded bg-black/70 px-1.5 py-0.5 text-[9px] text-accent border border-white/10 whitespace-nowrap">
                      {shot.movement}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Draggable Playhead Needle */}
          <div
            style={{ left: `${Math.min(100, Math.max(0, playheadPercent))}%` }}
            className="pointer-events-none absolute top-0 bottom-0 z-20 w-0.5 bg-rose shadow-[0_0_8px_rgba(251,113,133,0.8)]"
          >
            <div className="-ml-1.5 -top-1 absolute size-3.5 rounded-full bg-rose border-2 border-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
