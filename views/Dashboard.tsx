
import React from 'react';
import { Package, AlertCircle, ShoppingCart, DollarSign, ArrowRight, Share2, ClipboardList } from 'lucide-react';
import { Product, Order, Activity } from '../types';

interface DashboardProps {
  products: Product[];
  orders: Order[];
  activities: Activity[];
  onNavigate: (view: any) => void;
  shopName?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ products, orders, activities, onNavigate, shopName }) => {
  const lowStockCount = products.filter(p => p.stock < 5).length;
  const todayOrders = orders.filter(o => o.date === new Date().toISOString().split('T')[0]).length;
  const revenue = orders.reduce((acc, o) => acc + o.totalPrice, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome back, {shopName?.split(' ')[0] || 'Seller'}! 👋</h2>
          <p className="text-gray-500 mt-1">Here is how {shopName || 'your shop'} is doing today.</p>
        </div>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="All Products" 
          value={products.length.toString()} 
          icon={<Package className="text-blue-600" />} 
          color="bg-blue-100" 
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockCount.toString()} 
          icon={<AlertCircle className="text-red-600" />} 
          color="bg-red-100" 
          highlight={lowStockCount > 0}
        />
        <StatCard 
          title="Today's Orders" 
          value={todayOrders.toString()} 
          icon={<ShoppingCart className="text-green-600" />} 
          color="bg-green-100" 
        />
        <StatCard 
          title="Total Revenue" 
          value={`৳${revenue.toLocaleString()}`} 
          icon={<DollarSign className="text-purple-600" />} 
          color="bg-purple-100" 
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => onNavigate('post')}
          className="flex items-center justify-between p-8 bg-blue-600 text-white rounded-2xl shadow-lg hover:bg-blue-700 transition-all transform hover:scale-[1.02]"
        >
          <div className="flex items-center">
            <Share2 className="w-10 h-10 mr-6" />
            <div className="text-left">
              <h3 className="text-2xl font-bold">Create New Post</h3>
              <p className="text-blue-100">Post to FB, IG & TikTok at once</p>
            </div>
          </div>
          <ArrowRight className="w-8 h-8 opacity-70" />
        </button>

        <button 
          onClick={() => onNavigate('orders')}
          className="flex items-center justify-between p-8 bg-white text-gray-800 border-2 border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:scale-[1.02]"
        >
          <div className="flex items-center">
            <ClipboardList className="w-10 h-10 mr-6 text-green-500" />
            <div className="text-left">
              <h3 className="text-2xl font-bold">Check Orders</h3>
              <p className="text-gray-500">View and manage latest sales</p>
            </div>
          </div>
          <ArrowRight className="w-8 h-8 text-gray-300" />
        </button>
      </div>

      {/* Recent Activity */}
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">Recent Activity</h3>
          <button onClick={() => onNavigate('dashboard')} className="text-blue-600 font-bold text-sm">View All</button>
        </div>
        <div className="divide-y divide-gray-50">
          {activities.length > 0 ? activities.map(activity => (
            <div key={activity.id} className="p-4 flex items-start space-x-4 hover:bg-gray-50 transition-colors">
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${activity.type === 'order' ? 'bg-green-500' : activity.type === 'inventory' ? 'bg-red-500' : 'bg-blue-500'}`} />
              <div className="flex-1">
                <p className="text-gray-800 font-medium">{activity.message}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-tight">{activity.timestamp}</p>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center text-gray-400">No recent activity found.</div>
          )}
        </div>
      </section>
    </div>
  );
};

const StatCard: React.FC<{ title: string, value: string, icon: React.ReactNode, color: string, highlight?: boolean }> = ({ title, value, icon, color, highlight }) => (
  <div className={`p-6 rounded-2xl shadow-sm border ${highlight ? 'border-red-200 bg-red-50' : 'border-gray-100 bg-white'}`}>
    <div className="flex items-center mb-4">
      <div className={`p-3 rounded-xl ${color}`}>
        {icon}
      </div>
      <h4 className="ml-3 font-semibold text-gray-500 uppercase text-xs tracking-wider">{title}</h4>
    </div>
    <p className={`text-3xl font-extrabold ${highlight ? 'text-red-600' : 'text-gray-900'}`}>{value}</p>
  </div>
);

export default Dashboard;
