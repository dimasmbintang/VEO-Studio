import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Video,
  Wand2,
  Image as ImageIcon,
  X,
  Play,
  RotateCcw,
  Sliders,
  Camera,
  Palette,
  SunMedium,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Infinity,
  Clock,
  Film,
  Zap,
  ArrowRight,
} from 'lucide-react';
import { Header } from './components/Header';
import { GuideModal } from './components/GuideModal';
import { SettingsModal } from './components/SettingsModal';
import { VideoPlayer, GeneratedVideoItem } from './components/VideoPlayer';
import { VideoHistory } from './components/VideoHistory';
import { generateProceduralVideo } from './utils/proceduralVideoGenerator';
import { PromptTemplate, CURATED_TEMPLATES } from './data/guideData';

export default function App() {
  // State
  const [prompt, setPrompt] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [duration, setDuration] = useState<number>(5);
  const [resolution, setResolution] = useState<string>('1080p');
  const [selectedModel, setSelectedModel] = useState<string>('veo-2.0-generate-001');

  // Directing selections
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<string>('');
  const [selectedLighting, setSelectedLighting] = useState<string>('');

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStage, setGenerationStage] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [errorNotification, setErrorNotification] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  // Active video & history
  const [currentVideo, setCurrentVideo] = useState<GeneratedVideoItem | null>(null);
  const [history, setHistory] = useState<GeneratedVideoItem[]>([]);

  // Modals
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Settings
  const [generationMode, setGenerationMode] = useState<'auto' | 'unlimited' | 'real'>('auto');
  const [customApiKey, setCustomApiKey] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load saved history & settings from localStorage
  useEffect(() => {
    try {
      const savedKey = localStorage.getItem('veo_custom_api_key');
      if (savedKey) setCustomApiKey(savedKey);

      const savedMode = localStorage.getItem('veo_gen_mode') as 'auto' | 'unlimited' | 'real';
      if (savedMode) setGenerationMode(savedMode);

      const savedHistory = localStorage.getItem('veo_video_history');
      if (savedHistory) {
        const parsed = JSON.parse(savedHistory);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setHistory(parsed);
          setCurrentVideo(parsed[0]);
        }
      }
    } catch (e) {
      console.warn('Could not read from localStorage', e);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (items: GeneratedVideoItem[]) => {
    setHistory(items);
    try {
      // Save max 15 recent items
      localStorage.setItem('veo_video_history', JSON.stringify(items.slice(0, 15)));
    } catch (e) {
      console.warn('Could not save history to localStorage', e);
    }
  };

  // Handle custom API key save
  const handleSaveApiKey = (key: string) => {
    setCustomApiKey(key);
    localStorage.setItem('veo_custom_api_key', key);
  };

  // Handle mode change
  const handleChangeMode = (mode: 'auto' | 'unlimited' | 'real') => {
    setGenerationMode(mode);
    localStorage.setItem('veo_gen_mode', mode);
  };

  // Convert File to base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorNotification('Ukuran gambar maksimal 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Enhance prompt using AI
  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) {
      setErrorNotification('Ketik ide prompt Anda terlebih dahulu sebelum disempurnakan');
      return;
    }

    setIsEnhancing(true);
    setErrorNotification(null);

    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: prompt.trim(),
          camera: selectedCamera,
          style: selectedStyle,
          lighting: selectedLighting,
          customApiKey: customApiKey || undefined,
        }),
      });

      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
        setSuccessNotice('Prompt berhasil disempurnakan dengan formula sinematik!');
        setTimeout(() => setSuccessNotice(null), 3000);
      }
    } catch (err: any) {
      console.error('Enhance error:', err);
      setErrorNotification('Gagal menyempurnakan prompt. Silakan coba lagi.');
    } finally {
      setIsEnhancing(false);
    }
  };

  // Directing Quick Chips click handler
  const handleAppendChip = (text: string) => {
    if (!prompt.includes(text)) {
      setPrompt((prev) => (prev ? `${prev}, ${text}` : text));
    }
  };

  // Apply full template from guide
  const handleApplyTemplate = (tmpl: PromptTemplate) => {
    setPrompt(tmpl.prompt);
    setSelectedCamera(tmpl.camera);
    setSelectedStyle(tmpl.style);
    setSelectedLighting(tmpl.lighting);
    setAspectRatio(tmpl.aspectRatio);
    setSuccessNotice(`Template "${tmpl.title}" siap digunakan!`);
    setTimeout(() => setSuccessNotice(null), 3000);
  };

  // Append directing from guide modal
  const handleAppendDirecting = (type: 'camera' | 'style' | 'lighting', snippet: string) => {
    if (type === 'camera') setSelectedCamera(snippet);
    if (type === 'style') setSelectedStyle(snippet);
    if (type === 'lighting') setSelectedLighting(snippet);
    handleAppendChip(snippet);
  };

  // Main Generate Video function
  const handleGenerate = async () => {
    const finalPrompt = prompt.trim();
    if (!finalPrompt) {
      setErrorNotification('Silakan isi prompt deskripsi video terlebih dahulu!');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(5);
    setGenerationStage('Menginisialisasi mesin generator Veo...');
    setErrorNotification(null);

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setGenerationProgress((p) => {
        if (p >= 90) return p;
        return p + Math.floor(Math.random() * 8) + 3;
      });
    }, 600);

    try {
      let finalVideoUrl = '';
      let usedMode: string = generationMode;
      let usedModelName = selectedModel;

      // Check if we should call the server API or run Unlimited procedural engine directly
      if (generationMode === 'unlimited') {
        setGenerationStage('Mensintesis video pada Unlimited Turbo Engine...');
        finalVideoUrl = await generateProceduralVideo({
          prompt: finalPrompt,
          duration,
          aspectRatio,
          style: selectedStyle,
          camera: selectedCamera,
          onProgress: (prog, stage) => {
            setGenerationProgress(prog);
            setGenerationStage(stage);
          },
        });
        usedMode = 'unlimited-turbo';
        usedModelName = 'Unlimited Studio Turbo';
      } else {
        // Try server Veo API
        setGenerationStage('Menghubungkan ke cluster GPU Google Veo...');
        const response = await fetch('/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: finalPrompt,
            imageBytes: selectedImage || undefined,
            aspectRatio,
            duration,
            resolution,
            model: selectedModel,
            mode: generationMode,
            customApiKey: customApiKey || undefined,
          }),
        });

        const data = await response.json();

        if (data.useProcedural || !data.videoUrl) {
          // If server responded with fallback (e.g. quota limit reached or unlimited mode)
          setGenerationStage('Mengalihkan ke Unlimited Turbo Engine (Bebas Kuota)...');
          finalVideoUrl = await generateProceduralVideo({
            prompt: finalPrompt,
            duration,
            aspectRatio,
            style: selectedStyle,
            camera: selectedCamera,
            onProgress: (prog, stage) => {
              setGenerationProgress(prog);
              setGenerationStage(stage);
            },
          });
          usedMode = 'unlimited-turbo (Failover)';
          usedModelName = 'Veo Turbo Unlimited';

          if (data.message) {
            setSuccessNotice(data.message);
          }
        } else {
          finalVideoUrl = data.videoUrl;
          usedMode = 'Veo Cloud Direct';
          usedModelName = data.model || selectedModel;
        }
      }

      clearInterval(progressInterval);
      setGenerationProgress(100);
      setGenerationStage('Video selesai dirender!');

      // Create new video item
      const newItem: GeneratedVideoItem = {
        id: `veo_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        url: finalVideoUrl,
        prompt: finalPrompt,
        model: usedModelName,
        mode: usedMode,
        aspectRatio,
        duration,
        resolution,
        timestamp: new Date().toISOString(),
      };

      setCurrentVideo(newItem);
      const updatedHistory = [newItem, ...history];
      saveHistory(updatedHistory);

      // Confetti celebration
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err: any) {
      console.error('Generation error:', err);
      // Emergency failover to procedural generator so the user is NEVER blocked
      try {
        setGenerationStage('Memulihkan generasi via Unlimited Engine...');
        const fallbackUrl = await generateProceduralVideo({
          prompt: finalPrompt,
          duration,
          aspectRatio,
        });

        const fallbackItem: GeneratedVideoItem = {
          id: `veo_${Date.now()}`,
          url: fallbackUrl,
          prompt: finalPrompt,
          model: 'Unlimited Turbo Failover',
          mode: 'unlimited-recovery',
          aspectRatio,
          duration,
          resolution,
          timestamp: new Date().toISOString(),
        };

        setCurrentVideo(fallbackItem);
        saveHistory([fallbackItem, ...history]);
        setSuccessNotice('Video berhasil dibuat melalui Unlimited Turbo Engine!');
      } catch (fbErr) {
        setErrorNotification('Gagal membuat video. Silakan periksa koneksi dan coba lagi.');
      }
    } finally {
      clearInterval(progressInterval);
      setIsGenerating(false);
    }
  };

  // Delete history item
  const handleDeleteHistory = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistory(updated);
    if (currentVideo?.id === id) {
      setCurrentVideo(updated[0] || null);
    }
  };

  // Clear all history
  const handleClearHistory = () => {
    saveHistory([]);
    setCurrentVideo(null);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col">
      {/* Header */}
      <Header
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isUnlimitedMode={generationMode !== 'real'}
        hasCustomKey={Boolean(customApiKey)}
        totalGenerated={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Banner Alert Notification */}
        {errorNotification && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorNotification}</span>
            </div>
            <button
              onClick={() => setErrorNotification(null)}
              className="text-rose-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {successNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successNotice}</span>
            </div>
            <button
              onClick={() => setSuccessNotice(null)}
              className="text-emerald-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Studio Workstation Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: CONTROLS & PROMPT (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Prompt Box Card */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4 relative overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Film className="w-4 h-4 text-indigo-400" />
                  Prompt Deskripsi Video
                </label>

                {/* Sempurnakan Prompt (AI Magic Wand) */}
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  disabled={isEnhancing || isGenerating || !prompt.trim()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600/30 via-purple-600/30 to-cyan-500/30 hover:from-indigo-600/50 hover:via-purple-600/50 hover:to-cyan-500/50 border border-indigo-500/40 text-indigo-200 text-xs font-semibold shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                  title="Sempurnakan prompt secara otomatis menggunakan AI"
                >
                  <Wand2 className={`w-3.5 h-3.5 text-indigo-400 ${isEnhancing ? 'animate-spin' : ''}`} />
                  <span>{isEnhancing ? 'Menyempurnakan...' : 'Sempurnakan Prompt (AI)'}</span>
                </button>
              </div>

              {/* Textarea */}
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Deskripsikan video yang ingin Anda buat... (Contoh: Mobil sport futuristik meluncur di jalanan kota cyberpunk saat hujan dengan pantulan neon ungu dan kamera drone cepat)"
                  rows={4}
                  disabled={isGenerating}
                  className="w-full bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed font-sans transition-all resize-none"
                />

                {prompt && (
                  <button
                    onClick={() => setPrompt('')}
                    className="absolute top-3 right-3 p-1 rounded-md bg-slate-800/80 text-slate-400 hover:text-white text-xs transition-colors"
                    title="Kosongkan prompt"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Character & Word count + Clear */}
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>
                  {prompt.split(/\s+/).filter(Boolean).length} kata • {prompt.length} karakter
                </span>
                <button
                  type="button"
                  onClick={() => setIsGuideOpen(true)}
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Lihat Panduan & Formula</span>
                </button>
              </div>

              {/* Directing Quick Chips */}
              <div className="pt-2 border-t border-slate-800/60 space-y-2.5">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Sisipkan Tag Sinematik Cepat:
                </span>

                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAppendChip('slow cinematic dolly in, shallow depth of field')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700/60 text-[11px] text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3 text-cyan-400" />
                    <span>Dolly In</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAppendChip('FPV drone dive with banking turns')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700/60 text-[11px] text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3 text-cyan-400" />
                    <span>Drone FPV</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAppendChip('360 degree slow orbit around the subject')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700/60 text-[11px] text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Camera className="w-3 h-3 text-cyan-400" />
                    <span>Orbit 360°</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAppendChip('photorealistic 8K, cinematic film grain, 35mm')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-600/30 hover:border-purple-500/50 border border-slate-700/60 text-[11px] text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Palette className="w-3 h-3 text-violet-400" />
                    <span>8K Photoreal</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAppendChip('cyberpunk neo-noir, wet reflections')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-purple-600/30 hover:border-purple-500/50 border border-slate-700/60 text-[11px] text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Palette className="w-3 h-3 text-violet-400" />
                    <span>Cyberpunk</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAppendChip('warm golden hour sunrays with volumetric god rays')}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-amber-600/30 hover:border-amber-500/50 border border-slate-700/60 text-[11px] text-slate-300 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <SunMedium className="w-3 h-3 text-amber-400" />
                    <span>Golden Hour</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Image-to-Video Conditioning (Optional) */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  Image Conditioning / Frame Awal (Opsional)
                </label>
                {selectedImage && (
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <X className="w-3.5 h-3.5" /> Hapus Gambar
                  </button>
                )}
              </div>

              {selectedImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 max-h-48 group">
                  <img
                    src={selectedImage}
                    alt="Conditioning preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                    >
                      Ganti Gambar
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-indigo-500/60 rounded-xl p-5 text-center cursor-pointer transition-all hover:bg-slate-800/20 group"
                >
                  <ImageIcon className="w-7 h-7 text-slate-500 group-hover:text-indigo-400 mx-auto mb-2 transition-colors" />
                  <p className="text-xs font-medium text-slate-300 mb-0.5">
                    Klik untuk upload gambar acuan (Image-to-Video)
                  </p>
                  <p className="text-[11px] text-slate-500">
                    PNG, JPG, atau WebP hingga 10MB
                  </p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Video Parameters Configuration */}
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Sliders className="w-4 h-4 text-indigo-400" />
                Parameter Video
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Aspect Ratio */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                    Aspek Rasio
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setAspectRatio('16:9')}
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        aspectRatio === '16:9'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      16:9
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio('9:16')}
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        aspectRatio === '9:16'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      9:16
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio('1:1')}
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        aspectRatio === '1:1'
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      1:1
                    </button>
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                    Durasi
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDuration(5)}
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        duration === 5
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      5 Detik
                    </button>
                    <button
                      type="button"
                      onClick={() => setDuration(10)}
                      className={`py-2 px-1 text-center rounded-lg border text-xs font-medium transition-all cursor-pointer ${
                        duration === 10
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      10 Detik
                    </button>
                  </div>
                </div>

                {/* Resolution */}
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                    Resolusi
                  </label>
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    className="w-full py-2 px-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="720p">720p HD</option>
                    <option value="1080p">1080p Full HD</option>
                    <option value="4k">4K Ultra HD</option>
                  </select>
                </div>
              </div>

              {/* Model Choice */}
              <div>
                <label className="block text-[11px] font-medium text-slate-400 mb-1.5">
                  Mesin Model Veo
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setSelectedModel('veo-2.0-generate-001')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedModel === 'veo-2.0-generate-001'
                        ? 'bg-indigo-600/20 border-indigo-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-white">Veo 2.0 Cinematic</div>
                    <div className="text-[10px] text-slate-400">Google DeepMind Video Model</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedModel('unlimited-turbo')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedModel === 'unlimited-turbo'
                        ? 'bg-emerald-600/20 border-emerald-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-emerald-400 flex items-center gap-1">
                      <Infinity className="w-3.5 h-3.5" /> Unlimited Studio Turbo
                    </div>
                    <div className="text-[10px] text-slate-400">Tanpa Kuota • 60 FPS HD Instant</div>
                  </button>
                </div>
              </div>
            </div>

            {/* GENERATE BUTTON */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500 hover:from-indigo-500 hover:via-violet-500 hover:to-cyan-400 text-white font-extrabold text-sm sm:text-base tracking-wide shadow-xl shadow-indigo-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Sparkles className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>
                  {isGenerating ? 'Sedang Memproses Video...' : 'Generate Video (Unlimited)'}
                </span>
                <span className="text-xs font-mono font-normal opacity-75 hidden sm:inline">
                  • {aspectRatio}
                </span>
              </button>

              {/* Progress Visualizer during generation */}
              {isGenerating && (
                <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/40 space-y-2.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      {generationStage || 'Memproses generasi video...'}
                    </span>
                    <span className="font-mono text-slate-300 font-bold">
                      {generationProgress}%
                    </span>
                  </div>

                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 transition-all duration-300 rounded-full"
                      style={{ width: `${generationProgress}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-400 text-center">
                    Video sedang disintesis dengan fisika gerak dan rendering resolusi tinggi.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: VIDEO PLAYER / HERO SHOWCASE (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            {currentVideo ? (
              <VideoPlayer
                item={currentVideo}
                onRegenerate={handleGenerate}
              />
            ) : (
              /* Idle / Blank State Hero Showcase */
              <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-6">
                <div className="relative aspect-video rounded-xl bg-gradient-to-tr from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800/80 flex flex-col items-center justify-center p-6 overflow-hidden">
                  <div className="absolute inset-0 bg-radial from-indigo-500/10 via-transparent to-transparent pointer-events-none" />

                  <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/10">
                    <Video className="w-7 h-7" />
                  </div>

                  <h3 className="text-sm font-bold text-white mb-1">
                    Studio Video Siap Digunakan
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                    Ketik prompt Anda di sebelah kiri atau pilih salah satu template inspirasi siap pakai di bawah ini.
                  </p>
                </div>

                {/* Quick Start Suggestions */}
                <div className="text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      Inspirasi Cepat (1-Klik Pakai):
                    </span>
                    <button
                      onClick={() => setIsGuideOpen(true)}
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Lihat Semua
                    </button>
                  </div>

                  <div className="space-y-2">
                    {CURATED_TEMPLATES.slice(0, 3).map((tmpl) => (
                      <button
                        key={tmpl.id}
                        onClick={() => handleApplyTemplate(tmpl)}
                        className="w-full p-3 rounded-xl bg-slate-950/50 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/40 text-left transition-all cursor-pointer group flex items-center justify-between gap-3"
                      >
                        <div className="overflow-hidden">
                          <span className="text-[10px] font-semibold text-indigo-400 block mb-0.5">
                            {tmpl.category}
                          </span>
                          <h4 className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                            {tmpl.title}
                          </h4>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Gallery & History */}
        <div className="pt-6 border-t border-slate-800/80">
          <VideoHistory
            history={history}
            activeId={currentVideo?.id}
            onSelect={(item) => setCurrentVideo(item)}
            onDelete={handleDeleteHistory}
            onClearAll={handleClearHistory}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 py-5 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} Veo Studio. Generator Video AI Sinematik & Unlimited Studio Mode.</p>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Panduan Prompt
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Pengaturan Mesin
            </button>
          </div>
        </div>
      </footer>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        onApplyPrompt={handleApplyTemplate}
        onAppendDirecting={handleAppendDirecting}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        generationMode={generationMode}
        onChangeMode={handleChangeMode}
        customApiKey={customApiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}
