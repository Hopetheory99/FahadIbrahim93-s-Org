
import React, { useState, useEffect } from 'react';
import { Package, AlertCircle, ShoppingCart, DollarSign, ArrowRight, Share2, ClipboardList, Zap, Globe, ShieldCheck, Sparkles, TrendingUp, Lightbulb, ChevronRight, Loader2, Landmark } from 'lucide-react';
import { Product, Order, Activity, User, AIStrategicInsight } from '../types';
import { getStrategicInsights } from '../services/geminiService';

interface DashboardProps {
  products: Product[];
  orders: Order[];
  activities: Activity[];
  onNavigate: (view: any) => void;
  user: User | null;
}

const Dashboard: React.FC<DashboardProps> = ({ products, orders, activities, onNavigate, user }) => {
  const [insights, setInsights] = useState<AIStrategicInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(true);

  const lowStockCount = products.filter(p => p.stock < 5).length;
  const todayOrders = orders.filter(o => o.date === new Date().toISOString().split('T')[0]).length;
  
  // Financial metrics
  const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);
  const totalCost = orders.reduce((acc, o) => acc + (o.buyingCost * o.quantity), 0);
  const netProfit = revenue - totalCost;

  useEffect(() => {
    async function loadInsights() {
      setLoadingInsights(true);
      const data = await getStrategicInsights(products, orders);
      setInsights(data);
      setLoadingInsights(false);
    }
    loadInsights();
  }, [products.length, orders.length]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      <header className="flex justify-between items-end">
        <div className="space-y-1">
          <div className="flex items-center space-x-3">
             <h2 className="text-5xl font-black text-slate-900 tracking-tight">
               Hey, {user?.shopName?.split(' ')[0] || 'Seller'}!
             </h2>
             <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center">
               <ShieldCheck className="w-3 h-3 mr-1" /> Pro Tier
             </div>
          </div>
          <p className="text-slate-500 text-xl font-medium italic">Empowering your craft for <span className="text-blue-600 font-bold">{new Date().toLocaleDateString('en-BD', { month: 'long', day: 'numeric' })}</span></p>
        </div>
        <div className="hidden lg:flex items-center space-x-4 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
           <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl flex items-center font-black text-[10px] uppercase tracking-widest">
             <Zap className="w-3 h-3 mr-2" /> Global Sync: OK
           </div>
        </div>
      </header>

      {/* Stats Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`৳${revenue.toLocaleString()}`} icon={<DollarSign />} color="bg-blue-500" />
        <StatCard title="Net Profit" value={`৳${netProfit.toLocaleString()}`} icon={<Landmark />} color="bg-emerald-600" />
        <StatCard title="New Orders" value={todayOrders.toString()} icon={<ShoppingCart />} color="bg-indigo-500" />
        <StatCard title="Low Stock" value={lowStockCount.toString()} icon={<AlertCircle />} color="bg-red-500" highlight={lowStockCount > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Strategic Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Strategic Advisor - THE NEW FEATURE */}
          <section className="bg-slate-900 text-white p-10 rounded-[48px] shadow-3xl shadow-slate-200 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
              <Sparkles className="w-48 h-48 rotate-12" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Lightbulb className="text-white w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black tracking-tight">AI Strategic Advisor</h3>
                </div>
                {loadingInsights && <Loader2 className="w-5 h-5 animate-spin text-blue-400" />}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loadingInsights ? (
                  [1,2,3].map(i => (
                    <div key={i} className="h-40 bg-white/5 rounded-3xl animate-pulse"></div>
                  ))
                ) : (
                  insights.map((insight, idx) => (
                    <div key={idx} className="bg-white/5 hover:bg-white/10 p-6 rounded-[32px] border border-white/5 transition-all cursor-pointer group/card">
                      <div className="flex justify-between items-start mb-4">
                        <span className={`text-[8px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded ${insight.impact === 'high' ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}>
                          {insight.impact} Impact
                        </span>
                        <TrendingUp className="w-4 h-4 text-blue-400 opacity-50 group-hover/card:opacity-100 transition-opacity" />
                      </div>
                      <h4 className="font-bold text-sm mb-2 group-hover/card:text-blue-400 transition-colors">{insight.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{insight.description}</p>
                      <button 
                        onClick={() => insight.type === 'marketing' ? onNavigate('post') : insight.type === 'inventory' ? onNavigate('inventory') : onNavigate('orders')}
                        className="text-[9px] font-black uppercase tracking-widest text-white flex items-center hover:translate-x-1 transition-transform"
                      >
                        {insight.actionLabel} <ChevronRight className="ml-1 w-3 h-3" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <button 
              onClick={() => onNavigate('post')}
              className="group p-10 bg-white border border-slate-100 rounded-[42px] shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all text-left flex flex-col justify-between h-72"
            >
              <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Share2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">Broadcaster</h3>
                <p className="text-slate-500 font-medium">Post to all channels with AI</p>
              </div>
              <div className="text-blue-600 font-black text-xs uppercase tracking-widest flex items-center">
                Create Now <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>

            <button 
              onClick={() => onNavigate('inventory')}
              className="group p-10 bg-white border border-slate-100 rounded-[42px] shadow-sm hover:shadow-2xl hover:border-emerald-200 transition-all text-left flex flex-col justify-between h-72"
            >
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <ClipboardList className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 mb-2">Warehouse</h3>
                <p className="text-slate-500 font-medium">Predictive stock management</p>
              </div>
              <div className="text-emerald-600 font-black text-xs uppercase tracking-widest flex items-center">
                Manage Stock <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </div>
            </button>
          </div>
        </div>

        {/* Right Flow Column */}
        <div className="space-y-8">
          <section className="bg-white rounded-[48px] shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
            <div className="p-10 border-b border-slate-50">
              <h3 className="text-2xl font-black text-slate-900">Recent Flow</h3>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Real-time system log</p>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-4 max-h-[600px]">
              {activities.map(activity => (
                <div key={activity.id} className="p-6 bg-slate-50/50 rounded-3xl border border-transparent hover:border-slate-100 transition-all group">
                  <div className="flex items-start space-x-4">
                    <div className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${activity.type === 'order' ? 'bg-emerald-500' : activity.type === 'inventory' ? 'bg-red-500' : 'bg-blue-500'}`} />
                    <div>
                      <p className="text-slate-900 font-bold text-sm leading-tight">{activity.message}</p>
                      <p className="text-[9px] text-slate-400 mt-2 font-black uppercase tracking-widest">{activity.timestamp}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 border-t border-slate-50 bg-slate-50/30">
              <div className="flex items-center justify-between">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Market Status</p>
                <div className="flex items-center text-green-600 font-black text-[9px] uppercase tracking-widest">
                  <Globe className="w-3 h-3 mr-1" /> All Channels Live
                </div>
              </div>
            </div>
          </section>
        </div>

      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, color: string, highlight?: boolean }> = ({ title, value, icon, color, highlight }) => (
  <div className={`p-8 bg-white rounded-[42px] border shadow-sm transition-all hover:shadow-xl ${highlight ? 'border-red-100' : 'border-slate-100'}`}>
    <div className="flex items-center mb-6">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg ${color}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
      </div>
      <span className="ml-4 font-black text-[10px] text-slate-400 uppercase tracking-widest">{title}</span>
    </div>
    <div className="flex items-end justify-between">
       <p className={`text-4xl font-black tracking-tighter ${highlight ? 'text-red-600 animate-pulse' : 'text-slate-900'}`}>{value}</p>
       <TrendingUp className="w-5 h-5 text-slate-100" />
    </div>
  </div>
);

export default Dashboard;
