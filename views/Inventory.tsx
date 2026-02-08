
import React, { useState, useRef } from 'react';
import { Search, Plus, Edit2, Trash2, AlertTriangle, Save, X, Package, Check, Camera, Image as ImageIcon, TrendingUp, DollarSign, UploadCloud, Info, AlertCircle, FileWarning, RefreshCw } from 'lucide-react';
import { Product } from '../types';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

interface InventoryProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  onActivity: (msg: string, type: any) => void;
}

const Inventory: React.FC<InventoryProps> = ({ products, setProducts, onActivity }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement> | { target: { files: FileList | null } }) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (!file) return;

    // 1. Validate File Type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Invalid format. Please upload JPG, PNG, WEBP or GIF.");
      return;
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File too large. Maximum size is 5MB.");
      return;
    }

    setIsProcessingFile(true);
    const reader = new FileReader();

    reader.onloadstart = () => setIsProcessingFile(true);
    
    reader.onloadend = () => {
      setEditForm(prev => ({ ...prev, image: reader.result as string }));
      setIsProcessingFile(false);
    };

    reader.onerror = () => {
      setFileError("Failed to read file. Please try again.");
      setIsProcessingFile(false);
    };

    reader.readAsDataURL(file);
  };

  const validate = (form: Partial<Product>) => {
    const newErrors: Record<string, string> = {};
    if (!form.name || form.name.trim().length === 0) newErrors.name = "Name is required";
    if (form.stock === undefined || form.stock < 0) newErrors.stock = "Invalid stock";
    if (form.price === undefined || form.price <= 0) newErrors.price = "Invalid price";
    if (form.buyingCost === undefined || form.buyingCost < 0) newErrors.buyingCost = "Invalid cost";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDelete = (id: string) => {
    const p = products.find(prod => prod.id === id);
    if (!p) return;
    if (confirm(`Confirm deletion of "${p.name}"?`)) {
      setProducts(prev => prev.filter(prod => prod.id !== id));
      onActivity(`Deleted product: ${p.name}`, 'inventory');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
    setErrors({});
    setFileError(null);
  };

  const handleAddNew = () => {
    if (validate(editForm)) {
      const newProduct: Product = {
        id: Date.now().toString(),
        name: editForm.name!.trim(),
        stock: Number(editForm.stock),
        price: Number(editForm.price),
        buyingCost: Number(editForm.buyingCost),
        image: editForm.image
      };
      setProducts(prev => [...prev, newProduct]);
      onActivity(`Added new product: ${newProduct.name}`, 'inventory');
      setIsAdding(false);
      setEditForm({});
      setFileError(null);
    }
  };

  const totalInvestment = products.reduce((acc, p) => acc + (p.buyingCost * p.stock), 0);
  const potentialProfit = products.reduce((acc, p) => acc + ((p.price - p.buyingCost) * p.stock), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/jpeg,image/png,image/webp,image/gif" 
      />

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Warehouse Hub</h2>
          <p className="text-slate-500 text-lg font-medium italic">Track your assets, monitor margins, grow your business.</p>
        </div>
        <button 
          onClick={() => { 
            setIsAdding(true); 
            setEditForm({ name: '', stock: 0, price: 0, buyingCost: 0 }); 
            setFileError(null);
            setErrors({});
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-[24px] font-black text-lg flex items-center shadow-2xl shadow-blue-100 transition-all transform hover:scale-105 active:scale-95"
        >
          <Plus className="mr-3 w-6 h-6" /> Create New Listing
        </button>
      </div>

      <div className="relative group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-8 h-8 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Quick search by name or SKU..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-20 pr-10 py-7 bg-white border-4 border-transparent rounded-[32px] text-2xl font-black text-slate-900 focus:border-blue-100 outline-none transition-all shadow-sm"
        />
      </div>

      {fileError && (
        <div className="bg-red-50 border-2 border-red-100 p-6 rounded-[32px] flex items-center space-x-4 animate-in slide-in-from-top-2 duration-300">
          <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-black text-red-900 text-sm uppercase tracking-widest">Asset Error</h4>
            <p className="text-red-700 font-bold text-lg">{fileError}</p>
          </div>
          <button onClick={() => setFileError(null)} className="ml-auto p-2 hover:bg-red-200 rounded-xl transition-colors">
            <X className="w-5 h-5 text-red-400" />
          </button>
        </div>
      )}

      <div className="bg-white rounded-[40px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 font-black text-[10px] uppercase tracking-[0.3em] border-b border-slate-100">
                <th className="px-10 py-8">Product Asset</th>
                <th className="px-10 py-8">Units</th>
                <th className="px-10 py-8 text-center">
                  <div className="flex items-center justify-center group relative">
                    Cost Analysis
                    <Info className="w-3.5 h-3.5 ml-1.5 text-slate-300 cursor-help" />
                    <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-3 bg-slate-900 text-white text-[10px] font-bold rounded-xl shadow-xl z-50 normal-case tracking-normal text-left">
                      Buying Cost: The per-unit price you paid to acquire this stock.
                    </div>
                  </div>
                </th>
                <th className="px-10 py-8 text-center">
                  <div className="flex items-center justify-center group relative">
                    Selling Market
                    <Info className="w-3.5 h-3.5 ml-1.5 text-slate-300 cursor-help" />
                    <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 p-3 bg-slate-900 text-white text-[10px] font-bold rounded-xl shadow-xl z-50 normal-case tracking-normal text-left">
                      Selling Price: The listing price for customers on social platforms.
                    </div>
                  </div>
                </th>
                <th className="px-10 py-8 text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isAdding && (
                <tr className="bg-blue-50/50 animate-in slide-in-from-top-4">
                   <td className="px-10 py-8">
                     <div className="flex items-center space-x-6">
                       <button 
                         onClick={() => fileInputRef.current?.click()}
                         onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                         onDragLeave={() => setIsDragging(false)}
                         onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleFileChange({ target: { files: e.dataTransfer.files } } as any); }}
                         className={`w-20 h-20 rounded-3xl flex items-center justify-center border-4 border-dashed transition-all overflow-hidden shrink-0 group ${isDragging ? 'bg-blue-200 border-blue-600 scale-110' : fileError ? 'border-red-300 bg-red-50' : 'bg-white border-blue-100 hover:border-blue-400'}`}
                       >
                         {/* Fix: Added missing RefreshCw import from lucide-react */}
                         {isProcessingFile ? (
                           <div className="animate-spin text-blue-500"><RefreshCw className="w-8 h-8" /></div>
                         ) : editForm.image ? (
                           <img src={editForm.image} className="w-full h-full object-cover" alt="Preview" />
                         ) : (
                           <UploadCloud className={`w-8 h-8 ${fileError ? 'text-red-300' : 'text-blue-300'}`} />
                         )}
                       </button>
                       <div className="flex-1 space-y-1">
                         <input 
                           className={`p-4 border-2 rounded-2xl w-full font-bold text-lg text-slate-900 outline-none focus:border-blue-500 ${errors.name ? 'border-red-300' : 'border-white'}`} 
                           placeholder="What are you selling?" 
                           value={editForm.name} 
                           onChange={e => setEditForm({...editForm, name: e.target.value})}
                         />
                         {errors.name && <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-2">{errors.name}</p>}
                       </div>
                     </div>
                   </td>
                   <td className="px-10 py-8">
                      <input 
                        className={`p-4 border-2 rounded-2xl w-24 font-bold text-lg text-slate-900 outline-none focus:border-blue-500 ${errors.stock ? 'border-red-300' : 'border-white'}`} 
                        type="number" 
                        value={editForm.stock} 
                        onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value) || 0})}
                      />
                   </td>
                   <td className="px-10 py-8">
                      <input 
                        className={`p-4 border-2 rounded-2xl w-32 mx-auto block font-bold text-lg text-slate-900 outline-none focus:border-blue-500 text-center ${errors.buyingCost ? 'border-red-300' : 'border-white'}`} 
                        type="number" 
                        placeholder="Cost ৳" 
                        value={editForm.buyingCost} 
                        onChange={e => setEditForm({...editForm, buyingCost: parseInt(e.target.value) || 0})}
                      />
                   </td>
                   <td className="px-10 py-8">
                      <input 
                        className={`p-4 border-2 rounded-2xl w-32 mx-auto block font-bold text-lg text-slate-900 outline-none focus:border-blue-500 text-center ${errors.price ? 'border-red-300' : 'border-white'}`} 
                        type="number" 
                        placeholder="Sell ৳" 
                        value={editForm.price} 
                        onChange={e => setEditForm({...editForm, price: parseInt(e.target.value) || 0})}
                      />
                   </td>
                   <td className="px-10 py-8 text-right space-x-3">
                     <button onClick={handleAddNew} className="p-4 bg-green-500 text-white rounded-2xl shadow-lg hover:bg-green-600 transition-all"><Check className="w-6 h-6" /></button>
                     <button onClick={() => { setIsAdding(false); setFileError(null); }} className="p-4 bg-slate-400 text-white rounded-2xl shadow-lg hover:bg-slate-500 transition-all"><X className="w-6 h-6" /></button>
                   </td>
                </tr>
              )}
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-10 py-8">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 font-black text-2xl border-4 border-white shadow-sm overflow-hidden shrink-0">
                        {product.image ? <img src={product.image} className="w-full h-full object-cover" alt={product.name} /> : product.name.charAt(0)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-black text-2xl text-slate-800 tracking-tight">{product.name}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">SKU: SE-{product.id.slice(-4).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8">
                    <div className="flex items-center">
                      <span className={`text-3xl font-black ${product.stock < 5 ? 'text-red-500' : 'text-slate-900'}`}>{product.stock}</span>
                      {product.stock < 5 && <AlertTriangle className="ml-2 w-4 h-4 text-red-500 animate-pulse" />}
                    </div>
                  </td>
                  <td className="px-10 py-8 text-center text-slate-400 font-bold text-xl tracking-tighter">৳{product.buyingCost.toLocaleString()}</td>
                  <td className="px-10 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-3xl font-black text-blue-600 tracking-tighter">৳{product.price.toLocaleString()}</span>
                      <div className="flex items-center text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
                        <TrendingUp className="w-2.5 h-2.5 mr-1" /> ৳{(product.price - product.buyingCost).toLocaleString()} profit
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-8 text-right">
                    <div className="flex items-center justify-end space-x-3">
                      <button onClick={() => handleEdit(product)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><Edit2 className="w-5 h-5" /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-red-500 hover:text-white transition-all"><Trash2 className="w-5 h-5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-12 text-xs font-black text-slate-300 uppercase tracking-widest">
         <div className="flex items-center group cursor-help">
            <Info className="w-4 h-4 mr-2 group-hover:text-blue-500" /> Catalog: {products.length} Items
         </div>
         <div className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" /> Investment: <span className="text-slate-500 ml-1">৳{totalInvestment.toLocaleString()}</span>
         </div>
         <div className="flex items-center text-emerald-500">
            <TrendingUp className="w-4 h-4 mr-2" /> Projected Profit: ৳{potentialProfit.toLocaleString()}
         </div>
      </div>
    </div>
  );
};

export default Inventory;
