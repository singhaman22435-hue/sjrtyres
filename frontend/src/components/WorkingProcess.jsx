import React, { useRef } from 'react';
import { motion } from 'framer-motion';

const processes = [
  {
    id: 1,
    title: "Raw Material Selection",
    details: "Only the highest grade rubber compounds and steel belts are selected for unmatched durability. Every batch is rigorously tested before entering the production line.",
    icon: "🧪",
    color: "from-orange-500/20 to-orange-500/5",
    border: "border-orange-500/20",
    glow: "rgba(249,115,22,0.2)"
  },
  {
    id: 2,
    title: "Precision Extrusion",
    details: "Advanced extrusion technology ensures perfect tread patterns for maximum road grip, forming the exact profile needed for each specific tyre model.",
    icon: "⚙️",
    color: "from-blue-500/20 to-blue-500/5",
    border: "border-blue-500/20",
    glow: "rgba(59,130,246,0.2)"
  },
  {
    id: 3,
    title: "Automated Curing",
    details: "The green tyre is placed into our high-pressure curing presses where heat and pressure chemically bond all components, forming the final tread shape.",
    icon: "🔥",
    color: "from-red-500/20 to-red-500/5",
    border: "border-red-500/20",
    glow: "rgba(239,68,68,0.2)"
  },
  {
    id: 4,
    title: "Quality Control",
    details: "Every tyre passes through 3D laser scanning and X-ray machines to detect even microscopic anomalies, ensuring a zero-defect rate.",
    icon: "🔬",
    color: "from-green-500/20 to-green-500/5",
    border: "border-green-500/20",
    glow: "rgba(34,197,94,0.2)"
  },
  {
    id: 5,
    title: "Dispatch & Logistics",
    details: "Approved tyres are wrapped and securely loaded for global distribution, ready to dominate extreme terrains worldwide.",
    icon: "🚀",
    color: "from-purple-500/20 to-purple-500/5",
    border: "border-purple-500/20",
    glow: "rgba(168,85,247,0.2)"
  }
];

// 3D tilt hook
function TiltCard({ children, className }) {
  const ref = useRef(null);
  const handleMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
    const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
    ref.current.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) scale(1.02)`;
  };
  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) scale(1)';
  };
  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)', willChange: 'transform' }}
    >
      {children}
    </div>
  );
}

const WorkingProcess = () => {
  return (
    <section className="py-24 bg-[#080808] text-white overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand opacity-[0.04] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500 opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="text-center mb-20 max-w-4xl mx-auto px-6 relative z-10">
        <div className="flex items-center justify-center gap-3 mb-5">
          <div className="w-6 h-[2px] bg-brand" />
          <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">How We Build</span>
          <div className="w-6 h-[2px] bg-brand" />
        </div>
        <h2 className="text-4xl md:text-6xl font-black mb-6">The Making of <span className="text-brand">Excellence</span></h2>
        <p className="text-lg text-white/40 leading-relaxed">A look inside our state-of-the-art manufacturing facility and the rigorous process behind every tyre.</p>
      </div>

      {/* Process cards — alternating layout */}
      <div className="flex flex-col gap-12 max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {processes.map((step, index) => (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            key={step.id}
            className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-16`}
          >
            {/* Visual card with 3D tilt */}
            <TiltCard className="w-full md:w-1/2">
              <div
                className={`relative rounded-3xl overflow-hidden border ${step.border} bg-gradient-to-br ${step.color} h-[300px] md:h-[380px] flex items-center justify-center`}
                style={{ boxShadow: `0 20px 60px ${step.glow}` }}
              >
                {/* Large emoji icon */}
                <div className="text-[8rem] select-none opacity-80" style={{ filter: 'drop-shadow(0 0 40px rgba(255,255,255,0.15))' }}>
                  {step.icon}
                </div>
                {/* Phase badge */}
                <div className="absolute top-5 left-5 px-4 py-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-brand text-[10px] font-black uppercase tracking-widest">
                  Phase 0{step.id}
                </div>
                {/* Subtle grid overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id={`grid-${step.id}`} x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
                      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill={`url(#grid-${step.id})`} />
                </svg>
              </div>
            </TiltCard>

            {/* Text Details */}
            <div className="w-full md:w-1/2 flex flex-col justify-center">
              <h3 className="text-3xl md:text-4xl font-black mb-5 text-white">{step.title}</h3>
              <p className="text-base md:text-lg text-white/45 leading-relaxed border-l-2 border-brand/50 pl-5">
                {step.details}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Corporate Video Section */}
      <div className="max-w-7xl mx-auto px-6 lg:px-10 mt-24 mb-10 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">Inside <span className="text-brand">SJR Tyres</span></h2>
          <p className="text-white/40 text-base">Watch our exclusive corporate documentary showcasing our world-class facilities.</p>
        </div>

        <div className="relative w-full rounded-[2rem] overflow-hidden border border-brand/20 bg-[#080808] shadow-[0_0_80px_rgba(239,68,68,0.1)] group aspect-video">
          <video
            src="/WhatsApp%20Video%202026-06-27%20at%2013.45.00.mp4"
            controls
            preload="none"
            controlsList="nodownload noplaybackrate"
            disablePictureInPicture
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-cover"
            poster="/tyre images/IS 2441....c.webp"
          />
        </div>
      </div>
    </section>
  );
};

export default WorkingProcess;
