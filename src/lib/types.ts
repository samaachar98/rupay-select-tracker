// RuPay Select Tracker - Type Definitions

export type CycleType = 'monthly' | 'quarterly' | 'half-yearly' | 'yearly';

export type VoucherStatus = 'pending' | 'redeemed' | 'sold' | 'paused' | 'expired';

export type CardVariant = 'select' | 'platinum' | 'classic' | 'gold';

export interface Card {
  id: string;
  userId: string;
  bank: string;
  last4: string;
  variant: CardVariant;
  cardName?: string;
  issueDate?: string;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  notes?: string;
}

export interface Voucher {
  id: string;
  cardId: string;
  userId: string;
  name: string;
  description?: string;
  cycleType: CycleType;
  status: VoucherStatus;
  category?: VoucherCategory;
  value?: number;
  currency?: string;
  periods: VoucherPeriod[];
  createdAt: string;
  updatedAt: string;
  expiryDate?: string;
  reminderDays?: number;
  notes?: string;
}

export interface VoucherPeriod {
  id: string;
  voucherId: string;
  period: string;
  label: string;
  status: VoucherStatus;
  redeemedAt?: string;
  soldAt?: string;
  soldTo?: string;
  soldAmount?: number;
  expiryDate?: string;
  notes?: string;
}

export type VoucherCategory = 
  | 'lounge_access'
  | 'ott_subscription'
  | 'fitness'
  | 'dining'
  | 'shopping'
  | 'health'
  | 'travel'
  | 'golf'
  | 'concierge'
  | 'insurance'
  | 'entertainment'
  | 'other';

export interface VoucherCategoryInfo {
  id: VoucherCategory;
  name: string;
  icon: string;
  description: string;
  commonExamples: string[];
}

export const VOUCHER_CATEGORIES: VoucherCategoryInfo[] = [
  {
    id: 'lounge_access',
    name: 'Airport Lounge Access',
    icon: 'Plane',
    description: 'Complimentary domestic airport lounge visits',
    commonExamples: ['Domestic lounges', 'International lounges', 'Spa access']
  },
  {
    id: 'ott_subscription',
    name: 'OTT Subscriptions',
    icon: 'PlayCircle',
    description: 'Streaming platform subscriptions',
    commonExamples: ['Netflix', 'Amazon Prime', 'Disney+ Hotstar', 'SonyLIV', 'Zee5']
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    icon: 'Dumbbell',
    description: 'Gym memberships and wellness programs',
    commonExamples: ['Cult.fit', 'Gold\'s Gym', 'Yoga classes', 'Health checkups']
  },
  {
    id: 'dining',
    name: 'Dining & Restaurants',
    icon: 'Utensils',
    description: 'Discounts at partner restaurants',
    commonExamples: ['Swiggy Dineout', 'EazyDiner', 'Partner restaurants']
  },
  {
    id: 'shopping',
    name: 'Shopping Offers',
    icon: 'ShoppingBag',
    description: 'E-commerce and retail discounts',
    commonExamples: ['Amazon', 'Flipkart', 'Myntra', 'Brand vouchers']
  },
  {
    id: 'health',
    name: 'Health & Medical',
    icon: 'HeartPulse',
    description: 'Health checkups and medical benefits',
    commonExamples: ['Full body checkup', 'Doctor consultation', 'Pharmacy discounts']
  },
  {
    id: 'travel',
    name: 'Travel Benefits',
    icon: 'Plane',
    description: 'Hotel and travel booking discounts',
    commonExamples: ['Hotel bookings', 'Cab discounts', 'Bus/train offers']
  },
  {
    id: 'golf',
    name: 'Golf Privileges',
    icon: 'Target',
    description: 'Complimentary golf games and lessons',
    commonExamples: ['Green fee waiver', 'Golf lessons', 'Driving range']
  },
  {
    id: 'concierge',
    name: 'Concierge Services',
    icon: 'HeadphonesIcon',
    description: '24/7 lifestyle assistance',
    commonExamples: ['Travel planning', 'Gift assistance', 'Event bookings']
  },
  {
    id: 'insurance',
    name: 'Insurance Coverage',
    icon: 'Shield',
    description: 'Card-related insurance benefits',
    commonExamples: ['Purchase protection', 'Lost card liability', 'Baggage insurance']
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: 'Film',
    description: 'Movie tickets and events',
    commonExamples: ['BookMyShow', 'PVR', 'INOX', 'Event tickets']
  },
  {
    id: 'other',
    name: 'Other Benefits',
    icon: 'Gift',
    description: 'Miscellaneous card benefits',
    commonExamples: ['Fuel surcharge waiver', 'Reward points', 'Cashback']
  }
];

export const CYCLE_TYPES: { value: CycleType; label: string; periods: string[] }[] = [
  { value: 'monthly', label: 'Monthly (Jan-Dec)', periods: ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] },
  { value: 'quarterly', label: 'Quarterly (Q1-Q4)', periods: ['q1', 'q2', 'q3', 'q4'] },
  { value: 'half-yearly', label: 'Half-Yearly (H1-H2)', periods: ['h1', 'h2'] },
  { value: 'yearly', label: 'Yearly (Annual)', periods: ['yearly'] },
];

export const STATUS_CONFIG: Record<VoucherStatus, { label: string; color: string; bgColor: string; icon: string }> = {
  pending: { 
    label: 'Pending', 
    color: 'text-amber-700', 
    bgColor: 'bg-amber-100',
    icon: 'Clock'
  },
  redeemed: { 
    label: 'Redeemed', 
    color: 'text-emerald-700', 
    bgColor: 'bg-emerald-100',
    icon: 'CheckCircle2'
  },
  sold: { 
    label: 'Sold', 
    color: 'text-blue-700', 
    bgColor: 'bg-blue-100',
    icon: 'Banknote'
  },
  paused: { 
    label: 'Paused', 
    color: 'text-slate-700', 
    bgColor: 'bg-slate-100',
    icon: 'PauseCircle'
  },
  expired: { 
    label: 'Expired', 
    color: 'text-red-700', 
    bgColor: 'bg-red-100',
    icon: 'XCircle'
  },
};

export const BANK_LIST = [
  'Bank of Baroda',
  'Bank of India',
  'Canara Bank',
  'Central Bank of India',
  'HDFC Bank',
  'ICICI Bank',
  'Indian Bank',
  'Indian Overseas Bank',
  'Kotak Mahindra Bank',
  'Punjab National Bank',
  'State Bank of India',
  'Union Bank of India',
  'Axis Bank',
  'Yes Bank',
  'IDBI Bank',
  'UCO Bank',
  'Bank of Maharashtra',
  'Punjab & Sind Bank',
  'Other'
];

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
  preferences: {
    defaultCurrency: string;
    reminderEnabled: boolean;
    reminderDays: number;
  };
}

export interface DashboardStats {
  totalCards: number;
  activeCards: number;
  totalVouchers: number;
  vouchersByStatus: Record<VoucherStatus, number>;
  totalRedeemed: number;
  totalSold: number;
  estimatedValueRedeemed: number;
  estimatedValueSold: number;
  upcomingExpirations: number;
}