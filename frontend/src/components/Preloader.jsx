import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setLoading(false), 500); // Small delay before hiding
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5; // Random jump between 5-20
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Lock scrolling while preloader is active
    if (loading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [loading]);

  const content = (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="preloader"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-transparent pointer-events-auto"
        >
          {/* Split Backgrounds for Cinematic Reveal */}
          <motion.div 
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="absolute top-0 left-0 w-full h-1/2 bg-surface-dark border-b border-brand/20 z-0"
          />
          <motion.div 
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1], delay: 0.2 }}
            className="absolute bottom-0 left-0 w-full h-1/2 bg-surface-dark border-t border-brand/20 z-0"
          />
          
          <motion.div 
            exit={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            transition={{ duration: 0.4, ease: "easeIn" }}
            className="relative z-10 flex flex-col items-center"
          >
          {/* Branded Tyre Preloader */}
          <div className="relative mb-8 w-28 h-28 flex items-center justify-center">
            {/* Glowing backdrop */}
            <div className="absolute inset-0 bg-brand rounded-full blur-[40px] opacity-30"></div>
            
            {/* Rotating SVG Tyre — CSS spin instead of Framer Motion */}
            <svg
              style={{ animation: 'spin 2s linear infinite' }}
              viewBox="0 0 100 100"
              className="absolute inset-0 w-28 h-28 text-text-primary opacity-90 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              fill="currentColor"
            >
              {/* Outer Tread Base */}
              <path d="M50 0C22.4 0 0 22.4 0 50s22.4 50 50 50 50-22.4 50-50S77.6 0 50 0zm0 90C27.9 90 10 72.1 10 50S27.9 10 50 10s40 17.9 40 40-17.9 40-40 40z" />
              {/* Inner Rim Edge */}
              <path d="M50 20c-16.5 0-30 13.5-30 30s13.5 30 30 30 30-13.5 30-30-13.5-30-30-30zm0 50c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20z" />
              {/* Outer Treads */}
              <rect x="47" y="2" width="6" height="8" rx="2" />
              <rect x="47" y="90" width="6" height="8" rx="2" />
              <rect x="2" y="47" width="8" height="6" rx="2" />
              <rect x="90" y="47" width="8" height="6" rx="2" />
              <rect x="15" y="15" width="8" height="6" rx="2" transform="rotate(45 19 18)" />
              <rect x="77" y="77" width="8" height="6" rx="2" transform="rotate(45 81 80)" />
              <rect x="15" y="79" width="6" height="8" rx="2" transform="rotate(-45 18 83)" />
              <rect x="79" y="15" width="6" height="8" rx="2" transform="rotate(-45 82 19)" />
              {/* Rim Spokes */}
              <polygon points="48,22 52,22 55,42 45,42" />
              <polygon points="48,78 52,78 55,58 45,58" />
              <polygon points="22,48 22,52 42,55 42,45" />
              <polygon points="78,48 78,52 58,55 58,45" />
              {/* Center Hub */}
              <circle cx="50" cy="50" r="12" fill="#1A1C3D" />
              <circle cx="50" cy="50" r="12" fill="none" stroke="currentColor" strokeWidth="1" />
            </svg>

            {/* Static Floating Branding (Rolls-Royce Style) */}
            <div className="relative z-20 text-brand font-black text-[10px] tracking-widest font-heading mt-0.5 ml-0.5">
              SJR
            </div>
          </div>

          {/* Logo Animation */}
          <div className="relative mb-8 text-center">
            <motion.h1 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-5xl md:text-7xl font-black text-text-primary tracking-tighter"
            >
              SJR <span className="text-brand">TYRES</span>
            </motion.h1>
            <div className="absolute -bottom-4 left-0 w-full h-[1px] bg-text-primary/10 overflow-hidden">
              <motion.div 
                className="h-full bg-brand"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
          </div>

          {/* Progress Number */}
          <div className="text-text-secondary text-sm font-bold uppercase tracking-[0.3em]">
            Loading System <span className="text-text-primary">{progress}%</span>
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}
