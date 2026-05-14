import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ prefix: string }> }
) {
  const { prefix } = await params;
  
  if (!prefix || prefix.length !== 5) {
    return new NextResponse('Invalid prefix', { status: 400 });
  }

  try {
    const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      headers: {
        'User-Agent': 'SafeTools-Server-Proxy',
      },
      // HIBP API is public and doesn't require auth for this endpoint
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!response.ok) {
      return new NextResponse('HIBP API error', { status: response.status });
    }

    const data = await response.text();
    
    return new NextResponse(data, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    });
  } catch (error) {
    console.error('Pwned proxy error:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
