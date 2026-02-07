
import React, { useState } from 'react';
import { User as UserIcon, MapPin, Mail, ShoppingBag, Save, Globe, Smartphone, Camera } from 'lucide-react';

interface ProfileProps {
  user: any;
  onUpdateUser: (updated: any) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    shopName: user?.shopName || '',
    email: user?.email || '',
    location: user?.location || 'Dhaka, Bangladesh',
    bio: user?.bio || 'Handmade jewelry with love.',
    phone: user?.phone || '+880 1XXX-XXXXXX'
  });

  const handleSave = () => {
    onUpdateUser({ ...user, ...formData });
    alert('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-extrabold text-gray-900">Shop Profile</h2>
        <p className="text-gray-500">How your business appears to customers.</p>
      </header>

      <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
        {/* Cover / Profile Banner area */}
        <div className="h-48 bg-gradient-to-r from-blue-600 to-green-500 relative">
           <div className="absolute -bottom-12 left-12">
              <div className="w-32 h-32 rounded-[24px] bg-white border-4 border-white shadow-xl flex items-center justify-center overflow-hidden relative group">
                 <div className="w-full h-full bg-blue-100 flex items-center justify-center text-blue-600 text-4xl font-black">
                   {formData.shopName.charAt(0)}
                 </div>
                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                    <Camera className="text-white w-8 h-8" />
                 </div>
              </div>
           </div>
        </div>

        <div className="pt-20 px-12 pb-12 space-y-10">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ProfileInput 
                label="Shop Name" 
                value={formData.shopName} 
                onChange={v => setFormData({...formData, shopName: v})} 
                icon={<ShoppingBag className="w-5 h-5" />} 
              />
              <ProfileInput 
                label="Location" 
                value={formData.location} 
                onChange={v => setFormData({...formData, location: v})} 
                icon={<MapPin className="w-5 h-5" />} 
              />
              <ProfileInput 
                label="Email Address" 
                value={formData.email} 
                onChange={v => setFormData({...formData, email: v})} 
                icon={<Mail className="w-5 h-5" />} 
              />
              <ProfileInput 
                label="Phone Number" 
                value={formData.phone} 
                onChange={v => setFormData({...formData, phone: v})} 
                icon={<Smartphone className="w-5 h-5" />} 
              />
           </div>

           <div className="space-y-3">
              <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">About Your Shop (Bio)</label>
              <textarea 
                value={formData.bio}
                onChange={e => setFormData({...formData, bio: e.target.value})}
                className="w-full h-32 p-4 bg-gray-50 border-2 border-gray-50 rounded-2xl text-lg font-medium focus:border-blue-500 focus:bg-white outline-none transition-all"
                placeholder="Tell customers what makes your shop special..."
              />
           </div>

           <div className="p-8 bg-blue-50 rounded-[24px] border border-blue-100 flex items-center justify-between">
              <div className="flex items-center">
                 <Globe className="w-8 h-8 text-blue-600 mr-4" />
                 <div>
                    <h4 className="font-bold text-blue-900">Connected Accounts</h4>
                    <p className="text-blue-700 text-sm">Managing: Facebook Page, Instagram Business</p>
                 </div>
              </div>
              <button className="px-6 py-2 bg-white border-2 border-blue-200 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors">Manage Apps</button>
           </div>

           <button 
             onClick={handleSave}
             className="w-full bg-blue-600 text-white py-6 rounded-2xl text-2xl font-black shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center transform active:scale-95 group"
           >
             <Save className="mr-3" /> Save Shop Changes
           </button>
        </div>
      </div>
    </div>
  );
};

const ProfileInput: React.FC<{ label: string, value: string, onChange: (v: string) => void, icon: React.ReactNode }> = ({ label, value, onChange, icon }) => (
  <div className="space-y-2">
    <label className="text-sm font-black text-gray-400 uppercase tracking-widest ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input 
        type="text" 
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl text-lg font-bold focus:border-blue-500 focus:bg-white outline-none transition-all"
      />
    </div>
  </div>
);

export default Profile;
