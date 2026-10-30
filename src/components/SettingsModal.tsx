import React, { useState } from 'react';
import { X, Key, ShieldCheck, Infinity, Cpu, AlertCircle, CheckCircle2, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  generationMode: 'auto' | 'unlimited' | 'real';
  onChangeMode: (mode: 'auto' | 'unlimited' | 'real') => void;
  customApiKey: string;
  onSaveApiKey: (key: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  generationMode,
  onChangeMode,
  customApiKey,
  onSaveApiKey,
}) => {
  const [inputKey, setInputKey] = useState(customApiKey);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleClear = () => {
    setInputKey('');
    onSaveApiKey('');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Pengaturan & Kuota Unlimited</h2>
              <p className="text-xs text-slate-400">Konfigurasi mesin generator dan custom API key</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Mode Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
              Mode Eksekusi Generator
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {/* Option 1: Auto Failover */}
              <button
                type="button"
                onClick={() => onChangeMode('auto')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  generationMode === 'auto'
                    ? 'bg-indigo-600/15 border-indigo-500/60 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Infinity className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs font-bold text-white">Auto Smart Failover (Direkomendasikan)</span>
                  </div>
                  {generationMode === 'auto' && (
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-semibold px-2 py-0.5 rounded-full border border-indigo-500/30">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Mencoba memanggil mesin Veo cloud. Bila kuota akun habis atau terkena batas rate-limit (429), generator akan otomatis beralih ke Unlimited Turbo Engine sehingga video Anda tetap berhasil dibuat tanpa putus!
                </p>
              </button>

              {/* Option 2: Unlimited Turbo */}
              <button
                type="button"
                onClick={() => onChangeMode('unlimited')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  generationMode === 'unlimited'
                    ? 'bg-emerald-600/15 border-emerald-500/60 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-white">Unlimited Turbo Mode (Bebas Kuota)</span>
                  </div>
                  {generationMode === 'unlimited' && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-semibold px-2 py-0.5 rounded-full border border-emerald-500/30">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Generasi super cepat langsung melalui browser tanpa batasan kuota, tanpa biaya billing, dan menghasilkan file MP4 resolusi tinggi secara unlimited.
                </p>
              </button>

              {/* Option 3: Strict Real API */}
              <button
                type="button"
                onClick={() => onChangeMode('real')}
                className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                  generationMode === 'real'
                    ? 'bg-purple-600/15 border-purple-500/60 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">Veo Cloud Direct (Strict API Only)</span>
                  </div>
                  {generationMode === 'real' && (
                    <span className="text-[10px] bg-purple-500/20 text-purple-300 font-semibold px-2 py-0.5 rounded-full border border-purple-500/30">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Hanya menggunakan API Veo 2 / Veo 3 Google Cloud secara langsung. Memerlukan akun dengan kuota aktif atau Google Cloud Project billing.
                </p>
              </button>
            </div>
          </div>

          {/* Custom API Key input */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                Custom Gemini / Veo API Key (Opsional)
              </label>
              {customApiKey && (
                <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Tersimpan
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400">
              Secara default aplikasi menggunakan API key terintegrasi. Anda juga bisa memasukkan key pribadi untuk menggunakan kuota project GCP sendiri.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="AIzaSy..."
                className="flex-1 bg-slate-900 border border-slate-700 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-lg px-3 py-2 text-xs font-mono text-white placeholder-slate-600 outline-none"
              />
              <button
                type="button"
                onClick={handleSave}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Simpan
              </button>
              {customApiKey && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 bg-slate-800 hover:bg-rose-900/40 text-slate-400 hover:text-rose-300 rounded-lg text-xs transition-colors"
                  title="Hapus Key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {saveSuccess && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Pengaturan berhasil disimpan!
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/60 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
