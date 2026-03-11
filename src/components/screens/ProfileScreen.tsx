import React from 'react';
import { ArrowLeft, User, CheckCircle2, ShieldCheck, Building, ChevronRight, Lock, Bell, Globe, HelpCircle, FileText, LogOut } from 'lucide-react';
import { Button } from '../common/Button';
import { UserData, Screen } from '../../types';

interface ProfileScreenProps {
  setScreen: (screen: Screen) => void;
  user: UserData | null;
  logout: () => void;
}

export const ProfileScreen = ({
  setScreen,
  user,
  logout
}: ProfileScreenProps) => (
  <div className="h-full bg-bg text-white flex flex-col">
    <div className="px-6 py-6 flex items-center gap-4 sticky top-0 z-20 bg-bg/95 backdrop-blur-sm">
      <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-gold"><ArrowLeft className="w-6 h-6" /></button>
      <h2 className="text-xl font-display font-bold text-white">My Profile</h2>
    </div>
    <div className="flex-1 p-6 space-y-8 overflow-y-auto pb-28">
      {/* User Info Card */}
      <div className="flex flex-col items-center py-4">
        <div className="w-20 h-20 bg-surface rounded-full p-1 shadow-lg border-2 border-gold/30 mb-4 relative">
          <div className="w-full h-full bg-bg rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-gold" />
          </div>
          <div className="absolute bottom-0 right-0 bg-green-600 text-white p-1 rounded-full border-2 border-bg">
            <CheckCircle2 className="w-3 h-3" />
          </div>
        </div>
        <h3 className="text-lg font-display font-bold text-white">{user?.name}</h3>
        <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{user?.email}</p>
        <div className="mt-3 bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 border border-green-900/50">
          <ShieldCheck className="w-3 h-3" />
          KYC Verified
        </div>
      </div>

      {/* Account Sections */}
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest ml-1">Account Settings</p>
          {[
            { icon: User, label: 'Personal Information', desc: 'Name, Email, Phone' },
            { icon: Building, label: 'Bank Account Details', desc: 'For withdrawals & selling', status: 'Linked' },
            { icon: ShieldCheck, label: 'KYC Verification', desc: 'Aadhaar & PAN details', status: 'Verified' },
          ].map((item, i) => (
            <button key={i} className="w-full bg-surface p-4 rounded-2xl flex items-center justify-between border border-gold/20 shadow-lg hover:border-gold/40 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-white">{item.label}</span>
                  <span className="block text-[8px] text-text-muted font-bold uppercase">{item.desc}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.status && <span className="text-[8px] font-bold text-green-400 uppercase tracking-widest">{item.status}</span>}
                <ChevronRight className="w-4 h-4 text-text-muted" />
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest ml-1">Security & App</p>
          {[
            { icon: Lock, label: 'Security Settings', desc: 'Password, Biometric, 2FA' },
            { icon: Bell, label: 'Notifications', desc: 'Price alerts, Transaction updates' },
            { icon: Globe, label: 'Language', desc: 'English (India)' },
          ].map((item, i) => (
            <button key={i} className="w-full bg-surface p-4 rounded-2xl flex items-center justify-between border border-gold/20 shadow-lg hover:border-gold/40 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-white">{item.label}</span>
                  <span className="block text-[8px] text-text-muted font-bold uppercase">{item.desc}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest ml-1">Support & Legal</p>
          {[
            { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs, Live Chat, Contact' },
            { icon: FileText, label: 'Terms & Policies', desc: 'Privacy, Storage, T&C' },
          ].map((item, i) => (
            <button key={i} className="w-full bg-surface p-4 rounded-2xl flex items-center justify-between border border-gold/20 shadow-lg hover:border-gold/40 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-white">{item.label}</span>
                  <span className="block text-[8px] text-text-muted font-bold uppercase">{item.desc}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted" />
            </button>
          ))}
        </div>
      </div>

      <button onClick={logout} className="w-full bg-red-900/20 border border-red-900/50 text-red-400 py-4 rounded-2xl mt-4 flex items-center justify-center gap-2 hover:bg-red-900/30 transition-colors">
        <LogOut className="w-5 h-5" />
        <span className="font-bold uppercase tracking-widest text-[10px]">Logout Account</span>
      </button>
    </div>
  </div>
);
