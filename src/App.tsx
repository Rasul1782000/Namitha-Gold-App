import React, { useState, useEffect, useCallback } from 'react';
import { 
  Coins, 
  TrendingUp, 
  Wallet, 
  History, 
  MapPin, 
  Gift, 
  User, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  Plus, 
  Minus,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Building,
  LogOut,
  Bell,
  Search,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  Copy,
  Filter,
  Calendar,
  Info,
  Lock,
  Globe,
  HelpCircle,
  FileText,
  ChevronDown,
  RefreshCw,
  ArrowRight,
  Package,
  Store,
  Trash2,
  Pause,
  Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import axios from 'axios';
import { cn } from './lib/utils';
import { GoogleGenAI } from "@google/genai";
import { gsap } from 'gsap';
import { Button as PrimeButton } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { PrimeReactProvider } from 'primereact/api';

// --- Types ---
type Screen = 'splash' | 'onboarding' | 'auth' | 'dashboard' | 'buy' | 'sell' | 'sip' | 'redeem' | 'history' | 'rewards' | 'locator' | 'profile' | 'kyc';

interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  gold_balance: number;
  wallet_balance: number;
  kyc_status: string;
}

interface Transaction {
  id: number;
  type: 'buy' | 'sell' | 'sip' | 'redeem' | 'reward';
  gold_amount: number;
  price: number;
  status: string;
  created_at: string;
}

interface SIP {
  id: number;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  next_date: string;
  status: 'active' | 'paused';
}

// --- Mock Data ---
const GOLD_HISTORY = [
  { date: '01 Mar', price: 6100 },
  { date: '02 Mar', price: 6150 },
  { date: '03 Mar', price: 6120 },
  { date: '04 Mar', price: 6200 },
  { date: '05 Mar', price: 6180 },
  { date: '06 Mar', price: 6250 },
  { date: '07 Mar', price: 6300 },
];

const ONBOARDING_SLIDES = [
  {
    title: "Invest in Digital Gold",
    desc: "Start your gold savings journey with as little as ₹10. 24K pure gold at your fingertips.",
    image: "https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=800",
    icon: <Coins className="w-16 h-16 text-[#D4AF37]" />
  },
  {
    title: "Secure Gold Storage",
    desc: "Your gold is stored in world-class insured vaults, fully secured and 100% transparent.",
    image: "https://images.unsplash.com/photo-1561414927-6d86591d0c4f?auto=format&fit=crop&q=80&w=800",
    icon: <ShieldCheck className="w-16 h-16 text-[#D4AF37]" />
  },
  {
    title: "Redeem Anytime",
    desc: "Convert your digital gold into physical coins or jewelry at Namitha Jewellers, Chennai.",
    image: "https://images.unsplash.com/photo-1610312278520-bcc893a3ff1d?auto=format&fit=crop&q=80&w=800",
    icon: <Sparkles className="w-16 h-16 text-[#D4AF37]" />
  }
];

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className, disabled }: any) => {
  const variants = {
    primary: 'bg-burgundy text-white hover:bg-burgundy-light shadow-md shadow-burgundy/10',
    secondary: 'bg-white text-burgundy border-2 border-burgundy hover:bg-burgundy/5',
    gold: 'bg-gold text-white hover:bg-[#B8962F] shadow-md shadow-gold/10',
    dark: 'bg-black text-white hover:bg-gray-900',
    ghost: 'bg-transparent text-burgundy hover:bg-burgundy/10'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full py-3 rounded-lg font-bold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 uppercase tracking-wider text-xs",
        variants[variant as keyof typeof variants],
        className
      )}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className }: any) => (
  <div className={cn("bg-white rounded-xl p-4 shadow-lg border border-gray-100", className)}>
    {children}
  </div>
);

