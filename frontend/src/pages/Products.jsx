import { useState, useMemo, useEffect, useCallback } from 'react';
import { ChevronDown, ChevronUp, FilterX, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { products as localProducts } from '../productsData';

// ─── Skeleton + lazy image loader ────────────────────────────────────────────
function ImageWithSkeleton({ src, alt, className }) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const fallback = '/tyre images/New folder (2)/900.16 B SL 91/4K0A4431.JPG';

  return (
    <div className="relative w-full h-full">
      {/* Shimmer skeleton while loading */}
      {!loaded && (
        <div className="absolute inset-0 shimmer rounded-none" />
      )}
      <img
        src={error ? fallback : src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => { setError(true); setLoaded(true); }}
        className={`${className} transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}


const FilterAccordion = ({ title, options, selectedState, toggleFn }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border-b border-white/5 py-5">
      <button 
        className="w-full flex justify-between items-center text-white font-bold focus:outline-none group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="uppercase tracking-[0.15em] text-xs text-white/60 group-hover:text-white transition-colors">{title}</span>
        {isOpen ? <ChevronUp size={16} className="text-brand" /> : <ChevronDown size={16} className="text-white/40 group-hover:text-white transition-colors" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 mt-4">
              {options.map((option) => (
                <label key={option} className="flex items-center gap-3 cursor-pointer group/label p-2 -ml-2 rounded-xl hover:bg-white/[0.02] transition-colors">
                  <div className="relative flex items-center justify-center w-4 h-4 flex-shrink-0">
                    <input 
                      type="checkbox" 
                      checked={selectedState.includes(option)}
                      onChange={() => toggleFn(option)}
                      className="peer appearance-none w-4 h-4 border border-white/20 rounded bg-white/5 transition-all checked:border-brand checked:bg-brand hover:border-brand/50 focus:outline-none cursor-pointer"
                    />
                    <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className={`text-sm tracking-wide transition-colors ${selectedState.includes(option) ? 'text-white font-bold' : 'text-white/50 group-hover/label:text-white/80'}`}>
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function Products() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const initialCategory = searchParams.get('category');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState(initialCategory ? [initialCategory] : []);
  const [selectedFitments, setSelectedFitments] = useState([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategories([category]);
    }
  }, [location.search]);

  useEffect(() => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
    fetch(`${API_URL}/api/products`)
      .then(res => {
        if (!res.ok) throw new Error('API Error');
        return res.json();
      })
      .then(data => {
        if (data && data.length > 0) {
          setProducts(data);
        } else {
          setProducts(localProducts);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products, falling back to local data:", err);
        setProducts(localProducts);
        setLoading(false);
      });
  }, []);

  const PREDEFINED_CATEGORIES = ['Two-Wheeler', 'Three-Wheeler', 'Passenger Car', 'Light Commercial', 'Heavy Commercial', 'Agricultural', 'Off-Road'];
  const PREDEFINED_FITMENTS = ['Front', 'Rear', 'Universal', 'All-Position'];

  const FILTER_CATEGORIES = useMemo(() => {
    const dynamicCategories = products.map(p => p.category).filter(Boolean);
    return [...new Set([...PREDEFINED_CATEGORIES, ...dynamicCategories])];
  }, [products]);

  const FILTER_FITMENTS = useMemo(() => {
    const dynamicFitments = products.map(p => p.fitment).filter(Boolean);
    return [...new Set([...PREDEFINED_FITMENTS, ...dynamicFitments])];
  }, [products]);

  const toggleFilter = (state, setState) => (value) => {
    setState(prev => 
      prev.includes(value) ? prev.filter(i => i !== value) : [...prev, value]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedFitments([]);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchCat = selectedCategories.length === 0 || selectedCategories.includes(product.category);
      const matchFit = selectedFitments.length === 0 || selectedFitments.includes(product.fitment);
      return matchCat && matchFit;
    });
  }, [products, selectedCategories, selectedFitments]);

  return (
    <div className="bg-black text-white min-h-screen">
      {/* ═══ HERO ═════════════════════════════════════════════════════════════ */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(239,68,68,0.1) 0%, transparent 70%)' }}
        />
        <div className="max-w-7xl mx-auto relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-2xl"
          >
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-5">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">SJR Catalog</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-5 leading-tight tracking-tight">
              Premium <span className="text-brand">Showcase</span>
            </h1>
            <p className="text-base text-white/40 leading-relaxed max-w-lg mx-auto lg:mx-0">
              Explore our comprehensive range of high-performance tyres engineered for extreme durability, maximum grip, and uncompromising reliability.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CATALOG LAYOUT ══════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10">
        
        {/* Mobile Filter Toggle */}
        <button 
          className="lg:hidden flex items-center justify-center gap-2 bg-white/[0.05] border border-white/10 text-white font-bold py-3 px-6 rounded-xl w-full"
          onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
        >
          <FilterX size={18} className="text-brand" /> {isMobileFilterOpen ? 'Close Filters' : 'Filter Products'}
        </button>

        {/* ── Left: Filters Sidebar ── */}
        <aside className={`w-full lg:w-1/4 lg:max-w-[280px] flex-shrink-0 ${isMobileFilterOpen ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
              <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <FilterX size={16} className="text-brand" /> Filters
              </h2>
              {(selectedCategories.length > 0 || selectedFitments.length > 0) && (
                <button 
                  onClick={clearFilters}
                  className="text-[10px] uppercase tracking-widest font-bold text-brand hover:text-white transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="space-y-1">
              <FilterAccordion 
                title="Category" 
                options={FILTER_CATEGORIES} 
                selectedState={selectedCategories} 
                toggleFn={toggleFilter(selectedCategories, setSelectedCategories)} 
              />
              <FilterAccordion 
                title="Fitment" 
                options={FILTER_FITMENTS} 
                selectedState={selectedFitments} 
                toggleFn={toggleFilter(selectedFitments, setSelectedFitments)} 
              />
            </div>
          </div>
        </aside>

        {/* ── Right: Product Grid ── */}
        <main className="flex-1">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest">
              Showing <span className="text-brand">{filteredProducts.length}</span> Results
            </h2>
          </div>

          {loading ? (
             <div className="w-full py-32 flex justify-center items-center">
               <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-brand"></div>
             </div>
          ) : filteredProducts.length === 0 ? (
            <div className="w-full py-24 flex flex-col items-center justify-center bg-white/[0.02] border border-white/5 rounded-3xl text-center">
              <FilterX size={48} className="text-white/20 mb-6" />
              <h3 className="text-2xl font-black text-white mb-3">No Matches Found</h3>
              <p className="text-white/40 text-sm max-w-sm mb-8">Try adjusting or clearing your filters to discover our extensive tyre catalog.</p>
              <button 
                onClick={clearFilters}
                className="px-6 py-3 bg-brand text-white text-xs font-bold uppercase tracking-widest rounded-full hover:bg-red-700 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredProducts.map((product, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: Math.min((idx % 9) * 0.04, 0.3) }}
                    key={product.id} 
                    className="bg-white/[0.03] border border-white/5 rounded-3xl overflow-hidden flex flex-col group hover:bg-white/[0.05] hover:border-white/10 transition-colors"
                  >
                    
                    {/* Image */}
                    <Link to={`/product/${product.id}`} className="relative h-56 bg-white flex items-center justify-center p-6 border-b border-white/5 overflow-hidden">
                      <ImageWithSkeleton
                        src={product.image || '/tyre images/New folder (2)/900.16 B SL 91/4K0A4431.JPG'}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex gap-2 z-10">
                         <span className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full text-[9px] font-black text-white uppercase tracking-widest border border-white/10">
                           {product.category}
                         </span>
                      </div>
                    </Link>
                    
                    {/* Content Body */}
                    <div className="p-6 flex flex-col flex-1">
                      <div className="mb-1">
                        <p className="text-brand text-[10px] font-bold uppercase tracking-widest mb-1">{product.fitment} Axle</p>
                        <h3 className="text-lg font-black text-white uppercase tracking-wide leading-tight group-hover:text-brand transition-colors">
                          <Link to={`/product/${product.id}`}>{product.name}</Link>
                        </h3>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-white/5 flex-1">
                        <div className="text-white/40 text-[10px] uppercase tracking-widest mb-2">Primary Applications</div>
                        <div className="flex flex-wrap gap-1.5">
                          {product.applications.slice(0, 3).map((app, i) => (
                            <span key={i} className="text-xs text-white/60 bg-white/5 px-2 py-1 rounded">
                              {app}
                            </span>
                          ))}
                          {product.applications.length > 3 && (
                            <span className="text-xs text-white/40 px-1 py-1">+{product.applications.length - 3}</span>
                          )}
                        </div>
                      </div>
                      
                      <Link 
                        to={`/product/${product.id}`}
                        className="w-full mt-6 py-3 bg-white/5 hover:bg-brand text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-xl flex items-center justify-center gap-2 transition-colors"
                      >
                        View Details <ArrowRight size={14} />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
