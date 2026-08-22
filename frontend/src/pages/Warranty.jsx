import { useEffect } from 'react';
import { Shield, Info, AlertCircle, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Warranty() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.5 }
  };

  const warrantyData = [
    { category: "Two-wheeler", mfg: "60 months from manufacturing period or till 85% wear (whichever is earlier)", promise: "36 months from manufacturing period or till 50% wear (whichever is earlier)" },
    { category: "Farm", mfg: "60 months from manufacturing period or till 85% wear (whichever is earlier)", promise: "24 months from manufacturing period or till 50% wear (whichever is earlier)" },
    { category: "Thresher", mfg: "No WARRANTY", promise: "NO SJR PROMISE WARRANTY" },
    { category: "E-Rickshaw", mfg: "36 months from manufacturing period or till 85% wear (whichever is earlier)", promise: "18 months from manufacturing period or till 50% wear (whichever is earlier)" },
    { category: "Three wheeler", mfg: "36 months from manufacturing period or till 85% wear (whichever is earlier)", promise: "18 months from manufacturing period or till 50% wear (whichever is earlier)" },
    { category: "Small Commercial Vehicle (SCV)", mfg: "36 months from manufacturing period or till 85% wear (whichever is earlier)", promise: "12 months from manufacturing period or till 50% wear (whichever is earlier)" },
    { category: "Light Commercial Vehicle (LCV)", mfg: "36 months from manufacturing period or till 85% wear (whichever is earlier)", promise: "12 months from manufacturing period or till 50% wear (whichever is earlier)" },
    { category: "Tractor Trailer 9.00-16", mfg: "24 months from manufacturing period or till 85% wear (whichever is earlier)", promise: "NO SJR PROMISE WARRANTY" },
  ];

  return (
    <div className="bg-[#080808] min-h-screen pt-32 pb-24 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 mx-auto bg-brand/10 border border-brand/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.2)]"
          >
            <Shield size={40} className="text-brand" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4"
          >
            SJR TYRES <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-red-400">WARRANTY POLICY</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white/50 text-base font-medium tracking-widest uppercase"
          >
            SJR Promise & Manufacturing Defect Warranty Chart
          </motion.p>
        </div>

        {/* Warranty Table */}
        <motion.div {...fadeIn} className="mb-12 bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-1 bg-gradient-to-r from-transparent via-brand to-transparent"></div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-white/70 text-xs md:text-sm font-black uppercase tracking-widest">
                  <th className="px-6 py-6 border-r border-white/5 w-1/4">Category</th>
                  <th className="px-6 py-6 border-r border-white/5 w-3/8 text-brand">For Mfg. Defect</th>
                  <th className="px-6 py-6 w-3/8 text-white">SJR PROMISE Warranty**</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {warrantyData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-6 py-5 border-r border-white/5 font-bold text-white uppercase tracking-wider text-sm">
                      {row.category}
                    </td>
                    <td className="px-6 py-5 border-r border-white/5 text-white/70 font-medium text-sm leading-relaxed">
                      {row.mfg}
                    </td>
                    <td className="px-6 py-5 text-white/70 font-medium text-sm leading-relaxed">
                      {row.promise}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Important Notes */}
        <motion.div {...fadeIn} className="bg-brand/5 border border-brand/20 rounded-3xl p-8 md:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/10 blur-[100px] rounded-full pointer-events-none -translate-y-1/2 translate-x-1/2" />
          
          <h3 className="text-xl font-black uppercase tracking-widest text-brand mb-8 flex items-center gap-3">
            <AlertCircle size={24} /> Important Conditions
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-brand mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              <p className="text-white font-bold uppercase tracking-wide text-sm md:text-base leading-relaxed">
                <span className="text-brand">**</span> SJR TYRES ADJUSTED UNDER WARRANTY WILL BE REPLACED ON PRORATA BASIS.
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-brand mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              <p className="text-white font-bold uppercase tracking-wide text-sm md:text-base leading-relaxed">
                <span className="text-brand">**</span> THROUGH CUT IS CONSIDERED UNDER SJR PROMISE WARRANTY ON PRO RATA BASIS.
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-brand mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              <p className="text-white font-bold uppercase tracking-wide text-sm md:text-base leading-relaxed">
                <span className="text-brand">**</span> MOUNTING, DEMOUNTING BEAD DAMAGE (FITMENT DAMAGE), IRREGULAR WEAR, ONE SIDE WEAR, RIM DIGGING WILL <span className="text-brand underline decoration-2 underline-offset-4">NOT</span> BE CONSIDERED UNDER SJR PROMISE WARRANTY.
              </p>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-brand mt-2 flex-shrink-0 shadow-[0_0_10px_rgba(239,68,68,0.8)]"></div>
              <p className="text-white font-bold uppercase tracking-wide text-sm md:text-base leading-relaxed">
                <span className="text-brand">**</span> RUN FLAT FAILURE CONSIDER ON <span className="text-brand">ONLY SCV, LCV TYRE UPTO 12 MONTHS</span> FROM MANUFACTURING PERIOD OR 25 % WEAR (WHICHEVER IS EARLIER), EFFECTIVE FROM 1ST JAN 2026 APPLICABLE TYRE PRODUCED FROM 1ST DEC 2025 (4925 WEEK SERIAL CODE) ONWARDS.
              </p>
            </div>
          </div>
          
        </motion.div>

      </div>
    </div>
  );
}
