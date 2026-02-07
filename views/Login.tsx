
import React, { useState } from 'react';
import { User, Lock, ArrowRight, ShieldCheck, Facebook, Chrome, ShoppingBag } from 'lucide-react';

interface LoginProps {
  onLogin: (userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('sultana@shopease.bd');
  const [pass, setPass] = useState('password');
  const [shopName, setShopName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ 
      email, 
      shopName: isLogin ? "Sultana's Jewelry" : shopName,
      location: 'Dhaka, Bangladesh'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-6">
      <div className="w-full max-w-lg bg-white p-10 md:p-12 rounded-[40px] shadow-2xl border border-gray-100 relative overflow-hidden">
        {/* Decorative background circle */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-50 rounded-full opacity-50 blur-3xl"></div>
        
        <div className="relative text-center mb-10">
          <h1 className="text-5xl font-black text-blue-600 tracking-tight">Shop<span className="text-green-600">Ease</span></h1>
          <p className="text-gray-400 font-bold tracking-widest text-xs uppercase mt-3">SME Growth Platform • Bangladesh</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-sm font-black text-gray-500 uppercase tracking-widest ml-1">Shop Name</label>
              <div className="relative">
                <ShoppingBag className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Dreamy Crafts"
                  value={shopName}
                  onChange={e => setShopName(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-2xl text-lg font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-500 uppercase tracking-widest ml-1">Email / Mobile</label>
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input 
                type="text" 
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-2xl text-lg font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-6 h-6" />
              <input 
                type="password" 
                required
                value={pass}
                onChange={e => setPass(e.target.value)}
                className="w-full pl-16 pr-6 py-5 bg-gray-50 border-2 border-gray-50 rounded-2xl text-lg font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 text-white py-6 rounded-2xl text-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center transform active:scale-95 group"
          >
            {isLogin ? 'Login to Shop' : 'Create My Shop'} <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="relative flex items-center py-4">
            <div className="flex-grow border-t border-gray-100"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-xs font-black uppercase tracking-widest">Or login with</span>
            <div className="flex-grow border-t border-gray-100"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => onLogin({ email: 'google@user.com', shopName: 'Social Seller' })}
              className="flex items-center justify-center py-4 px-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all active:scale-95 group"
            >
              <Chrome className="w-6 h-6 mr-3 text-red-500" />
              <span className="font-bold text-gray-700">Google</span>
            </button>
            <button 
              type="button"
              onClick={() => onLogin({ email: 'fb@user.com', shopName: 'FB Boutique' })}
              className="flex items-center justify-center py-4 px-6 border-2 border-gray-100 rounded-2xl hover:bg-gray-50 transition-all active:scale-95 group"
            >
              <Facebook className="w-6 h-6 mr-3 text-blue-600" />
              <span className="font-bold text-gray-700">Facebook</span>
            </button>
          </div>
        </form>

        <div className="mt-10 pt-8 border-t border-gray-50 text-center">
           <p className="text-gray-400 font-medium mb-4">{isLogin ? "Don't have an account?" : "Already have an account?"}</p>
           <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 font-black text-lg hover:underline decoration-2"
           >
             {isLogin ? 'Create New Shop Account' : 'Back to Login'}
           </button>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-2 text-green-600 font-bold text-xs uppercase tracking-widest">
           <ShieldCheck className="w-4 h-4" />
           <span>Secure & Private BD Servers</span>
        </div>
      </div>

      <p className="mt-8 text-gray-400 font-medium text-sm">© 2023 ShopEase Bangladesh. All Rights Reserved.</p>
    </div>
  );
};

export default Login;
