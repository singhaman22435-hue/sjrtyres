import { useState, useMemo, useEffect } from 'react';
import { Package, Search, Filter, FilterX, Edit, Trash2, Plus, UploadCloud, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { products as localProducts } from '../../productsData';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedFitment, setSelectedFitment] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newProduct, setNewProduct] = useState({
    id: null, name: '', category: 'Two-Wheeler', fitment: 'Front', brand: 'SJR Tyres', image: '', images: [], description: '', isFeatured: false, applications: []
  });
  const [uploading, setUploading] = useState(false);

  const openAddModal = () => {
    setIsEditing(false);
    setNewProduct({ id: null, name: '', category: 'Two-Wheeler', fitment: 'Front', brand: 'SJR Tyres', image: '', images: [], description: '', isFeatured: false, applications: [] });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setIsEditing(true);
    setNewProduct({ 
      id: product.id, 
      name: product.name || '', 
      category: product.category || 'Two-Wheeler', 
      fitment: product.fitment || 'Front', 
      brand: product.brand || 'SJR Tyres',
      image: product.image || '',
      images: product.images || [],
      description: product.description || '',
      isFeatured: product.isFeatured || false,
      applications: product.applications || []
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;
    
    setUploading(true);
    const formData = new FormData();
    for(let i=0; i<files.length; i++) {
      formData.append('images', files[i]);
    }

    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      
      if(res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      
      const data = await res.json();
      if(res.ok) {
        setNewProduct(prev => ({
          ...prev,
          image: prev.image || data.urls[0],
          images: [...(prev.images || []), ...data.urls]
        }));
      } else {
        alert('Upload failed: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  const fetchProducts = () => {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4 second timeout

    fetch(`${API_URL}/api/products`, { signal: controller.signal })
      .then(res => {
        clearTimeout(timeoutId);
        if(res.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
          throw new Error('Unauthorized');
        }
        if(!res.ok) throw new Error('API Error');
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
        console.error("Error fetching products, falling back to local:", err);
        setProducts(localProducts);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, name) => {
    if(window.confirm(`Are you sure you want to completely delete ${name} from the database?`)) {
      try {
        const token = localStorage.getItem('adminToken');
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
        const res = await fetch(`${API_URL}/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if(res.status === 401) {
          localStorage.removeItem('adminToken');
          window.location.href = '/admin/login';
          return;
        }
        
        if(res.ok) fetchProducts();
        else alert('Error deleting product');
      } catch(err) {
        console.error(err);
      }
    }
  };

  const handleBulkUpload = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    setUploading(true);
    const token = localStorage.getItem('adminToken');
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';

    // Group files by subfolder name (Product Name)
    const productsGroups = {};
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const pathParts = file.webkitRelativePath.split('/');
      // pathParts[0] is the master folder, pathParts[1] is the product folder
      if (pathParts.length >= 2) {
        const productName = pathParts[1];
        if (!productsGroups[productName]) {
          productsGroups[productName] = { images: [], doc: null };
        }
        
        if (file.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)) {
          productsGroups[productName].images.push(file);
        } else if (file.name.match(/\.(docx|txt)$/i)) {
          productsGroups[productName].doc = file;
        }
      }
    }

    // Process each group iteratively
    let successCount = 0;
    let failCount = 0;
    
    for (const [folderName, filesData] of Object.entries(productsGroups)) {
      if (filesData.images.length === 0 && !filesData.doc) continue; // Skip empty folders

      const formData = new FormData();
      formData.append('folder_name', folderName);
      
      filesData.images.forEach(img => {
        formData.append('images', img);
      });
      
      if (filesData.doc) {
        formData.append('doc', filesData.doc);
      }

      try {
        const res = await fetch(`${API_URL}/api/products/bulk-upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });
        
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (err) {
        console.error("Failed to upload folder: " + folderName, err);
        failCount++;
      }
    }

    setUploading(false);
    fetchProducts();
    alert(`Bulk Upload Complete!\nSuccessfully imported: ${successCount}\nFailed: ${failCount}`);
    e.target.value = ''; // Reset input
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5005';
      const url = isEditing ? `${API_URL}/api/products/${newProduct.id}` : `${API_URL}/api/products`;
      const method = isEditing ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(newProduct)
      });
      
      if(res.status === 401) {
        localStorage.removeItem('adminToken');
        window.location.href = '/admin/login';
        return;
      }
      
      if(res.ok) {
        setShowModal(false);
        fetchProducts();
      } else {
        const errorData = await res.json().catch(() => ({error: 'Unknown error'}));
        alert('Error saving product: ' + (errorData.error || res.statusText));
      }
    } catch(err) {
      console.error(err);
    }
  };

  // Dynamically generate filter options from the products data
  const FILTER_CATEGORIES = useMemo(() => [...new Set(products.map(p => p.category))].filter(Boolean), [products]);
  const FILTER_FITMENTS = useMemo(() => [...new Set(products.map(p => p.fitment))].filter(Boolean), [products]);
  const FILTER_BRANDS = useMemo(() => [...new Set(products.map(p => p.brand))].filter(Boolean), [products]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedFitment('');
    setSelectedBrand('');
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = selectedCategory === '' || product.category === selectedCategory;
      const matchFit = selectedFitment === '' || product.fitment === selectedFitment;
      const matchBrand = selectedBrand === '' || product.brand === selectedBrand;
      return matchSearch && matchCat && matchFit && matchBrand;
    });
  }, [products, searchTerm, selectedCategory, selectedFitment, selectedBrand]);

  return (
    <div className="space-y-8">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/10">
        <div>
          <h1 className="text-3xl font-black text-white flex items-center gap-3 tracking-tight">
            <Package className="text-brand w-8 h-8" /> Product Database
          </h1>
          <p className="text-white/40 mt-1 text-xs font-bold uppercase tracking-widest">Manage and filter the dynamic catalog</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <label className="px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2 text-xs uppercase tracking-widest group">
            {uploading ? <UploadCloud size={16} className="animate-bounce" /> : <UploadCloud size={16} className="text-white/50 group-hover:text-white transition-colors" />}
            <span>{uploading ? 'Processing...' : 'Bulk Upload'}</span>
            <input 
              type="file" 
              webkitdirectory="true" 
              directory="true" 
              multiple 
              className="hidden"
              onChange={handleBulkUpload}
              disabled={uploading}
            />
          </label>
          <button 
            onClick={openAddModal}
            className="px-6 py-3.5 bg-brand text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg flex items-center justify-center gap-2 text-xs uppercase tracking-widest"
          >
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      {/* ── SMART FILTERS ── */}
      <div className="bg-[#050505] border border-white/10 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[80px] pointer-events-none"></div>
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <Filter className="text-brand" size={18} />
          <h2 className="text-xs uppercase tracking-widest font-bold text-white">Advanced Search & Filter</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-brand transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/5 border border-white/10 text-white pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors text-sm"
            />
          </div>
          
          <select 
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors appearance-none text-sm"
          >
            <option value="" className="bg-[#050505]">All Categories</option>
            {FILTER_CATEGORIES.map(cat => (
              <option key={cat} value={cat} className="bg-[#050505]">{cat}</option>
            ))}
          </select>

          <select 
            value={selectedFitment} 
            onChange={(e) => setSelectedFitment(e.target.value)}
            className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors appearance-none text-sm"
          >
            <option value="" className="bg-[#050505]">All Fitments</option>
            {FILTER_FITMENTS.map(fit => (
              <option key={fit} value={fit} className="bg-[#050505]">{fit}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <select 
              value={selectedBrand} 
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 text-white px-4 py-3 rounded-xl focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors appearance-none text-sm"
            >
              <option value="" className="bg-[#050505]">All Brands</option>
              {FILTER_BRANDS.map(brand => (
                <option key={brand} value={brand} className="bg-[#050505]">{brand}</option>
              ))}
            </select>
            <button 
              onClick={clearFilters}
              title="Clear Filters"
              className="px-4 bg-white/5 border border-white/10 hover:border-brand hover:text-brand text-white/50 rounded-xl transition-colors flex items-center justify-center"
            >
              <FilterX size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* ── DATA TABLE ── */}
      <div className="bg-[#050505] border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
          <h2 className="text-xs uppercase tracking-widest font-bold text-white/70">Database Results ({filteredProducts.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-white/60 min-w-[900px]">
            <thead className="bg-[#050505] border-b border-white/5 text-white uppercase tracking-widest text-[10px] font-bold">
              <tr>
                <th className="px-6 py-5">Image</th>
                <th className="px-6 py-5">Product Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Fitment</th>
                <th className="px-6 py-5">Brand</th>
                <th className="px-6 py-5 text-right">System Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-white/[0.01]">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">
                    Loading Database...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/[0.03] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="w-14 h-14 bg-white rounded-lg p-1.5 flex items-center justify-center overflow-hidden border border-white/10">
                         <img loading="lazy" src={product.image || '/tyre images/IS 2441....a.webp'} alt={product.name} className="w-full h-full object-contain mix-blend-multiply transition-transform group-hover:scale-110" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white max-w-[200px] truncate text-base" title={product.name}>
                        {product.name}
                      </div>
                      {product.isFeatured && <span className="text-[9px] uppercase tracking-widest font-bold text-brand mt-1 block">Featured</span>}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-brand/10 text-brand border border-brand/20 rounded-lg text-[10px] font-black uppercase tracking-widest">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-white/70 font-medium">{product.fitment}</td>
                    <td className="px-6 py-4 font-bold text-white">{product.brand}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => openEditModal(product)}
                          className="p-2.5 bg-white/5 hover:bg-white/10 text-blue-400 border border-white/10 hover:border-blue-500/50 rounded-xl transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id, product.name)}
                          className="p-2.5 bg-white/5 hover:bg-red-500/20 text-brand border border-white/10 hover:border-brand/50 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-24 text-center">
                    <FilterX size={48} className="mx-auto text-white/20 mb-6" />
                    <p className="text-xl text-white font-black mb-2">No Records Found</p>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-bold">Adjust your filters to see more results.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── ADD/EDIT MODAL ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#050505] border border-white/10 p-8 md:p-10 rounded-3xl w-full max-w-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] my-auto relative"
            >
              
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-8 right-8 text-white/40 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
                <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center border border-brand/20">
                  <Package className="text-brand w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white">{isEditing ? 'Edit Product File' : 'Initialize New Product'}</h2>
                  <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest mt-1">Database Modification</p>
                </div>
              </div>
              
              <form onSubmit={handleSaveProduct} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  <div className="md:col-span-2">
                    <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Product Name</label>
                    <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors text-sm" placeholder="e.g., SJR Balwaan Plus" />
                  </div>
                  
                  <div>
                    <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Category</label>
                    <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors appearance-none text-sm">
                      {['Two-Wheeler', 'Three-Wheeler', 'Passenger Car', 'Light Commercial', 'Heavy Commercial', 'Agricultural', 'Off-Road'].map(c => (
                        <option key={c} value={c} className="bg-[#050505]">{c}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Fitment</label>
                    <select value={newProduct.fitment} onChange={e => setNewProduct({...newProduct, fitment: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors appearance-none text-sm">
                      {['Front', 'Rear', 'Universal', 'All-Position'].map(f => (
                        <option key={f} value={f} className="bg-[#050505]">{f}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Brand Tag</label>
                    <input required type="text" value={newProduct.brand} onChange={e => setNewProduct({...newProduct, brand: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors text-sm" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Media Upload</label>
                    <input 
                      type="file" multiple accept="image/*" onChange={handleImageUpload} 
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand/50 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:uppercase file:tracking-widest file:bg-white/10 file:text-white hover:file:bg-white/20 transition-all text-sm cursor-pointer" 
                    />
                    {uploading && <p className="text-brand text-xs mt-2 font-bold animate-pulse">Processing Upload...</p>}
                    {newProduct.images && newProduct.images.length > 0 && (
                      <div className="flex gap-3 mt-4 flex-wrap">
                        {newProduct.images.map((img, idx) => (
                          <div key={idx} className="relative group w-20 h-20 bg-white rounded-xl border-2 border-white/10 flex items-center justify-center p-2">
                            <img loading="lazy" src={img} className="w-full h-full object-contain mix-blend-multiply" />
                            <button type="button" onClick={() => setNewProduct({...newProduct, images: newProduct.images.filter((_, i) => i !== idx), image: newProduct.image === img ? (newProduct.images[0] || '') : newProduct.image})} className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-500">×</button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Technical Description</label>
                    <textarea rows="3" value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors text-sm resize-none" placeholder="Enter short paragraph description..."></textarea>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-white/50 text-[10px] font-bold uppercase tracking-widest mb-2">Product Features (Bullet Points)</label>
                    <textarea rows="4" value={(newProduct.applications || []).join('\n')} onChange={e => setNewProduct({...newProduct, applications: e.target.value.split('\n')})} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-brand/50 focus:bg-white/10 transition-colors text-sm resize-none" placeholder="Enter one feature per line (e.g. RIB TREAD PATTERN)"></textarea>
                    <p className="text-white/30 text-[9px] uppercase tracking-widest font-bold mt-2">Enter each bullet point on a new line. These will display exactly like the catalog design.</p>
                  </div>
                  
                  <div className="md:col-span-2 flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5">
                    <div className="relative flex items-center justify-center w-5 h-5 flex-shrink-0">
                      <input 
                        type="checkbox" 
                        id="isFeatured" 
                        checked={newProduct.isFeatured} 
                        onChange={e => setNewProduct({...newProduct, isFeatured: e.target.checked})} 
                        className="peer appearance-none w-5 h-5 border border-white/20 rounded bg-black transition-all checked:border-brand checked:bg-brand hover:border-brand/50 focus:outline-none cursor-pointer" 
                      />
                      <svg className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <label htmlFor="isFeatured" className="text-white font-bold text-sm cursor-pointer select-none">Mark as Featured Product</label>
                  </div>
                
                </div>
                
                <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-white/10">
                  <button type="button" onClick={() => setShowModal(false)} className="px-8 py-4 rounded-xl text-white/50 text-xs font-bold uppercase tracking-widest hover:text-white hover:bg-white/5 transition-colors">Abort</button>
                  <button type="submit" className="px-8 py-4 bg-brand text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.3)]">{isEditing ? 'Commit Update' : 'Initialize Record'}</button>
                </div>
              </form>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
