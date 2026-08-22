import { MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#080808] border-t border-white/5 relative overflow-hidden">
      {/* 3D Perspective watermark */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 text-[22vw] font-black text-white/[0.018] select-none pointer-events-none leading-none tracking-tighter z-0"
        style={{ transform: 'translateX(-50%) perspective(400px) rotateX(20deg)', transformOrigin: 'bottom center' }}
      >
        SJR
      </div>
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">

          {/* Brand */}
          <div className="lg:col-span-4">
            <img loading="lazy" 
              src="/logo.webp" 
              alt="SJR Tyres" 
              className="h-10 w-auto object-contain brightness-0 invert mb-6"
            />
            <p className="text-sm text-white/40 leading-relaxed mb-8 max-w-sm">
              Engineered for Performance. Delivering premium industrial, agricultural, and commercial tyres with cutting-edge manufacturing excellence.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/sjrtyresofficial"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-brand hover:border-brand/50 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a
                href="https://wa.me/919599428405"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/50 hover:text-green-400 hover:border-green-400/50 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 2.18h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.25em] mb-6">Company</h3>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About Us", href: "/about" },
                { label: "Products", href: "/products" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/40 hover:text-brand transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.25em] mb-6">Products</h3>
            <ul className="space-y-3">
              {["Agriculture", "Commercial", "Two-Wheeler", "OTR & Mining"].map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/products?category=${cat}`}
                    className="text-sm text-white/40 hover:text-brand transition-colors flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -ml-3 group-hover:ml-0 transition-all duration-200" />
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="lg:col-span-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.25em] mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm text-white/70 font-medium">Headquarters</p>
                  <p className="text-xs text-white/35 mt-0.5 leading-relaxed">Plot No E-18, MIDC Kagal<br />Kolhapur - 416216, Maharashtra</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm text-white/70 font-medium">Call Us</p>
                  <a href="tel:+919599428405" className="text-xs text-white/35 hover:text-brand transition-colors mt-0.5 block">+91 9599428405</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4 text-brand" />
                </div>
                <div>
                  <p className="text-sm text-white/70 font-medium">Email</p>
                  <a href="mailto:sales@sjrtyres.in" className="text-xs text-white/35 hover:text-brand transition-colors mt-0.5 block">sales@sjrtyres.in</a>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/25">© {new Date().getFullYear()} SJR Tyres. Engineered for the Real World.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-white/25 hover:text-brand transition-colors">Privacy Policy</a>
            <span className="w-px h-3 bg-white/10" />
            <a href="#" className="text-xs text-white/25 hover:text-brand transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
