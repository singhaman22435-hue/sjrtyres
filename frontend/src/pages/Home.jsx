import { ShieldCheck, Cog, Award, Search, ArrowRight, Quote, Plus, CheckCircle, ShoppingCart, Star, TrendingUp, Droplets, Play, Phone, Zap, Globe, Factory } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { siteData } from '../siteData';
import { products } from '../productsData';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Floating Particle Component (CSS-only, no Framer Motion) ────────────────
function FloatingParticles({ count = 10 }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 6,
      duration: Math.random() * 8 + 8,
      opacity: Math.random() * 0.25 + 0.05,
    }))
  ).current;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-brand"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            opacity: p.opacity,
            animation: `particleFloat ${p.duration}s ${p.delay}s ease-in-out infinite`,
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  );
}

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ value, suffix = '' }) {
  const [count, setCount] = useState(0);
  const num = parseInt(value);

  useEffect(() => {
    let start = 0;
    const end = num;
    const duration = 1800;
    const step = (end - start) / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [num]);

  return <span>{count}{suffix}</span>;
}


// ─── Hero Slides ───────────────────────────────────────────────────────────────
const heroSlides = [
  {
    image: "/tyre images/New folder (2)/900.16 B SL 91/4K0A4431.webp",
    label: "Commercial Grade",
    category: "Truck & Bus",
    model: "900.16 B SL 91",
    tagline: "Built for the Long Haul",
    color: "#f97316",
    accent: "from-orange-500 to-red-600",
  },
  {
    image: "/tyre images/New folder (2)/75016 BALWAAN PLUS/4K0A4435.webp",
    label: "Agricultural Series",
    category: "Tractor Front",
    model: "750/16 Balwaan Plus",
    tagline: "Master the Fields",
    color: "#22c55e",
    accent: "from-green-500 to-emerald-600",
  },
  {
    image: "/tyre images/New folder (2)/600.16 R PLUS/4K0A4428.webp",
    label: "Farm Ready",
    category: "Tractor Rear",
    model: "600/16 R Plus",
    tagline: "Grip Every Terrain",
    color: "#eab308",
    accent: "from-yellow-500 to-orange-600",
  },
  {
    image: "/tyre images/New folder (2)/317 SMP TT/4K0A4231.webp",
    label: "Urban Mobility",
    category: "Two Wheeler",
    model: "317 SMP TT",
    tagline: "City to Highway",
    color: "#3b82f6",
    accent: "from-blue-500 to-cyan-600",
  },
  {
    image: "/tyre images/New folder (2)/400 8 ARYA 9100/4K0A4403.webp",
    label: "All Terrain",
    category: "OTR & Mining",
    model: "400/8 Arya 9100",
    tagline: "Where Others Stop",
    color: "#a855f7",
    accent: "from-purple-500 to-indigo-600",
  },
];

const IconMap = { ShieldCheck, Cog, Award };

export default function Home() {
  const [vehicleType, setVehicleType] = useState('');
  const [openFaq, setOpenFaq] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [countersVisible, setCountersVisible] = useState(false);
  const heroRef = useRef(null);
  const countersRef = useRef(null);
  const navigate = useNavigate();

  // Auto-play hero slideshow
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  // Intersection observer for counters
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setCountersVisible(true); },
      { threshold: 0.3 }
    );
    if (countersRef.current) observer.observe(countersRef.current);
    return () => observer.disconnect();
  }, []);

  const toggleFaq = (id) => setOpenFaq(openFaq === id ? null : id);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(vehicleType ? `/products?category=${vehicleType}` : '/products');
  };

  const slide = heroSlides[currentSlide];

  const anatomyLayers = [
    { id: 'casing', label: 'Nylon Carcass', desc: '3D sipe interlocking for cornering stability.', color: '#a855f7' },
    { id: 'bead', label: 'Armor Sidewall', desc: 'Kevlar-reinforced inserts for off-road protection.', color: '#3b82f6' },
    { id: 'rim', label: 'Bead Wire', desc: 'High-strength wire for perfect rim seating.', color: '#22c55e' },
  ];

  const [activeLayer, setActiveLayer] = useState(anatomyLayers[0].id);

  return (
    <div className="w-full overflow-hidden bg-black" ref={heroRef}>

      {/* ═══════════════════════════════════════════════════════════════════
          HERO — SPLIT SCREEN with Real 3D Tyre
      ═══════════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col lg:flex-row w-full overflow-hidden bg-[#080808]">

        {/* ── LEFT: Text Content ── */}
        <div className="relative z-10 flex flex-col justify-center w-full lg:w-1/2 px-8 md:px-14 lg:px-20 pt-32 pb-16 lg:pt-0 lg:pb-0 min-h-[60vh] lg:min-h-screen bg-[#080808]">

          {/* Subtle right edge gradient bleeding into right panel */}
          <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/5 to-transparent pointer-events-none" />

          <div className="relative z-10 max-w-xl">

            {/* Category Badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`badge-${currentSlide}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.35 }}
                className="flex items-center gap-3 mb-8"
              >
                <div className="w-8 h-[2px] bg-brand" />
                <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">{slide.label}</span>
                <span className="text-white/20 text-xs">·</span>
                <span className="text-white/35 text-xs tracking-widest uppercase">{slide.category}</span>
              </motion.div>
            </AnimatePresence>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-black text-white leading-[0.92] tracking-tight mb-6"
              style={{ fontFamily: "'Outfit', sans-serif" }}
            >
              Built to<br />
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand via-red-400 to-orange-400">
                  Dominate
                </span>
                <motion.span
                  className="absolute -bottom-1 left-0 h-[3px] bg-gradient-to-r from-brand to-red-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.9, duration: 0.6 }}
                />
              </span>
              <br />Every Road
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="text-base md:text-lg text-white/50 font-light leading-relaxed mb-10 max-w-md"
            >
              SJR Tyres — India's precision-engineered tyre manufacturer. Trusted by 500+ fleets across agriculture, commercial &amp; off-road sectors since 2010.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-14"
            >
              <Link
                to="/products"
                className="relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-brand text-white text-sm font-bold uppercase tracking-widest rounded-full transition-all duration-300 shadow-[0_0_30px_rgba(239,68,68,0.35)] hover:shadow-[0_0_55px_rgba(239,68,68,0.7)] group"
              >
                <ShoppingCart size={15} />
                Shop Tyres
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-600" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-white text-sm font-bold uppercase tracking-widest rounded-full border border-white/15 hover:bg-white hover:text-black transition-all duration-300"
              >
                Get a Quote
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-x-10 gap-y-4 pt-8 border-t border-white/8"
            >
              {[
                { value: "5M+", label: "Tyres Sold" },
                { value: "15+", label: "Countries" },
                { value: "10+", label: "Years" },
                { value: "500+", label: "Partners" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-black text-white">{s.value}</div>
                  <div className="text-[10px] text-white/35 uppercase tracking-widest font-semibold mt-0.5">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Slide pills */}
          <div className="absolute left-6 bottom-12 z-20 hidden md:flex flex-col items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`rounded-full transition-all duration-500 ${i === currentSlide ? 'w-1 h-8 bg-brand' : 'w-1 h-2 bg-white/20 hover:bg-white/50'}`}
              />
            ))}
          </div>

          {/* Slide counter */}
          <div className="absolute right-8 bottom-12 text-white/20 text-xs font-mono hidden md:block">
            <span className="text-white/50 font-bold text-base">{String(currentSlide + 1).padStart(2, '0')}</span>
            <span> / {String(heroSlides.length).padStart(2, '0')}</span>
          </div>
        </div>

        {/* ── RIGHT: Cinematic Full-Bleed Product Showcase ── */}
        <div className="relative w-full lg:w-1/2 min-h-[65vh] lg:min-h-screen bg-[#060606] flex items-center justify-center overflow-hidden">

          {/* Full-bleed image with animated crossfade */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`bg-${currentSlide}`}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.06 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={slide.image}
                alt={slide.model}
                className="w-full h-full object-cover"
              />
              {/* Dramatic color overlay matching slide accent */}
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, ${slide.color}33 0%, transparent 60%, rgba(6,6,6,0.85) 100%)` }}
              />
              {/* Left vignette to blend with text panel */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(6,6,6,0.7) 0%, transparent 35%)' }} />
              {/* Bottom fade */}
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,6,6,0.9) 0%, transparent 40%)' }} />
            </motion.div>
          </AnimatePresence>

          {/* Floating particles */}
          <FloatingParticles count={12} />

          {/* Model name — vertical watermark on right edge */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-3">
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <AnimatePresence mode="wait">
              <motion.div
                key={`vtext-${currentSlide}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-white/25 text-[9px] font-black uppercase tracking-[0.5em] font-mono"
                style={{ writingMode: 'vertical-rl' }}
              >
                {slide.model}
              </motion.div>
            </AnimatePresence>
            <div className="w-px h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          </div>

          {/* Thumbnail strip */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
            {heroSlides.map((s, i) => (
              <button
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`relative rounded-xl overflow-hidden transition-all duration-400 border-2 ${
                  i === currentSlide
                    ? 'border-brand scale-110 shadow-[0_0_12px_rgba(239,68,68,0.5)]'
                    : 'border-white/10 opacity-50 hover:opacity-80'
                }`}
                style={{ width: 46, height: 46 }}
              >
                <img loading="lazy" src={s.image} alt={s.model} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20" />
              </button>
            ))}
          </div>

          {/* Tagline pill bottom-left */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`tagline-${currentSlide}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-20 left-8 z-20 hidden md:block"
            >
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border"
                style={{ color: slide.color, borderColor: `${slide.color}50`, background: `${slide.color}12` }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: slide.color }} />
                {slide.tagline}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Floating model badge top-right */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`badge2-${currentSlide}`}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="absolute top-8 right-14 z-20"
            >
              <div
                className="inline-flex flex-col items-start gap-0.5 bg-black/70 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-2.5 shadow-xl"
                style={{ borderColor: `${slide.color}40` }}
              >
                <span className="text-[9px] uppercase tracking-[0.25em] font-bold" style={{ color: slide.color }}>{slide.label}</span>
                <span className="text-white font-bold text-xs">{slide.model}</span>
                <span className="text-white/40 text-[9px]">{slide.tagline}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Watermark */}
          <div className="absolute bottom-8 right-16 text-white/[0.03] text-8xl font-black select-none pointer-events-none leading-none tracking-tighter">SJR</div>
        </div>
      </section>

      {/* ═══ RED MARQUEE STRIP ═══════════════════════════════════════════════ */}
      <div className="w-full bg-brand py-5 overflow-hidden flex whitespace-nowrap border-y border-red-700">
        <div
          className="flex gap-14 items-center text-white font-black text-sm uppercase tracking-[0.3em] animate-marquee"
          style={{ animation: 'marquee 300s linear infinite' }}
        >
          {Array(4).fill(["TATA MOTORS", "ASHOK LEYLAND", "JOHN DEERE", "EICHER", "MAHINDRA", "ESCORTS", "NEW HOLLAND", "VOLVO"]).flat().map((p, i) => (
            <span key={i} className="flex items-center gap-14">
              <span>{p}</span>
              <span className="text-white/30 text-lg">✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══ TYRE FINDER ═════════════════════════════════════════════════════ */}
      <section className="relative z-20 py-20 px-4 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-white/[0.04] border border-white/8 p-10 md:p-12 rounded-[2rem] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 100%, rgba(239,68,68,0.08) 0%, transparent 70%)' }} />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <Search className="text-brand w-6 h-6" />
                <span className="text-brand font-bold text-xs tracking-[0.3em] uppercase">Smart Tyre Finder</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-8">Find Your Perfect Match</h2>
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                <select
                  value={vehicleType}
                  onChange={(e) => setVehicleType(e.target.value)}
                  className="flex-1 p-5 text-sm bg-white/5 border border-white/10 rounded-full text-white focus:outline-none focus:border-brand transition-all appearance-none cursor-pointer uppercase tracking-widest font-bold"
                >
                  <option value="" className="bg-black text-white">Select Vehicle Type...</option>
                  <option value="Agriculture" className="bg-black text-white">Tractor / Agriculture</option>
                  <option value="Commercial" className="bg-black text-white">Truck / Commercial</option>
                  <option value="Light Commercial" className="bg-black text-white">LCV / Light Commercial</option>
                </select>
                <button
                  type="submit"
                  className="px-10 py-5 text-sm uppercase tracking-widest bg-brand text-white font-bold rounded-full hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_35px_rgba(239,68,68,0.6)]"
                >
                  Find Match
                </button>
              </form>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ═══ FEATURED PRODUCTS ═══════════════════════════════════════════════ */}
      <section className="py-28 bg-[#050505] relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6"
          >
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-[2px] bg-brand" />
                <span className="text-brand font-bold text-xs tracking-[0.3em] uppercase">Best Sellers</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white">Our Top <span className="text-brand">Performers</span></h2>
              <p className="text-base text-white/40 mt-3">Engineered to deliver exceptional results.</p>
            </div>
            <Link to="/products" className="flex items-center gap-2 text-white/50 hover:text-brand font-bold uppercase tracking-widest text-xs transition-colors group">
              View All <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {products.slice(0, 4).map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white/[0.03] rounded-3xl border border-white/8 overflow-hidden group hover:-translate-y-2 transition-all duration-300 hover:border-brand/30 hover:shadow-[0_20px_40px_rgba(239,68,68,0.1)] flex flex-col"
              >
                <div className="absolute top-4 right-4 z-10 bg-brand text-white px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <Star size={10} fill="currentColor" /> 4.9
                </div>
                <div className="relative h-56 overflow-hidden bg-white flex items-center justify-center p-6">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-108 transition-transform duration-700"
                    style={{ mixBlendMode: 'multiply' }}
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="text-brand text-[10px] font-bold uppercase tracking-widest mb-2">{product.category}</div>
                  <h3 className="text-base font-bold text-white mb-auto line-clamp-2">{product.name}</h3>
                  <div className="mt-5 pt-5 border-t border-white/8 flex items-center justify-between">
                    <Link to={`/product/${product.id}`} className="text-white/40 hover:text-brand transition-colors text-xs font-semibold uppercase tracking-widest">Details</Link>
                    <Link to={`/product/${product.id}`} className="bg-brand text-white p-2.5 rounded-full hover:bg-red-700 transition-colors">
                      <ShoppingCart size={15} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ WHY CHOOSE SJR — 4 PILLARS ══════════════════════════════════════ */}
      <section className="py-28 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.3em] uppercase">Why SJR</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Built Different. <span className="text-brand">Engineered Better.</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">We don't just make tyres. We engineer solutions for uncompromising performance and safety.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {[
              { icon: ShieldCheck, title: "Unmatched Durability", desc: "Reinforced sidewalls and premium compounds for the harshest environments.", grad: "from-blue-500/20 to-blue-500/5", iconColor: "text-blue-400" },
              { icon: TrendingUp, title: "High Mileage", desc: "Optimized tread patterns reduce rolling resistance, saving fuel and extending tyre life.", grad: "from-green-500/20 to-green-500/5", iconColor: "text-green-400" },
              { icon: Droplets, title: "Superior Wet Grip", desc: "Advanced silica compounds for maximum traction and shorter braking distances.", grad: "from-cyan-500/20 to-cyan-500/5", iconColor: "text-cyan-400" },
              { icon: Award, title: "Premium Warranty", desc: "Industry-leading comprehensive warranty giving you total peace of mind.", grad: "from-purple-500/20 to-purple-500/5", iconColor: "text-purple-400" },
            ].map((b, idx) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08 }}
                  className={`p-8 rounded-3xl border border-white/8 bg-gradient-to-b ${b.grad} hover:border-white/15 transition-all duration-300 group`}
                >
                  <Icon size={36} className={`${b.iconColor} mb-5 group-hover:scale-110 transition-transform duration-300`} />
                  <h3 className="text-lg font-bold text-white mb-3">{b.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{b.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ ANATOMY SECTION — Real Product Image + Feature Cards ══════════════ */}
      <section className="py-28 bg-[#050505] border-t border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.3em] uppercase">Engineering</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-4">Anatomy of <span className="text-brand">Performance</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">Every layer engineered for absolute dominance on any surface.</p>
          </motion.div>

          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">

            {/* Left: Layer selector */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-2/5 flex flex-col gap-3"
            >
              {anatomyLayers.map((layer) => (
                <button
                  key={layer.id}
                  onClick={() => setActiveLayer(layer.id)}
                  className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all duration-300 text-left ${
                    activeLayer === layer.id
                      ? 'border-white/20 bg-white/[0.06]'
                      : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full mt-0.5 flex-shrink-0 transition-all duration-300"
                    style={{
                      background: layer.color,
                      boxShadow: activeLayer === layer.id ? `0 0 10px ${layer.color}` : 'none',
                    }}
                  />
                  <div>
                    <div
                      className="font-bold text-sm transition-colors duration-300"
                      style={{ color: activeLayer === layer.id ? layer.color : 'rgba(255,255,255,0.7)' }}
                    >
                      {layer.label}
                    </div>
                    <div className="text-xs text-white/35 mt-1 leading-relaxed">{layer.desc}</div>
                  </div>
                </button>
              ))}
            </motion.div>

            {/* Center: Real Product Image (replacing CSS art rings) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center flex-shrink-0 relative"
            >
              {/* Glow behind the image */}
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-20 scale-110 pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.8) 0%, transparent 70%)' }}
              />
              <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]" style={{ width: 320, height: 320 }}>
                <img
                  src="/tyre images/New folder (2)/317 SMP TT/4K0A4231.webp"
                  alt="SJR Tyre Cross Section"
                  className="w-full h-full object-cover"
                />
                {/* Overlay with branded gradient */}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, transparent 60%, rgba(0,0,0,0.6) 100%)' }} />
                {/* Corner label */}
                <div className="absolute top-4 left-4 bg-brand text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  Precision Engineered
                </div>
              </div>
            </motion.div>

            {/* Right: Key specs */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="w-full lg:w-2/5 flex flex-col gap-6"
            >
              {[
                { icon: Zap, title: "Zero-Compromise Testing", desc: "Every tyre undergoes 47 quality checks including X-ray inspection and high-speed uniformity analysis.", color: "text-yellow-400", bg: "bg-yellow-500/10" },
                { icon: Globe, title: "Global Certifications", desc: "ISO 9001, BIS, DOT & ECE certified for use in 15+ countries across 6 continents.", color: "text-blue-400", bg: "bg-blue-500/10" },
                { icon: Factory, title: "Automated Manufacturing", desc: "State-of-the-art robotic production lines ensuring sub-millimeter precision on every unit.", color: "text-green-400", bg: "bg-green-500/10" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4 items-start group"
                  >
                    <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon size={22} className={item.color} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-white/35 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══════════════════════════════════════════════════════ */}
      <section className="py-28 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.3em] uppercase">Product Range</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Master Every <span className="text-brand">Terrain</span></h2>
            <p className="text-white/40">Engineered specific to your vehicle's extreme demands.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {siteData.categories.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group relative overflow-hidden rounded-3xl cursor-pointer h-[420px] border border-white/8 hover:border-brand/40 transition-all duration-500"
              >
                <img
                  loading="lazy"
                  src={cat.imageUrl}
                  alt={cat.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-8 flex flex-col">
                  <h3 className="text-2xl font-black text-white mb-2 group-hover:text-brand transition-colors">{cat.title}</h3>
                  <p className="text-sm text-white/50 leading-relaxed mb-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">{cat.description}</p>
                  <Link to="/products" className="inline-flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 delay-75">
                    Explore Range <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PIONEERING — About + Photo Gallery Mosaic ════════════════════════ */}
      <section className="py-28 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-center">

            {/* Left: Photo gallery mosaic */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2"
            >
              <div className="grid grid-cols-2 gap-3" style={{ aspectRatio: '1 / 1' }}>
                {/* Top-left */}
                <div className="relative rounded-2xl overflow-hidden group">
                  <img
                    src="/tyre images/New folder (2)/900.16 B SL 91/4K0A4431.webp"
                    alt="SJR Truck Tyre"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white text-xs font-bold bg-brand px-2.5 py-1 rounded-full">Commercial</span>
                  </div>
                </div>
                {/* Top-right */}
                <div className="relative rounded-2xl overflow-hidden group">
                  <img
                    src="/tyre images/New folder (2)/75016 BALWAAN PLUS/4K0A4435.webp"
                    alt="SJR Tractor Tyre"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white text-xs font-bold bg-green-600 px-2.5 py-1 rounded-full">Agricultural</span>
                  </div>
                </div>
                {/* Bottom-left */}
                <div className="relative rounded-2xl overflow-hidden group">
                  <img
                    src="/tyre images/IS 2441....a.webp"
                    alt="SJR Two Wheeler Tyre"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <span className="text-white text-xs font-bold bg-blue-600 px-2.5 py-1 rounded-full">Two-Wheeler</span>
                  </div>
                </div>
                {/* Bottom-right: Stats card */}
                <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand/20 to-red-900/20 border border-brand/20 flex flex-col items-center justify-center gap-4 p-5">
                  <div className="text-center">
                    <div className="text-5xl font-black text-brand">5M+</div>
                    <div className="text-white/50 text-xs uppercase tracking-widest mt-1">Tyres Delivered</div>
                  </div>
                  <div className="w-full h-px bg-white/10" />
                  <div className="text-center">
                    <div className="text-4xl font-black text-white">15+</div>
                    <div className="text-white/50 text-xs uppercase tracking-widest mt-1">Countries</div>
                  </div>
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    style={{ background: 'radial-gradient(circle at 50% 50%, rgba(239,68,68,0.08), transparent)' }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-brand" />
                <span className="text-brand font-bold text-xs tracking-[0.3em] uppercase">Our Story</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Pioneering the<br /><span className="text-brand">Future</span>
              </h2>
              <p className="text-white/45 leading-relaxed mb-10">
                Founded over a decade ago, SJR Tyres has grown from a regional manufacturer to a global leader. Our commitment to advanced technology and premium raw materials ensures that every tyre meets the highest standards of safety and durability.
              </p>

              <div ref={countersRef} className="grid grid-cols-2 gap-5 mb-10">
                {[
                  { value: 5, suffix: "M+", label: "Tyres Sold" },
                  { value: 15, suffix: "+", label: "Countries" },
                  { value: 100, suffix: "+", label: "Products" },
                  { value: 10, suffix: "+", label: "Years Legacy" },
                ].map((s, i) => (
                  <div key={i} className="bg-white/[0.04] border border-white/8 rounded-2xl p-6 hover:border-brand/20 transition-colors">
                    <div className="text-4xl font-black text-brand mb-1">
                      {countersVisible ? <AnimatedCounter value={s.value} suffix={s.suffix} /> : `0${s.suffix}`}
                    </div>
                    <div className="text-xs text-white/40 font-bold uppercase tracking-widest">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                {["3D Laser Tread Scanning", "Extreme Temperature Testing", "Nano-Silica Rubber Compounding", "High-Speed Uniformity Checks"].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-brand w-5 h-5 flex-shrink-0" />
                    <span className="text-sm text-white/60 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Link to="/about" className="mt-10 inline-flex items-center gap-3 px-7 py-3.5 border border-white/10 rounded-full text-sm text-white/70 font-bold uppercase tracking-widest hover:border-brand/40 hover:text-brand transition-all group">
                Read Our Story <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ SERVICES ═════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-black border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.3em] uppercase">Services</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Our <span className="text-brand">Expertise</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">Beyond manufacturing — comprehensive tyre solutions for businesses globally.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteData.services.map((service, idx) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="group bg-white/[0.03] border border-white/8 hover:border-brand/30 p-10 rounded-3xl transition-all duration-300 flex gap-8 items-start hover:bg-white/[0.05]"
              >
                <div className="text-5xl font-black text-brand/20 group-hover:text-brand/40 transition-colors font-mono flex-shrink-0">
                  0{idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand transition-colors">{service.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{service.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═════════════════════════════════════════════════════ */}
      <section className="py-28 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.3em] uppercase">Reviews</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">Trusted by <span className="text-brand">Industry Leaders</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {siteData.testimonials.map((testi, idx) => (
              <motion.div
                key={testi.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white/[0.03] border border-white/8 p-8 rounded-3xl relative group hover:border-brand/30 hover:-translate-y-1 transition-all duration-300"
              >
                <Quote className="text-brand/15 w-16 h-16 absolute top-5 right-5 group-hover:text-brand/30 transition-colors" />
                <div className="flex gap-1 mb-5">
                  {[...Array(5)].map((_, i) => <Star key={i} size={14} className="text-brand fill-brand" />)}
                </div>
                <p className="text-sm text-white/50 leading-relaxed mb-6 italic">"{testi.quote}"</p>
                <div className="border-t border-white/8 pt-5">
                  <h4 className="text-white font-bold text-sm">{testi.author}</h4>
                  <p className="text-brand text-xs font-semibold mt-0.5">{testi.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQs ═════════════════════════════════════════════════════════════ */}
      <section className="py-28 bg-black border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.3em] uppercase">FAQ</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white">Frequently Asked <span className="text-brand">Questions</span></h2>
          </motion.div>

          <div className="space-y-3">
            {siteData.faqs.map((faq) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden hover:border-brand/20 transition-colors"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-7 py-5 flex justify-between items-center text-left"
                >
                  <span className="text-base font-bold text-white pr-8">{faq.question}</span>
                  <span className={`text-brand transition-transform duration-300 flex-shrink-0 ${openFaq === faq.id ? 'rotate-45' : ''}`}>
                    <Plus size={20} />
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: openFaq === faq.id ? "auto" : 0, opacity: openFaq === faq.id ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-7 pb-5 text-sm text-white/40 leading-relaxed border-t border-white/5 pt-4">
                    {faq.answer}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ INSTAGRAM SECTION (lazy — no iframes) ════════════════════════════ */}
      <section className="py-28 bg-[#050505] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-14">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-[2px] bg-brand" />
                <span className="text-brand font-bold text-xs tracking-[0.3em] uppercase">Social</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white">SJR on the <span className="text-brand">Move</span></h2>
              <a
                href="https://www.instagram.com/sjrtyresofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-brand transition-colors text-sm mt-2 block"
              >
                @sjrtyresofficial
              </a>
            </div>
            <a
              href="https://www.instagram.com/sjrtyresofficial"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 text-white font-bold text-sm rounded-full hover:opacity-90 transition-opacity"
            >
              Follow Us
            </a>
          </div>

          {/* Reel cards — link only, no iframes for performance */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { code: "C837aLmxZrl", thumb: "/tyre images/New folder (2)/900.16 B SL 91/4K0A4432.webp" },
              { code: "C7Q3k1iRCvF", thumb: "/tyre images/New folder (2)/75016 BALWAAN PLUS/4K0A4436.webp" },
              { code: "DHIY7agoZGf", thumb: "/tyre images/New folder (2)/317 SMP TT/4K0A4232.webp" },
              { code: "DM-Wan5yxS9", thumb: "/tyre images/New folder (2)/400 8 ARYA 9100/4K0A4404.webp" },
            ].map((reel, i) => (
              <a
                key={i}
                href={`https://www.instagram.com/reel/${reel.code}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-[9/16] rounded-2xl overflow-hidden border border-white/8 hover:border-brand/40 transition-all duration-300 block"
              >
                <img
                  loading="lazy"
                  src={reel.thumb}
                  alt="SJR Instagram Reel"
                  className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-14 h-14 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-2xl">
                    <Play size={22} className="text-black fill-black ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 text-white/60 text-xs font-bold">View Reel</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CINEMATIC CTA ════════════════════════════════════════════════════ */}
      <section className="relative py-40 flex items-center justify-center overflow-hidden bg-black border-t border-white/5">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="/tyre images/New folder (2)/900.16 B SL 91/4K0A4431.webp"
            alt="CTA background"
            className="w-full h-full object-contain opacity-10"
            style={{ mixBlendMode: 'luminosity' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(239,68,68,0.15) 0%, transparent 70%)' }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center max-w-5xl px-4"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-6 h-[2px] bg-brand" />
            <span className="text-brand font-bold text-xs tracking-[0.3em] uppercase">Get Started</span>
            <div className="w-6 h-[2px] bg-brand" />
          </div>
          <h2 className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tight">
            READY TO<br /><span className="text-brand">DOMINATE?</span>
          </h2>
          <p className="text-lg text-white/40 mb-12">Join 500+ fleets worldwide running on SJR Tyres.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 bg-brand text-white text-sm font-black rounded-full hover:bg-red-700 transition-all duration-300 shadow-[0_0_40px_rgba(239,68,68,0.4)] hover:shadow-[0_0_60px_rgba(239,68,68,0.7)] uppercase tracking-widest group relative overflow-hidden"
            >
              <ShoppingCart size={18} />
              Start Shopping
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-3 px-10 py-5 text-white text-sm font-bold rounded-full border border-white/15 hover:bg-white hover:text-black transition-all duration-300 uppercase tracking-widest"
            >
              <Phone size={16} />
              Contact Us
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
