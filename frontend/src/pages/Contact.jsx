import { useState } from 'react';
import axios from 'axios';
import { MapPin, Phone, Mail, Send, MessageSquare, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const inputClass = "w-full bg-white/[0.04] border border-white/10 rounded-2xl px-5 py-4 text-white text-sm placeholder-white/20 focus:outline-none focus:border-brand focus:bg-white/[0.07] transition-all";
const labelClass = "block text-xs font-bold tracking-[0.2em] uppercase text-white/40 mb-2";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', vehicleType: 'General', message: ''
  });
  const [status, setStatus] = useState(null); // null | 'submitting' | 'success' | 'error'

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5005';
      await axios.post(`${API_URL}/api/contact`, formData);
      setStatus('success');
      setFormData({ name: '', email: '', phone: '', vehicleType: 'General', message: '' });
      setTimeout(() => setStatus(null), 6000);
    } catch (error) {
      console.error(error);
      setStatus('error');
      setTimeout(() => setStatus(null), 4000);
    }
  };

  const update = (field) => (e) => setFormData({ ...formData, [field]: e.target.value });

  return (
    <div className="bg-black text-white min-h-screen">

      {/* ═══ HERO ═════════════════════════════════════════════════════════════ */}
      <section className="relative pt-36 pb-20 px-4 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(239,68,68,0.1) 0%, transparent 70%)' }}
        />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-6 h-[2px] bg-brand" />
              <span className="text-brand font-bold text-xs tracking-[0.35em] uppercase">Get in Touch</span>
              <div className="w-6 h-[2px] bg-brand" />
            </div>
            <h1 className="text-5xl md:text-7xl font-black mb-5 leading-tight">
              Contact <span className="text-brand">Us</span>
            </h1>
            <p className="text-base text-white/40 leading-relaxed max-w-xl mx-auto">
              Get in touch for bulk inquiries, technical specifications, dealership opportunities, or general questions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTACT GRID ════════════════════════════════════════════════════ */}
      <section className="pb-24 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

            {/* ── Left: Info ── */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="lg:col-span-2 flex flex-col gap-6"
            >
              {/* Info card */}
              <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-8">
                <h2 className="text-xl font-black text-white mb-6">Our Headquarters</h2>
                <div className="space-y-6">
                  {[
                    {
                      icon: MapPin, label: "Address",
                      value: "Sudarshan Auto Industries Pvt Ltd\nPlot No E-18, Five Star MIDC Kagal\nKolhapur - 416216 (Maharashtra)",
                      href: "https://maps.google.com/?q=Kolhapur+Maharashtra",
                    },
                    {
                      icon: Phone, label: "Phone",
                      value: "+91 9599428405\n+91 9028477277",
                      href: "tel:+919599428405",
                    },
                    {
                      icon: Mail, label: "Email",
                      value: "sales@sjrtyres.in\nexport@sjrtyres.in",
                      href: "mailto:sales@sjrtyres.in",
                    },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <a
                        key={i}
                        href={item.href}
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-brand/20 transition-colors">
                          <Icon size={18} className="text-brand" />
                        </div>
                        <div>
                          <div className="text-xs text-white/30 font-bold uppercase tracking-widest mb-1">{item.label}</div>
                          <div className="text-sm text-white/65 group-hover:text-white transition-colors leading-relaxed whitespace-pre-line">{item.value}</div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://wa.me/919599428405"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400 text-xs font-bold hover:bg-green-500/20 transition-colors"
                >
                  <MessageSquare size={16} />
                  WhatsApp
                </a>
                <a
                  href="https://www.instagram.com/sjrtyresofficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-4 bg-pink-500/10 border border-pink-500/20 rounded-2xl text-pink-400 text-xs font-bold hover:bg-pink-500/20 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                  Instagram
                </a>
              </div>

              {/* Map */}
              <div className="rounded-3xl overflow-hidden border border-white/8 h-52 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d122283.7912196652!2d74.1593888!3d16.7049873!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc1000cdec07a29%3A0xece8ea642952e42f!2sKolhapur%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1714418641913!5m2!1sen!2sin"
                  className="absolute inset-0 w-full h-full border-0 transition-all duration-500"
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </motion.div>

            {/* ── Right: Form ── */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="lg:col-span-3"
            >
              <div className="bg-white/[0.03] border border-white/8 rounded-3xl p-8 md:p-10 relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at top right, rgba(239,68,68,0.07) 0%, transparent 70%)' }}
                />

                <h2 className="text-2xl font-black text-white mb-2">Send an Inquiry</h2>
                <p className="text-sm text-white/35 mb-8">We respond within 24 hours.</p>

                {/* Status messages */}
                <AnimatePresence>
                  {status === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-3 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-xl mb-6 text-sm"
                    >
                      <CheckCircle size={16} />
                      Thank you! Your message has been sent successfully.
                    </motion.div>
                  )}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="bg-brand/10 border border-brand/30 text-brand px-4 py-3 rounded-xl mb-6 text-sm"
                    >
                      An error occurred. Please try again or call us directly.
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input
                        required type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={update('name')}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email *</label>
                      <input
                        required type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={update('email')}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Phone</label>
                      <input
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.phone}
                        onChange={update('phone')}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Inquiry Type</label>
                      <select
                        value={formData.vehicleType}
                        onChange={update('vehicleType')}
                        className={inputClass + " cursor-pointer appearance-none"}
                      >
                        <option value="General">General Inquiry</option>
                        <option value="Bulk Order">Bulk Order</option>
                        <option value="Technical Support">Technical Support</option>
                        <option value="Dealership">Dealership Opportunities</option>
                        <option value="Export">Export Inquiry</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Message *</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us about your requirements..."
                      value={formData.message}
                      onChange={update('message')}
                      className={inputClass + " resize-none"}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-brand text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-red-700 transition-all duration-300 shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Sending...
                      </span>
                    ) : (
                      <>Send Message <Send size={16} /></>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
