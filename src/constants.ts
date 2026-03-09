import React from 'react';
import { Coins, ShieldCheck, Sparkles } from 'lucide-react';

export const GOLD_HISTORY = [
  { date: '01 Mar', price: 6100 },
  { date: '02 Mar', price: 6150 },
  { date: '03 Mar', price: 6120 },
  { date: '04 Mar', price: 6200 },
  { date: '05 Mar', price: 6180 },
  { date: '06 Mar', price: 6250 },
  { date: '07 Mar', price: 6300 },
];

export const ONBOARDING_SLIDES = [
  {
    title: "Invest in Digital Gold",
    desc: "Start your gold savings journey with as little as ₹10. 24K pure gold at your fingertips.",
    image: "https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=800",
    icon: React.createElement(Coins, { className: "w-16 h-16 text-[#D4AF37]" })
  },
  {
    title: "Secure Gold Storage",
    desc: "Your gold is stored in world-class insured vaults, fully secured and 100% transparent.",
    image: "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?auto=format&fit=crop&q=80&w=800",
    icon: React.createElement(ShieldCheck, { className: "w-16 h-16 text-[#D4AF37]" })
  },
  {
    title: "Redeem Anytime",
    desc: "Convert your digital gold into physical coins or jewelry at Namitha Jewellers, Chennai.",
    image: "https://images.unsplash.com/photo-1610312278520-bcc893a3ff1d?auto=format&fit=crop&q=80&w=800",
    icon: React.createElement(Sparkles, { className: "w-16 h-16 text-[#D4AF37]" })
  }
];

export const FEATURED_COLLECTION = [
  { 
    title: "Bridal Gold", 
    img: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&q=80&w=400" 
  },
  { 
    title: "Gold Coins", 
    img: "https://images.unsplash.com/photo-1610312278520-bcc893a3ff1d?auto=format&fit=crop&q=80&w=400" 
  },
  { 
    title: "Temple Jewelry", 
    img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400" 
  }
];
