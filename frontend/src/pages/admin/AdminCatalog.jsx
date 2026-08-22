import { useState } from 'react';
import { BookOpen, Upload, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

export default function AdminCatalog() {
  const [isUploading, setIsUploading] = useState(false);
  const totalPages = 109; // Currently hardcoded based on the existing generated webp files

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/pdf') {
      alert('Please upload a PDF file.');
      return;
    }
    
    setIsUploading(true);
    // Mock upload delay
    setTimeout(() => {
      setIsUploading(false);
      alert('Catalog PDF uploaded and rendering started in the background. It may take a few minutes to process all pages.');
      e.target.value = '';
    }, 2000);
  };

  const handleDelete = (pageNum) => {
    if(window.confirm(`Are you sure you want to delete catalog page ${pageNum}?`)) {
      alert(`Page ${pageNum} delete request sent.`);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <BookOpen className="text-brand w-8 h-8" /> E-Catalog Manager
          </h1>
          <p className="text-white/40 mt-1 text-xs font-bold uppercase tracking-widest">Manage high-res WebP catalog pages</p>
        </div>
        <div className="flex gap-3">
          <label className="px-6 py-3.5 bg-brand text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-widest group">
            {isUploading ? <Upload size={16} className="animate-bounce" /> : <Upload size={16} />}
            <span>{isUploading ? 'Processing PDF...' : 'Upload New Catalog PDF'}</span>
            <input 
              type="file" 
              accept=".pdf"
              className="hidden"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center border border-brand/20">
            <BookOpen className="text-brand w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">{totalPages}</div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Total Active Pages</div>
          </div>
        </div>
        
        <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
            <CheckCircle className="text-green-500 w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-black text-white">Optimized</div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Format: WebP</div>
          </div>
        </div>

        <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
            <AlertTriangle className="text-yellow-500 w-6 h-6" />
          </div>
          <div>
            <div className="text-sm font-bold text-white mt-1">Live Preview</div>
            <div className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">Changes reflect instantly</div>
          </div>
        </div>
      </div>

      {/* ── CATALOG IMAGES GRID ── */}
      <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Current Catalog Pages</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div key={i} className="group relative bg-white/5 border border-white/10 rounded-xl overflow-hidden aspect-[1/1.4] flex items-center justify-center hover:border-brand/50 transition-colors">
              
              <img 
                src={`/catalog/page_${i + 1}.webp`} 
                alt={`Catalog Page ${i + 1}`} 
                loading="lazy"
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.classList.add('bg-brand/10', 'border-brand/30');
                  e.target.parentElement.innerHTML = `<span class="text-[10px] font-bold text-brand uppercase text-center p-2">Page ${i+1}<br/>Missing</span>`;
                }}
              />
              
              {/* Overlay Actions */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button 
                  onClick={() => handleDelete(i + 1)}
                  className="w-8 h-8 rounded-lg bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg transition-colors"
                  title="Delete Page"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              
              {/* Page Number Badge */}
              <div className="absolute top-2 left-2 bg-black/80 backdrop-blur px-2 py-1 rounded text-[9px] font-bold text-white tracking-widest border border-white/10">
                PG {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
