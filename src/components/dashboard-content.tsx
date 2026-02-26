'use client'

import { useState, useCallback } from 'react'
import { 
  Plus, 
  CreditCard, 
  Gift, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Banknote,
  MoreHorizontal,
  Edit2,
  Trash2,
  PauseCircle,
  XCircle,
  CheckCircle,
  Search,
  Download
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { addCard, addVoucher, updateVoucherPeriod, deleteCard, deleteVoucher } from '@/app/actions'
import { useRouter } from 'next/navigation'
import type { Card as CardType, Voucher, VoucherStatus, DashboardStats } from '@/lib/types'
import { CYCLE_TYPES, STATUS_CONFIG, VOUCHER_CATEGORIES, BANK_LIST } from '@/lib/types'

interface DashboardContentProps {
  cards: CardType[]
  vouchers: Voucher[]
  stats: DashboardStats
}

export function DashboardContent({ cards, vouchers, stats }: DashboardContentProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Modal states
  const [addCardOpen, setAddCardOpen] = useState(false)
  const [addVoucherOpen, setAddVoucherOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<CardType | null>(null)
  
  // Form states
  const [cardForm, setCardForm] = useState({ bank: '', last4: '', variant: 'select', cardName: '', notes: '' })
  const [voucherForm, setVoucherForm] = useState({
    cardId: '',
    name: '',
    description: '',
    cycleType: 'quarterly',
    category: 'other',
    value: '',
    reminderDays: '7',
    notes: ''
  })

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(cardForm).forEach(([key, value]) => formData.append(key, value))
    await addCard(formData)
    setAddCardOpen(false)
    setCardForm({ bank: '', last4: '', variant: 'select', cardName: '', notes: '' })
    router.refresh()
  }

  const handleAddVoucher = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    Object.entries(voucherForm).forEach(([key, value]) => formData.append(key, value))
    await addVoucher(formData)
    setAddVoucherOpen(false)
    setVoucherForm({
      cardId: '',
      name: '',
      description: '',
      cycleType: 'quarterly',
      category: 'other',
      value: '',
      reminderDays: '7',
      notes: ''
    })
    router.refresh()
  }

  const handleUpdatePeriodStatus = async (periodId: string, status: VoucherStatus, details?: any) => {
    await updateVoucherPeriod(periodId, status, details)
    router.refresh()
  }

  const handleDeleteCard = async (cardId: string) => {
    if (confirm('Are you sure you want to delete this card? All associated vouchers will also be deleted.')) {
      await deleteCard(cardId)
      router.refresh()
    }
  }

  const handleDeleteVoucher = async (voucherId: string) => {
    if (confirm('Are you sure you want to delete this voucher?')) {
      await deleteVoucher(voucherId)
      router.refresh()
    }
  }

  const filteredVouchers = vouchers.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cards.find(c => c.id === v.cardId)?.bank.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const exportToCSV = () => {
    const headers = ['Card', 'Voucher', 'Category', 'Cycle', 'Status', 'Value']
    const rows = vouchers.map(v => {
      const card = cards.find(c => c.id === v.cardId)
      return [
        `${card?.bank} ****${card?.last4}`,
        v.name,
        v.category,
        v.cycleType,
        v.status,
        v.value || 0
      ]
    })
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rupay-vouchers-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getCardDisplayName = (cardId: string) => {
    const card = cards.find(c => c.id === cardId)
    return card ? `${card.bank} ****${card.last4}` : 'Unknown Card'
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList className="bg-white/70 backdrop-blur-xl p-1 rounded-2xl">
        <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
          Overview
        </TabsTrigger>
        <TabsTrigger value="cards" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
          My Cards ({cards.length})
        </TabsTrigger>
        <TabsTrigger value="vouchers" className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
          Vouchers ({vouchers.length})
        </TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-white/70 backdrop-blur-xl border-white/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Cards</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-indigo-600">{stats.totalCards}</span>
                <CreditCard className="w-8 h-8 text-indigo-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-xl border-white/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Active Vouchers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-purple-600">{stats.totalVouchers}</span>
                <Gift className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-xl border-white/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Redeemed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-emerald-600">{stats.totalRedeemed}</span>
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white/70 backdrop-blur-xl border-white/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Sold</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-3xl font-bold text-blue-600">{stats.totalSold}</span>
                <Banknote className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={() => setAddCardOpen(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
          <Button 
            onClick={() => setAddVoucherOpen(true)}
            variant="outline"
            className="rounded-xl border-indigo-200 hover:bg-indigo-50"
          >
            <Gift className="w-4 h-4 mr-2" />
            Add Voucher
          </Button>
          <Button 
            onClick={exportToCSV}
            variant="outline"
            className="rounded-xl border-gray-200 hover:bg-gray-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Recent Vouchers */}
        <Card className="bg-white/70 backdrop-blur-xl border-white/50">
          <CardHeader>
            <CardTitle>Recent Vouchers</CardTitle>
          </CardHeader>
          <CardContent>
            {vouchers.slice(0, 5).map((voucher) => (
              <div key={voucher.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-900">{voucher.name}</p>
                  <p className="text-sm text-gray-500">{getCardDisplayName(voucher.cardId)}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_CONFIG[voucher.status].bgColor} ${STATUS_CONFIG[voucher.status].color}`}>
                  {STATUS_CONFIG[voucher.status].label}
                </span>
              </div>
            ))}
            {vouchers.length === 0 && (
              <p className="text-center text-gray-500 py-8">No vouchers yet. Add your first voucher!</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Cards Tab */}
      <TabsContent value="cards" className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">My Cards</h2>
          <Button onClick={() => setAddCardOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Add Card
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card) => (
            <Card key={card.id} className="bg-white/70 backdrop-blur-xl border-white/50 hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-white" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingCard(card)}>
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDeleteCard(card.id)} className="text-red-600">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">{card.bank}</h3>
                <p className="text-2xl font-mono text-gray-600 mb-2">**** {card.last4}</p>
                <span className="inline-block px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full capitalize">
                  {card.variant}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>

        {cards.length === 0 && (
          <div className="text-center py-16 bg-white/50 rounded-3xl">
            <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700 mb-2">No Cards Added</h3>
            <p className="text-gray-500 mb-4">Add your first RuPay Select card to get started</p>
            <Button onClick={() => setAddCardOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl">
              <Plus className="w-4 h-4 mr-2" />
              Add Card
            </Button>
          </div>
        )}
      </TabsContent>

      {/* Vouchers Tab */}
      <TabsContent value="vouchers" className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-2xl font-bold text-gray-800">Vouchers</h2>
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search vouchers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-xl"
              />
            </div>
            <Button onClick={() => setAddVoucherOpen(true)} className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl whitespace-nowrap">
              <Plus className="w-4 h-4 mr-2" />
              Add Voucher
            </Button>
          </div>
        </div>

        {/* Vouchers Table */}
        <Card className="bg-white/70 backdrop-blur-xl border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Card</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Voucher</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Cycle</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Periods</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVouchers.map((voucher) => (
                  <tr key={voucher.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3 text-sm text-gray-900">{getCardDisplayName(voucher.cardId)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{voucher.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{voucher.category?.replace('_', ' ')}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 capitalize">{voucher.cycleType}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_CONFIG[voucher.status].bgColor} ${STATUS_CONFIG[voucher.status].color}`}>
                        {STATUS_CONFIG[voucher.status].label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {voucher.periods?.map((period) => (
                          <DropdownMenu key={period.id}>
                            <DropdownMenuTrigger asChild>
                              <button
                                className={`w-6 h-6 rounded text-xs font-medium transition-colors ${
                                  period.status === 'redeemed' ? 'bg-emerald-500 text-white' :
                                  period.status === 'sold' ? 'bg-blue-500 text-white' :
                                  period.status === 'paused' ? 'bg-slate-400 text-white' :
                                  period.status === 'expired' ? 'bg-red-400 text-white' :
                                  'bg-amber-100 text-amber-700 hover:bg-amber-200'
                                }`}
                                title={`${period.label}: ${STATUS_CONFIG[period.status].label}`}
                              >
                                {period.period.substring(0, 2).toUpperCase()}
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleUpdatePeriodStatus(period.id, 'pending')}>
                                <Clock className="w-4 h-4 mr-2 text-amber-500" />
                                Mark Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdatePeriodStatus(period.id, 'redeemed')}>
                                <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                                Mark Redeemed
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdatePeriodStatus(period.id, 'sold', { soldAmount: voucher.value })}>
                                <Banknote className="w-4 h-4 mr-2 text-blue-500" />
                                Mark Sold
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdatePeriodStatus(period.id, 'paused')}>
                                <PauseCircle className="w-4 h-4 mr-2 text-slate-500" />
                                Mark Paused
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleDeleteVoucher(voucher.id)} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredVouchers.length === 0 && (
            <div className="text-center py-12">
              <Gift className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No vouchers found</p>
            </div>
          )}
        </Card>
      </TabsContent>

      {/* Add Card Dialog */}
      <Dialog open={addCardOpen} onOpenChange={setAddCardOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Card</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddCard} className="space-y-4">
            <div>
              <Label htmlFor="bank">Bank</Label>
              <Select value={cardForm.bank} onValueChange={(value) => setCardForm({...cardForm, bank: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {BANK_LIST.map((bank) => (
                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="last4">Last 4 Digits</Label>
              <Input
                id="last4"
                value={cardForm.last4}
                onChange={(e) => setCardForm({...cardForm, last4: e.target.value.replace(/\D/g, '').slice(0, 4)})}
                maxLength={4}
                placeholder="1234"
                required
              />
            </div>
            <div>
              <Label htmlFor="variant">Card Variant</Label>
              <Select value={cardForm.variant} onValueChange={(value) => setCardForm({...cardForm, variant: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="select">RuPay Select</SelectItem>
                  <SelectItem value="platinum">RuPay Platinum</SelectItem>
                  <SelectItem value="gold">RuPay Gold</SelectItem>
                  <SelectItem value="classic">RuPay Classic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cardName">Card Name (Optional)</Label>
              <Input
                id="cardName"
                value={cardForm.cardName}
                onChange={(e) => setCardForm({...cardForm, cardName: e.target.value})}
                placeholder="e.g., Primary Card"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setAddCardOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                Add Card
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Add Voucher Dialog */}
      <Dialog open={addVoucherOpen} onOpenChange={setAddVoucherOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Voucher</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddVoucher} className="space-y-4">
            <div>
              <Label htmlFor="cardId">Card</Label>
              <Select value={voucherForm.cardId} onValueChange={(value) => setVoucherForm({...voucherForm, cardId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select card" />
                </SelectTrigger>
                <SelectContent>
                  {cards.map((card) => (
                    <SelectItem key={card.id} value={card.id}>
                      {card.bank} ****{card.last4}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="name">Voucher Name</Label>
              <Input
                id="name"
                value={voucherForm.name}
                onChange={(e) => setVoucherForm({...voucherForm, name: e.target.value})}
                placeholder="e.g., Netflix Subscription"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={voucherForm.category} onValueChange={(value) => setVoucherForm({...voucherForm, category: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {VOUCHER_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="cycleType">Cycle Type</Label>
              <Select value={voucherForm.cycleType} onValueChange={(value) => setVoucherForm({...voucherForm, cycleType: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CYCLE_TYPES.map((cycle) => (
                    <SelectItem key={cycle.value} value={cycle.value}>{cycle.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="value">Estimated Value (₹)</Label>
              <Input
                id="value"
                type="number"
                value={voucherForm.value}
                onChange={(e) => setVoucherForm({...voucherForm, value: e.target.value})}
                placeholder="0"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={() => setAddVoucherOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
                Add Voucher
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Tabs>
  )
}