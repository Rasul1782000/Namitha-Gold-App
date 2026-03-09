import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import axios from 'axios';
import { GoogleGenAI } from "@google/genai";
import { gsap } from 'gsap';
import { PrimeReactProvider } from 'primereact/api';
import { Sparkles } from 'lucide-react';

// Types
import { Screen, UserData, Transaction, SIP } from './types';

// Components
import { Button } from './components/common/Button';
import { SplashScreen } from './components/screens/SplashScreen';
import { OnboardingScreen } from './components/screens/OnboardingScreen';
import { AuthScreen } from './components/screens/AuthScreen';
import { DashboardScreen } from './components/screens/DashboardScreen';
import { BuyGoldScreen } from './components/screens/BuyGoldScreen';
import { SellGoldScreen } from './components/screens/SellGoldScreen';
import { SIPGoldScreen } from './components/screens/SIPGoldScreen';
import { RedeemGoldScreen } from './components/screens/RedeemGoldScreen';
import { HistoryScreen } from './components/screens/HistoryScreen';
import { RewardsScreen } from './components/screens/RewardsScreen';
import { StoreLocatorScreen } from './components/screens/StoreLocatorScreen';
import { ProfileScreen } from './components/screens/ProfileScreen';
import { Navbar } from './components/common/Navbar';

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [user, setUser] = useState<UserData | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [goldPrice, setGoldPrice] = useState(6245.50);
  const [loading, setLoading] = useState(false);
  const [onboardingIdx, setOnboardingIdx] = useState(0);
  const [aiInsight, setAiInsight] = useState("Analyzing market trends... Gold remains a safe haven asset.");

  // Auth States
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Transaction States
  const [buyAmount, setBuyAmount] = useState('');
  const [sellAmount, setSellAmount] = useState('');
  const [sipAmount, setSipAmount] = useState('');
  const [sipFrequency, setSipFrequency] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeSips, setActiveSips] = useState<SIP[]>([
    { id: 1, amount: 2500, frequency: 'monthly', next_date: '2024-04-01', status: 'active' }
  ]);

  const fetchProfile = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch (err) {
      console.error(err);
      setToken(null);
      localStorage.removeItem('token');
      setScreen('auth');
    }
  }, [token]);

  const fetchTransactions = useCallback(async () => {
    if (!token) return;
    try {
      const res = await axios.get('/api/transactions', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  const fetchGoldPrice = async () => {
    try {
      const res = await axios.get('/api/gold/price');
      setGoldPrice(res.data.price);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAIInsight = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Provide a very brief (max 20 words) professional investment insight for digital gold in India today. Current price: ₹${goldPrice}/g. Mention if it's a good time to buy or hold.`,
      });
      if (response.text) {
        setAiInsight(response.text.trim());
      }
    } catch (err) {
      console.error("AI Insight Error:", err);
    }
  };

  useEffect(() => {
    if (screen === 'splash') {
      gsap.fromTo(".splash-logo", { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.2, ease: "back.out(1.7)" });
      gsap.fromTo(".splash-text", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.6, stagger: 0.2 });
      
      setTimeout(() => {
        if (token) {
          setScreen('dashboard');
        } else {
          setScreen('onboarding');
        }
      }, 2500);
    }
  }, [screen, token]);

  useEffect(() => {
    if (token) {
      fetchProfile();
      fetchTransactions();
    }
    fetchGoldPrice();
    fetchAIInsight();
    const interval = setInterval(() => {
      fetchGoldPrice();
    }, 30000);
    return () => clearInterval(interval);
  }, [token, fetchProfile, fetchTransactions]);

  const handleAuth = async () => {
    setLoading(true);
    try {
      const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const payload = authMode === 'login' ? { email, password } : { name, email, phone, password };
      const res = await axios.post(endpoint, payload);
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setScreen('dashboard');
    } catch (err: any) {
      alert(err.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!buyAmount || isNaN(Number(buyAmount))) return;
    setLoading(true);
    try {
      const grams = Number(buyAmount) / goldPrice;
      await axios.post('/api/gold/buy', {
        amount: Number(buyAmount),
        goldGrams: grams,
        price: goldPrice
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      await fetchProfile();
      await fetchTransactions();
      setScreen('dashboard');
      setBuyAmount('');
    } catch (err) {
      alert('Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSell = async () => {
    if (!sellAmount || isNaN(Number(sellAmount))) return;
    setLoading(true);
    try {
      const grams = Number(sellAmount) / (goldPrice * 0.97);
      if (user && user.gold_balance < grams) {
        alert('Insufficient gold balance');
        setLoading(false);
        return;
      }
      // Mock API call simulation
      setTimeout(async () => {
        await fetchProfile();
        await fetchTransactions();
        setScreen('dashboard');
        setSellAmount('');
        setLoading(false);
      }, 1000);
    } catch (err) {
      alert('Sale failed');
      setLoading(false);
    }
  };

  const handleCreateSIP = async () => {
    if (!sipAmount || isNaN(Number(sipAmount))) return;
    setLoading(true);
    setTimeout(() => {
      const newSip: SIP = {
        id: Date.now(),
        amount: Number(sipAmount),
        frequency: sipFrequency,
        next_date: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        status: 'active'
      };
      setActiveSips([...activeSips, newSip]);
      setSipAmount('');
      setScreen('dashboard');
      setLoading(false);
    }, 1000);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUser(null);
    setScreen('auth');
  };

  return (
    <PrimeReactProvider>
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-0 sm:p-4">
        <div className="w-full max-w-md h-screen sm:h-[850px] bg-white sm:rounded-[3rem] shadow-2xl overflow-hidden relative border-[8px] border-black">
          {/* Notch simulation */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-black rounded-b-2xl z-50 hidden sm:block" />
          
          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              {screen === 'splash' && <SplashScreen />}
              {screen === 'onboarding' && (
                <OnboardingScreen 
                  onboardingIdx={onboardingIdx} 
                  setOnboardingIdx={setOnboardingIdx} 
                  setScreen={setScreen} 
                />
              )}
              {screen === 'auth' && (
                <AuthScreen 
                  authMode={authMode}
                  setAuthMode={setAuthMode}
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  name={name}
                  setName={setName}
                  phone={phone}
                  setPhone={setPhone}
                  handleAuth={handleAuth}
                  loading={loading}
                />
              )}
              {screen === 'dashboard' && (
                <DashboardScreen 
                  user={user}
                  goldPrice={goldPrice}
                  setScreen={setScreen}
                  aiInsight={aiInsight}
                  activeSips={activeSips}
                />
              )}
              {screen === 'buy' && (
                <BuyGoldScreen 
                  setScreen={setScreen}
                  goldPrice={goldPrice}
                  buyAmount={buyAmount}
                  setBuyAmount={setBuyAmount}
                  handleBuy={handleBuy}
                  loading={loading}
                />
              )}
              {screen === 'sell' && (
                <SellGoldScreen 
                  setScreen={setScreen}
                  goldPrice={goldPrice}
                  user={user}
                  sellAmount={sellAmount}
                  setSellAmount={setSellAmount}
                  handleSell={handleSell}
                  loading={loading}
                />
              )}
              {screen === 'sip' && (
                <SIPGoldScreen 
                  setScreen={setScreen}
                  activeSips={activeSips}
                  sipAmount={sipAmount}
                  setSipAmount={setSipAmount}
                  sipFrequency={sipFrequency}
                  setSipFrequency={setSipFrequency}
                  handleCreateSIP={handleCreateSIP}
                  loading={loading}
                />
              )}
              {screen === 'redeem' && (
                <RedeemGoldScreen 
                  setScreen={setScreen}
                  user={user}
                />
              )}
              {screen === 'history' && (
                <HistoryScreen 
                  setScreen={setScreen}
                  transactions={transactions}
                  user={user}
                  goldPrice={goldPrice}
                />
              )}
              {screen === 'rewards' && (
                <RewardsScreen 
                  setScreen={setScreen}
                />
              )}
              {screen === 'locator' && (
                <StoreLocatorScreen 
                  setScreen={setScreen}
                />
              )}
              {screen === 'profile' && (
                <ProfileScreen 
                  setScreen={setScreen}
                  user={user}
                  logout={logout}
                />
              )}
              {['kyc'].includes(screen) && (
                <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center text-[#D4AF37]">
                    <Sparkles className="w-10 h-10" />
                  </div>
                  <h2 className="text-2xl font-bold capitalize">{screen} Gold</h2>
                  <p className="text-gray-500">This feature is coming soon in the next update!</p>
                  <Button onClick={() => setScreen('dashboard')}>Back to Dashboard</Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {['dashboard', 'history', 'rewards', 'locator', 'profile'].includes(screen) && (
            <Navbar currentScreen={screen} setScreen={setScreen} />
          )}
        </div>
      </div>
    </PrimeReactProvider>
  );
}
