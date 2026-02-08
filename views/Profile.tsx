
import React, { useState } from 'react';
import { MapPin, Mail, ShoppingBag, Save, Globe, Smartphone, Camera, Facebook, Instagram, Music, CheckCircle2, ShieldAlert } from 'lucide-react';
import { authService } from '../services/authService';
import { User, LinkedAccounts } from '../types';

interface ProfileProps {
  user: User | null;
  onUpdateUser: (updated: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    shopName: user?.shopName || '',
    email: user?.email || '',
    location: user?.location || 'Dhaka, Bangladesh',
    bio: user?.bio || 'Handmade crafts with love.',
    phone: user?.phone || '+880 1XXX-XXXXXX'
  });

  const [isLinking, setIsLinking] = useState<string | null>(null);

  const handleSave = () => {
    if (!user) return;
    onUpdateUser({ ...user, ...formData });
    alert('Store preferences updated successfully!');
  };

  const handleToggleLink = async (platform: keyof LinkedAccounts) => {
    if (!user) return;
    
    setIsLinking(platform);
    try {
      if (user.linkedAccounts[platform]) {
        const confirmDisconnect = confirm(`Disconnect ${platform}? This removes API access.`);
        if (confirmDisconnect) {
          onUpdateUser({
            ...user,
            linkedAccounts: { ...user.linkedAccounts, [platform]: false }
          });
        }
      } else {
        if (platform === 'facebook' || platform === 'instagram') {
          // Fix: Call socialLogin with all 3 required arguments (provider, rememberMe, shopNameInput)
          await authService.socialLogin('facebook', true, formData.shopName);
        } else if (platform === 'google') {
          // Fix: Call socialLogin with all 3 required arguments (provider, rememberMe, shopNameInput)
          await authService.socialLogin('google', true, formData.shopName);
        } else {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        onUpdateUser({
          ...user,
          linkedAccounts: { ...user.linkedAccounts, [platform]: true }
        });
      }
    } catch (e) {
      alert("Authentication failed.");
    } finally {
      setIsLinking(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      <header>
        <h2 className="text-4xl font-black text-slate-900 tracking-tight">Store Settings</h2>
        <p className="text-slate-600 text-lg font-medium">Configure your presence across the digital ecosystem.</p>
      </header>

      <div className="bg-white rounded-[48px] shadow-sm border border-slate-200 overflow-hidden">
        <div className="h-64 bg-gradient-to-br from-blue-600 via-blue-500 to-green-500 relative">
           <div className="absolute -bottom-16 left-16">
              <div className="w-40 h-40 rounded-[40px] bg-white border-8 border-white shadow-2xl flex items-center justify-center overflow-hidden relative group">
                 {user?.avatar ? (
                    <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                 ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-600 text-6xl font-black">
                      {formData.shopName.charAt(0)}
                    </div>
                 )}
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="text-white w-10 h-10" />
                 </div>
              </div>
           </div>
        </div>

        <div className="pt-24 px-16 pb-16 space-y-12">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <ProfileInput 
                label="Registered Shop Name" 
                value={formData.shopName} 
                onChange={v => setFormData({...formData, shopName: v})} 
                icon={<ShoppingBag className="w-5 h-5" />} 
              />
              <ProfileInput 
                label="Store Location" 
                value={formData.location} 
                onChange={v => setFormData({...formData, location: v})} 
                icon={<MapPin className="w-5 h-5" />} 
              />
              <ProfileInput 
                label="Admin Email" 
                value={formData.email} 
                onChange={v => setFormData({...formData, email: v})} 
                icon={<Mail className="w-5 h-5" />} 
              />
              <ProfileInput 
                label="Support Mobile" 
                value={formData.phone} 
                onChange={v => setFormData({...formData, phone: v})} 
                icon={<Smartphone className="w-5 h-5" />} 
              />
           </div>

           <div className="space-y-4">
              <label className="text-xs font-black text-slate-700 uppercase tracking-[0.2em] ml-2">Brand Story (Bio)</label>
              <textarea 
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className="w-full h-40 p-8 bg-slate-50 border-2 border-slate-100 rounded-[32px] text-xl font-bold text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all resize-none shadow-inner"
                placeholder="What makes your items unique?"
              />
           </div>

           <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                 <h3 className="text-2xl font-black text-slate-900 flex items-center">
                    <Globe className="mr-3 text-blue-600" /> API Connections
                 </h3>
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Secured via Social Auth</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <AccountLinkCard 
                    name="Facebook Business" 
                    icon={<Facebook className="text-blue-600" />} 
                    connected={user?.linkedAccounts.facebook || false} 
                    loading={isLinking === 'facebook'}
                    onToggle={() => handleToggleLink('facebook')}
                 />
                 <AccountLinkCard 
                    name="Instagram Creator" 
                    icon={<Instagram className="text-pink-500" />} 
                    connected={user?.linkedAccounts.instagram || false} 
                    loading={isLinking === 'instagram'}
                    onToggle={() => handleToggleLink('instagram')}
                 />
                 <AccountLinkCard 
                    name="TikTok for Business" 
                    icon={<Music className="text-black" />} 
                    connected={user?.linkedAccounts.tiktok || false} 
                    loading={isLinking === 'tiktok'}
                    onToggle={() => handleToggleLink('tiktok')}
                 />
                 <AccountLinkCard 
                    name="Google Identity" 
                    icon={<Globe className="text-red-500" />} 
                    connected={user?.linkedAccounts.google || false} 
                    loading={isLinking === 'google'}
                    onToggle={() => handleToggleLink('google')}
                 />
              </div>
           </section>

           <div className="pt-8 flex flex-col md:flex-row gap-4">
              <button 
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-8 rounded-[32px] text-3xl font-black shadow-2xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center transform active:scale-[0.98]"
              >
                <Save className="mr-4 w-8 h-8" /> Commit Changes
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

const ProfileInput: React.FC<{ label: string, value: string, onChange: (v: string) => void, icon: React.ReactNode }> = ({ label, value, onChange, icon }) => (
  <div className="space-y-3">
    <label className="text-xs font-black text-slate-700 uppercase tracking-[0.2em] ml-2">{label}</label>
    <div className="relative group">
      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-600 transition-colors">
        {icon}
      </div>
      <input 
        type="text" 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-16 pr-8 py-5 bg-slate-50 border-2 border-slate-200 rounded-[24px] text-xl font-black text-slate-900 focus:border-blue-500 focus:bg-white outline-none transition-all placeholder:text-slate-400"
      />
    </div>
  </div>
);

const AccountLinkCard: React.FC<{ name: string, icon: React.ReactNode, connected: boolean, onToggle: () => void, loading: boolean }> = ({ name, icon, connected, onToggle, loading }) => (
  <div className={`p-8 rounded-[32px] border-2 flex items-center justify-between transition-all ${connected ? 'bg-white border-blue-100' : 'bg-slate-50 border-transparent grayscale'}`}>
    <div className="flex items-center">
       <div className={`p-4 rounded-2xl bg-white shadow-sm mr-6 ${!connected && 'opacity-50'}`}>
         {icon}
       </div>
       <div>
          <h4 className="text-lg font-black text-slate-900">{name}</h4>
          <p className={`text-[10px] font-black uppercase tracking-widest ${connected ? 'text-blue-600' : 'text-slate-500'}`}>
            {connected ? 'Active Handshake' : 'Offline'}
          </p>
       </div>
    </div>
    <button 
      onClick={onToggle}
      disabled={loading}
      className={`px-6 py-3 rounded-2xl font-black text-sm transition-all flex items-center ${connected ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
    >
      {loading ? 'Processing...' : connected ? 'Unlink' : 'Link API'}
      {connected && !loading && <ShieldAlert className="ml-2 w-4 h-4" />}
      {!connected && !loading && <CheckCircle2 className="ml-2 w-4 h-4" />}
    </button>
  </div>
);

export default Profile;
