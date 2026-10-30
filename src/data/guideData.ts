export interface PromptTemplate {
  id: string;
  category: string;
  title: string;
  prompt: string;
  camera: string;
  style: string;
  lighting: string;
  aspectRatio: '16:9' | '9:16' | '1:1';
  tag: string;
}

export interface DirectingOption {
  id: string;
  label: string;
  promptSnippet: string;
  description: string;
  iconName?: string;
}

export const CAMERA_MOVEMENTS: DirectingOption[] = [
  {
    id: 'dolly_in',
    label: 'Slow Dolly In',
    promptSnippet: 'slow smooth cinematic dolly in toward the subject, focal compression, shallow depth of field',
    description: 'Kamera perlahan bergerak mendekati subjek untuk membangun rasa intensitas atau fokus mendalam.',
  },
  {
    id: 'fpv_drone',
    label: 'FPV Drone Dive',
    promptSnippet: 'high-speed dynamic FPV drone dive following the action, sweeping cinematic banking motion, ultra-smooth stabilization',
    description: 'Manuver terbang cepat drone FPV yang dinamis menyusuri pemandangan atau aksi cepat.',
  },
  {
    id: 'orbit_360',
    label: '360° Slow Orbit',
    promptSnippet: '360-degree seamless slow orbit around the central subject, steadycam rotational movement, cinematic parallax',
    description: 'Kamera berputar melingkari subjek dengan parallax latar belakang yang memukau.',
  },
  {
    id: 'pan_tracking',
    label: 'Tracking Pan',
    promptSnippet: 'horizontal tracking shot matching subject velocity, steady panning motion, cinematic motion blur on background',
    description: 'Kamera bergerak sejajar mengikuti subjek yang sedang melaju.',
  },
  {
    id: 'crane_up',
    label: 'Crane / Jib Up',
    promptSnippet: 'majestic vertical crane shot rising from ground level to reveal the vast landscape beyond, sweeping tilt down',
    description: 'Kamera naik ke atas secara megah mengungkap panorama luas.',
  },
  {
    id: 'macro_zoom',
    label: 'Extreme Macro Zoom',
    promptSnippet: 'extreme macro probe lens zoom, hyper-detailed textures, sub-millimeter focal point, micro atmospheric dust',
    description: 'Bidikan super close-up detail mikroskopis tekstur halus dengan kedalaman bidang sempit.',
  },
];

export const CINEMATIC_STYLES: DirectingOption[] = [
  {
    id: 'photoreal_8k',
    label: '8K Hyper-Realistic',
    promptSnippet: 'photorealistic 8K masterpiece, ARRI Alexa 65 cinema camera, crisp organic details, cinematic color grading, natural skin textures',
    description: 'Hasil seperti film layar lebar Hollywood dengan detail tajam alami dan warna seimbang.',
  },
  {
    id: 'cyberpunk_noir',
    label: 'Cyberpunk Neo-Noir',
    promptSnippet: 'cyberpunk neo-noir aesthetic, gleaming wet asphalt reflections, holographic advertisements, moody rain mist, chromatic aberration',
    description: 'Suasana masa depan berlumur neon, aspal basah, dan kabut malam futuristik.',
  },
  {
    id: 'anime_ghibli',
    label: 'Studio Anime Cel-Shaded',
    promptSnippet: 'enchanting high-end Japanese anime aesthetic, vibrant hand-painted watercolor textures, soft pastel daylight, whimsical fluid animation',
    description: 'Gaya animasi Jepang klasik dengan sapuan warna cat air lembut dan magis.',
  },
  {
    id: 'vintage_35mm',
    label: 'Vintage 35mm Film',
    promptSnippet: 'vintage 1970s Kodachrome 35mm film stock, authentic organic film grain, warm nostalgic tones, slight lens flare, retro cinema look',
    description: 'Tekstur grain film analog klasik yang hangat dan bernuansa nostalgia.',
  },
  {
    id: 'pixar_3d',
    label: 'Stylized 3D CGI',
    promptSnippet: 'stylized high-end 3D CGI animation, Pixar-style whimsical lighting, rich subsurface scattering, smooth velvety surfaces',
    description: 'Animasi 3D modern berkualitas studio animasi dengan tekstur lembut bersinar.',
  },
  {
    id: 'imax_nature',
    label: 'IMAX Wildlife Documentary',
    promptSnippet: 'IMAX 70mm nature documentary cinematography, national geographic level realism, natural light scattering, ultra-sharp atmospheric clarity',
    description: 'Standar dokumenter alam liar National Geographic / BBC Planet Earth.',
  },
];

