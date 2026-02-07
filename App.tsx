
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, PlusCircle, LogOut, User as UserIcon, Settings } from 'lucide-react';
import Dashboard from './views/Dashboard';
import CreatePost from './views/CreatePost';
import Inventory from './views/Inventory';
import Orders from './views/Orders';
import Login from './views/Login';
import Profile from './views/Profile';
import { Product, Order, Activity, OrderStatus, Platform } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'post' | 'inventory' | 'orders' | 'profile'>('dashboard');
  
  // Simulated database
  const [products, setProducts] = useState<Product[]>([
    { id: '1', name: 'Gold Plated Necklace', stock: 12, price: 1500 },
    { id: '2', name: 'Silver Handmade Ring', stock: 4, price: 800 },
    { id: '3', name: 'Traditional Jhumka', stock: 25, price: 1200 },
    { id: '4', name: 'Velvet Hair Clip', stock: 2, price: 150 },
  ]);

  const [orders, setOrders] = useState<Order[]>([
    { id: '123', platform: Platform.FACEBOOK, customerName: 'Sara Islam', productName: 'Gold Necklace', quantity: 2, totalPrice: 3000, status: OrderStatus.PENDING, date: '2023-10-25' },
    { id: '124', platform: Platform.INSTAGRAM, customerName: 'Anik Rahman', productName: 'Silver Ring', quantity: 1, totalPrice: 800, status: OrderStatus.PAID, date: '2023-10-25' },
  ]);

  const [activities, setActivities] = useState<Activity[]>([
    { id: 'a1', type: 'post', message: 'Posted "New Jhumka" to Facebook and Instagram', timestamp: '2 mins ago' },
    { id: 'a2', type: 'order', message: 'New order #123 received from Facebook', timestamp: '1 hour ago' },
    { id: 'a3', type: 'inventory', message: 'Silver Ring stock is low (4 left)', timestamp: '3 hours ago' },
  ]);

  useEffect(() => {
    const savedUser = localStorage.getItem('shopease_session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (userData: any) => {
    localStorage.setItem('shopease_session', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('shopease_session');
    setUser(null);
    setIsAuthenticated(false);
  };

  const addActivity = (message: string, type: Activity['type']) => {
    setActivities(prev => [{ id: Date.now().toString(), type, message, timestamp: 'Just now' }, ...prev]);
  };

  const updateProductStock = (id: string, delta: number) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  };

  const updateOrderStatus = (id: string, newStatus: OrderStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => {
        if (o.id === id) {
          if (newStatus === OrderStatus.PAID && o.status !== OrderStatus.PAID) {
            const product = products.find(p => p.name.toLowerCase().includes(o.productName.toLowerCase()));
            if (product) updateProductStock(product.id, -o.quantity);
          }
          return { ...o, status: newStatus };
        }
        return o;
      });
      return updated;
    });
    addActivity(`Order #${id} marked as ${newStatus}`, 'order');
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-blue-600 flex items-center">
            Shop<span className="text-green-600">Ease</span>
          </h1>
          <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase mt-1">SME Manager BD</p>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
          />
          <NavItem 
            active={currentView === 'post'} 
            onClick={() => setCurrentView('post')} 
            icon={<PlusCircle className="w-5 h-5" />} 
            label="Create Post" 
          />
          <NavItem 
            active={currentView === 'inventory'} 
            onClick={() => setCurrentView('inventory')} 
            icon={<Package className="w-5 h-5" />} 
            label="Inventory" 
          />
          <NavItem 
            active={currentView === 'orders'} 
            onClick={() => setCurrentView('orders')} 
            icon={<ShoppingBag className="w-5 h-5" />} 
            label="Orders Inbox" 
          />
          <div className="pt-4 mt-4 border-t border-gray-100">
             <NavItem 
               active={currentView === 'profile'} 
               onClick={() => setCurrentView('profile')} 
               icon={<Settings className="w-5 h-5" />} 
               label="Shop Profile" 
             />
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button 
            onClick={() => setCurrentView('profile')}
            className="flex items-center p-3 mb-2 w-full text-left rounded-xl hover:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <UserIcon size={20} />
            </div>
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">{user?.shopName || 'My Shop'}</p>
              <p className="text-xs text-gray-500 truncate">SME Seller</p>
            </div>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
          >
            <LogOut className="mr-2 w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-6xl mx-auto">
          {currentView === 'dashboard' && (
            <Dashboard 
              products={products} 
              orders={orders} 
              activities={activities} 
              onNavigate={setCurrentView} 
              shopName={user?.shopName}
            />
          )}
          {currentView === 'post' && (
            <CreatePost onPostSuccess={() => {
              addActivity('New post created successfully', 'post');
              setCurrentView('dashboard');
            }} shopName={user?.shopName} />
          )}
          {currentView === 'inventory' && (
            <Inventory 
              products={products} 
              setProducts={setProducts} 
              onActivity={addActivity} 
            />
          )}
          {currentView === 'orders' && (
            <Orders 
              orders={orders} 
              onUpdateStatus={updateOrderStatus} 
            />
          )}
          {currentView === 'profile' && (
            <Profile 
              user={user}
              onUpdateUser={(updated) => {
                setUser(updated);
                localStorage.setItem('shopease_session', JSON.stringify(updated));
                addActivity('Shop profile updated', 'inventory');
              }}
            />
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left rounded-xl transition-all ${active ? 'bg-blue-50 text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
  >
    <div className="mr-3">{icon}</div>
    <span className="font-semibold">{label}</span>
  </button>
);

export default App;
