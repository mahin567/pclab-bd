// ⚠️ SAMPLE DATA — replace names, specs, prices and videos with PC Lab Bangladesh's real catalogue.
// Put per-product scrub videos in /public/videos/<slug>.mp4 and set `video` accordingly.

export interface Product {
  slug: string
  name: string
  tagline: string
  summary: string
  price: number // BDT, "starting from"
  image?: string // product photo used as the hero background
  video?: string // optional scrub video; if set it is used instead of the photo
  highlights: { title: string; text: string }[]
  specs: { label: string; value: string }[]
}

export const DEFAULT_IMAGE = "/images/vengeance-ram.png" // placeholder until each build has its own photo

export const products: Product[] = [
  {
    slug: "vengeance-rgb-rs",
    name: "Corsair Vengeance RGB RS",
    tagline: "Light up your build.",
    summary: "High-performance RGB desktop memory with a light-bar design and a heat-spreading aluminium shell.",
    price: 9500,
    image: "/images/vengeance-ram.png",
    highlights: [
      { title: "RGB lighting", text: "Addressable RGB light bar that syncs with your board's lighting software." },
      { title: "Heat spreader", text: "Aluminium spreader keeps modules cool under sustained load." },
      { title: "Plug and play", text: "Tested for compatibility before it goes into a build." },
    ],
    specs: [
      { label: "Series", value: "Vengeance RGB RS" },
      { label: "Type", value: "DDR4 (confirm)" },
      { label: "Capacity", value: "Set per kit" },
      { label: "Speed", value: "Set per kit" },
      { label: "Lighting", value: "RGB light bar" },
      { label: "Form factor", value: "288-pin DIMM" },
    ],
  },  {
    slug: "creator-pro",
    name: "Creator Pro Workstation",
    tagline: "Render faster. Create more.",
    summary: "A high-core-count workstation tuned for video editing, 3D rendering and heavy multitasking.",
    price: 285000,
    highlights: [
      { title: "Fast renders", text: "High-core CPU and 12 GB GPU shorten export and render times." },
      { title: "Room to work", text: "64 GB DDR5 keeps large timelines and scenes responsive." },
      { title: "Stays cool", text: "High-airflow case and tuned fan curves for long sessions." },
    ],
    specs: [
      { label: "Processor", value: "AMD Ryzen 9 7900X" },
      { label: "Graphics", value: "NVIDIA RTX 4070 Super 12GB" },
      { label: "Memory", value: "64GB DDR5" },
      { label: "Storage", value: "2TB NVMe Gen4 SSD" },
      { label: "Power supply", value: "850W 80+ Gold" },
      { label: "Cooling", value: "240mm AIO liquid cooler" },
    ],
  },
  {
    slug: "gaming-beast",
    name: "Gaming Beast",
    tagline: "Every frame, uncompromised.",
    summary: "A high-refresh 1440p gaming rig built around a cache-heavy CPU and a strong GPU.",
    price: 210000,
    highlights: [
      { title: "High FPS", text: "Built for smooth 1440p gameplay in modern titles." },
      { title: "Quick loads", text: "Gen4 NVMe storage cuts load times." },
      { title: "Upgrade-ready", text: "Quality PSU and board leave headroom for later upgrades." },
    ],
    specs: [
      { label: "Processor", value: "AMD Ryzen 7 7800X3D" },
      { label: "Graphics", value: "NVIDIA RTX 4070 Ti Super 16GB" },
      { label: "Memory", value: "32GB DDR5" },
      { label: "Storage", value: "1TB NVMe Gen4 SSD" },
      { label: "Power supply", value: "750W 80+ Gold" },
      { label: "Cooling", value: "Dual-tower air cooler" },
    ],
  },
  {
    slug: "office-essential",
    name: "Office Essential",
    tagline: "Reliable, all day.",
    summary: "A quiet, efficient desktop for office work, study and everyday browsing.",
    price: 62000,
    highlights: [
      { title: "Always responsive", text: "SSD boot and 16 GB of memory keep daily work snappy." },
      { title: "Quiet", text: "Low-power parts and a quiet cooler." },
      { title: "Value", text: "Only the parts everyday work needs." },
    ],
    specs: [
      { label: "Processor", value: "Intel Core i5-12400" },
      { label: "Graphics", value: "Integrated Intel UHD 730" },
      { label: "Memory", value: "16GB DDR4" },
      { label: "Storage", value: "512GB NVMe SSD" },
      { label: "Power supply", value: "450W" },
      { label: "Case", value: "Compact mid-tower" },
    ],
  },
]

export const getProduct = (slug?: string) => products.find((p) => p.slug === slug)
export const formatBDT = (n: number) => `৳ ${n.toLocaleString("en-US")}`
