import { Shield, CheckCircle, Globe, ArrowRight, Factory, Users, Clock, Target, Award, Zap, TrendingUp, MapPin, Phone, Mail, Building2, Leaf, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import WorkingProcess from '../components/WorkingProcess';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const fadeLeft = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

const fadeRight = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
};

export default function About() {
  return (
    <div className="bg-black text-white">

      {/* HERO BANNER */}
      <section className="relative pt-36 pb-28 px-4 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/tyre images/New folder (2)/900.16 B SL 91/4K0A4431.JPG"
            alt="SJR Factory"
            className="w-full h-full object-contain opacity-8"
            style={{ mixBlendMode: 'luminosity' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(239,68,68,0.14) 0%, transparent 70%)' }}
          />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">Company Profile</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              About <span className="text-brand">SJR Tyres</span>
            </h1>
            <p className="text-lg text-white/45 max-w-3xl mx-auto leading-relaxed mb-8">
              A decade of relentless innovation — from a regional manufacturer to a globally trusted name in precision-engineered tyres for agriculture, commercial transport, and off-road applications.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-10">
              {[
                { icon: MapPin, text: "India (Manufacturing)" },
                { icon: Globe, text: "15+ Countries Served" },
                { icon: Building2, text: "Est. 2014" },
                { icon: Users, text: "1200+ Employees" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-2 text-white/50 text-sm">
                    <Icon size={14} className="text-brand" />
                    <span>{item.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      {/* COMPANY OVERVIEW */}
      <section className="py-20 px-4 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft} className="relative">
              <div className="relative rounded-3xl overflow-hidden border border-white/8 aspect-[4/3] bg-white flex items-center justify-center">
                <img src="/tyre images/New folder (2)/75016 BALWAAN PLUS/4K0A4435.JPG" alt="SJR Manufacturing" className="w-full h-full object-contain p-6" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-5 left-5 right-5">
                  <div className="bg-black/70 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 inline-block">
                    <div className="text-brand text-xs font-bold uppercase tracking-widest">Since 2014</div>
                    <div className="text-white font-black text-lg">SJR Tyres Pvt. Ltd.</div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-brand text-white rounded-2xl px-5 py-4 shadow-2xl shadow-brand/30">
                <div className="text-3xl font-black">5M+</div>
                <div className="text-xs font-bold uppercase tracking-wider opacity-80">Tyres Delivered</div>
              </div>
            </motion.div>
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRight}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-brand" />
                <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">Who We Are</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                India's Precision-Engineered<br /><span className="text-brand">Tyre Manufacturer</span>
              </h2>
              <div className="space-y-4 text-sm text-white/45 leading-relaxed mb-8">
                <p>SJR Tyres Pvt. Ltd. is a leading manufacturer and exporter of high-performance tyres headquartered in India. Established in 2014, the company has rapidly scaled from a domestic producer to a globally recognized brand supplying tyres to 15+ countries across agriculture, commercial transport, light commercial, OTR, and two/three-wheeler segments.</p>
                <p>With a state-of-the-art manufacturing facility spanning 500,000 sq. ft., SJR combines cutting-edge robotics, nano-silica compounding, and 3D laser tread scanning to produce tyres that meet and exceed international safety standards including ISO 9001, BIS, DOT, and ECE certifications.</p>
                <p>Our philosophy is simple — never compromise on quality, build lifetime customer relationships, and continuously innovate to stay ahead of global performance benchmarks.</p>
              </div>
              <div className="space-y-3">
                {[
                  "Automated production with zero-defect tolerance",
                  "Nano-silica rubber compounding for superior grip",
                  "3D laser tread scanning & high-speed uniformity testing",
                  "Custom tyre solutions for OEM & enterprise clients",
                  "End-to-end supply chain & global bulk distribution",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <CheckCircle className="text-brand w-4 h-4 flex-shrink-0" />
                    <span className="text-sm text-white/60">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="py-20 px-4 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">Direction</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Vision & <span className="text-brand">Mission</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Star, label: "Our Vision", color: "from-yellow-500/15 to-yellow-500/5", border: "border-yellow-500/20", iconColor: "text-yellow-400", text: "To be the most trusted and innovative tyre manufacturer in the world — known for uncompromising quality, engineering excellence, and enduring partnerships across every terrain and every industry." },
              { icon: Target, label: "Our Mission", color: "from-brand/15 to-brand/5", border: "border-brand/20", iconColor: "text-brand", text: "To engineer and deliver superior tyre solutions that maximize performance, safety, and durability for our customers — while building lasting relationships rooted in trust, transparency, and shared growth." },
              { icon: Leaf, label: "Our Values", color: "from-green-500/15 to-green-500/5", border: "border-green-500/20", iconColor: "text-green-400", text: "Quality without compromise. Innovation without boundaries. Integrity in every transaction. Sustainability in every process. These are the pillars that define how we operate, manufacture, and grow." },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className={`p-8 rounded-3xl border bg-gradient-to-b ${card.color} ${card.border} hover:-translate-y-1 transition-all duration-300`}>
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6">
                    <Icon size={28} className={card.iconColor} />
                  </div>
                  <div className="text-white/30 text-xs font-bold uppercase tracking-[0.3em] mb-3">{card.label}</div>
                  <p className="text-sm text-white/50 leading-relaxed">{card.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PHILOSOPHY QUOTE */}
      <section className="py-20 px-4 border-t border-white/5 bg-[#050505]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <div className="text-brand text-8xl font-black opacity-15 leading-none mb-2">"</div>
            <blockquote className="text-xl md:text-2xl font-bold text-white/65 leading-relaxed italic mb-8">
              We are not in a race with anyone to achieve numerical output — we challenge the best in the trade in terms of quality. We are not interested in short-term buyer/seller relationships but building lifetime associations with our customers.
            </blockquote>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-px bg-brand" />
              <span className="text-brand text-sm font-bold uppercase tracking-widest">Founder, SJR Tyres</span>
              <div className="w-10 h-px bg-brand" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRODUCT RANGE */}
      <section className="py-20 px-4 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">Product Portfolio</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Our Complete <span className="text-brand">Range</span></h2>
            <p className="text-white/40 max-w-2xl mx-auto">Engineered for every application — from farm fields to global highways.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Agriculture Tyres", sub: "Tractor Front & Rear", image: "/tyre images/New folder (2)/75016 BALWAAN PLUS/4K0A4435.JPG", desc: "Designed to maximize traction and minimize soil compaction for farming operations worldwide.", color: "#22c55e", tag: "Agri" },
              { title: "Commercial Tyres", sub: "Truck, Bus & LCV", image: "/tyre images/New folder (2)/900.16 B SL 91/4K0A4431.JPG", desc: "High-mileage, fuel-efficient tyres built for the demands of long-haul commercial transport.", color: "#f97316", tag: "Commercial" },
              { title: "OTR Tyres", sub: "Mining & Construction", image: "/tyre images/New folder (2)/400 8 ARYA 9100/4K0A4403.JPG", desc: "Off-the-road tyres engineered to withstand extreme loads, cuts, and punishing terrains.", color: "#a855f7", tag: "OTR" },
              { title: "Two / Three Wheeler", sub: "Motorcycle & Scooter", image: "/tyre images/New folder (2)/317 SMP TT/4K0A4231.JPG", desc: "Precision-balanced tyres for superior grip and stability on urban roads and highways.", color: "#3b82f6", tag: "2W/3W" },
              { title: "Specialty Tyres", sub: "Industrial & Equipment", image: "/tyre images/New folder (2)/400 8 RIDER X/4K0A4407.JPG", desc: "Custom-designed tyres for forklifts, material handling, and industrial machinery.", color: "#eab308", tag: "Industrial" },
              { title: "Custom OEM Solutions", sub: "Made-to-Order", image: "/tyre images/New folder (2)/600.16 R PLUS/4K0A4426.JPG", desc: "R&D-backed custom tread designs and rubber compounds for OEM and enterprise clients.", color: "#ef4444", tag: "OEM" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="group bg-white/[0.03] border border-white/8 rounded-3xl overflow-hidden hover:border-white/15 hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-44 bg-white flex items-center justify-center p-4 overflow-hidden">
                  <img src={item.image} alt={item.title} className="max-h-full object-contain group-hover:scale-105 transition-transform duration-700" style={{ mixBlendMode: 'multiply' }} />
                  <div className="absolute top-3 right-3 text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: item.color }}>{item.tag}</div>
                </div>
                <div className="p-6">
                  <div className="text-white/30 text-[10px] uppercase tracking-widest font-bold mb-1">{item.sub}</div>
                  <h3 className="text-lg font-black text-white mb-2 group-hover:text-brand transition-colors">{item.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/products" className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white font-bold text-sm rounded-full hover:bg-red-700 transition-all uppercase tracking-widest group">
              Browse All Products <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* WORKING PROCESS */}
      <div className="border-t border-white/5">
        <WorkingProcess />
      </div>

      {/* KEY FACTS */}
      <section className="py-20 px-4 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">Key Facts</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Company at a <span className="text-brand">Glance</span></h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fact table */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeLeft} className="bg-white/[0.03] border border-white/8 rounded-3xl p-8">
              <h3 className="text-lg font-black text-white mb-6 pb-4 border-b border-white/8">Company Information</h3>
              <div className="space-y-0">
                {[
                  { key: "Company Name", value: "SJR Tyres Pvt. Ltd." },
                  { key: "Year Established", value: "2014" },
                  { key: "Headquarters", value: "India" },
                  { key: "Nature of Business", value: "Manufacturer & Exporter" },
                  { key: "Annual Capacity", value: "Millions of Units" },
                  { key: "Markets Served", value: "Domestic & International (15+ Countries)" },
                  { key: "Major Segments", value: "Agriculture, Commercial, OTR, 2W/3W" },
                  { key: "Quality Standard", value: "ISO 9001, BIS, DOT, ECE" },
                  { key: "Payment Terms", value: "Negotiable / LC / TT" },
                  { key: "Min. Order Qty.", value: "1 x 20ft Container" },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between gap-4 py-3 border-b border-white/5 last:border-0">
                    <span className="text-white/40 text-sm">{row.key}</span>
                    <span className="text-white text-sm font-semibold text-right">{row.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            {/* Stats + contact */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeRight} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Factory, value: "500K", unit: "Sq Ft", label: "Manufacturing Facility", color: "text-orange-400", bg: "bg-orange-500/10" },
                  { icon: Users, value: "1200+", unit: "", label: "Skilled Employees", color: "text-blue-400", bg: "bg-blue-500/10" },
                  { icon: Globe, value: "15+", unit: "", label: "Countries Exported", color: "text-green-400", bg: "bg-green-500/10" },
                  { icon: TrendingUp, value: "5M+", unit: "", label: "Tyres Sold Globally", color: "text-brand", bg: "bg-brand/10" },
                  { icon: Clock, value: "24/7", unit: "", label: "Production Cycle", color: "text-purple-400", bg: "bg-purple-500/10" },
                  { icon: Award, value: "10+", unit: "Yrs", label: "Industry Experience", color: "text-yellow-400", bg: "bg-yellow-500/10" },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className={`${s.bg} border border-white/8 hover:border-white/15 p-5 rounded-2xl transition-colors`}>
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center mb-3">
                        <Icon size={20} className={s.color} />
                      </div>
                      <div className={`text-3xl font-black ${s.color}`}>{s.value}<span className="text-sm ml-0.5">{s.unit}</span></div>
                      <div className="text-xs text-white/35 font-bold uppercase tracking-widest mt-1">{s.label}</div>
                    </div>
                  );
                })}
              </div>
              {/* Contact card */}
              <div className="bg-gradient-to-br from-brand/15 to-red-900/10 border border-brand/20 rounded-2xl p-6">
                <h4 className="text-white font-black mb-4">Get In Touch</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-white/50 text-sm">
                    <Phone size={14} className="text-brand flex-shrink-0" />
                    <span>Contact via Inquiry Form</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/50 text-sm">
                    <Mail size={14} className="text-brand flex-shrink-0" />
                    <span>Reach us through our website</span>
                  </div>
                  <div className="flex items-start gap-3 text-white/50 text-sm">
                    <MapPin size={14} className="text-brand flex-shrink-0 mt-0.5" />
                    <span>India (Factory & Head Office)</span>
                  </div>
                </div>
                <Link to="/contact" className="mt-5 inline-flex items-center gap-2 text-brand text-xs font-bold uppercase tracking-widest hover:gap-3 transition-all">
                  Send Inquiry <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS */}
      <section className="py-20 px-4 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">Accreditation</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Global <span className="text-brand">Certifications</span></h2>
            <p className="text-white/40 max-w-xl mx-auto">Meeting and exceeding international safety and quality standards.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {[
              { icon: Globe, title: "ISO 9001", color: "from-blue-500/15 to-blue-500/5", border: "border-blue-500/20", iconColor: "text-blue-400", desc: "Certified quality management systems ensuring consistent manufacturing excellence." },
              { icon: Shield, title: "DOT Compliant", color: "from-brand/15 to-brand/5", border: "border-brand/20", iconColor: "text-brand", desc: "Approved by the Department of Transportation for commercial and highway safety." },
              { icon: CheckCircle, title: "ECE Certified", color: "from-green-500/15 to-green-500/5", border: "border-green-500/20", iconColor: "text-green-400", desc: "Meeting rigorous Economic Commission for Europe standards for tyre performance." },
              { icon: Award, title: "BIS Certified", color: "from-yellow-500/15 to-yellow-500/5", border: "border-yellow-500/20", iconColor: "text-yellow-400", desc: "Bureau of Indian Standards certification for domestic market quality compliance." },
            ].map((cert, i) => {
              const Icon = cert.icon;
              return (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.08 }} className={`p-7 rounded-3xl border bg-gradient-to-b ${cert.color} ${cert.border} flex flex-col group hover:-translate-y-1 transition-transform duration-300`}>
                  <Icon size={32} className={`${cert.iconColor} mb-4`} />
                  <h3 className="text-xl font-black text-white mb-3">{cert.title}</h3>
                  <p className="text-xs text-white/40 leading-relaxed flex-1">{cert.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="py-20 px-4 border-t border-white/5 bg-[#050505]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">History</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">Our <span className="text-brand">Journey</span></h2>
            <p className="text-white/40">A decade of relentless innovation and growth.</p>
          </motion.div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-px top-0 bottom-0 w-px bg-gradient-to-b from-brand via-brand/40 to-transparent hidden md:block" />
            <div className="space-y-10">
              {[
                { year: "2014", title: "Foundation", desc: "SJR Tyres established with a vision to redefine industrial tyre manufacturing in India.", icon: Building2 },
                { year: "2018", title: "Global Expansion", desc: "First international exports to Europe and Middle-East markets, establishing global presence.", icon: Globe },
                { year: "2021", title: "Advanced R&D Lab", desc: "Launch of state-of-the-art polymer research facility with 3D laser tread scanning technology.", icon: Zap },
                { year: "2023", title: "BIS & ECE Certification", desc: "Achieved BIS and ECE certifications, unlocking access to regulated international markets.", icon: Award },
                { year: "2024", title: "Industry Leader", desc: "Surpassing 5 Million units sold globally across 15+ countries. Trusted by 500+ fleets.", icon: Star },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }} className={`flex flex-col md:flex-row ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-6`}>
                    <div className="flex-1">
                      <div className={`bg-white/[0.04] border border-white/8 hover:border-brand/30 p-6 rounded-2xl transition-colors ${i % 2 !== 0 ? 'md:text-left' : 'md:text-right'}`}>
                        <div className={`flex items-center gap-3 mb-2 ${i % 2 !== 0 ? 'justify-start' : 'justify-end'}`}>
                          <Icon size={16} className="text-brand" />
                          <span className="text-brand font-black text-2xl">{item.year}</span>
                        </div>
                        <h3 className="text-lg font-black text-white mt-1 mb-2">{item.title}</h3>
                        <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                    <div className="hidden md:flex w-4 h-4 rounded-full bg-brand flex-shrink-0 shadow-[0_0_12px_rgba(239,68,68,0.6)]" />
                    <div className="flex-1 hidden md:block" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* INFRASTRUCTURE */}
      <section className="py-20 px-4 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-[2px] bg-brand" />
                <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">Manufacturing</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
                Massive Scale.<br /><span className="text-brand">Precision Engineering.</span>
              </h2>
              <p className="text-sm text-white/40 leading-relaxed mb-4">
                Our 500,000 sq ft state-of-the-art manufacturing facility is equipped with fully automated production lines, robotic quality inspection systems, and advanced rubber compounding labs — all operating 24/7 to meet the demands of global bulk orders.
              </p>
              <p className="text-sm text-white/40 leading-relaxed mb-10">
                Every tyre undergoes 47 rigorous quality checkpoints including X-ray inspection, high-speed uniformity testing, dynamic balance checks, and endurance testing before leaving our facility.
              </p>
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-brand text-white font-bold text-sm rounded-full hover:bg-red-700 transition-all uppercase tracking-widest group">
                Partner With Us <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} className="grid grid-cols-2 gap-4">
              {[
                { icon: Factory, value: "500K", label: "Sq Ft Facility", color: "text-orange-400", bg: "bg-orange-500/10" },
                { icon: Users, value: "1.2K+", label: "Skilled Experts", color: "text-blue-400", bg: "bg-blue-500/10" },
                { icon: Clock, value: "24/7", label: "Production Cycle", color: "text-green-400", bg: "bg-green-500/10" },
                { icon: Target, value: "0%", label: "Defect Tolerance", color: "text-brand", bg: "bg-brand/10" },
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className={`${s.bg} border border-white/8 hover:border-white/15 p-6 rounded-2xl text-center transition-colors`}>
                    <Icon size={28} className={`${s.color} mx-auto mb-3`} />
                    <div className={`text-4xl font-black ${s.color} mb-1`}>{s.value}</div>
                    <div className="text-xs text-white/35 font-bold uppercase tracking-widest">{s.label}</div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-28 px-4 overflow-hidden bg-[#050505] border-t border-white/5">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,68,68,0.1) 0%, transparent 70%)' }} />
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Ready to <span className="text-brand">Partner</span><br />with SJR?
          </h2>
          <p className="text-white/40 mb-10 text-lg">
            Join 500+ global fleet operators and distributors who trust SJR Tyres for performance, reliability, and scale.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-brand text-white font-black text-sm rounded-full hover:bg-red-700 transition-all uppercase tracking-widest shadow-[0_0_40px_rgba(239,68,68,0.35)] hover:shadow-[0_0_60px_rgba(239,68,68,0.6)] group">
              Get a Quote <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/products" className="inline-flex items-center justify-center gap-2 px-10 py-5 border border-white/15 text-white font-bold text-sm rounded-full hover:bg-white hover:text-black transition-all uppercase tracking-widest">
              View Products
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
