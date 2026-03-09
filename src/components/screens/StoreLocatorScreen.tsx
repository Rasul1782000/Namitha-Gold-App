import React from 'react';
import { ArrowLeft, MapPin, Clock, Smartphone } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Screen } from '../../types';

interface StoreLocatorScreenProps {
  setScreen: (screen: Screen) => void;
}

export const StoreLocatorScreen = ({
  setScreen
}: StoreLocatorScreenProps) => (
  <div className="h-full bg-white flex flex-col">
    <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-100 bg-white sticky top-0 z-20">
      <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2"><ArrowLeft className="w-6 h-6" /></button>
      <h2 className="text-xl font-bold">Store Locator</h2>
    </div>
    <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-28">
      <div className="h-64 rounded-3xl overflow-hidden relative shadow-xl">
        <img 
          src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" 
          alt="Namitha Jewellers Store" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy/60 to-transparent" />
        <div className="absolute bottom-6 left-6 flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
            <MapPin className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-white">Chennai Flagship</h3>
            <p className="text-[10px] text-gold font-bold uppercase tracking-widest">Main Branch</p>
          </div>
        </div>
      </div>

      <Card className="border-2 border-[#D4AF37]/20">
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Namitha Jewellers</h3>
              <p className="text-sm text-gray-500">Main Branch - Perungudi</p>
            </div>
            <div className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg text-xs font-bold">Open Now</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">No. 42, OMR Road, Perungudi, Chennai, Tamil Nadu 600096</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <p className="text-sm text-gray-600">10:00 AM - 09:00 PM</p>
            </div>
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-gray-400" />
              <p className="text-sm text-gray-600">+91 44 2496 1234</p>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button className="flex-1 py-3 text-sm">Get Directions</Button>
            <Button variant="secondary" className="flex-1 py-3 text-sm">Call Store</Button>
          </div>
        </div>
      </Card>
    </div>
  </div>
);
