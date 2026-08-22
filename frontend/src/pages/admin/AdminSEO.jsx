import { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Save, Settings } from 'lucide-react';

export default function AdminSEO() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const response = await axios.get(`${API_URL}/api/products`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSEO = async (id, metaTitle, metaDescription, metaKeywords) => {
    setSaving(id);
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      await axios.put(`${API_URL}/api/admin/seo/${id}`, 
        { metaTitle, metaDescription, metaKeywords },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating SEO:', error);
      alert('Failed to update SEO');
    } finally {
      setSaving(null);
    }
  };

  const handleChange = (id, field, value) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <Settings className="text-yellow-500 w-8 h-8" /> SEO Control
          </h1>
          <p className="text-white/40 mt-1 text-xs font-bold uppercase tracking-widest">Metadata mapping for product indexing</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-yellow-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-colors text-sm"
          />
        </div>
      </div>

      {/* ── SEO CARDS ── */}
      <div className="space-y-6">
        {loading ? (
          <div className="p-20 text-center text-white/40 font-bold uppercase tracking-widest text-xs animate-pulse">Synchronizing Metadata...</div>
        ) : filteredProducts.map(product => (
          <div key={product.id} className="bg-[#050505] border border-white/10 p-6 rounded-3xl shadow-xl hover:border-white/20 transition-colors group">
            
            <div className="flex items-center justify-between mb-6 pb-6 border-b border-white/5">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-white/10 p-1">
                  <img src={product.image || '/tyre images/default.webp'} className="w-full h-full object-contain mix-blend-multiply" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg leading-none mb-1.5">{product.name}</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{product.category} • {product.brand}</p>
                </div>
              </div>
              <button 
                onClick={() => updateSEO(product.id, product.meta_title, product.meta_description, product.meta_keywords)}
                className="px-6 py-3 bg-white/5 border border-white/10 text-yellow-500 hover:bg-yellow-500 hover:text-white hover:border-yellow-500 font-bold rounded-xl transition-all flex items-center gap-2 text-[10px] uppercase tracking-widest"
              >
                <Save size={14} className={saving === product.id ? 'animate-ping' : ''} />
                Save Metadata
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mb-2">Meta Title (Max 60 chars)</label>
                  <input 
                    type="text" 
                    value={product.meta_title || ''} 
                    onChange={(e) => handleChange(product.id, 'meta_title', e.target.value)}
                    placeholder={`${product.name} | SJR Tyres`}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-colors text-sm"
                  />
                  <div className={`text-[10px] text-right mt-1.5 font-bold ${(product.meta_title || '').length > 60 ? 'text-red-500' : 'text-white/30'}`}>
                    {(product.meta_title || '').length}/60
                  </div>
                </div>
                <div>
                  <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mb-2">Meta Keywords (Comma separated)</label>
                  <input 
                    type="text" 
                    value={product.meta_keywords || ''} 
                    onChange={(e) => handleChange(product.id, 'meta_keywords', e.target.value)}
                    placeholder="premium tyre, agriculture, 14.9-28"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-colors text-sm font-mono"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-white/50 text-[10px] uppercase tracking-widest font-bold mb-2">Meta Description (Max 160 chars)</label>
                <textarea 
                  rows="5"
                  value={product.meta_description || ''} 
                  onChange={(e) => handleChange(product.id, 'meta_description', e.target.value)}
                  placeholder="Engineered for maximum durability..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 focus:bg-white/10 transition-colors text-sm resize-none"
                ></textarea>
                <div className={`text-[10px] text-right mt-1.5 font-bold ${(product.meta_description || '').length > 160 ? 'text-red-500' : 'text-white/30'}`}>
                  {(product.meta_description || '').length}/160
                </div>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}
