
import React, { useState } from 'react';
import { Filter, Facebook, Instagram, Music, CheckCircle, Truck, FileText, Clock, X, Printer, Download, Loader2, Edit3, Save, TrendingUp } from 'lucide-react';
import { Order, OrderStatus, Platform } from '../types';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface OrdersProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
  onUpdatePrice: (id: string, newPrice: number) => void;
}

const Orders: React.FC<OrdersProps> = ({ orders, onUpdateStatus, onUpdatePrice }) => {
  const [filter, setFilter] = useState<'All' | OrderStatus>('All');
  const [showInvoice, setShowInvoice] = useState<Order | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [priceBuffer, setPriceBuffer] = useState<string>('');

  const filteredOrders = filter === 'All' ? orders : orders.filter(o => o.status === filter);

  const startEditPrice = (order: Order) => {
    setEditingPriceId(order.id);
    setPriceBuffer(order.totalPrice.toString());
  };

  const savePrice = (id: string) => {
    const val = parseInt(priceBuffer);
    if (!isNaN(val)) {
      onUpdatePrice(id, val);
    }
    setEditingPriceId(null);
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('invoice-printable');
    if (!element || !showInvoice) return;

    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, logging: false, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`ShopEase_Invoice_${showInvoice.id}.pdf`);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      alert("Something went wrong while generating the PDF.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Orders Inbox</h2>
          <p className="text-gray-500">Track and fulfill orders. You can adjust the final price for specific customers below.</p>
        </div>
        <div className="flex items-center space-x-2 bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
           <Filter className="w-5 h-5 ml-3 text-gray-400" />
           {(['All', OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.SHIPPED] as const).map(f => (
             <button 
               key={f}
               onClick={() => setFilter(f)}
               className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${filter === f ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
             >
               {f}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 group">
            <div className="flex-1 flex items-center space-x-6">
               <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border-2 border-white ${order.platform === Platform.FACEBOOK ? 'bg-blue-50 text-blue-600' : order.platform === Platform.INSTAGRAM ? 'bg-pink-50 text-pink-500' : 'bg-gray-100 text-black'}`}>
                 {order.platform === Platform.FACEBOOK && <Facebook className="w-8 h-8" />}
                 {order.platform === Platform.INSTAGRAM && <Instagram className="w-8 h-8" />}
                 {order.platform === Platform.TIKTOK && <Music className="w-8 h-8" />}
               </div>
               <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">#{order.id}</span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      order.status === OrderStatus.PENDING ? 'bg-yellow-100 text-yellow-700' :
                      order.status === OrderStatus.PAID ? 'bg-green-100 text-green-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold text-gray-800">{order.customerName}</h4>
                  <p className="text-gray-500 font-medium">{order.productName} (x{order.quantity})</p>
               </div>
            </div>

            <div className="text-center md:text-right px-8 space-y-1">
               <div className="flex items-center justify-end">
                  {editingPriceId === order.id ? (
                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-blue-200">
                      <span className="ml-2 text-slate-400 font-bold">৳</span>
                      <input 
                        className="w-24 px-2 py-1 bg-transparent font-black text-gray-900 outline-none text-right"
                        value={priceBuffer}
                        onChange={e => setPriceBuffer(e.target.value)}
                        autoFocus
                      />
                      <button onClick={() => savePrice(order.id)} className="p-2 text-green-600 hover:bg-green-50 rounded-lg"><Save className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <p className="text-3xl font-black text-gray-900">৳{order.totalPrice.toLocaleString()}</p>
                      {order.status === OrderStatus.PENDING && (
                        <button onClick={() => startEditPrice(order)} className="opacity-0 group-hover:opacity-100 text-blue-500 p-2 hover:bg-blue-50 rounded-full transition-all">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
               </div>
               <div className="flex items-center justify-end text-[10px] font-black uppercase tracking-widest text-emerald-500">
                 <TrendingUp className="w-3 h-3 mr-1" /> Profit: ৳{(order.totalPrice - (order.buyingCost * order.quantity)).toLocaleString()}
               </div>
            </div>

            <div className="flex flex-wrap justify-center gap-3">
              {order.status === OrderStatus.PENDING && (
                <button onClick={() => onUpdateStatus(order.id, OrderStatus.PAID)} className="bg-green-100 text-green-700 hover:bg-green-200 p-4 rounded-2xl font-bold transition-all flex items-center text-sm"><CheckCircle className="w-5 h-5 mr-2" /> Mark Paid</button>
              )}
              {order.status === OrderStatus.PAID && (
                <button onClick={() => onUpdateStatus(order.id, OrderStatus.SHIPPED)} className="bg-blue-100 text-blue-700 hover:bg-blue-200 p-4 rounded-2xl font-bold transition-all flex items-center text-sm"><Truck className="w-5 h-5 mr-2" /> Mark Shipped</button>
              )}
              <button onClick={() => setShowInvoice(order)} className="bg-gray-100 text-gray-600 hover:bg-gray-200 p-4 rounded-2xl font-bold transition-all flex items-center text-sm"><FileText className="w-5 h-5 mr-2" /> Invoice</button>
            </div>
          </div>
        ))}
        {filteredOrders.length === 0 && (
          <div className="p-20 bg-white rounded-3xl text-center border-2 border-dashed border-gray-100">
             <Clock className="w-16 h-16 text-gray-100 mx-auto mb-4" />
             <p className="text-gray-400 font-medium text-xl">No orders in this category yet.</p>
          </div>
        )}
      </div>

      {showInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                 <h3 className="text-2xl font-bold text-gray-800">Invoice Details</h3>
                 <button onClick={() => setShowInvoice(null)} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X className="w-8 h-8 text-gray-500" /></button>
              </div>
              <div className="p-12 text-gray-800 bg-white" id="invoice-printable">
                 <div className="flex justify-between mb-12">
                    <div>
                      <h1 className="text-4xl font-black text-blue-600">ShopEase</h1>
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Official Billing</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl uppercase tracking-widest text-gray-400 mb-2">INVOICE</p>
                      <p className="text-2xl font-black">#{showInvoice.id}</p>
                      <p className="text-sm text-gray-400">{showInvoice.date}</p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-12 mb-12">
                    <div>
                       <p className="text-xs font-black text-gray-400 uppercase mb-3">Bill To:</p>
                       <p className="text-2xl font-bold">{showInvoice.customerName}</p>
                       <p className="text-gray-500">Platform: {showInvoice.platform}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-gray-400 uppercase mb-3">Order Status:</p>
                       <span className="text-lg font-black text-green-600 bg-green-50 px-4 py-2 rounded-full uppercase tracking-widest">{showInvoice.status}</span>
                    </div>
                 </div>
                 <div className="border-t-2 border-b-2 border-gray-100 py-8 mb-8">
                    <div className="flex justify-between items-center mb-4">
                       <p className="text-xl font-bold">{showInvoice.productName} x{showInvoice.quantity}</p>
                       <p className="text-xl font-bold">৳{showInvoice.totalPrice.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between items-center text-gray-400">
                       <p>Delivery Fee (Express)</p>
                       <p>৳100</p>
                    </div>
                 </div>
                 <div className="flex justify-between items-center">
                    <p className="text-2xl font-bold text-gray-400">Grand Total:</p>
                    <p className="text-5xl font-black text-blue-600">৳{(showInvoice.totalPrice + 100).toLocaleString()}</p>
                 </div>
                 <div className="mt-16 pt-8 border-t border-gray-100 text-center text-gray-400 italic">"Thank you for supporting small businesses in Bangladesh! 🇧🇩"</div>
              </div>
              <div className="p-8 bg-gray-50 flex gap-4">
                 <button onClick={() => window.print()} className="flex-1 bg-blue-600 text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg active:scale-95"><Printer className="mr-3" /> Print Invoice</button>
                 <button onClick={handleDownloadPDF} disabled={isExporting} className="flex-1 bg-white border-2 border-gray-200 text-gray-700 py-5 rounded-2xl font-bold text-xl flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95 disabled:opacity-50">
                   {isExporting ? <Loader2 className="mr-3 animate-spin" /> : <Download className="mr-3" />} {isExporting ? 'Generating...' : 'Download PDF'}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
