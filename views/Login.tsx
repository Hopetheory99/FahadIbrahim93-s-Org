
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Loader2, Chrome, Facebook, ShieldCheck, AlertCircle, RefreshCw, Check, X, Lock, Activity, Globe, Wifi, Settings, MousePointer2, ShieldAlert, Cpu, WifiOff, ExternalLink, HelpCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { AuthError, DiagnosticResult } from '../types';

interface LoginProps {
  onLoginSuccess: (userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [shopName, setShopName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState<string | null>(null);
  const [error, setError] = useState<AuthError | null>(null);
  const [showPortal, setShowPortal] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticResult | null>(null);
  const [showTroubleshoot, setShowTroubleshoot] = useState(false);

  const runSystemCheck = async () => {
    const res = await authService.runDiagnostics();
    setDiagnostics(res);
  };

  useEffect(() => {
    runSystemCheck();
  }, []);

  const initiateAuth = (provider: 'google' | 'facebook') => {
    setError(null);
    setShowPortal(provider);
  };

  const handleGrantAccess = async () => {
    const provider = showPortal as 'google' | 'facebook';
    setShowPortal(null);
    setIsAuthenticating(provider);
    
    try {
      const user = await authService.socialLogin(provider, rememberMe, shopName);
      onLoginSuccess({
        email: user.email,
        shopName: shopName || user.displayName,
        location: 'Dhaka, Bangladesh',
        avatar: user.photoURL,
        uid: user.uid,
        rememberMe,
        linkedAccounts: {
          facebook: provider === 'facebook',
          google: provider === 'google',
          instagram: provider === 'facebook',
          tiktok: false
        }
      });
    } catch (err: any) {
      setError(err as AuthError);
      runSystemCheck(); // Refresh diagnostics when an error occurs
    } finally {
      setIsAuthenticating(null);
    }
  };

  const getTroubleshootingSteps = (code: string) => {
    switch (code) {
      case 'AUTH_OFFLINE':
        return [
          { icon: <WifiOff className="w-4 h-4" />, text: "Ensure your Wi-Fi or mobile data is switched on." },
          { icon: <Globe className="w-4 h-4" />, text: "Try accessing another website to confirm internet stability." },
          { icon: <Activity className="w-4 h-4" />, text: "If using a public network, check if login is required via portal." }
        ];
      case 'AUTH_POPUP_BLOCKED':
        return [
          { icon: <ExternalLink className="w-4 h-4" />, text: "Look for a red icon in the right side of your browser's address bar." },
          { icon: <Settings className="w-4 h-4" />, text: "Click 'Always allow pop-ups from this site' and click Done." },
          { icon: <RefreshCw className="w-4 h-4" />, text: "Refresh this page and try the login again." }
        ];
      default:
        return [
          { icon: <HelpCircle className="w-4 h-4" />, text: "Try clearing your browser cache and cookies." },
          { icon: <Chrome className="w-4 h-4" />, text: "Ensure you are using a modern browser like Chrome, Edge, or Safari." }
        ];
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-6 relative overflow-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {/* Dynamic Security Mesh Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#2563eb 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[140px] animate-pulse"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Enterprise Gateway Header */}
      <div className="fixed top-0 left-0 w-full bg-white/60 backdrop-blur-xl border-b border-slate-100 px-8 py-3 flex items-center justify-between z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <span className="font-black text-slate-900 tracking-tighter">ShopEase <span className="text-blue-600">ID Hub</span></span>
        </div>
        
        <div className="flex items-center space-x-6">
          <DiagnosticBadge icon={<Wifi />} label="Network" status={diagnostics?.networkHealthy} />
          <DiagnosticBadge icon={<ShieldCheck />} label="Certs" status={diagnostics?.cookiesEnabled} />
          <DiagnosticBadge icon={<Cpu />} label="Core" status={true} />
        </div>
      </div>

      <div className="w-full max-w-xl bg-white p-12 md:p-16 rounded-[64px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] border border-white/50 relative z-10 animate-in fade-in zoom-in-95 duration-1000">
        
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-28 h-28 bg-slate-900 rounded-[40px] shadow-2xl mb-10 transform hover:scale-105 transition-all duration-500">
            <ShieldCheck className="text-blue-500 w-14 h-14" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">Merchant Identity</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px] flex items-center justify-center">
            <Lock className="w-3 h-3 mr-2 text-blue-500" /> Secure Handshake Protocol
          </p>
        </div>

        {error && (
          <div className="mb-10 animate-in slide-in-from-top-4 duration-500">
            <div className={`p-8 rounded-[40px] border-2 flex flex-col gap-6 shadow-sm ${error.severity === 'critical' ? 'bg-red-50 border-red-100' : 'bg-amber-50 border-amber-100'}`}>
              <div className="flex gap-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${error.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                  {error.code === 'AUTH_OFFLINE' ? <WifiOff className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-black text-slate-900 mb-1">{error.message}</h3>
                    <button onClick={() => setError(null)} className="p-1 hover:bg-black/5 rounded-lg transition-colors">
                      <X className="w-4 h-4 text-slate-400" />
                    </button>
                  </div>
                  <p className="text-slate-600 text-sm font-medium mb-4 leading-relaxed">{error.action}</p>
                  <div className="flex flex-wrap gap-3">
                     <button 
                      onClick={() => setShowTroubleshoot(!showTroubleshoot)} 
                      className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-500 transition-all shadow-sm"
                     >
                        {showTroubleshoot ? "Hide Guide" : "Troubleshoot"}
                     </button>
                     <button 
                      onClick={() => initiateAuth('google')} 
                      className={`flex-1 px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-md ${error.severity === 'critical' ? 'bg-red-600 hover:bg-red-700' : 'bg-slate-900 hover:bg-black'}`}
                     >
                        <RefreshCw className="w-3 h-3 inline mr-2" /> Retry Connection
                     </button>
                  </div>
                </div>
              </div>

              {showTroubleshoot && (
                <div className="bg-white/60 p-6 rounded-3xl border border-white/50 space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Recommended Steps:</p>
                  <div className="space-y-3">
                    {getTroubleshootingSteps(error.code).map((step, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                          {step.icon}
                        </div>
                        <p className="text-xs font-bold text-slate-700">{step.text}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={runSystemCheck} 
                    className="w-full text-center py-2 text-[9px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                  >
                    Refresh Diagnostics
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-12">
          <div className="space-y-4">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Merchant Branding</label>
            <div className="relative group">
              <div className="absolute left-8 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <input 
                type="text" 
                placeholder="Business Name (Optional)"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                className="w-full pl-20 pr-8 py-8 bg-slate-50 border-2 border-transparent rounded-[32px] text-2xl font-black text-slate-900 focus:border-blue-600 focus:bg-white outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-4">
             <button onClick={() => setRememberMe(!rememberMe)} className="flex items-center group">
                <div className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${rememberMe ? 'bg-blue-600 border-blue-600' : 'border-slate-200 group-hover:border-blue-400'}`}>
                  {rememberMe && <Check className="w-5 h-5 text-white stroke-[3]" />}
                </div>
                <div className="ml-4 text-left">
                  <p className="text-xs font-black text-slate-900">Extend Session</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Keep identity active for 48h</p>
                </div>
             </button>
             <ShieldAlert className="w-5 h-5 text-slate-200" />
          </div>

          <div className="grid grid-cols-1 gap-4 pt-4">
            <button 
              onClick={() => initiateAuth('google')}
              disabled={!!isAuthenticating}
              className="group relative w-full bg-slate-900 text-white py-8 rounded-[36px] text-2xl font-black overflow-hidden hover:bg-black transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {isAuthenticating === 'google' ? (
                <div className="flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10" /></div>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="absolute left-8 w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Chrome className="w-8 h-8" /></div>
                  Connect via Google
                </div>
              )}
            </button>

            <button 
              onClick={() => initiateAuth('facebook')}
              disabled={!!isAuthenticating}
              className="group relative w-full bg-blue-50 text-blue-700 py-8 rounded-[36px] text-2xl font-black border-2 border-transparent hover:border-blue-200 transition-all transform active:scale-[0.98] disabled:opacity-50"
            >
              {isAuthenticating === 'facebook' ? (
                <div className="flex items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-600" /></div>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="absolute left-8 w-14 h-14 bg-blue-600/5 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform"><Facebook className="w-8 h-8 text-blue-600" /></div>
                  Connect via Facebook
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="mt-16 pt-10 border-t border-slate-50 text-center">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.4em] mb-4">Powered by ShopEase Grid Technology</p>
           <div className="flex items-center justify-center space-x-6 opacity-30 grayscale">
              <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-4" alt="Stripe" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_HiRes_Logo.png" className="h-4" alt="Google" />
              <img src="https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" className="h-4" alt="Meta" />
           </div>
        </div>
      </div>

      {showPortal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-500" onClick={() => setShowPortal(null)}></div>
          <div className="bg-white w-full max-w-lg rounded-[56px] shadow-4xl overflow-hidden relative animate-in zoom-in-95 duration-500">
            <div className="p-10 border-b border-slate-100 flex items-center space-x-6 bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg">
                   {showPortal === 'google' ? <Chrome className="w-10 h-10 text-blue-600" /> : <Facebook className="w-10 h-10 text-blue-700" />}
                </div>
                <div>
                   <h3 className="text-xl font-black text-slate-900 leading-tight">Identity Handshake</h3>
                   <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Provider: {showPortal.toUpperCase()}</p>
                </div>
            </div>
            
            <div className="p-14 text-center">
               <div className="w-24 h-24 bg-blue-600/5 rounded-full flex items-center justify-center mx-auto mb-10 relative">
                  <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-20"></div>
                  <MousePointer2 className="w-10 h-10 text-blue-600" />
               </div>
               <h2 className="text-3xl font-black text-slate-900 mb-6">Authorize Access</h2>
               <p className="text-slate-500 font-bold leading-relaxed mb-12">
                 ShopEase requires a standard API handshake to sync your {showPortal} business assets and customer data.
               </p>
               
               <div className="space-y-4">
                 <button onClick={handleGrantAccess} className="w-full bg-blue-600 text-white py-6 rounded-3xl text-xl font-black hover:bg-blue-700 transition-all shadow-xl active:scale-[0.97]">Securely Proceed</button>
                 <button onClick={() => setShowPortal(null)} className="w-full text-slate-400 py-2 font-black text-xs uppercase tracking-widest">Cancel Request</button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DiagnosticBadge: React.FC<{ icon: React.ReactNode, label: string, status?: boolean }> = ({ icon, label, status }) => (
  <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
    <div className={`${status ? 'text-green-500' : 'text-amber-500'} scale-75`}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4" })}
    </div>
    <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</span>
  </div>
);

export default Login;
