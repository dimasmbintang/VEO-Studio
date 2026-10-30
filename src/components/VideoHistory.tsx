import React from 'react';
import { Film, Play, Download, Trash2, Clock, Sparkles } from 'lucide-react';
import { GeneratedVideoItem } from './VideoPlayer';

interface VideoHistoryProps {
  history: GeneratedVideoItem[];
  activeId?: string;
  onSelect: (item: GeneratedVideoItem) => void;
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

export const VideoHistory: React.FC<VideoHistoryProps> = ({
  history,
  activeId,
  onSelect,
  onDelete,
  onClearAll,
}) => {
  if (history.length === 0) {
    return (
      <div className="p-8 text-center rounded-2xl bg-slate-900/50 border border-slate-800/80">
        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto mb-3">
          <Film className="w-6 h-6 opacity-70" />
        </div>
        <h4 className="text-sm font-semibold text-white mb-1">Belum Ada Video di Galeri</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Setiap video yang Anda generate akan tersimpan otomatis di sini untuk ditonton dan diunduh kembali kapan saja tanpa batas.
        </p>
      </div>
    );
  }

  const handleDownload = (e: React.MouseEvent, item: GeneratedVideoItem) => {
    e.stopPropagation();
    const a = document.createElement('a');
    a.href = item.url;
    const cleanPrompt = item.prompt.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_');
    a.download = `veo_studio_${cleanPrompt}_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Film className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Galeri & Riwayat Generasi</h3>
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-full">
            {history.length}
          </span>
        </div>

        {history.length > 1 && (
          <button
            onClick={onClearAll}
            className="text-xs text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
          >
            Bersihkan Riwayat
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {history.map((item) => {
          const isActive = item.id === activeId;
          return (
            <div
              key={item.id}
              onClick={() => onSelect(item)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                isActive
                  ? 'bg-indigo-600/15 border-indigo-500/80 shadow-lg shadow-indigo-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Video Mini Preview / Aspect badge */}
                <div className="relative aspect-video rounded-lg bg-black/60 overflow-hidden mb-2.5 flex items-center justify-center border border-slate-800">
                  <video
                    src={item.url}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    muted
                    playsInline
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-indigo-600/80 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-4 h-4 ml-0.5" />
                    </div>
                  </div>

                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-black/80 text-slate-200">
                    {item.aspectRatio}
                  </span>
                  <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-black/80 text-slate-200">
                    {item.duration}s
                  </span>
                </div>

                <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed font-medium mb-2">
                  {item.prompt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/60 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={(e) => handleDownload(e, item)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition-colors"
                    title="Download Video"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(item.id);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/50 text-slate-400 hover:text-rose-300 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
