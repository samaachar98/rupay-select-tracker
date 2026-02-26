'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { User, Mail, Bell, LogOut, Save } from 'lucide-react'

interface ProfileContentProps {
  user: {
    id: string
    email?: string
    user_metadata?: {
      full_name?: string
    }
  }
  profile: {
    full_name?: string
    default_currency?: string
    reminder_enabled?: boolean
    reminder_days?: number
  } | null
}

export function ProfileContent({ user, profile }: ProfileContentProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  
  const [formData, setFormData] = useState({
    fullName: profile?.full_name || user.user_metadata?.full_name || '',
    email: user.email || '',
    reminderEnabled: profile?.reminder_enabled ?? true,
    reminderDays: profile?.reminder_days || 7,
  })

  const handleSave = async () => {
    setLoading(true)
    
    // Update profile in Supabase
    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        full_name: formData.fullName,
        reminder_enabled: formData.reminderEnabled,
        reminder_days: formData.reminderDays,
        updated_at: new Date().toISOString(),
      })

    setLoading(false)
    
    if (!error) {
      router.refresh()
    }
  }

  const handleSignOut = async () => {
    setIsSigningOut(true)
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Profile Info Card */}
      <Card className="bg-white/70 backdrop-blur-xl border-white/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                value={formData.email}
                disabled
                className="bg-gray-50"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white/70 backdrop-blur-xl border-white/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Enable Reminders</p>
              <p className="text-sm text-gray-500">Get notified about upcoming voucher expirations</p>
            </div>
            <Switch
              checked={formData.reminderEnabled}
              onCheckedChange={(checked: boolean) => setFormData({ ...formData, reminderEnabled: checked })}
            />
          </div>
          
          {formData.reminderEnabled && (
            <div>
              <Label htmlFor="reminderDays">Reminder Days Before Expiry</Label>
              <Input
                id="reminderDays"
                type="number"
                min={1}
                max={30}
                value={formData.reminderDays}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, reminderDays: parseInt(e.target.value) || 7 })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={handleSave}
          disabled={loading}
          className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
        
        <Button
          onClick={handleSignOut}
          disabled={isSigningOut}
          variant="outline"
          className="flex-1 border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isSigningOut ? 'Signing out...' : 'Sign Out'}
        </Button>
      </div>
    </div>
  )
}