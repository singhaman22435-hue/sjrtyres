import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function Catalog() {
  const [selectedImage, setSelectedImage] = useState(null);
  
  // We have 109 pages extracted from the PDF
  const totalPages = 109;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage]);

  const handleNext = () => {
    if (selectedImage < totalPages) setSelectedImage(selectedImage + 1);
  };

  const handlePrev = () => {
    if (selectedImage > 1) setSelectedImage(selectedImage - 1);
  };

  return (
    <div className="bg-[#080808] min-h-screen pt-32 pb-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-black uppercase tracking-widest mb-6"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand"></span>
            </span>
            Official E-Catalog
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-6"
          >
            SJR Tyres <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-red-400">Collection</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/50 text-sm md:text-base leading-relaxed"
          >
            Explore our complete product lineup, featuring detailed specifications, advanced tread patterns, and engineered performance metrics. Click on any page to zoom in.
          </motion.p>
        </div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {pages.map((pageNum, idx) => (
            <motion.div
              key={pageNum}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (idx % 12) * 0.05 }}
              onClick={() => setSelectedImage(pageNum)}
              className="group relative aspect-[1/1.4] bg-white/5 rounded-2xl overflow-hidden cursor-pointer border border-white/5 hover:border-brand/50 transition-colors"
            >
              <img
                src={`/catalog/page_${pageNum}.webp`}
                alt={`SJR Tyres Catalog Page ${pageNum}`}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 bg-brand rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                  <ZoomIn size={20} className="text-white" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-white">View Page {pageNum}</span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
          >
            {/* Close button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-brand text-white rounded-full flex items-center justify-center transition-all z-50"
            >
              <X size={24} />
            </button>

            {/* Navigation Arrows */}
            <button
              onClick={(e) => { e.stopPropagation(); handlePrev(); }}
              className={`absolute left-4 md:left-8 w-12 h-12 rounded-full flex items-center justify-center transition-all z-50 ${
                selectedImage > 1 ? 'bg-white/10 hover:bg-brand text-white' : 'opacity-0 pointer-events-none'
              }`}
            >
              <ChevronLeft size={28} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); handleNext(); }}
              className={`absolute right-4 md:right-8 w-12 h-12 rounded-full flex items-center justify-center transition-all z-50 ${
                selectedImage < totalPages ? 'bg-white/10 hover:bg-brand text-white' : 'opacity-0 pointer-events-none'
              }`}
            >
              <ChevronRight size={28} />
            </button>

            {/* Main Image */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex items-center justify-center"
              onClick={() => setSelectedImage(null)} // click outside to close
            >
              <img
                src={`/catalog/page_${selectedImage}.webp`}
                alt={`Catalog Page ${selectedImage}`}
                className="max-w-full max-h-[90vh] object-contain rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                onClick={(e) => e.stopPropagation()} // prevent closing when clicking the image itself
              />
            </motion.div>
            
            {/* Page indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/50 backdrop-blur-md border border-white/10 rounded-full text-xs font-bold text-white tracking-widest uppercase">
              Page {selectedImage} of {totalPages}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
