import { VOUCHER_CATEGORIES } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Plane, 
  PlayCircle, 
  Dumbbell, 
  Utensils, 
  ShoppingBag, 
  HeartPulse, 
  Target, 
  HeadphonesIcon, 
  Shield, 
  Film, 
  Gift,
  Crown,
  CheckCircle2
} from 'lucide-react'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Plane,
  PlayCircle,
  Dumbbell,
  Utensils,
  ShoppingBag,
  HeartPulse,
  Target,
  HeadphonesIcon,
  Shield,
  Film,
  Gift,
}

const RUPAY_BENEFITS = [
  {
    title: 'Airport Lounge Access',
    description: 'Complimentary access to domestic airport lounges across India. Enjoy comfortable seating, complimentary food & beverages, Wi-Fi, and more.',
    icon: Plane,
    details: [
      '2 complimentary visits per quarter',
      'Access to 25+ domestic lounges',
      'Valid for RuPay Select cardholders',
      'Show your card at lounge reception'
    ]
  },
  {
    title: 'Cult.fit Membership',
    description: 'Free or discounted Cult.fit memberships for fitness enthusiasts. Access to gyms, yoga studios, and online workout sessions.',
    icon: Dumbbell,
    details: [
      '3-month free Cult.fit membership (quarterly)',
      'Access to 1000+ fitness centers',
      'Live online workout classes',
      'Mental wellness sessions included'
    ]
  },
  {
    title: 'OTT Subscriptions',
    description: 'Complimentary subscriptions to popular streaming platforms. Watch your favorite movies, series, and sports.',
    icon: PlayCircle,
    details: [
      'Netflix / Amazon Prime (varies by bank)',
      'Disney+ Hotstar access',
      'SonyLIV Premium subscription',
      'Zee5 All Access Pack'
    ]
  },
  {
    title: 'Dining Privileges',
    description: 'Exclusive discounts and offers at premium restaurants across India through partner platforms.',
    icon: Utensils,
    details: [
      'Up to 40% off at partner restaurants',
      'Swiggy Dineout discounts',
      'EazyDiner Prime membership',
      'No minimum order value on select offers'
    ]
  },
  {
    title: 'Health Checkups',
    description: 'Complimentary preventive health checkups and teleconsultation services.',
    icon: HeartPulse,
    details: [
      'Annual full body checkup',
      'Free doctor consultations',
      'Discounted medicines at partner pharmacies',
      'Health insurance benefits'
    ]
  },
  {
    title: 'Golf Privileges',
    description: 'Complimentary golf games and lessons at select golf courses across India.',
    icon: Target,
    details: [
      '2 complimentary golf rounds per month',
      'Access to 20+ golf courses',
      'Complimentary coaching sessions',
      'Driving range access'
    ]
  },
  {
    title: 'Concierge Services',
    description: '24/7 concierge assistance for travel planning, reservations, and lifestyle services.',
    icon: HeadphonesIcon,
    details: [
      '24/7 phone assistance',
      'Restaurant reservations',
      'Event ticket bookings',
      'Travel planning support'
    ]
  },
  {
    title: 'Shopping Offers',
    description: 'Exclusive discounts and cashback on shopping from partner brands and e-commerce platforms.',
    icon: ShoppingBag,
    details: [
      'Amazon & Flipkart offers',
      'Brand voucher discounts',
      'Cashback on select categories',
      'Exclusive member-only sales'
    ]
  }
]

const PARTICIPATING_BANKS = [
  'Bank of Baroda', 'Bank of India', 'Canara Bank', 'Central Bank of India',
  'HDFC Bank', 'ICICI Bank', 'Indian Bank', 'Indian Overseas Bank',
  'Kotak Mahindra Bank', 'Punjab National Bank', 'State Bank of India',
  'Union Bank of India', 'Axis Bank', 'Yes Bank', 'IDBI Bank'
]

export default function BenefitsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-8 h-8" />
            <span className="text-lg font-medium opacity-90">Premium Benefits</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            RuPay Select Debit Card Benefits
          </h1>
          <p className="text-lg opacity-90">
            Discover the exclusive privileges and benefits available with your RuPay Select Debit Card. 
            From lounge access to OTT subscriptions, make the most of your premium card.
          </p>
        </div>
      </div>

      {/* Benefits Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RUPAY_BENEFITS.map((benefit) => {
            const Icon = benefit.icon
            return (
              <Card key={benefit.title} className="bg-white/70 backdrop-blur-xl border-white/50 hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{benefit.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{benefit.description}</p>
                  <ul className="space-y-2">
                    {benefit.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Voucher Categories Reference */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Voucher Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VOUCHER_CATEGORIES.map((category) => {
            const Icon = iconMap[category.icon] || Gift
            return (
              <Card key={category.id} className="bg-white/70 backdrop-blur-xl border-white/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{category.description}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {category.commonExamples.slice(0, 2).map((example) => (
                          <span key={example} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                            {example}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Participating Banks */}
      <Card className="bg-white/70 backdrop-blur-xl border-white/50">
        <CardHeader>
          <CardTitle>Participating Banks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            RuPay Select Debit Cards are offered by major banks across India. Check with your bank for specific benefits and terms.
          </p>
          <div className="flex flex-wrap gap-2">
            {PARTICIPATING_BANKS.map((bank) => (
              <span 
                key={bank} 
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-sm font-medium rounded-lg border border-indigo-100"
              >
                {bank}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">💡 Pro Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-amber-800">
            <li className="flex items-start gap-2">
              <span className="font-bold">1.</span>
              Track your quarterly benefits - they reset every calendar quarter!
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">2.</span>
              Some benefits require activation through your bank's app or website.
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">3.</span>
              Lounge access benefits are per card - having multiple cards means more visits!
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">4.</span>
              OTT subscriptions often need to be claimed manually - don't forget!
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold">5.</span>
              Keep track of expiry dates for all vouchers and redeem them on time.
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}