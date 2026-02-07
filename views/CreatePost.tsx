
import React, { useState } from 'react';
import { Upload, X, Facebook, Instagram, Music, Sparkles, Send, Eye } from 'lucide-react';
import { generateSmartCaption } from '../services/geminiService';

interface CreatePostProps {
  onPostSuccess: () => void;
  shopName?: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostSuccess, shopName }) => {
  const [caption, setCaption] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState({ fb: true, ig: true, tt: false });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const togglePlatform = (key: keyof typeof platforms) => {
    setPlatforms(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSmartCaption = async () => {
    setIsGenerating(true);
    const selectedPlatforms = Object.entries(platforms)
      .filter(([_, active]) => active)
      .map(([name]) => name === 'fb' ? 'Facebook' : name === 'ig' ? 'Instagram' : 'TikTok');
    
    const suggested = await generateSmartCaption(shopName || "your items", selectedPlatforms);
    setCaption(suggested);
    setIsGenerating(false);
  };

  const handlePost = () => {
    if (!caption || !image) {
      alert('Please add a photo and a caption!');
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      onPostSuccess();
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">Create New Post</h2>
        <div className="flex space-x-3">
          <button 
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center px-4 py-2 border-2 border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Eye className="w-5 h-5 mr-2" /> {isPreview ? 'Edit Post' : 'Preview'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        {/* Left Column - Form */}
        <div className={`md:col-span-3 space-y-6 ${isPreview ? 'hidden' : 'block'}`}>
          <div className="relative">
            {!image ? (
              <label className="flex flex-col items-center justify-center w-full h-80 border-4 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-12 h-12 text-gray-400 group-hover:text-blue-500 mb-4" />
                  <p className="mb-2 text-lg font-bold text-gray-600">Click to upload photo or video</p>
                  <p className="text-sm text-gray-400">High quality images sell faster!</p>
                </div>
                <input type="file" className="hidden" accept="image/*,video/*" onChange={handleImageUpload} />
              </label>
            ) : (
              <div className="relative rounded-3xl overflow-hidden shadow-md group h-80">
                <img src={image} alt="Preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImage(null)}
                  className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-lg font-bold text-gray-700">Caption / Description</label>
              <button 
                onClick={handleSmartCaption}
                disabled={isGenerating}
                className="flex items-center text-sm font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 mr-1" /> {isGenerating ? 'Writing...' : 'AI Smart Caption'}
              </button>
            </div>
            <textarea 
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Write something about your item... (Include price and delivery charge)"
              className="w-full h-40 p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-gray-700 transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="text-lg font-bold text-gray-700 block">Select Platforms</label>
            <div className="flex flex-wrap gap-4">
              <PlatformToggle 
                label="Facebook" 
                icon={<Facebook className="text-blue-600" />} 
                active={platforms.fb} 
                onClick={() => togglePlatform('fb')} 
              />
              <PlatformToggle 
                label="Instagram" 
                icon={<Instagram className="text-pink-500" />} 
                active={platforms.ig} 
                onClick={() => togglePlatform('ig')} 
              />
              <PlatformToggle 
                label="TikTok" 
                icon={<Music className="text-black" />} 
                active={platforms.tt} 
                onClick={() => togglePlatform('tt')} 
              />
            </div>
          </div>
          
          <button 
            onClick={handlePost}
            disabled={isGenerating}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl text-2xl font-bold shadow-xl transition-all flex items-center justify-center transform active:scale-95 disabled:bg-gray-300"
          >
            {isGenerating ? (
              <span>Posting...</span>
            ) : (
              <><Send className="mr-3" /> Post Everywhere Now</>
            )}
          </button>
        </div>

        {/* Right Column - Context/Preview Info */}
        <div className={`md:col-span-2 space-y-6 ${isPreview ? 'block col-span-5 max-w-lg mx-auto' : 'hidden md:block'}`}>
           <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm sticky top-0">
              <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                <Eye className="mr-2 text-blue-500" /> Live Preview
              </h3>
              
              <div className="border border-gray-100 rounded-2xl overflow-hidden">
                <div className="p-4 flex items-center space-x-3 border-b border-gray-50">
                   <div className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white shadow-sm flex items-center justify-center font-bold text-blue-600">
                     {shopName?.charAt(0) || 'S'}
                   </div>
                   <div>
                     <p className="text-sm font-bold">{shopName || "Sultana's Jewelry"}</p>
                     <p className="text-xs text-gray-400">Just now • Facebook</p>
                   </div>
                </div>
                {image ? (
                  <img src={image} className="w-full h-64 object-cover" />
                ) : (
                  <div className="w-full h-64 bg-gray-50 flex items-center justify-center text-gray-300">No Image</div>
                )}
                <div className="p-4">
                  <p className="text-sm whitespace-pre-wrap">{caption || "Your caption will appear here..."}</p>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                 <p className="text-sm text-blue-700 font-medium leading-relaxed">
                   <strong>Tip:</strong> Posts with clear prices and delivery info in the first 2 lines get 40% more orders in Bangladesh! 🇧🇩
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const PlatformToggle: React.FC<{ label: string, icon: React.ReactNode, active: boolean, onClick: () => void }> = ({ label, icon, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`flex items-center space-x-3 px-6 py-4 rounded-2xl border-2 transition-all ${active ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm' : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'}`}
  >
    <div className={`p-1 rounded-md bg-white shadow-sm ${!active && 'grayscale opacity-50'}`}>
      {icon}
    </div>
    <span className="font-bold text-lg">{label}</span>
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${active ? 'bg-blue-600 border-blue-600' : 'border-gray-200'}`}>
      {active && <div className="w-2 h-2 rounded-full bg-white" />}
    </div>
  </button>
);

export default CreatePost;
