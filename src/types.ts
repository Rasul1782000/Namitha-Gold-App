export type Screen = 'splash' | 'onboarding' | 'auth' | 'dashboard' | 'buy' | 'sell' | 'sip' | 'redeem' | 'history' | 'rewards' | 'locator' | 'profile' | 'schemes' | 'kyc' | 'refer' | 'transaction' | 'withdraw';

export interface UserData {
  id: number;
  name: string;
  email: string;
  phone: string;
  gold_balance: number;
  wallet_balance: number;
  kyc_status: string;
}

export interface Transaction {
  id: number;
  type: 'buy' | 'sell' | 'sip' | 'redeem' | 'reward';
  gold_amount: number;
  price: number;
  status: string;
  created_at: string;
}

export interface SIP {
  id: number;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  next_date: string;
  status: 'active' | 'paused';
}
