import { createClient } from '../lib/supabase'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Skip auth check for login/signup pages
  if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/signup') {
    return res
  }
  
  // For now, just pass through - auth will be handled by server actions
  return res
}

export const config = {
  matcher: [
    '/((?!login|signup|api|_next/static|_next/image|favicon.ico).*)',
  ],
}