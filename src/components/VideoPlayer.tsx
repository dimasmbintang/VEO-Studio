import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Download,
  Copy,
  Check,
  Sparkles,
  Info,
  Clock,
  Layers,
  Infinity,
} from 'lucide-react';

export interface GeneratedVideoItem {
  id: string;
  url: string;
  prompt: string;
  model: string;
  mode: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  duration: number;
  resolution: string;
  timestamp: string;
  thumbnail?: string;
}

interface VideoPlayerProps {
  item: GeneratedVideoItem;
  onRegenerate?: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ item, onRegenerate }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isLooping, setIsLooping] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [item.url]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration || item.duration || 5);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = item.url;
    const cleanPrompt = item.prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
    a.download = `veo_studio_${cleanPrompt}_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(item.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine aspect ratio class
  let aspectClass = 'aspect-video'; // 16:9
  if (item.aspectRatio === '9:16') {
    aspectClass = 'aspect-[9/16] max-h-[580px] mx-auto';
  } else if (item.aspectRatio === '1:1') {
    aspectClass = 'aspect-square max-h-[520px] mx-auto';
  }

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="flex flex-col rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl transition-all">
      {/* Top Bar / Metadata Header */}
      <div className="px-4 py-3 bg-slate-950/70 border-b border-slate-800/80 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-semibold text-white truncate max-w-[280px] sm:max-w-[400px]">
            {item.prompt}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
            {item.aspectRatio}
          </span>
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 hidden sm:inline">
            {item.resolution || '1080p'}
          </span>
          {item.mode.includes('unlimited') ? (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 flex items-center gap-1">
              <Infinity className="w-3 h-3" /> Turbo
            </span>
          ) : (
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
              Veo Engine
            </span>
          )}
        </div>
      </div>

      {/* Video Container Stage */}
      <div className="relative bg-black flex items-center justify-center overflow-hidden group">
        {/* Glow backlight */}
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-cyan-500/10 blur-xl pointer-events-none" />

        <div className={`w-full relative ${aspectClass}`}>
          <video
            ref={videoRef}
            src={item.url}
            className="w-full h-full object-contain"
            autoPlay
            loop={isLooping}
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={() => setIsPlaying(false)}
            onClick={togglePlay}
          />

          {/* Center Play Overlay when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
            >
              <Play className="w-7 h-7 ml-1" />
            </button>
          )}
        </div>
      </div>

      {/* Video Player Controls */}
      <div className="px-4 py-3 bg-slate-950/90 border-t border-slate-800/80 space-y-2">
        {/* Progress Scrubber */}
        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 1}
            step={0.05}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
          <span>{formatTime(duration)}</span>
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="flex items-center gap-1.5">
            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>

            {/* Loop */}
            <button
              onClick={() => setIsLooping(!isLooping)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isLooping ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
              title={isLooping ? 'Looping Aktif' : 'Loop Non-aktif'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Volume */}
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Fullscreen"
            >
              <Maximize className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Copy Prompt */}
            <button
              onClick={handleCopyPrompt}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
              title="Salin Prompt"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Tersalin' : 'Salin Prompt'}</span>
            </button>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download MP4</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expandable Prompt and Details Footer */}
      <div className="p-4 bg-slate-950/40 border-t border-slate-800/60 text-xs space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Prompt Video:
            </span>
            <p className="text-slate-300 leading-relaxed font-sans text-xs">
              {item.prompt}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-800/40">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-500" />
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-500" />
            Model: {item.model}
          </span>
          <span>•</span>
          <span>Durasi: {item.duration}s</span>
        </div>
      </div>
    </div>
  );
};
