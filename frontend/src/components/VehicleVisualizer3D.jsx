import React from 'react';
import { motion } from 'framer-motion';

export default function VehicleVisualizer3D() {
  return (
    <div className="w-full h-full min-h-[400px] relative flex items-center justify-center p-4 sm:p-8 overflow-visible">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand/20 via-transparent to-transparent opacity-70 blur-2xl pointer-events-none"></div>
      
      {/* 2D Animated SJR Branded Image */}
      <motion.img 
        src="/images/apc_hero_sjr.webp" 
        alt="VehicleVisualizer3D Render" 
        className="w-full max-w-[85%] sm:max-w-xl object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)] filter brightness-110 contrast-125 z-10"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        animate={{ y: [0, -15, 0] }}
        transition={{ 
          opacity: { duration: 0.8, ease: "easeOut" },
          scale: { duration: 0.8, ease: "easeOut" },
          y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
        }}
        whileHover={{ scale: 1.05, rotate: 2 }}
      />

      {/* Futuristic Floating UI Overlay */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 z-20 pointer-events-none"
      >
        <div className="text-brand font-black text-2xl sm:text-4xl tracking-tighter drop-shadow-[0_0_15px_rgba(112,214,197,0.8)]">
          SJR<span className="text-white">.</span>
        </div>
        <div className="text-text-primary/70 text-xs sm:text-sm font-mono uppercase tracking-widest mt-1">
          PERFORMANCE
        </div>
      </motion.div>
    </div>
  );
}
