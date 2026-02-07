
import React, { useState } from 'react';
// Fixed missing Package import from lucide-react
import { Search, Plus, Edit2, Trash2, AlertTriangle, ArrowUpDown, ChevronRight, Save, X, Package } from 'lucide-react';
import { Product } from '../types';

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

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to remove this product?')) {
      const p = products.find(prod => prod.id === id);
      setProducts(prev => prev.filter(prod => prod.id !== id));
      onActivity(`Product "${p?.name}" deleted from inventory`, 'inventory');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm(product);
  };

  const saveEdit = () => {
    if (editingId) {
      setProducts(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm } as Product : p));
      onActivity(`Updated details for "${editForm.name}"`, 'inventory');
      setEditingId(null);
    }
  };

  const handleAddNew = () => {
    const newId = Date.now().toString();
    const newProduct: Product = {
      id: newId,
      name: editForm.name || 'New Product',
      stock: Number(editForm.stock) || 0,
      price: Number(editForm.price) || 0,
    };
    setProducts(prev => [...prev, newProduct]);
    onActivity(`Added new product "${newProduct.name}"`, 'inventory');
    setIsAdding(false);
    setEditForm({});
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">My Products</h2>
          <p className="text-gray-500">Manage your jewelry and clothing stock here.</p>
        </div>
        <button 
          onClick={() => { setIsAdding(true); setEditForm({ name: '', stock: 0, price: 0 }); }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold flex items-center shadow-lg transition-transform hover:scale-105"
        >
          <Plus className="mr-2" /> Add New Product
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
        <input 
          type="text" 
          placeholder="Search by product name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-14 pr-6 py-5 bg-white border-2 border-gray-100 rounded-2xl text-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
        />
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 font-bold text-sm uppercase tracking-widest border-b border-gray-100">
                <th className="px-8 py-6">Product Details</th>
                <th className="px-8 py-6">Stock Level</th>
                <th className="px-8 py-6 text-center">Price</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isAdding && (
                <tr className="bg-blue-50">
                   <td className="px-8 py-6">
                     <input 
                       className="p-3 border rounded-xl w-full" 
                       placeholder="Name" 
                       value={editForm.name} 
                       onChange={e => setEditForm({...editForm, name: e.target.value})}
                     />
                   </td>
                   <td className="px-8 py-6">
                     <input 
                       className="p-3 border rounded-xl w-32" 
                       type="number" 
                       placeholder="Stock" 
                       value={editForm.stock} 
                       onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})}
                     />
                   </td>
                   <td className="px-8 py-6">
                     <input 
                       className="p-3 border rounded-xl w-32 mx-auto block" 
                       type="number" 
                       placeholder="Price" 
                       value={editForm.price} 
                       onChange={e => setEditForm({...editForm, price: parseInt(e.target.value)})}
                     />
                   </td>
                   <td className="px-8 py-6 text-right space-x-2">
                     <button onClick={handleAddNew} className="p-2 bg-green-500 text-white rounded-lg"><Save /></button>
                     <button onClick={() => setIsAdding(false)} className="p-2 bg-gray-400 text-white rounded-lg"><X /></button>
                   </td>
                </tr>
              )}
              {filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 font-bold border-2 border-white shadow-sm overflow-hidden">
                        {product.image ? <img src={product.image} className="w-full h-full object-cover" /> : product.name.charAt(0)}
                      </div>
                      <div>
                        {editingId === product.id ? (
                           <input 
                             className="p-2 border rounded-lg font-bold" 
                             value={editForm.name} 
                             onChange={e => setEditForm({...editForm, name: e.target.value})}
                           />
                        ) : (
                          <h4 className="font-bold text-xl text-gray-800">{product.name}</h4>
                        )}
                        <p className="text-sm text-gray-400">ID: #{product.id.slice(-4)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {editingId === product.id ? (
                       <input 
                         className="p-2 border rounded-lg w-20 font-bold" 
                         type="number"
                         value={editForm.stock} 
                         onChange={e => setEditForm({...editForm, stock: parseInt(e.target.value)})}
                       />
                    ) : (
                      <div className="flex items-center">
                        <span className={`text-2xl font-black ${product.stock < 5 ? 'text-red-500' : 'text-gray-700'}`}>
                          {product.stock}
                        </span>
                        {product.stock < 5 && (
                          <span className="ml-3 px-3 py-1 bg-red-100 text-red-600 rounded-full text-xs font-bold flex items-center">
                            <AlertTriangle className="w-3 h-3 mr-1" /> LOW STOCK
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-6 text-center">
                    {editingId === product.id ? (
                       <input 
                         className="p-2 border rounded-lg w-32 font-bold text-center" 
                         type="number"
                         value={editForm.price} 
                         onChange={e => setEditForm({...editForm, price: parseInt(e.target.value)})}
                       />
                    ) : (
                      <span className="text-2xl font-bold text-gray-900">৳{product.price.toLocaleString()}</span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                      {editingId === product.id ? (
                        <button onClick={saveEdit} className="p-3 bg-green-500 text-white rounded-xl shadow-sm hover:bg-green-600">
                          <Save className="w-6 h-6" />
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(product)} className="p-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
                          <Edit2 className="w-6 h-6" />
                        </button>
                      )}
                      <button onClick={() => handleDelete(product.id)} className="p-3 bg-gray-100 text-gray-400 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                        <Trash2 className="w-6 h-6" />
                      </button>
                      <ChevronRight className="w-6 h-6 text-gray-200" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="p-20 text-center">
              <Package className="w-20 h-20 text-gray-100 mx-auto mb-4" />
              <p className="text-gray-400 text-xl font-medium">No products found. Start by adding one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Inventory;
