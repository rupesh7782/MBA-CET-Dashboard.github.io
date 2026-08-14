import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../common/Modal';
import { 
  Cloud, LogIn, LogOut, CheckCircle2, AlertCircle, RefreshCw, 
  Database, ShieldCheck, User as UserIcon, Sparkles, Wifi, WifiOff 
} from 'lucide-react';

export const CloudSyncModal: React.FC = () => {
  const { 
    isSyncModalOpen, 
    setIsSyncModalOpen, 
    currentUser, 
    isCloudSyncing, 
    lastSyncedAt, 
    isOnline, 
    signInWithGoogle, 
    signInGuest, 
    signOutUser,
    syncToCloudNow,
    loadFromCloudNow
  } = useApp();

  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  if (!isSyncModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsLoadingAuth(true);
    await signInWithGoogle();
    setIsLoadingAuth(false);
  };

  const handleGuestSignIn = async () => {
    setIsLoadingAuth(true);
    await signInGuest();
    setIsLoadingAuth(false);
  };

  const handleSignOut = async () => {
    setIsLoadingAuth(true);
    await signOutUser();
    setIsLoadingAuth(false);
  };

  return (
    <Modal isOpen={isSyncModalOpen} onClose={() => setIsSyncModalOpen(false)} title="Cloud Database & Realtime Sync">
      <div className="space-y-6 text-sm text-gray-200">
        
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-br from-amber-500/10 via-black to-emerald-500/5 border border-amber-500/30 rounded-2xl p-4 sm:p-5 relative overflow-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Database className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white flex items-center space-x-2">
                  <span>Firebase Firestore Cloud DB</span>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Live
                  </span>
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">
                  Your study records, mocks, formulas, goals & logs sync to the cloud automatically.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center space-x-2">
              {isOnline ? (
                <span className="flex items-center space-x-1.5 text-emerald-400">
                  <Wifi className="w-3.5 h-3.5" />
                  <span className="font-semibold">Online & Connected</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1.5 text-rose-400">
                  <WifiOff className="w-3.5 h-3.5" />
                  <span className="font-semibold">Offline Mode (Cached Locally)</span>
                </span>
              )}
            </div>

            <div className="text-[11px] text-gray-400 font-mono">
              {lastSyncedAt ? (
                <span>Last Cloud Sync: {new Date(lastSyncedAt).toLocaleTimeString()}</span>
              ) : (
                <span>Sync pending...</span>
              )}
            </div>
          </div>
        </div>

        {/* User Account / Status Section */}
        {currentUser ? (
          <div className="bg-[#0b0b0f] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-emerald-400 overflow-hidden bg-white/10 flex items-center justify-center">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="Avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <UserIcon className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <div>
                  <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block">Logged In User</span>
                  <h5 className="font-bold text-white text-sm">
                    {currentUser.displayName || (currentUser.isAnonymous ? 'Guest Aspirant (Cloud ID)' : currentUser.email || 'Cloud User')}
                  </h5>
                  <p className="text-[11px] text-gray-400 font-mono mt-0.5">UID: {currentUser.uid.slice(0, 12)}...</p>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                disabled={isLoadingAuth}
                className="px-3 py-1.5 bg-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 text-gray-300 hover:text-rose-300 border border-white/15 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-xl p-3.5 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-300">Firestore Real-time sync is actively protecting your study progress.</span>
              </div>
              <button
                onClick={syncToCloudNow}
                disabled={isCloudSyncing}
                className="px-3 py-1.5 bg-amber-500 text-black font-bold rounded-lg text-xs hover:bg-amber-400 flex items-center space-x-1.5 transition-all cursor-pointer flex-shrink-0"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isCloudSyncing ? 'animate-spin' : ''}`} />
                <span>{isCloudSyncing ? 'Syncing...' : 'Sync Now'}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#0b0b0f] border border-white/10 rounded-2xl p-5 space-y-4">
            <div>
              <h5 className="font-bold text-white text-sm flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Connect your Account for Cloud Persistence</span>
              </h5>
              <p className="text-xs text-gray-400 mt-1">
                Sign in with Google to access your entire MBA CET workspace from any device, laptop, or phone at any time.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoadingAuth}
                className="w-full py-3 px-4 bg-white text-black font-bold rounded-xl text-xs hover:bg-gray-200 flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg shadow-white/5"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={handleGuestSignIn}
                disabled={isLoadingAuth}
                className="w-full py-3 px-4 bg-white/10 text-white font-bold rounded-xl text-xs hover:bg-white/15 border border-white/15 flex items-center justify-center space-x-2 transition-all cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-amber-400" />
                <span>Anonymous Cloud Guest</span>
              </button>
            </div>
          </div>
        )}

        {/* Cloud Architecture Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-black/40 border border-white/10 rounded-xl">
            <h6 className="font-bold text-amber-400 mb-1">Automatic Sync</h6>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Every mock score, study hour, note, and goal you save is stored online in real-time.
            </p>
          </div>
          <div className="p-3 bg-black/40 border border-white/10 rounded-xl">
            <h6 className="font-bold text-emerald-400 mb-1">Multi-Device</h6>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Log in on GitHub Pages, mobile browser, or laptop and your progress restores instantly.
            </p>
          </div>
          <div className="p-3 bg-black/40 border border-white/10 rounded-xl">
            <h6 className="font-bold text-sky-400 mb-1">Encrypted & Safe</h6>
            <p className="text-gray-400 text-[11px] leading-relaxed">
              Protected by Firestore user-isolated security rules so only you can access your data.
            </p>
          </div>
        </div>

      </div>
    </Modal>
  );
};
