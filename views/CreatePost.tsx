
import React, { useState } from 'react';
import { Upload, X, Facebook, Instagram, Music, Sparkles, Eye, CheckCircle2, Loader2, ShieldCheck, AlertCircle, Wand2, Camera, RefreshCw, TrendingUp } from 'lucide-react';
import { generateSmartCaptions, generateProductPhoto } from '../services/geminiService';
import { socialBridge } from '../services/supabaseClient';
import { SocialMediaCaptions } from '../types';

interface CreatePostProps {
  onPostSuccess: () => void;
  shopName?: string;
}

const CreatePost: React.FC<CreatePostProps> = ({ onPostSuccess, shopName }) => {
  const [captions, setCaptions] = useState<SocialMediaCaptions>({ facebook: '', instagram: '', tiktok: '' });
  const [image, setImage] = useState<string | null>(null);
  const [platforms, setPlatforms] = useState({ fb: true, ig: true, tt: false });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewPlatform, setPreviewPlatform] = useState<'fb' | 'ig' | 'tt'>('fb');
  const [studioPrompt, setStudioPrompt] = useState('');
  const [showStudio, setShowStudio] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleAiImageGen = async () => {
    if (!studioPrompt.trim()) return;
    setIsGeneratingImage(true);
    const generated = await generateProductPhoto(studioPrompt);
    if (generated) {
      setImage(generated);
      setShowStudio(false);
    } else {
      alert("AI was unable to generate that specific image. Try a simpler description!");
    }
    setIsGeneratingImage(false);
  };

  const handleSmartCaption = async () => {
    if (!image) {
      alert("Add a photo first so AI can analyze the style!");
      return;
    }
    setIsGenerating(true);
    try {
      const result = await generateSmartCaptions(shopName || "new items", image);
      setCaptions(result);
    } catch (error) {
      console.error("AI Generation Failed", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePost = async () => {
    const active = Object.entries(platforms).filter(([_, v]) => v).map(([k]) => k);
    if (active.length === 0 || !image) {
      alert('Missing requirements: Platform & Photo.');
      return;
    }
    setIsPublishing(true);
    try {
      await socialBridge.publishToAll({ captions, image, platforms: active });
      onPostSuccess();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-4 duration-700">
      
      {/* AI Studio Overlay */}
      {showStudio && (
        <div className="fixed inset-0 z-[110] bg-slate-900/95 backdrop-blur-2xl flex items-center justify-center p-6 text-white">
           <div className="w-full max-w-2xl bg-white text-slate-900 p-12 rounded-[56px] shadow-4xl relative animate-in zoom-in-95 duration-500">
              <button onClick={() => setShowStudio(false)} className="absolute top-10 right-10 p-3 hover:bg-slate-50 rounded-full transition-all">
                <X className="w-8 h-8 text-slate-300" />
              </button>
              
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
                  <Wand2 className="text-white w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tight">AI Product Studio</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Powered by Gemini 2.5 Flash</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-2">Product Description</label>
                   <textarea 
                    value={studioPrompt}
                    onChange={(e) => setStudioPrompt(e.target.value)}
                    placeholder="e.g. A handmade silver necklace displayed on a traditional Bengali silk fabric background, soft natural lighting, professional photography."
                    className="w-full h-40 p-8 bg-slate-50 border-2 border-slate-100 rounded-[32px] text-xl font-medium focus:border-indigo-600 focus:bg-white outline-none transition-all resize-none shadow-inner"
                   />
                </div>
                
                <button 
                  onClick={handleAiImageGen}
                  disabled={isGeneratingImage || !studioPrompt.trim()}
                  className="w-full bg-indigo-600 text-white py-8 rounded-[32px] text-2xl font-black shadow-2xl hover:bg-indigo-700 transition-all flex items-center justify-center transform active:scale-[0.98] disabled:opacity-50"
                >
                  {isGeneratingImage ? <Loader2 className="animate-spin w-10 h-10" /> : "Generate Lifestyle Photo ✨"}
                </button>
              </div>
           </div>
        </div>
      )}

      {isPublishing && (
        <div className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center text-white text-center">
           <Loader2 className="w-20 h-20 animate-spin text-blue-500 mb-8" />
           <h2 className="text-4xl font-black mb-2">Broadcasting Strategy...</h2>
           <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Distributing to Meta & TikTok Networks</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-10">
          <header className="flex justify-between items-end">
            <div>
              <h2 className="text-5xl font-black text-slate-900 tracking-tight">Broadcaster</h2>
              <p className="text-slate-500 text-lg">One design, universal impact.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative aspect-square bg-white border-4 border-dashed border-slate-100 rounded-[48px] flex items-center justify-center overflow-hidden hover:border-blue-400 transition-all">
              {!image ? (
                <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer group-hover:bg-blue-50/50">
                  <Upload className="w-12 h-12 text-slate-200 mb-4 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Upload Asset</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                </label>
              ) : (
                <>
                  <img src={image} className="w-full h-full object-cover" alt="Source" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                     <button onClick={() => setImage(null)} className="p-5 bg-white text-red-600 rounded-3xl hover:scale-110 transition-transform"><X className="w-6 h-6" /></button>
                  </div>
                </>
              )}
            </div>
            
            <button 
              onClick={() => setShowStudio(true)}
              className="aspect-square bg-slate-900 rounded-[48px] p-10 flex flex-col items-center justify-center text-center text-white group relative overflow-hidden shadow-2xl hover:scale-[1.02] transition-all"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
                <Wand2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black mb-2">AI Product Studio</h3>
              <p className="text-slate-400 text-sm px-4">Generate lifestyle photos without a camera.</p>
            </button>
          </div>

          <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex bg-slate-50 p-1.5 rounded-2xl">
                {(['fb', 'ig', 'tt'] as const).map(p => (
                  <button key={p} onClick={() => setPreviewPlatform(p)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${previewPlatform === p ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-400 hover:text-slate-900'}`}>{p}</button>
                ))}
              </div>
              <button 
                onClick={handleSmartCaption} 
                disabled={isGenerating || !image}
                className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center shadow-lg hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                Optimize with AI
              </button>
            </div>

            <textarea 
              value={previewPlatform === 'fb' ? captions.facebook : previewPlatform === 'ig' ? captions.instagram : captions.tiktok}
              onChange={(e) => setCaptions({...captions, [previewPlatform === 'fb' ? 'facebook' : previewPlatform === 'ig' ? 'instagram' : 'tiktok']: e.target.value})}
              placeholder={`Write your ${previewPlatform.toUpperCase()} narrative here...`}
              className="w-full h-48 p-8 bg-slate-50 border-2 border-slate-100 rounded-[32px] text-xl font-medium focus:border-blue-600 focus:bg-white outline-none transition-all resize-none shadow-inner"
            />
          </div>

          {/* Fix: Added missing TrendingUp icon from lucide-react */}
          <button onClick={handlePost} disabled={isPublishing || !image} className="w-full bg-blue-600 text-white py-10 rounded-[42px] text-3xl font-black shadow-3xl shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center group active:scale-[0.98] disabled:opacity-30">
            Launch Broadcast <TrendingUp className="ml-4 w-8 h-8 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" />
          </button>
        </div>

        {/* Sidebar Preview */}
        <div className="w-full lg:w-96 shrink-0 space-y-8">
           <div className="sticky top-10">
              <div className="flex items-center justify-between px-2 mb-6">
                 <h3 className="text-xl font-black text-slate-900 flex items-center">
                    <Eye className="mr-2 text-blue-500" /> Live Feed
                 </h3>
                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform Mock</span>
              </div>
              
              <div className="bg-slate-900 border-[10px] border-slate-900 rounded-[60px] shadow-4xl h-[650px] relative overflow-hidden group/phone">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-900 rounded-b-3xl z-20"></div>
                 <div className="h-full bg-white overflow-y-auto no-scrollbar rounded-[50px]">
                    {previewPlatform === 'fb' && (
                      <div className="animate-in fade-in duration-300">
                        <div className="p-4 flex items-center space-x-3 border-b border-slate-50">
                          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-black text-white">{shopName?.charAt(0)}</div>
                          <p className="text-sm font-black text-slate-900">{shopName}</p>
                        </div>
                        <div className="p-5">
                          <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">{captions.facebook || "AI Story waiting..."}</p>
                        </div>
                        {image && <img src={image} className="w-full" alt="FB" />}
                      </div>
                    )}
                    {previewPlatform === 'ig' && (
                      <div className="animate-in fade-in duration-300">
                        <div className="p-4 flex items-center space-x-3">
                           <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-0.5">
                             <div className="w-full h-full rounded-full bg-white p-0.5">
                               <div className="w-full h-full rounded-full bg-slate-100"></div>
                             </div>
                           </div>
                           <p className="text-xs font-black text-slate-900">{shopName?.toLowerCase().replace(/\s/g, '')}</p>
                        </div>
                        {image && <img src={image} className="w-full aspect-square object-cover" alt="IG" />}
                        <div className="p-4 space-y-2">
                           <p className="text-xs text-slate-800 leading-relaxed">
                             <span className="font-black mr-2">{shopName?.toLowerCase().replace(/\s/g, '')}</span>
                             {captions.instagram || "Visual context loading..."}
                           </p>
                        </div>
                      </div>
                    )}
                    {previewPlatform === 'tt' && (
                      <div className="h-full bg-black relative animate-in fade-in duration-300">
                        {image ? <img src={image} className="w-full h-full object-cover opacity-70" alt="TT" /> : <div className="h-full flex items-center justify-center text-white/20">Empty Stage</div>}
                        <div className="absolute bottom-10 left-4 right-16 p-4 bg-gradient-to-t from-black/90 to-transparent text-white">
                          <p className="font-black mb-2">@{shopName?.toLowerCase().replace(/\s/g, '')}</p>
                          <p className="text-sm line-clamp-3">{captions.tiktok || "Hook script..."}</p>
                          <div className="mt-4 flex items-center text-[10px] font-black uppercase tracking-widest text-white/60">
                            <Music className="w-3 h-3 mr-2" /> Original Audio - ShopEase
                          </div>
                        </div>
                      </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