export const LIGHTING_PRESETS: DirectingOption[] = [
  {
    id: 'golden_hour',
    label: 'Golden Hour Sunset',
    promptSnippet: 'warm golden hour sunrays, soft orange and amber glow, long dramatic shadows, volumetric sunbeam haze',
    description: 'Cahaya matahari senja hangat keemasan dengan bayangan panjang dramatis.',
  },
  {
    id: 'neon_noir',
    label: 'Volumetric Neon',
    promptSnippet: 'vivid cyan and magenta neon lights piercing through misty fog, high-contrast chiaroscuro, specular wet highlights',
    description: 'Cahaya neon kontras tinggi warna toska dan magenta menembus kabut.',
  },
  {
    id: 'studio_softbox',
    label: 'Studio Softbox High-Key',
    promptSnippet: 'diffused high-key studio softbox lighting, perfectly balanced soft shadows, clean commercial luxury look',
    description: 'Pencahayaan studio bersih dan mewah, cocok untuk iklan produk dan fashion.',
  },
  {
    id: 'bioluminescent',
    label: 'Bioluminescent Glow',
    promptSnippet: 'ethereal deep-sea bioluminescent organisms emitting soft cyan and turquoise glow in the dark, sparkling glitter spores',
    description: 'Kilauan cahaya alami organik di dalam kegelapan seperti Avatar atau laut dalam.',
  },
  {
    id: 'dramatic_rim',
    label: 'Dramatic Edge Rim Light',
    promptSnippet: 'intense backlight creating a razor-sharp glowing silhouette rim on the subject edges, dark moody background',
    description: 'Garis cahaya tipis menyinari siluet subjek dari belakang untuk efek dramatis.',
  },
];

