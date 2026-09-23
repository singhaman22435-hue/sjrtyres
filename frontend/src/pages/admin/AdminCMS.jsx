import { useState, useEffect } from 'react';
import axios from 'axios';
import { FileText, Save, Check } from 'lucide-react';

export default function AdminCMS() {
  const [content, setContent] = useState({
    heroTitle: '',
    heroSubtitle: '',
    announcementBanner: '',
    aboutText: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5005';
      const response = await axios.get(`${API_URL}/api/admin/cms`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent({
        heroTitle: response.data.heroTitle || '',
        heroSubtitle: response.data.heroSubtitle || '',
        announcementBanner: response.data.announcementBanner || '',
        aboutText: response.data.aboutText || ''
      });
    } catch (error) {
      console.error('Error fetching CMS:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.PROD ? '' : 'http://localhost:5005';
      await axios.post(`${API_URL}/api/admin/cms`, content, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Content saved successfully! The live site has been updated.');
    } catch (error) {
      console.error('Error saving CMS:', error);
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  if (loading) {
     return <div className="p-10 text-center text-white/40 uppercase tracking-widest text-xs font-bold animate-pulse">Loading CMS Database...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* ── HEADER ── */}
      <div className="pb-6 border-b border-white/10">
        <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
          <FileText className="text-green-500 w-8 h-8" /> Content Management
        </h1>
        <p className="text-white/40 mt-1 text-xs font-bold uppercase tracking-widest">Update live text on the frontend</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Homepage Settings */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 blur-[50px] pointer-events-none rounded-full"></div>
          
          <h2 className="text-lg font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-green-500"></span> Homepage Configuration
          </h2>
          
          <div className="space-y-8 relative z-10">
            <div>
              <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mb-2">Global Announcement Banner</label>
              <input 
                type="text" 
                name="announcementBanner"
                value={content.announcementBanner} 
                onChange={handleChange}
                placeholder="e.g., Get 10% off on all bulk orders this month!"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-colors text-sm"
              />
            </div>
            
            <div>
              <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mb-2">Hero Section Title</label>
              <input 
                type="text" 
                name="heroTitle"
                value={content.heroTitle} 
                onChange={handleChange}
                placeholder="Engineered for Performance. Built to Last."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-colors text-lg font-black"
              />
            </div>

            <div>
              <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mb-2">Hero Section Subtitle</label>
              <textarea 
                name="heroSubtitle"
                rows="3"
                value={content.heroSubtitle} 
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-green-500/50 focus:bg-white/10 transition-colors text-sm resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* About Us Section */}
        <div className="bg-[#050505] border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] pointer-events-none rounded-full"></div>
          
          <h2 className="text-lg font-bold text-white mb-8 border-b border-white/5 pb-4 flex items-center gap-2 relative z-10">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> About Us Configuration
          </h2>
          
          <div className="relative z-10">
            <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mb-2">Corporate Profile Text</label>
            <textarea 
              name="aboutText"
              rows="6"
              value={content.aboutText} 
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-colors text-sm resize-none"
            ></textarea>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button 
            type="submit" 
            disabled={saving || loading}
            className="px-8 py-4 bg-green-600 text-white font-bold rounded-xl hover:bg-green-500 transition-colors shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 flex items-center gap-3 text-xs uppercase tracking-widest"
          >
            {saving ? 'Publishing...' : 'Deploy Content'}
            {saving ? <Save size={16} className="animate-pulse" /> : <Check size={16} />}
          </button>
        </div>
      </form>
    </div>
  );
}
