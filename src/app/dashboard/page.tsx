import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { DashboardContent } from '@/components/dashboard-content'
import { getCards, getVouchers, getDashboardStats } from '@/app/actions'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch all data
  const [cards, vouchers, stats] = await Promise.all([
    getCards(),
    getVouchers(),
    getDashboardStats(),
  ])

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-3xl p-8 sm:p-12 text-white shadow-2xl">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Welcome back! 👋
          </h1>
          <p className="text-lg sm:text-xl opacity-90 mb-6">
            Track your RuPay Select benefits and maximize your card privileges.
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
              <span className="text-2xl font-bold">{stats.totalCards}</span>
              <span className="ml-2 text-sm opacity-80">Cards</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
              <span className="text-2xl font-bold">{stats.totalVouchers}</span>
              <span className="ml-2 text-sm opacity-80">Vouchers</span>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-3">
              <span className="text-2xl font-bold">{stats.totalRedeemed}</span>
              <span className="ml-2 text-sm opacity-80">Redeemed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <DashboardContent 
        cards={cards} 
        vouchers={vouchers} 
        stats={stats}
      />
    </div>
  )
}