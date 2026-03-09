import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../common/Button';
import { ONBOARDING_SLIDES } from '../../constants';
import { cn } from '../../lib/utils';
import { Screen } from '../../types';

interface OnboardingScreenProps {
  onboardingIdx: number;
  setOnboardingIdx: (idx: number) => void;
  setScreen: (screen: Screen) => void;
}

export const OnboardingScreen = ({ onboardingIdx, setOnboardingIdx, setScreen }: OnboardingScreenProps) => (
  <div className="h-full bg-white flex flex-col overflow-hidden">
    <div className="flex-1 relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={onboardingIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <img 
            src={ONBOARDING_SLIDES[onboardingIdx].image} 
            alt={ONBOARDING_SLIDES[onboardingIdx].title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute bottom-0 left-0 right-0 p-8 text-center space-y-4">
        <motion.div
          key={`text-${onboardingIdx}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <h2 className="text-3xl font-serif font-bold text-burgundy">{ONBOARDING_SLIDES[onboardingIdx].title}</h2>
          <p className="text-gray-600 leading-relaxed font-medium">{ONBOARDING_SLIDES[onboardingIdx].desc}</p>
        </motion.div>
      </div>
    </div>

    <div className="p-8 space-y-6 bg-white">
      <div className="flex justify-center gap-2">
        {ONBOARDING_SLIDES.map((_, i) => (
          <div key={i} className={cn("h-1.5 rounded-full transition-all", i === onboardingIdx ? "w-10 bg-burgundy" : "w-3 bg-gray-200")} />
        ))}
      </div>
      <Button onClick={() => {
        if (onboardingIdx < ONBOARDING_SLIDES.length - 1) {
          setOnboardingIdx(onboardingIdx + 1);
        } else {
          setScreen('auth');
        }
      }}>
        {onboardingIdx === ONBOARDING_SLIDES.length - 1 ? "Get Started" : "Next"}
      </Button>
    </div>
  </div>
);
