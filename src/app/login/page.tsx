'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '../../lib/supabase'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type FormData = z.infer<typeof schema>

export default function Login() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setMessage('')
    const { error } = await supabase.auth.signInWithPassword(data)
    setLoading(false)
    if (error) {
      setMessage(error.message)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              {...form.register('email')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              {...form.register('password')}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500 mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>
          {message && <p className="text-sm text-red-500">{message}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>
        <p className="text-center text-sm mt-4 text-gray-600">
          No account? <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}