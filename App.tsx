
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, PlusCircle, LogOut, Settings } from 'lucide-react';
import Dashboard from './views/Dashboard';
import CreatePost from './views/CreatePost';
import Inventory from './views/Inventory';
import Orders from './views/Orders';
import Login from './views/Login';
import Profile from './views/Profile';
import { Product, Order, Activity, OrderStatus, Platform, User } from './types';
import { authService } from './services/authService';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'post' | 'inventory' | 'orders' | 'profile'>('dashboard');
  const [loading, setLoading] = useState(true);
  
  // High-fidelity Product Catalog for BD Market
  const [products, setProducts] = useState<Product[]>([
    { id: 'p1', name: 'Jamdani Silk Saree', stock: 8, price: 5500, buyingCost: 3200, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=400' },
    { id: 'p2', name: 'Hand-painted Panjabi', stock: 15, price: 2200, buyingCost: 1100, image: 'https://images.unsplash.com/photo-1597983073493-88cd35cf93b0?auto=format&fit=crop&q=80&w=400' },
    { id: 'p3', name: 'Oxidized Choker Set', stock: 42, price: 850, buyingCost: 350, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400' },
    { id: 'p4', name: 'Clay Wall Hanging', stock: 5, price: 1200, buyingCost: 500, image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&q=80&w=400' },
    { id: 'p5', name: 'Designer Georgette Hijab', stock: 60, price: 650, buyingCost: 280, image: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&q=80&w=400' },
    { id: 'p6', name: 'Block Print Kurti', stock: 12, price: 1800, buyingCost: 950, image: 'https://images.unsplash.com/photo-1609357483233-5a869d622158?auto=format&fit=crop&q=80&w=400' },
    { id: 'p7', name: 'Traditional Clay Pot', stock: 3, price: 450, buyingCost: 150, image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=400' },
    { id: 'p8', name: 'Sandalwood Soap Pack', stock: 25, price: 350, buyingCost: 120, image: 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214?auto=format&fit=crop&q=80&w=400' },
    { id: 'p9', name: 'Wooden Photo Frame', stock: 18, price: 1100, buyingCost: 400, image: 'https://images.unsplash.com/photo-1544000323-2882193e433a?auto=format&fit=crop&q=80&w=400' },
    { id: 'p10', name: 'Crochet Table Runner', stock: 7, price: 1500, buyingCost: 700, image: 'https://images.unsplash.com/photo-1520970014086-2208d477c812?auto=format&fit=crop&q=80&w=400' },
  ]);

  // Historical 2-Month Order Dataset (50 Orders)
  const generateOrders = (): Order[] => {
    const today = new Date();
    const data: Order[] = [];
    const platforms = [Platform.FACEBOOK, Platform.INSTAGRAM, Platform.TIKTOK];
    const statuses = [OrderStatus.PENDING, OrderStatus.PAID, OrderStatus.SHIPPED];
    const names = ['Sara Islam', 'Anik Rahman', 'Maher Afroz', 'Riad Hassan', 'Nila Ahmed', 'Tarek Aziz', 'Farhana Akter', 'Sohail Rana', 'Laila Khan', 'Zeeshan Khan'];
    
    // Seed with 50 orders over 60 days
    for (let i = 0; i < 50; i++) {
      const date = new Date();
      date.setDate(today.getDate() - (i % 60)); // Spread across 60 days
      const dateStr = date.toISOString().split('T')[0];
      
      const productIndex = i % products.length;
      const product = products[productIndex];
      const qty = (i % 3) + 1;
      
      data.push({
        id: (1000 + i).toString(),
        platform: platforms[i % 3],
        customerName: names[i % names.length],
        productName: product.name,
        quantity: qty,
        totalPrice: product.price * qty,
        buyingCost: product.buyingCost,
        status: i < 5 ? OrderStatus.PENDING : i < 15 ? OrderStatus.PAID : OrderStatus.SHIPPED,
        date: dateStr
      });
    }
    return data;
  };

  const [orders, setOrders] = useState<Order[]>(generateOrders());

  const [activities, setActivities] = useState<Activity[]>([
    { id: 'a1', type: 'order', message: 'New order #1049 received from TikTok', timestamp: 'Just now' },
    { id: 'a2', type: 'post', message: 'Campaign "Eid Collection" launched on Meta', timestamp: '1 hour ago' },
    { id: 'a3', type: 'inventory', message: 'Stock for "Traditional Clay Pot" is critically low (3 left)', timestamp: '3 hours ago' },
    { id: 'a4', type: 'order', message: 'Payment verified for Order #1045', timestamp: '5 hours ago' },
    { id: 'a5', type: 'order', message: 'Sara Islam ordered 2 units of Jamdani Silk Saree', timestamp: 'Yesterday' },
    { id: 'a6', type: 'inventory', message: 'Added 60 units of Designer Georgette Hijab', timestamp: '2 days ago' },
  ]);

  useEffect(() => {
    const unsubscribe = authService.onAuthUpdate((sessionUser) => {
      if (sessionUser) {
        setUser({
          name: sessionUser.displayName,
          email: sessionUser.email,
          isAuthenticated: true,
          shopName: sessionUser.displayName,
          location: 'Dhaka, Bangladesh',
          avatar: sessionUser.photoURL,
          linkedAccounts: sessionUser.linkedAccounts || {
            facebook: true,
            instagram: true,
            tiktok: false,
            google: true
          }
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLoginSuccess = (data: any) => {
    setUser({
      name: data.shopName,
      email: data.email,
      isAuthenticated: true,
      shopName: data.shopName,
      location: data.location,
      avatar: data.avatar,
      linkedAccounts: data.linkedAccounts
    });
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (e) {
      console.error("Logout failed", e);
    }
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

  const handleUpdateOrderPrice = (id: string, newPrice: number) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, totalPrice: newPrice } : o));
    addActivity(`Custom price updated for order #${id}`, 'order');
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-bold uppercase tracking-widest text-[10px]">Verifying Identity Gateway...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return <Login onLoginSuccess={handleLoginSuccess} />;

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col shadow-sm relative z-20">
        <div className="p-10">
          <h1 className="text-4xl font-black text-blue-600 flex items-center tracking-tighter">
            Shop<span className="text-slate-900">Ease</span>
          </h1>
          <div className="mt-2 flex items-center">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-2"></div>
            <p className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">Enterprise Live</p>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-3">
          <NavItem active={currentView === 'dashboard'} onClick={() => setCurrentView('dashboard')} icon={<LayoutDashboard className="w-5 h-5" />} label="Market Pulse" />
          <NavItem active={currentView === 'post'} onClick={() => setCurrentView('post')} icon={<PlusCircle className="w-5 h-5" />} label="Broadcaster" />
          <NavItem active={currentView === 'inventory'} onClick={() => setCurrentView('inventory')} icon={<Package className="w-5 h-5" />} label="Warehouse" />
          <NavItem active={currentView === 'orders'} onClick={() => setCurrentView('orders')} icon={<ShoppingBag className="w-5 h-5" />} label="Orders" />
          <div className="pt-6 mt-6 border-t border-slate-50">
             <NavItem active={currentView === 'profile'} onClick={() => setCurrentView('profile')} icon={<Settings className="w-5 h-5" />} label="Settings" />
          </div>
        </nav>

        <div className="p-8">
          <div className="p-5 mb-4 rounded-[32px] bg-slate-50 border border-slate-100 flex items-center">
            {user?.avatar ? (
              <img src={user.avatar} className="w-12 h-12 rounded-2xl shadow-lg" alt="User" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-100">
                {user?.shopName?.charAt(0) || 'S'}
              </div>
            )}
            <div className="ml-4 overflow-hidden">
              <p className="text-sm font-black text-slate-900 truncate">{user?.shopName || 'My Shop'}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Store Admin</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center w-full px-5 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-xs uppercase tracking-widest group">
            <LogOut className="mr-3 w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sign Out Securely
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto">
          {currentView === 'dashboard' && <Dashboard products={products} orders={orders} activities={activities} onNavigate={setCurrentView} user={user} />}
          {currentView === 'post' && <CreatePost onPostSuccess={() => { addActivity('Multi-channel campaign launched', 'post'); setCurrentView('dashboard'); }} shopName={user?.shopName} />}
          {currentView === 'inventory' && <Inventory products={products} setProducts={setProducts} onActivity={addActivity} />}
          {currentView === 'orders' && <Orders orders={orders} onUpdateStatus={updateOrderStatus} onUpdatePrice={handleUpdateOrderPrice} />}
          {currentView === 'profile' && <Profile user={user} onUpdateUser={(updated) => { setUser(updated); addActivity('Profile sync completed', 'inventory'); }} />}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center w-full px-6 py-5 text-left rounded-[24px] transition-all group ${active ? 'bg-slate-900 text-white shadow-2xl shadow-slate-200 translate-x-1' : 'text-slate-500 hover:bg-white hover:text-slate-900'}`}>
    <div className={`mr-4 transition-colors ${active ? 'text-blue-400' : 'text-slate-300 group-hover:text-blue-600'}`}>{icon}</div>
    <span className={`font-black text-xs uppercase tracking-[0.2em] ${active ? 'opacity-100' : 'opacity-80'}`}>{label}</span>
  </button>
);

export default App;
