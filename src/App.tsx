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
  Sparkles
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
  type: 'buy' | 'sell' | 'sip' | 'redeem';
  gold_amount: number;
  price: number;
  status: string;
  created_at: string;
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
    icon: <Coins className="w-16 h-16 text-[#D4AF37]" />
  },
  {
    title: "Secure Gold Storage",
    desc: "Your gold is stored in world-class insured vaults, fully secured and 100% transparent.",
    icon: <ShieldCheck className="w-16 h-16 text-[#D4AF37]" />
  },
  {
    title: "Redeem Anytime",
    desc: "Convert your digital gold into physical coins or jewelry at Namitha Jewellers, Chennai.",
    icon: <Sparkles className="w-16 h-16 text-[#D4AF37]" />
  }
];

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className, disabled }: any) => {
  const variants = {
    primary: 'bg-[#D4AF37] text-white hover:bg-[#B8962F]',
    secondary: 'bg-white text-[#D4AF37] border border-[#D4AF37] hover:bg-gray-50',
    dark: 'bg-black text-white hover:bg-gray-900',
    ghost: 'bg-transparent text-[#D4AF37] hover:bg-gold/10'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "w-full py-4 rounded-2xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100",
        variants[variant as keyof typeof variants],
        className
      )}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className }: any) => (
  <div className={cn("bg-white rounded-3xl p-6 shadow-sm border border-gray-100", className)}>
    {children}
  </div>
);

