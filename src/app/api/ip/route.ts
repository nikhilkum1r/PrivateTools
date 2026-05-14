import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  // Get IP from headers (standard for Next.js/Vercel/Netlify)
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';
  
  return NextResponse.json({ ip });
}