const Input = ({ label, type = "text", value, onChange, placeholder, icon: Icon }: any) => (
  <div className="space-y-1">
    {label && <label className="text-[10px] font-bold text-burgundy uppercase tracking-widest ml-1">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-burgundy/40" />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full bg-white border-2 border-gray-100 rounded-lg py-3 px-3 focus:outline-none focus:ring-2 focus:ring-burgundy/5 focus:border-burgundy transition-all font-medium text-sm",
          Icon && "pl-10"
        )}
      />
    </div>
  </div>
);

// --- Main App ---

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

  // --- Screens ---

  const SplashScreen = () => (
    <div className="h-full bg-burgundy flex flex-col items-center justify-center text-center p-8">
      <div className="mb-8 splash-logo">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(212,175,55,0.4)] border-4 border-gold">
          <Coins className="w-12 h-12 text-burgundy" />
        </div>
      </div>
      <h1 className="text-2xl font-serif font-bold text-gold mb-2 tracking-widest uppercase splash-text">
        NAMITHA JEWELLERS
      </h1>
      <p className="text-white/80 font-medium tracking-widest text-[10px] uppercase splash-text">
        Save Gold. Secure Future.
      </p>
    </div>
  );

  const OnboardingScreen = () => (
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

  const AuthScreen = () => (
    <div className="h-full bg-white flex flex-col overflow-y-auto">
      {/* Hero Header */}
      <div className="h-64 relative shrink-0">
        <img 
          src="https://images.unsplash.com/photo-1610312278520-bcc893a3ff1d?auto=format&fit=crop&q=80&w=1200" 
          alt="Gold Jewelry"
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-burgundy/40 backdrop-blur-[2px]" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 mb-4">
            <Coins className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white tracking-widest uppercase">
            Namitha Jewellers
          </h1>
        </div>
      </div>

      <div className="flex-1 p-8 -mt-8 bg-white rounded-t-[32px] relative z-10 space-y-8">
        <div>
          <h2 className="text-3xl font-serif font-bold text-burgundy mb-2">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-500 font-medium text-sm">
            {authMode === 'login' ? 'Access your premium gold holdings' : 'Join thousands of smart gold investors'}
          </p>
        </div>

        <div className="space-y-5">
          {authMode === 'signup' && (
            <Input label="Full Name" placeholder="Enter your name" value={name} onChange={(e: any) => setName(e.target.value)} icon={User} />
          )}
          <Input label="Email Address" type="email" placeholder="name@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} icon={Bell} />
          {authMode === 'signup' && (
            <Input label="Phone Number" placeholder="98765 43210" value={phone} onChange={(e: any) => setPhone(e.target.value)} icon={Smartphone} />
          )}
          <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} icon={ShieldCheck} />
        </div>

        <div className="space-y-4 pt-4">
          <Button onClick={handleAuth} disabled={loading}>
            {loading ? 'Processing...' : authMode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
          
          {authMode === 'login' && (
            <button 
              onClick={() => {
                setEmail('test@example.com');
                setPassword('password123');
              }}
              className="w-full py-3 text-xs font-bold text-burgundy/60 uppercase tracking-widest hover:text-burgundy transition-colors"
            >
              Use Demo Credentials
            </button>
          )}

          <div className="pt-4 text-center">
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="text-sm font-bold text-gray-500 uppercase tracking-widest"
            >
              {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
              <span className="text-burgundy underline decoration-gold decoration-2 underline-offset-4">
                {authMode === 'login' ? 'Register' : 'Login'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const DashboardScreen = () => {
    useEffect(() => {
      const card = document.querySelector(".spotlight-card");
      if (card) {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          gsap.to(".spotlight", {
            x,
            y,
            duration: 0.2,
            ease: "power2.out"
          });
        };
        card.addEventListener("mousemove", handleMouseMove as any);
        return () => card.removeEventListener("mousemove", handleMouseMove as any);
      }
    }, []);

    return (
      <div className="h-full bg-[#FDFCF0]/30 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-burgundy px-5 py-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-gold/30">
            <User className="w-5 h-5 text-gold" />
          </div>
          <div>
            <p className="text-[8px] text-gold font-bold uppercase tracking-widest">Premium Member</p>
            <p className="text-base font-serif font-bold text-white">{user?.name || 'User'}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gold border border-gold/20">
            <Bell className="w-4 h-4" />
          </button>
          <button onClick={() => setScreen('profile')} className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center text-gold border border-gold/20">
            <User className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-24">
        {/* Live Gold Price Section - Compact */}
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <h3 className="text-[9px] font-bold text-burgundy uppercase tracking-widest">Market Overview</h3>
            <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">LIVE</span>
          </div>
          <Card className="bg-white border-2 border-burgundy/10 p-0 overflow-hidden relative spotlight-card shadow-md h-40">
            <img 
              src="https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=800" 
              alt="Gold Market" 
              className="absolute inset-0 w-full h-full object-cover opacity-10"
              referrerPolicy="no-referrer"
            />
            <div className="spotlight absolute w-40 h-40 bg-burgundy/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
            <div className="p-4 flex justify-between items-center relative z-10">
              <div>
                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">24K Gold Price</p>
                <div className="flex items-baseline gap-1.5">
                  <h2 className="text-2xl font-serif font-bold text-burgundy">₹{goldPrice.toLocaleString()}</h2>
                  <span className="text-[10px] font-bold text-gray-400">/ g</span>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-600 font-bold text-xs justify-end">
                  <TrendingUp className="w-3 h-3" />
                  +₹45.20
                </div>
              </div>
            </div>
            <div className="h-16 -mx-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GOLD_HISTORY}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#600000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#600000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="price" stroke="#600000" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Featured Collection - NEW HD IMAGES */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-[9px] font-bold text-burgundy uppercase tracking-widest">Featured Collection</h3>
            <button className="text-[8px] font-bold text-burgundy underline uppercase tracking-widest">Explore</button>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
            {[
              { title: "Bridal Gold", img: "https://images.unsplash.com/photo-1631116618155-607d2e572142?auto=format&fit=crop&q=80&w=400" },
              { title: "Gold Coins", img: "https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=400" },
              { title: "Temple Jewelry", img: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400" }
            ].map((item, i) => (
              <div key={i} className="shrink-0 w-40 space-y-2">
                <div className="h-48 rounded-2xl overflow-hidden shadow-md border border-burgundy/5">
                  <img 
                    src={item.img} 
                    alt={item.title} 
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-[10px] font-bold text-burgundy uppercase tracking-widest text-center">{item.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Portfolio Section - Compact */}
        <div className="space-y-2">
          <h3 className="text-[9px] font-bold text-burgundy uppercase tracking-widest">My Portfolio</h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="bg-burgundy border-none text-white p-4 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mb-1">
                <Coins className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-[8px] font-bold text-gold uppercase tracking-widest">Gold Balance</p>
                <h4 className="text-lg font-bold">{user?.gold_balance.toFixed(4)} g</h4>
              </div>
            </Card>
            <Card className="bg-gold border-none text-white p-4 flex flex-col justify-between h-28">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center mb-1">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[8px] font-bold text-white/80 uppercase tracking-widest">Total Value</p>
                <h4 className="text-lg font-bold">₹{((user?.gold_balance || 0) * goldPrice).toLocaleString()}</h4>
              </div>
            </Card>
          </div>
        </div>

        {/* Action Grid - Compact */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => setScreen('buy')} className="bg-white p-4 rounded-xl border-2 border-gray-100 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-all group">
            <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
              <Plus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-burgundy uppercase tracking-widest">Buy Gold</span>
          </button>
          <button onClick={() => setScreen('sell')} className="bg-white p-4 rounded-xl border-2 border-gray-100 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-all group">
            <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
              <Minus className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-burgundy uppercase tracking-widest">Sell Gold</span>
          </button>
          <button onClick={() => setScreen('sip')} className="bg-white p-4 rounded-xl border-2 border-gray-100 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-all group">
            <div className="w-10 h-10 bg-burgundy/5 rounded-full flex items-center justify-center text-burgundy group-hover:bg-burgundy/10 transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-burgundy uppercase tracking-widest">Gold SIP</span>
          </button>
          <button onClick={() => setScreen('redeem')} className="bg-white p-4 rounded-xl border-2 border-gray-100 flex flex-col items-center gap-2 shadow-sm active:scale-95 transition-all group">
            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center text-gold group-hover:bg-gold/20 transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-burgundy uppercase tracking-widest">Redeem</span>
          </button>
        </div>

        {/* Promotional Banner - HD IMAGE */}
        <div className="relative h-32 rounded-2xl overflow-hidden shadow-lg group cursor-pointer">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" 
            alt="Promotion" 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-burgundy/80 to-transparent flex flex-col justify-center p-6">
            <p className="text-[8px] font-bold text-gold uppercase tracking-widest mb-1">Limited Offer</p>
            <h4 className="text-white font-serif font-bold text-lg leading-tight">Get 0.5% Extra Gold<br/>on your first SIP</h4>
          </div>
        </div>

        {/* AI Advisor - Compact */}
        <div className="bg-burgundy p-4 rounded-xl text-white relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="w-16 h-16" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 bg-gold rounded-full flex items-center justify-center">
                <Sparkles className="w-2.5 h-2.5 text-burgundy" />
              </div>
              <h4 className="text-[8px] font-extrabold text-gold uppercase tracking-widest">AI Market Insight</h4>
            </div>
            <p className="text-xs font-medium leading-relaxed italic">
              "{aiInsight}"
            </p>
          </div>
        </div>

        {/* SIP Plans - Compact */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-[9px] font-bold text-burgundy uppercase tracking-widest">Active SIP Plans</h3>
            <button onClick={() => setScreen('sip')} className="text-[8px] font-bold text-burgundy underline uppercase tracking-widest">View All</button>
          </div>
          {activeSips.length > 0 ? (
            activeSips.slice(0, 1).map(sip => (
              <Card key={sip.id} className="p-3 border-l-4 border-l-gold">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-burgundy/5 rounded-full flex items-center justify-center text-burgundy">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-burgundy capitalize">{sip.frequency} Savings</p>
                      <p className="text-[8px] text-gray-500 font-bold uppercase">Next: {sip.next_date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-burgundy">₹{sip.amount.toLocaleString()}</p>
                    <p className="text-[8px] text-emerald-600 font-bold uppercase">{sip.status}</p>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-4 text-center border-dashed border-2 border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase">No active SIPs</p>
              <button onClick={() => setScreen('sip')} className="text-[10px] text-burgundy font-bold underline mt-1 uppercase tracking-widest">Start Saving</button>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Nav - Compact */}
      <div className="bg-white border-t-2 border-gray-100 px-6 py-3 flex justify-between items-center fixed bottom-0 left-0 right-0 max-w-md mx-auto shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        <button onClick={() => setScreen('dashboard')} className="flex flex-col items-center gap-0.5 text-burgundy">
          <TrendingUp className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Home</span>
        </button>
        <button onClick={() => setScreen('history')} className="flex flex-col items-center gap-0.5 text-gray-300 hover:text-burgundy transition-colors">
          <History className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">History</span>
        </button>
        <button onClick={() => setScreen('rewards')} className="flex flex-col items-center gap-0.5 text-gray-300 hover:text-burgundy transition-colors">
          <Gift className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Rewards</span>
        </button>
        <button onClick={() => setScreen('profile')} className="flex flex-col items-center gap-0.5 text-gray-300 hover:text-burgundy transition-colors">
          <User className="w-5 h-5" />
          <span className="text-[8px] font-black uppercase tracking-widest">Profile</span>
        </button>
      </div>
    </div>
  );
};

  const BuyGoldScreen = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50 bg-white sticky top-0 z-20">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-serif font-bold text-burgundy">Buy Digital Gold</h2>
      </div>
      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl group">
          <img 
            src="https://images.unsplash.com/photo-1610312278520-bcc893a3ff1d?auto=format&fit=crop&q=80&w=800" 
            alt="Gold Bullion" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-burgundy/40 to-transparent flex flex-col justify-end p-6">
            <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">Live Buying Price</p>
            <h3 className="text-3xl font-serif font-bold text-white">₹{goldPrice.toLocaleString()} <span className="text-xs font-bold text-gold/60">/ g</span></h3>
          </div>
        </div>

        <div className="space-y-6">
          <Input 
            label="Investment Amount (₹)" 
            placeholder="Min ₹10" 
            value={buyAmount} 
            onChange={(e: any) => setBuyAmount(e.target.value)} 
            icon={CreditCard}
          />
          
          <div className="flex justify-between items-center p-5 bg-burgundy/5 rounded-2xl border-2 border-burgundy/10">
            <span className="text-xs font-bold text-burgundy uppercase tracking-widest">Estimated Gold</span>
            <span className="text-xl font-bold text-burgundy">
              {buyAmount ? (Number(buyAmount) / goldPrice).toFixed(4) : '0.0000'} g
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-xs font-bold text-burgundy uppercase tracking-widest">Quick Select</p>
            <div className="grid grid-cols-3 gap-3">
              {[500, 1000, 5000].map((amt) => (
                <button 
                  key={amt} 
                  onClick={() => setBuyAmount(amt.toString())}
                  className="py-3 rounded-xl border-2 border-gray-100 text-sm font-bold text-gray-600 hover:border-burgundy hover:text-burgundy hover:bg-burgundy/5 transition-all"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-burgundy uppercase tracking-widest">Secure Payment</h4>
          <div className="space-y-3">
            {[
              { id: 'upi', label: 'UPI (PhonePe, GPay)', icon: Smartphone },
              { id: 'card', label: 'Debit / Credit Card', icon: CreditCard },
              { id: 'net', label: 'Net Banking', icon: Building },
            ].map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border-2 border-gray-50 rounded-2xl hover:border-burgundy cursor-pointer group transition-all bg-white shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-burgundy/5 rounded-xl flex items-center justify-center text-burgundy">
                    <method.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{method.label}</span>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-burgundy" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 border-t-2 border-gray-50">
        <Button onClick={handleBuy} disabled={loading || !buyAmount}>
          {loading ? 'Processing...' : `Securely Pay ₹${buyAmount || '0'}`}
        </Button>
      </div>
    </div>
  );

  const SellGoldScreen = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50 bg-white sticky top-0 z-20">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-serif font-bold text-burgundy">Sell Digital Gold</h2>
      </div>
      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl group">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" 
            alt="Sell Gold" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-orange-600/40 to-transparent flex flex-col justify-end p-6">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">Live Selling Price</p>
            <h3 className="text-3xl font-serif font-bold text-white">₹{(goldPrice * 0.97).toLocaleString()} <span className="text-xs font-bold text-white/60">/ g</span></h3>
            <p className="text-[8px] text-white/60 mt-1">* 3% spread applied for processing</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Balance</span>
            <span className="text-sm font-bold text-burgundy">{user?.gold_balance.toFixed(4)} g</span>
          </div>
          
          <Input 
            label="Sell Amount (₹)" 
            placeholder="Min ₹100" 
            value={sellAmount} 
            onChange={(e: any) => setSellAmount(e.target.value)} 
            icon={Wallet}
          />
          
          <div className="flex justify-between items-center p-5 bg-orange-50 rounded-2xl border-2 border-orange-100">
            <span className="text-xs font-bold text-orange-800 uppercase tracking-widest">Gold to Deduct</span>
            <span className="text-xl font-bold text-orange-800">
              {sellAmount ? (Number(sellAmount) / (goldPrice * 0.97)).toFixed(4) : '0.0000'} g
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-burgundy uppercase tracking-widest">Credit To</h4>
          <div className="p-4 border-2 border-burgundy rounded-2xl bg-burgundy/5 flex items-center gap-4">
            <div className="w-10 h-10 bg-burgundy rounded-xl flex items-center justify-center text-white">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-burgundy">HDFC Bank **** 4321</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase">Primary Account</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-burgundy ml-auto" />
          </div>
        </div>
      </div>
      <div className="p-6 border-t-2 border-gray-50">
        <Button onClick={handleSell} disabled={loading || !sellAmount} variant="secondary">
          {loading ? 'Processing...' : `Sell & Credit ₹${sellAmount || '0'}`}
        </Button>
      </div>
    </div>
  );

  const SIPGoldScreen = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50 bg-white sticky top-0 z-20">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-serif font-bold text-burgundy">Gold SIP</h2>
      </div>
      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl group">
          <img 
            src="https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=800" 
            alt="Gold SIP" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-600 via-emerald-600/40 to-transparent flex flex-col justify-end p-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Total SIP Investment</p>
                <h3 className="text-2xl font-serif font-bold text-white">₹12,500</h3>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold text-emerald-100 uppercase tracking-widest">Active Plans</p>
                <p className="text-sm font-bold text-white">{activeSips.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-burgundy uppercase tracking-widest">Active Plans</h4>
          {activeSips.map(sip => (
            <div key={sip.id} className="bg-white p-5 rounded-2xl border-2 border-gray-50 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-burgundy">₹{sip.amount.toLocaleString()} <span className="text-[10px] text-gray-400 font-bold uppercase">/ {sip.frequency}</span></p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Next: {sip.next_date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-gray-400 hover:text-burgundy"><Pause className="w-4 h-4" /></button>
                <button className="p-2 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-burgundy/5 p-6 rounded-3xl border-2 border-dashed border-burgundy/20 space-y-4">
          <h4 className="text-sm font-bold text-burgundy">Start New SIP</h4>
          <Input 
            label="Monthly Amount" 
            placeholder="Min ₹500" 
            value={sipAmount} 
            onChange={(e: any) => setSipAmount(e.target.value)} 
            icon={Plus}
          />
          <div className="grid grid-cols-3 gap-2">
            {(['daily', 'weekly', 'monthly'] as const).map(freq => (
              <button 
                key={freq}
                onClick={() => setSipFrequency(freq)}
                className={cn(
                  "py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest border-2 transition-all",
                  sipFrequency === freq ? "bg-burgundy border-burgundy text-white" : "bg-white border-gray-100 text-gray-400"
                )}
              >
                {freq}
              </button>
            ))}
          </div>
          <Button onClick={handleCreateSIP} disabled={loading || !sipAmount}>Setup SIP</Button>
        </div>
      </div>
    </div>
  );

  const RedeemGoldScreen = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50 bg-white sticky top-0 z-20">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-serif font-bold text-burgundy">Redeem Gold</h2>
      </div>
      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl group">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=800" 
            alt="Gold Redemption" 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gold via-gold/40 to-transparent flex flex-col justify-end p-6">
            <p className="text-[10px] font-bold text-white/80 uppercase tracking-widest mb-1">Available for Redemption</p>
            <h3 className="text-3xl font-serif font-bold text-white">{user?.gold_balance.toFixed(4)} g</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="bg-white p-6 rounded-3xl border-2 border-gray-50 shadow-sm hover:border-burgundy transition-all text-center space-y-3 group overflow-hidden relative">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
              <img src="https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=200" alt="Coins" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-burgundy/5 rounded-2xl flex items-center justify-center text-burgundy mx-auto group-hover:bg-burgundy group-hover:text-white transition-colors">
                <Package className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-burgundy uppercase tracking-widest mt-3">Physical Coins</p>
              <p className="text-[8px] text-gray-400 font-bold uppercase">Doorstep Delivery</p>
            </div>
          </button>
          
          <button className="bg-white p-6 rounded-3xl border-2 border-gray-50 shadow-sm hover:border-burgundy transition-all text-center space-y-3 group overflow-hidden relative">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity">
              <img src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=200" alt="Jewelry" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-burgundy/5 rounded-2xl flex items-center justify-center text-burgundy mx-auto group-hover:bg-burgundy group-hover:text-white transition-colors">
                <Store className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-burgundy uppercase tracking-widest mt-3">Jewelry</p>
              <p className="text-[8px] text-gray-400 font-bold uppercase">At Store Outlet</p>
            </div>
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-bold text-burgundy uppercase tracking-widest">Popular Coins</h4>
          <div className="space-y-3">
            {[
              { weight: '1g', type: '24K Gold Coin', price: '₹6,800', img: 'https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=100' },
              { weight: '2g', type: '24K Gold Coin', price: '₹13,500', img: 'https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=100' },
              { weight: '5g', type: '24K Gold Bar', price: '₹33,200', img: 'https://images.unsplash.com/photo-1589750670744-dc9633e0f633?auto=format&fit=crop&q=80&w=100' },
            ].map((item, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border-2 border-gray-50 flex items-center justify-between shadow-sm group hover:border-gold transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-100">
                    <img src={item.img} alt={item.type} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-burgundy">{item.weight} {item.type}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Making charges: ₹450</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-burgundy">{item.price}</p>
                  <button className="text-[10px] font-black text-gold uppercase tracking-widest mt-1">Select</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const HistoryScreen = () => {
    const [filter, setFilter] = useState('all');
    
    const filteredTransactions = transactions.filter(tx => 
      filter === 'all' ? true : tx.type === filter
    );

    const stats = {
      totalBought: transactions.reduce((acc, tx) => tx.type === 'buy' ? acc + tx.gold_amount : acc, 0),
      totalSold: transactions.reduce((acc, tx) => tx.type === 'sell' ? acc + tx.gold_amount : acc, 0),
      currentBalance: user?.gold_balance || 0,
      investmentValue: (user?.gold_balance || 0) * goldPrice
    };

    return (
      <div className="h-full bg-[#FDFCF0]/30 flex flex-col">
        <div className="bg-white px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50">
          <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
          <h2 className="text-xl font-serif font-bold text-burgundy">Transaction History</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto pb-28">
          {/* Investment Summary */}
          <div className="p-6 grid grid-cols-2 gap-3">
            <div className="bg-white p-4 rounded-2xl border-2 border-gray-50 shadow-sm">
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Bought</p>
              <p className="text-sm font-bold text-burgundy">{stats.totalBought.toFixed(4)} g</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border-2 border-gray-50 shadow-sm">
              <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Sold</p>
              <p className="text-sm font-bold text-burgundy">{stats.totalSold.toFixed(4)} g</p>
            </div>
            <div className="bg-burgundy p-4 rounded-2xl shadow-md col-span-2 flex justify-between items-center">
              <div>
                <p className="text-[8px] font-bold text-gold/60 uppercase tracking-widest mb-1">Current Value</p>
                <p className="text-lg font-bold text-white">₹{stats.investmentValue.toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p className="text-[8px] font-bold text-gold/60 uppercase tracking-widest mb-1">Balance</p>
                <p className="text-lg font-bold text-gold">{stats.currentBalance.toFixed(4)} g</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="px-6 mb-4 flex gap-2 overflow-x-auto no-scrollbar">
            {['all', 'buy', 'sell', 'sip', 'reward'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all shrink-0 border-2",
                  filter === f 
                    ? "bg-burgundy border-burgundy text-white shadow-md" 
                    : "bg-white border-gray-100 text-gray-400 hover:border-burgundy/20"
                )}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Transaction List */}
          <div className="px-6 space-y-3">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((tx) => (
                <div key={tx.id} className="bg-white p-4 rounded-2xl border-2 border-gray-50 flex items-center justify-between shadow-sm hover:border-burgundy/20 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                      tx.type === 'buy' ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100" : "bg-orange-50 text-orange-600 group-hover:bg-orange-100"
                    )}>
                      {tx.type === 'buy' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-burgundy capitalize">{tx.type} Gold</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">{new Date(tx.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-burgundy">₹{(tx.gold_amount * tx.price).toLocaleString()}</p>
                    <p className="text-[10px] text-emerald-600 font-bold">{tx.gold_amount.toFixed(4)} g</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                  <History className="w-8 h-8" />
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No transactions found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const StoreLocatorScreen = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-100 bg-white sticky top-0 z-20">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold">Store Locator</h2>
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
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

  const RewardsScreen = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white px-6 py-6 flex items-center gap-4 border-b-2 border-gray-50 bg-white sticky top-0 z-20">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2 text-burgundy"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-serif font-bold text-burgundy">Rewards</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto pb-28">
        {/* Rewards Balance */}
        <div className="p-6">
          <div className="relative h-48 rounded-3xl overflow-hidden shadow-xl group">
            <img 
              src="https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800" 
              alt="Rewards" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-burgundy via-burgundy/40 to-transparent flex flex-col justify-end p-6">
              <p className="text-[10px] font-bold text-gold uppercase tracking-widest mb-1">Reward Gold Earned</p>
              <div className="flex items-baseline gap-2 mb-2">
                <h3 className="text-3xl font-serif font-bold text-white">0.2500</h3>
                <span className="text-xs font-bold text-gold">g</span>
              </div>
              <div className="flex items-center gap-2 text-gold/80">
                <TrendingUp className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-widest">Value: ₹1,550</span>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Program */}
        <div className="px-6 space-y-4">
          <div className="bg-white p-6 rounded-3xl border-2 border-burgundy/10 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-burgundy/5 rounded-2xl flex items-center justify-center text-burgundy">
                <Share2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-burgundy">Invite & Earn Free Gold</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Get 0.1g for every referral</p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-2xl flex items-center justify-between border border-gray-100">
              <span className="text-sm font-mono font-bold text-burgundy">NAMITHA100</span>
              <button className="text-burgundy hover:bg-burgundy/5 p-2 rounded-lg transition-colors">
                <Copy className="w-5 h-5" />
              </button>
            </div>
            
            <Button className="w-full py-4 text-sm font-bold">Share Referral Link</Button>
          </div>
        </div>

        {/* Campaigns */}
        <div className="p-6 space-y-4">
          <p className="text-xs font-bold text-burgundy uppercase tracking-widest ml-1">Active Offers</p>
          <div className="bg-emerald-50 p-5 rounded-3xl border-2 border-emerald-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-900">Festival Bonus</h4>
              <p className="text-[10px] text-emerald-700 font-bold uppercase">Buy ₹5000+ get 0.02g free</p>
            </div>
          </div>
        </div>

        {/* Reward History */}
        <div className="px-6 space-y-4">
          <p className="text-xs font-bold text-burgundy uppercase tracking-widest ml-1">Reward History</p>
          <div className="space-y-3">
            {[
              { type: 'Referral Bonus', amount: '0.1000 g', date: '10 Mar 2024' },
              { type: 'Festival Offer', amount: '0.0500 g', date: '08 Mar 2024' },
              { type: 'Signup Bonus', amount: '0.1000 g', date: '01 Mar 2024' },
            ].map((reward, i) => (
              <div key={i} className="bg-white p-4 rounded-2xl border-2 border-gray-50 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-burgundy/5 rounded-xl flex items-center justify-center text-burgundy">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-burgundy">{reward.type}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">{reward.date}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-emerald-600">+{reward.amount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ProfileScreen = () => (
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
            {screen === 'onboarding' && <OnboardingScreen />}
            {screen === 'auth' && <AuthScreen />}
            {screen === 'dashboard' && <DashboardScreen />}
            {screen === 'buy' && <BuyGoldScreen />}
            {screen === 'sell' && <SellGoldScreen />}
            {screen === 'sip' && <SIPGoldScreen />}
            {screen === 'redeem' && <RedeemGoldScreen />}
            {screen === 'history' && <HistoryScreen />}
            {screen === 'rewards' && <RewardsScreen />}
            {screen === 'locator' && <StoreLocatorScreen />}
            {screen === 'profile' && <ProfileScreen />}
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
      </div>
    </div>
    </PrimeReactProvider>
  );
}