const Input = ({ label, type = "text", value, onChange, placeholder, icon: Icon }: any) => (
  <div className="space-y-2">
    {label && <label className="text-sm font-medium text-gray-600 ml-1">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 px-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 focus:border-[#D4AF37] transition-all",
          Icon && "pl-12"
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

  // Auth States
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Transaction States
  const [buyAmount, setBuyAmount] = useState('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

  useEffect(() => {
    if (screen === 'splash') {
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
    const interval = setInterval(fetchGoldPrice, 30000);
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

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setUser(null);
    setScreen('auth');
  };

  // --- Screens ---

  const SplashScreen = () => (
    <div className="h-full bg-black flex flex-col items-center justify-center text-center p-8">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-8"
      >
        <div className="w-24 h-24 bg-[#D4AF37] rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(212,175,55,0.3)]">
          <Coins className="w-12 h-12 text-white" />
        </div>
      </motion.div>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-3xl font-bold text-[#D4AF37] mb-2 tracking-tight"
      >
        NAMITHA JEWELLERS
      </motion.h1>
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-gray-400 font-medium"
      >
        Save Gold. Secure Future.
      </motion.p>
      <div className="absolute bottom-12">
        <div className="w-12 h-1 bg-[#D4AF37]/20 rounded-full overflow-hidden">
          <motion.div 
            initial={{ x: -48 }}
            animate={{ x: 48 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="w-12 h-full bg-[#D4AF37]"
          />
        </div>
      </div>
    </div>
  );

  const OnboardingScreen = () => (
    <div className="h-full bg-white flex flex-col p-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={onboardingIdx}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            className="space-y-8"
          >
            <div className="flex justify-center">{ONBOARDING_SLIDES[onboardingIdx].icon}</div>
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-gray-900">{ONBOARDING_SLIDES[onboardingIdx].title}</h2>
              <p className="text-gray-500 leading-relaxed px-4">{ONBOARDING_SLIDES[onboardingIdx].desc}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="space-y-6">
        <div className="flex justify-center gap-2">
          {ONBOARDING_SLIDES.map((_, i) => (
            <div key={i} className={cn("h-2 rounded-full transition-all", i === onboardingIdx ? "w-8 bg-[#D4AF37]" : "w-2 bg-gray-200")} />
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
    <div className="h-full bg-white flex flex-col p-8 overflow-y-auto">
      <div className="mb-12 mt-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-500">
          {authMode === 'login' ? 'Login to manage your gold investments' : 'Join Namitha DigiGold today'}
        </p>
      </div>

      <div className="space-y-6 flex-1">
        {authMode === 'signup' && (
          <Input label="Full Name" placeholder="John Doe" value={name} onChange={(e: any) => setName(e.target.value)} icon={User} />
        )}
        <Input label="Email Address" type="email" placeholder="john@example.com" value={email} onChange={(e: any) => setEmail(e.target.value)} icon={Bell} />
        {authMode === 'signup' && (
          <Input label="Phone Number" placeholder="+91 98765 43210" value={phone} onChange={(e: any) => setPhone(e.target.value)} icon={Smartphone} />
        )}
        <Input label="Password" type="password" placeholder="••••••••" value={password} onChange={(e: any) => setPassword(e.target.value)} icon={ShieldCheck} />
      </div>

      <div className="mt-12 space-y-4">
        <Button onClick={handleAuth} disabled={loading}>
          {loading ? 'Processing...' : authMode === 'login' ? 'Login' : 'Sign Up'}
        </Button>
        <button 
          onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          className="w-full text-center text-sm font-medium text-gray-500"
        >
          {authMode === 'login' ? "Don't have an account? " : "Already have an account? "}
          <span className="text-[#D4AF37]">
            {authMode === 'login' ? 'Sign Up' : 'Login'}
          </span>
        </button>
      </div>
    </div>
  );

  const DashboardScreen = () => (
    <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-[#D4AF37]" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Welcome,</p>
            <p className="text-sm font-bold text-gray-900">{user?.name || 'User'}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
            <Bell className="w-5 h-5" />
          </button>
          <button onClick={() => setScreen('profile')} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400">
            <User className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        {/* Gold Price Card */}
        <Card className="bg-gradient-to-br from-black to-gray-800 text-white border-none p-0 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-gray-400 text-sm font-medium mb-1">Live 24K Gold Price</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-bold">₹{goldPrice.toLocaleString()}</h2>
                  <span className="text-xs text-gray-400">/ gram</span>
                </div>
              </div>
              <div className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold">
                <TrendingUp className="w-3 h-3" />
                +0.45%
              </div>
            </div>
            
            <div className="h-32 -mx-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GOLD_HISTORY}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="price" stroke="#D4AF37" fillOpacity={1} fill="url(#colorPrice)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Wallet Card */}
        <Card className="relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Wallet className="w-24 h-24 text-[#D4AF37]" />
          </div>
          <div className="relative">
            <p className="text-sm font-medium text-gray-500 mb-4">Your Gold Balance</p>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center">
                <Coins className="w-6 h-6 text-[#D4AF37]" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{user?.gold_balance.toFixed(4)} g</h3>
                <p className="text-sm text-emerald-600 font-semibold">≈ ₹{(user?.gold_balance || 0 * goldPrice).toLocaleString()}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button onClick={() => setScreen('buy')} className="py-3 text-sm">Buy Gold</Button>
              <Button onClick={() => setScreen('sell')} variant="secondary" className="py-3 text-sm">Sell Gold</Button>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4">
          {[
            { icon: TrendingUp, label: 'SIP', screen: 'sip' },
            { icon: Sparkles, label: 'Redeem', screen: 'redeem' },
            { icon: History, label: 'History', screen: 'history' },
            { icon: MapPin, label: 'Store', screen: 'locator' },
          ].map((action, i) => (
            <button 
              key={i} 
              onClick={() => setScreen(action.screen as Screen)}
              className="flex flex-col items-center gap-2"
            >
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center text-[#D4AF37]">
                <action.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-gray-600">{action.label}</span>
            </button>
          ))}
        </div>

        {/* AI Advisor */}
        <Card className="bg-[#D4AF37]/5 border-[#D4AF37]/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-[#D4AF37] rounded-xl flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-1">AI Gold Advisor</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Gold price dropped 2% today. Historically, this is a strong entry point for long-term savings.
              </p>
            </div>
          </div>
        </Card>

        {/* Recent Transactions */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-gray-900">Recent Transactions</h3>
            <button onClick={() => setScreen('history')} className="text-sm font-bold text-[#D4AF37]">See All</button>
          </div>
          <div className="space-y-3">
            {transactions.slice(0, 3).map((tx) => (
              <div key={tx.id} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center",
                    tx.type === 'buy' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
                  )}>
                    {tx.type === 'buy' ? <ArrowDownRight className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 capitalize">{tx.type} Gold</p>
                    <p className="text-xs text-gray-500">{new Date(tx.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">₹{(tx.gold_amount * tx.price).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{tx.gold_amount.toFixed(4)} g</p>
                </div>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-center text-gray-400 py-4 text-sm">No transactions yet</p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-100 px-8 py-4 flex justify-between items-center fixed bottom-0 left-0 right-0 max-w-md mx-auto">
        <button onClick={() => setScreen('dashboard')} className="flex flex-col items-center gap-1 text-[#D4AF37]">
          <TrendingUp className="w-6 h-6" />
          <span className="text-[10px] font-bold">Home</span>
        </button>
        <button onClick={() => setScreen('history')} className="flex flex-col items-center gap-1 text-gray-400">
          <History className="w-6 h-6" />
          <span className="text-[10px] font-bold">History</span>
        </button>
        <button onClick={() => setScreen('rewards')} className="flex flex-col items-center gap-1 text-gray-400">
          <Gift className="w-6 h-6" />
          <span className="text-[10px] font-bold">Rewards</span>
        </button>
        <button onClick={() => setScreen('profile')} className="flex flex-col items-center gap-1 text-gray-400">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold">Profile</span>
        </button>
      </div>
    </div>
  );

  const BuyGoldScreen = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold">Buy Gold</h2>
      </div>
      <div className="flex-1 p-6 space-y-8 overflow-y-auto">
        <Card className="bg-[#D4AF37]/5 border-[#D4AF37]/20 text-center">
          <p className="text-sm text-gray-500 mb-1">Current Buying Price</p>
          <h3 className="text-2xl font-bold text-[#D4AF37]">₹{goldPrice.toLocaleString()} <span className="text-sm font-normal text-gray-400">/ gram</span></h3>
        </Card>

        <div className="space-y-6">
          <Input 
            label="Enter Amount (₹)" 
            placeholder="Min ₹10" 
            value={buyAmount} 
            onChange={(e: any) => setBuyAmount(e.target.value)} 
            icon={CreditCard}
          />
          
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
            <span className="text-sm font-medium text-gray-500">You will get</span>
            <span className="text-lg font-bold text-gray-900">
              {buyAmount ? (Number(buyAmount) / goldPrice).toFixed(4) : '0.0000'} g
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-sm font-bold text-gray-900">Quick Amounts</p>
            <div className="grid grid-cols-3 gap-3">
              {[500, 1000, 5000].map((amt) => (
                <button 
                  key={amt} 
                  onClick={() => setBuyAmount(amt.toString())}
                  className="py-3 rounded-xl border border-gray-200 text-sm font-bold hover:border-[#D4AF37] hover:text-[#D4AF37] transition-colors"
                >
                  ₹{amt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-bold text-gray-900">Payment Method</h4>
          <div className="space-y-3">
            {[
              { id: 'upi', label: 'UPI (PhonePe, Google Pay)', icon: Smartphone },
              { id: 'card', label: 'Debit / Credit Card', icon: CreditCard },
              { id: 'net', label: 'Net Banking', icon: Building },
            ].map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-2xl hover:border-[#D4AF37] cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-[#D4AF37]">
                    <method.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-gray-700">{method.label}</span>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-gray-200 group-hover:border-[#D4AF37]" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 border-t border-gray-100">
        <Button onClick={handleBuy} disabled={loading || !buyAmount}>
          {loading ? 'Processing...' : `Pay ₹${buyAmount || '0'}`}
        </Button>
      </div>
    </div>
  );

  const HistoryScreen = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold">Transaction History</h2>
      </div>
      <div className="flex-1 p-6 space-y-4 overflow-y-auto pb-24">
        {transactions.map((tx) => (
          <div key={tx.id} className="bg-white p-5 rounded-3xl border border-gray-100 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                tx.type === 'buy' ? "bg-emerald-50 text-emerald-600" : "bg-orange-50 text-orange-600"
              )}>
                {tx.type === 'buy' ? <ArrowDownRight className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
              </div>
              <div>
                <p className="font-bold text-gray-900 capitalize">{tx.type} Gold</p>
                <p className="text-xs text-gray-500 font-medium">{new Date(tx.created_at).toLocaleString()}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-900">₹{(tx.gold_amount * tx.price).toLocaleString()}</p>
              <p className="text-xs text-emerald-600 font-bold">{tx.gold_amount.toFixed(4)} g</p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-500 uppercase">Success</span>
              </div>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
              <History className="w-10 h-10" />
            </div>
            <p className="text-gray-500 font-medium">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );

  const StoreLocatorScreen = () => (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold">Store Locator</h2>
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-y-auto">
        <div className="h-64 bg-gray-100 rounded-3xl overflow-hidden relative">
          <img 
            src="https://picsum.photos/seed/chennai-map/800/600" 
            alt="Map" 
            className="w-full h-full object-cover opacity-50"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <MapPin className="w-12 h-12 text-[#D4AF37] fill-[#D4AF37]/20 animate-bounce" />
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/20 rounded-full blur-[2px]" />
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

  const ProfileScreen = () => (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-gray-100">
        <button onClick={() => setScreen('dashboard')} className="p-2 -ml-2"><ArrowLeft className="w-6 h-6" /></button>
        <h2 className="text-xl font-bold">My Profile</h2>
      </div>
      <div className="flex-1 p-6 space-y-6 overflow-y-auto pb-24">
        <div className="flex flex-col items-center py-6">
          <div className="w-24 h-24 bg-white rounded-full p-1 shadow-md border border-gray-100 mb-4">
            <div className="w-full h-full bg-[#D4AF37]/10 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-[#D4AF37]" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
          <p className="text-sm text-gray-500">{user?.email}</p>
          <div className="mt-4 bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            KYC Verified
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase ml-4 mb-2">Account Settings</p>
          {[
            { icon: User, label: 'Personal Information' },
            { icon: ShieldCheck, label: 'KYC Verification', status: 'Verified' },
            { icon: Building, label: 'Bank Account Details' },
            { icon: Bell, label: 'Notifications' },
          ].map((item, i) => (
            <button key={i} className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-gray-700">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.status && <span className="text-xs font-bold text-emerald-500">{item.status}</span>}
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <p className="text-xs font-bold text-gray-400 uppercase ml-4 mb-2">Support</p>
          {[
            { icon: Bell, label: 'Help & Support' },
            { icon: ShieldCheck, label: 'Terms & Conditions' },
          ].map((item, i) => (
            <button key={i} className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-bold text-gray-700">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300" />
            </button>
          ))}
        </div>

        <Button variant="secondary" onClick={logout} className="text-red-500 border-red-100 hover:bg-red-50">
          <div className="flex items-center justify-center gap-2">
            <LogOut className="w-5 h-5" />
            Logout
          </div>
        </Button>
      </div>
    </div>
  );

  return (
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
            {screen === 'history' && <HistoryScreen />}
            {screen === 'locator' && <StoreLocatorScreen />}
            {screen === 'profile' && <ProfileScreen />}
            {['sell', 'sip', 'redeem', 'rewards'].includes(screen) && (
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
  );
}
