import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Camera,
  Palette,
  SunMedium,
  Sparkles,
  HelpCircle,
  Copy,
  Check,
  ArrowRight,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import {
  CAMERA_MOVEMENTS,
  CINEMATIC_STYLES,
  LIGHTING_PRESETS,
  CURATED_TEMPLATES,
  VEO_TIPS,
  PromptTemplate,
  DirectingOption,
} from '../data/guideData';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPrompt: (template: PromptTemplate) => void;
  onAppendDirecting: (type: 'camera' | 'style' | 'lighting', snippet: string) => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({
  isOpen,
  onClose,
  onApplyPrompt,
  onAppendDirecting,
}) => {
  const [activeTab, setActiveTab] = useState<'formula' | 'templates' | 'camera' | 'style' | 'lighting' | 'tips'>('formula');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Panduan Sinematik Google Veo
                <span className="text-[10px] font-mono uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                  Tutorial & Presets
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Formula prompt, teknik pergerakan kamera, dan template inspirasi video sinematik
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1.5 px-6 py-2.5 bg-slate-950/30 border-b border-slate-800/80 overflow-x-auto text-xs font-medium">
          <button
            onClick={() => setActiveTab('formula')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'formula'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Formula Veo
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Template Siap Pakai
          </button>
          <button
            onClick={() => setActiveTab('camera')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'camera'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            Gerakan Kamera
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'style'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            Gaya Visual
          </button>
          <button
            onClick={() => setActiveTab('lighting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'lighting'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <SunMedium className="w-3.5 h-3.5" />
            Pencahayaan
          </button>
          <button
            onClick={() => setActiveTab('tips')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'tips'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Tips & Trik
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: FORMULA PROMPT */}
          {activeTab === 'formula' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-900 border border-indigo-500/30">
                <h3 className="text-sm font-semibold text-indigo-300 mb-1 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Formula Anatomi Prompt Veo (5 Elemen Kunci)
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Mesin Google Veo memahami simulasi fisika, pencahayaan foton, dan gerakan kamera sinematik. Susun prompt Anda mengikuti formula di bawah ini untuk hasil yang memukau:
                </p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                    <span className="block font-bold text-indigo-400 text-[11px] mb-1">1. SUBJEK</span>
                    <span className="text-slate-300">Siapa/apa objek utama di video?</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                    <span className="block font-bold text-violet-400 text-[11px] mb-1">2. GERAKAN</span>
                    <span className="text-slate-300">Aksi fisik dinamis yang terjadi</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                    <span className="block font-bold text-cyan-400 text-[11px] mb-1">3. KAMERA</span>
                    <span className="text-slate-300">Dolly, orbit, drone, tracking pan</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                    <span className="block font-bold text-amber-400 text-[11px] mb-1">4. PENCAHAYAAN</span>
                    <span className="text-slate-300">Golden hour, neon, rim light</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-700/60">
                    <span className="block font-bold text-emerald-400 text-[11px] mb-1">5. GAYA VISUAL</span>
                    <span className="text-slate-300">8K photoreal, 35mm film, anime</span>
                  </div>
                </div>
              </div>

              {/* Perbandingan Contoh */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400 block mb-1">
                    ❌ Prompt Biasa (Hasil Kurang Maksimal)
                  </span>
                  <p className="text-xs text-slate-300 font-mono bg-slate-950/60 p-3 rounded-lg border border-rose-500/20 mb-2">
                    "Mobil balap ngebut di jalan malam hari"
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Hasilnya seringkali kaku, sudut kamera acak, dan pencahayaan datar tanpa kedalaman dramatis.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                    ✅ Prompt Sinematik Veo (Hasil Maksimal)
                  </span>
                  <p className="text-xs text-slate-200 font-mono bg-slate-950/60 p-3 rounded-lg border border-emerald-500/20 mb-2">
                    "A customized midnight-purple sports car drifting along a rain-slicked mountain pass, tires smoking, low-angle tracking camera following centimeters above the asphalt, warm golden taillight trails reflecting on wet puddles, cinematic 8K, 35mm anamorphic lens."
                  </p>
                  <p className="text-[11px] text-slate-300">
                    Kamera dinamis, detail partikel asap ban, dan pantulan air di aspal membuat video hidup!
                  </p>
                </div>
              </div>

              {/* Auto Enhancer Notice */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                <div className="text-xs">
                  <span className="font-semibold text-slate-200">Tips Cepat: </span>
                  <span className="text-slate-400">
                    Anda cukup mengetik ide singkat di kotak input, lalu klik tombol <strong className="text-indigo-300">"Sempurnakan Prompt (AI)"</strong>. AI akan otomatis mengubahnya menjadi prompt Veo profesional berstandar Hollywood!
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TEMPLATE SIAP PAKAI */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Klik <strong>"Gunakan Prompt Ini"</strong> untuk memuat prompt, setting kamera, gaya visual, dan aspek rasio langsung ke generator Anda!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CURATED_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-indigo-500/50 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-500/20">
                          {tmpl.category}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                          {tmpl.aspectRatio}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
                        {tmpl.title}
                      </h4>
                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-3">
                        {tmpl.prompt}
                      </p>
                      <div className="text-[11px] text-slate-400 space-y-1 mb-4 border-t border-slate-800/60 pt-2 font-mono">
                        <div><strong className="text-slate-300">Kamera:</strong> {tmpl.camera}</div>
                        <div><strong className="text-slate-300">Lighting:</strong> {tmpl.lighting}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={() => {
                          onApplyPrompt(tmpl);
                          onClose();
                        }}
                        className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                      >
                        <span>Gunakan Prompt Ini</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleCopy(tmpl.prompt, tmpl.id)}
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="Salin Prompt"
                      >
                        {copiedId === tmpl.id ? (
                          <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: GERAKAN KAMERA */}
          {activeTab === 'camera' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Pilih gerakan kamera untuk memberi instruksi pergerakan lensa dan stabilitas pada Veo:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CAMERA_MOVEMENTS.map((cam) => (
                  <div
                    key={cam.id}
                    className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-cyan-400" />
                          {cam.label}
                        </h4>
                      </div>
                      <p className="text-xs text-slate-300 mb-2">{cam.description}</p>
                      <p className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800/60 mb-3">
                        "{cam.promptSnippet}"
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onAppendDirecting('camera', cam.promptSnippet);
                        onClose();
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Terapkan Gerakan Kamera</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: GAYA VISUAL */}
          {activeTab === 'style' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Katalog gaya visual sinematik untuk membentuk estetika, ketajaman, dan grading warna video:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CINEMATIC_STYLES.map((st) => (
                  <div
                    key={st.id}
                    className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
                        <Palette className="w-3.5 h-3.5 text-violet-400" />
                        {st.label}
                      </h4>
                      <p className="text-xs text-slate-300 mb-2">{st.description}</p>
                      <p className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800/60 mb-3">
                        "{st.promptSnippet}"
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onAppendDirecting('style', st.promptSnippet);
                        onClose();
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-violet-600 text-slate-200 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Terapkan Gaya Visual</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PENCAHAYAAN */}
          {activeTab === 'lighting' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">
                Pencahayaan memegang peranan krusial dalam membentuk kedalaman 3D dan mood emosional video:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {LIGHTING_PRESETS.map((lt) => (
                  <div
                    key={lt.id}
                    className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5 mb-1.5">
                        <SunMedium className="w-3.5 h-3.5 text-amber-400" />
                        {lt.label}
                      </h4>
                      <p className="text-xs text-slate-300 mb-2">{lt.description}</p>
                      <p className="text-[11px] text-slate-400 font-mono bg-slate-900 p-2 rounded border border-slate-800/60 mb-3">
                        "{lt.promptSnippet}"
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onAppendDirecting('lighting', lt.promptSnippet);
                        onClose();
                      }}
                      className="w-full py-1.5 px-3 rounded-lg bg-slate-800 hover:bg-amber-600 text-slate-200 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Terapkan Pencahayaan</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: TIPS & TRIK */}
          {activeTab === 'tips' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3">
                {VEO_TIPS.map((tip, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white mb-1">{tip.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
          <span>Veo Studio Guide v2.5</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
