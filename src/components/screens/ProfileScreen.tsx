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
  <div className="h-full bg-gray-50 flex flex-col">
    <div className="bg-white px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50">
      <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
      <h2 className="text-xl font-serif font-bold text-burgundy">My Profile</h2>
    </div>
    <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-28">
      {/* User Info Card */}
      <div className="flex flex-col items-center py-4">
        <div className="w-20 h-20 bg-white rounded-full p-1 shadow-md border-2 border-burgundy/10 mb-4 relative">
          <div className="w-full h-full bg-burgundy/5 rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-burgundy" />
          </div>
          <div className="absolute bottom-0 right-0 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
            <CheckCircle2 className="w-3 h-3" />
          </div>
        </div>
        <h3 className="text-lg font-bold text-burgundy">{user?.name}</h3>
        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{user?.email}</p>
        <div className="mt-3 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
          <ShieldCheck className="w-3 h-3" />
          KYC Verified
        </div>
      </div>

      {/* Account Sections */}
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Account Settings</p>
          {[
            { icon: User, label: 'Personal Information', desc: 'Name, Email, Phone' },
            { icon: Building, label: 'Bank Account Details', desc: 'For withdrawals & selling', status: 'Linked' },
            { icon: ShieldCheck, label: 'KYC Verification', desc: 'Aadhaar & PAN details', status: 'Verified' },
          ].map((item, i) => (
            <button key={i} className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border-2 border-gray-50 shadow-sm hover:border-burgundy/10 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-burgundy/5 rounded-xl flex items-center justify-center text-burgundy group-hover:bg-burgundy/10 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-burgundy">{item.label}</span>
                  <span className="block text-[8px] text-gray-400 font-bold uppercase">{item.desc}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {item.status && <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">{item.status}</span>}
                <ChevronRight className="w-4 h-4 text-gray-300" />
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Security & App</p>
          {[
            { icon: Lock, label: 'Security Settings', desc: 'Password, Biometric, 2FA' },
            { icon: Bell, label: 'Notifications', desc: 'Price alerts, Transaction updates' },
            { icon: Globe, label: 'Language', desc: 'English (India)' },
          ].map((item, i) => (
            <button key={i} className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border-2 border-gray-50 shadow-sm hover:border-burgundy/10 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-burgundy/5 rounded-xl flex items-center justify-center text-burgundy group-hover:bg-burgundy/10 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-burgundy">{item.label}</span>
                  <span className="block text-[8px] text-gray-400 font-bold uppercase">{item.desc}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-1">Support & Legal</p>
          {[
            { icon: HelpCircle, label: 'Help & Support', desc: 'FAQs, Live Chat, Contact' },
            { icon: FileText, label: 'Terms & Policies', desc: 'Privacy, Storage, T&C' },
          ].map((item, i) => (
            <button key={i} className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border-2 border-gray-50 shadow-sm hover:border-burgundy/10 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-burgundy/5 rounded-xl flex items-center justify-center text-burgundy group-hover:bg-burgundy/10 transition-colors">
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <span className="block text-xs font-bold text-burgundy">{item.label}</span>
                  <span className="block text-[8px] text-gray-400 font-bold uppercase">{item.desc}</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      <Button variant="secondary" onClick={logout} className="text-red-500 border-red-100 hover:bg-red-50 py-4 mt-4">
        <div className="flex items-center justify-center gap-2">
          <LogOut className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest text-[10px]">Logout Account</span>
        </div>
      </Button>
    </div>
  </div>
);
