import { useState, useEffect } from 'react';
import axios from 'axios';
import { Box, AlertTriangle, Search, Save } from 'lucide-react';
import { products as localProducts } from '../../productsData';

export default function AdminInventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const response = await axios.get(`${API_URL}/api/products`, { timeout: 4000 });
      if (response.data && response.data.length > 0) {
        setProducts(response.data);
      } else {
        setProducts(localProducts);
      }
    } catch (error) {
      console.error('Error fetching inventory, falling back to local:', error);
      setProducts(localProducts);
    } finally {
      setLoading(false);
    }
  };

  const updateStock = async (id, stockCount, lowStockThreshold) => {
    setSaving(id);
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      await axios.put(`${API_URL}/api/admin/inventory/${id}`, 
        { stockCount: parseInt(stockCount), lowStockThreshold: parseInt(lowStockThreshold) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    } finally {
      setSaving(null);
    }
  };

  const handleStockChange = (id, field, value) => {
    setProducts(products.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <Box className="text-orange-500 w-8 h-8" /> Inventory Control
          </h1>
          <p className="text-white/40 mt-1 text-xs font-bold uppercase tracking-widest">Track and manage product stock levels</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-orange-500 transition-colors" size={16} />
          <input 
            type="text" 
            placeholder="Search inventory..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-colors text-sm"
          />
        </div>
      </div>

      {/* ── INVENTORY TABLE ── */}
      <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-white/60 min-w-[800px]">
            <thead className="bg-[#050505] border-b border-white/5 text-white uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="px-6 py-5">Product Identity</th>
                <th className="px-6 py-5">Classification</th>
                <th className="px-6 py-5">Current Stock Level</th>
                <th className="px-6 py-5">Alert Threshold</th>
                <th className="px-6 py-5 text-right">System Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/[0.01]">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">
                    Loading Stock Data...
                  </td>
                </tr>
              ) : filteredProducts.map(product => {
                const isLowStock = parseInt(product.stock_count || 0) <= parseInt(product.low_stock_threshold || 10);
                return (
                  <tr key={product.id} className={`hover:bg-white/[0.03] transition-colors group ${isLowStock ? 'bg-red-500/[0.02]' : ''}`}>
                    <td className="px-6 py-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg p-1 flex items-center justify-center overflow-hidden border border-white/10">
                        <img src={product.image || '/tyre images/default.webp'} className="w-full h-full object-contain mix-blend-multiply" />
                      </div>
                      <div>
                        <div className="font-bold text-white text-base">{product.name}</div>
                        <div className="text-[10px] uppercase tracking-widest text-white/40 mt-0.5">{product.brand}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-white/5 text-white/70 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <input 
                          type="number" 
                          value={product.stock_count || 0} 
                          onChange={(e) => handleStockChange(product.id, 'stock_count', e.target.value)}
                          className={`w-24 bg-white/5 border rounded-lg px-3 py-2 focus:outline-none focus:bg-white/10 transition-colors text-sm font-mono ${
                            isLowStock ? 'border-red-500/50 text-red-500 font-bold' : 'border-white/10 text-white focus:border-orange-500/50'
                          }`}
                        />
                        {isLowStock && (
                          <div className="flex items-center gap-1.5 text-red-500 text-[10px] font-bold uppercase tracking-widest animate-pulse">
                            <AlertTriangle size={12} /> CRITICAL
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        value={product.low_stock_threshold || 10} 
                        onChange={(e) => handleStockChange(product.id, 'low_stock_threshold', e.target.value)}
                        className="w-24 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-colors text-sm font-mono"
                      />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => updateStock(product.id, product.stock_count, product.low_stock_threshold)}
                        className={`p-3 rounded-xl transition-all border ${
                          saving === product.id 
                            ? 'bg-orange-500 text-white border-orange-500' 
                            : 'bg-white/5 text-orange-500 border-white/10 hover:border-orange-500/50 hover:bg-orange-500/10'
                        }`}
                        title="Commit Stock Changes"
                      >
                        <Save size={16} className={saving === product.id ? 'animate-ping' : ''} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