export const CURATED_TEMPLATES: PromptTemplate[] = [
  {
    id: 'cyber_car',
    category: 'Sci-Fi / Futuristik',
    title: 'Mobil Terbang di Kota Masa Depan Neo-Tokyo',
    prompt: 'A sleek matte-black aerodynamic hovercar flying through the neon-soaked skyscrapers of Neo-Tokyo at midnight. Holographic billboards reflect off the wet carbon fiber chassis. Steam rises from sewer vents below.',
    camera: 'smooth FPV tracking shot right behind the hovercar as it banks between towering megastructures',
    style: 'hyper-realistic 8K, Blade Runner 2049 aesthetic, photorealistic reflections',
    lighting: 'vivid volumetric magenta and cyan neon rim lighting with atmospheric rain mist',
    aspectRatio: '16:9',
    tag: 'Sci-Fi Action',
  },
  {
    id: 'bali_drone',
    category: 'Landscape / Alam',
    title: 'Pemandangan Terasering Padi Ubud Pagi Hari',
    prompt: 'Majestic emerald-green rice terraces in Ubud Bali at sunrise. Golden mist cascades down the layered hillsides. Morning dew glistens on palm fronds while gentle breeze sways the vegetation.',
    camera: 'slow sweeping crane shot descending through morning mist and moving forward over the lush terraces',
    style: 'IMAX 70mm nature documentary style, national geographic clarity',
    lighting: 'early golden hour sunlight breaking through tropical clouds, god rays penetrating the valley',
    aspectRatio: '16:9',
    tag: 'Cinematic Drone',
  },
  {
    id: 'water_drop_macro',
    category: 'Macro / Slow Motion',
    title: 'Tetesan Air Jatuh ke Bunga Teratai (1000 FPS)',
    prompt: 'An ultra slow-motion 1000fps capture of a crystalline water droplet hitting the velvet surface of a pink lotus petal, exploding into a crown-shaped splash with micro-ripples and refraction.',
    camera: 'extreme macro probe lens holding static focus with microscopic depth of field',
    style: 'high-speed phantom flex 4K cinematography, crystalline clarity',
    lighting: 'soft diffused backlighting creating luminous glowing halos inside each micro-droplet',
    aspectRatio: '9:16',
    tag: 'Super Slow-Mo',
  },
  {
    id: 'anime_shrine',
    category: 'Anime / Fantasy',
    title: 'Kuil Jepang Kuno dengan Bunga Sakura Berterbangan',
    prompt: 'A timeless hillside Shinto shrine nestled among blossoming cherry blossom trees. Wind sweeps pink sakura petals across stone steps as a solitary black cat looks toward distant mountains.',
    camera: 'gentle cinematic pan following the swirling path of sakura petals in the wind',
    style: 'Makoto Shinkai and Studio Ghibli cel-shaded animation, breathtaking watercolor skies',
    lighting: 'warm afternoon sunbeams filtering through blooming branches with radiant lens flare',
    aspectRatio: '16:9',
    tag: 'Anime Masterpiece',
  },
  {
    id: 'coffee_commercial',
    category: 'Commercial / Produk',
    title: 'Iklan Kopi Mewah Pour-Over Slow Pour',
    prompt: 'Commercial close-up of dark roasted specialty coffee beans falling onto a copper scale, followed by hot steaming water poured in a spiral over freshly ground coffee with thick golden crema bloom.',
    camera: 'smooth cinematic orbital camera glide, dynamic focus shift from beans to swirling steam',
    style: 'luxury commercial television advertisement, pristine razor-sharp product details',
    lighting: 'dramatic warm tungsten rim lighting against a dark textured slate background',
    aspectRatio: '9:16',
    tag: 'Product Ads',
  },
  {
    id: 'space_spacewalk',
    category: 'Space / Eksplorasi',
    title: 'Astronot Melayang di Luar Stasiun Luar Angkasa',
    prompt: 'An astronaut conducting an EVA spacewalk outside a massive solar-paneled space station, with the curved blue horizon of Earth glowing majestically beneath and deep starfields in the cosmic void.',
    camera: 'slow zero-gravity rotational dolly, viewing the reflection of Earth in the astronaut gold visor',
    style: 'Interstellar and 2001 A Space Odyssey cinematography, hyper-detailed spacesuit fabric',
    lighting: 'harsh direct solar glare balanced by luminous soft blue Earth-shine fill',
    aspectRatio: '16:9',
    tag: 'Space Epic',
  },
];

export const VEO_TIPS = [
  {
    title: 'Gunakan Formula 5 Unsur',
    description: 'Subjek + Aksi Fisik + Pergerakan Kamera + Pencahayaan + Gaya Visual. Format ini memberikan kontrol maksimal pada mesin Veo.',
  },
  {
    title: 'Jelaskan Gerakan Kamera Secara Eksplisit',
    description: 'Veo unggul dalam simulasi fisika kamera nyata. Tulis kata seperti "slow dolly in", "steady tracking pan", atau "FPV drone dive" agar gerakan tidak statis.',
  },
  {
    title: 'Hindari Perintah Negatif',
    description: 'Jangan menulis "tanpa blur" atau "tidak ada orang". Sebaliknya, tulis apa yang Anda inginkan: "ultra-sharp focus, pristine empty street".',
  },
  {
    title: 'Pencahayaan Membentuk Realisme',
    description: 'Sebutkan sumber cahaya spesifik: "golden hour backlight", "specular neon reflections on wet asphalt", atau "volumetric god rays".',
  },
  {
    title: 'Image Conditioning (Gambar Awal)',
    description: 'Unggah foto awal untuk mengunci karakter, produk, atau arsitektur agar Veo menganimasikannya dengan konsisten.',
  },
];
