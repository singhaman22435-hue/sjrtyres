import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Warranty', href: '/warranty' },
  { label: 'E-Catalog', href: '/catalog' },
  { label: 'Contact', href: '/contact' },
];

const productCategories = [
  { label: 'Agriculture', href: '/products?category=Agriculture', desc: 'Tractor & Farm Tyres' },
  { label: 'Commercial', href: '/products?category=Commercial', desc: 'Truck & Bus Tyres' },
  { label: 'Two-Wheeler', href: '/products?category=Two-Wheeler', desc: 'Bike & Scooter Tyres' },
  { label: 'OTR & Mining', href: '/products?category=OTR', desc: 'Off-Road & Industrial' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setIsMegaMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-6xl">
      {/* Main pill navbar */}
      <div
        className={`transition-all duration-500 rounded-full ${
          isScrolled
            ? 'glass-nav shadow-[0_8px_40px_rgba(0,0,0,0.6)]'
            : 'bg-brand border border-red-700/50 shadow-[0_4px_24px_rgba(239,68,68,0.35)]'
        }`}
      >
        <div className={`px-5 sm:px-8 flex items-center justify-between transition-all duration-500 ${isScrolled ? 'h-15' : 'h-18'}`}
          style={{ height: isScrolled ? '60px' : '72px' }}
        >
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <img
              src="/logo.webp"
              alt="SJR Tyres"
              className={`w-auto object-contain brightness-0 invert transition-all duration-500 ${isScrolled ? 'h-8' : 'h-10'}`}
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`relative px-4 py-2 text-[12px] font-bold uppercase tracking-widest rounded-full transition-all duration-200 ${
                  location.pathname === link.href
                    ? isScrolled ? 'text-brand' : 'text-white bg-white/15'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
                {/* Animated underline on active link */}
                {location.pathname === link.href && isScrolled && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] w-4 bg-brand rounded-full"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Products dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsMegaMenuOpen(true)}
              onMouseLeave={() => setIsMegaMenuOpen(false)}
            >
              <Link
                to="/products"
                className={`flex items-center gap-1 px-4 py-2 text-[12px] font-bold uppercase tracking-widest rounded-full transition-all duration-200 ${
                  location.pathname === '/products'
                    ? isScrolled ? 'text-brand' : 'text-white bg-white/15'
                    : 'text-white/80 hover:text-white hover:bg-white/10'
                }`}
              >
                Products
                <ChevronDown size={13} className={`transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180' : ''}`} />
              </Link>

              <AnimatePresence>
                {isMegaMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[420px] bg-[#0a0a0a]/95 border border-white/10 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] z-[100]"
                  >
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {productCategories.map((cat) => (
                        <Link
                          key={cat.label}
                          to={cat.href}
                          onClick={() => setIsMegaMenuOpen(false)}
                          className="group p-3 rounded-xl hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-0.5">
                            <div className="w-1.5 h-1.5 bg-brand rounded-full" />
                            <span className="text-sm font-bold text-white group-hover:text-brand transition-colors">{cat.label}</span>
                          </div>
                          <p className="text-xs text-white/35 pl-3.5">{cat.desc}</p>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to="/products"
                      onClick={() => setIsMegaMenuOpen(false)}
                      className="flex items-center justify-between w-full px-4 py-2.5 bg-brand/10 hover:bg-brand/20 border border-brand/20 rounded-xl text-brand text-xs font-bold uppercase tracking-widest transition-all group"
                    >
                      View All Products
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'open'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="md:hidden mt-2 bg-[#0a0a0a]/95 border border-white/10 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]"
          >
            <div className="p-4 flex flex-col gap-1">
              {[...navLinks, { label: 'Products', href: '/products' }].map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`px-4 py-3 text-sm font-bold uppercase tracking-widest rounded-xl transition-colors ${
                    location.pathname === link.href
                      ? 'text-brand bg-brand/10'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-white/8">
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white/5 text-white/70 text-sm font-bold uppercase tracking-widest rounded-xl hover:bg-white/10 transition-colors"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
