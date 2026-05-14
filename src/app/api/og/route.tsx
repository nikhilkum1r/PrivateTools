import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Dynamic params
    const title = searchParams.has('title')
      ? searchParams.get('title')?.slice(0, 100)
      : 'SafeTools | Privacy-First Utilities';
    const subtitle = searchParams.has('subtitle')
      ? searchParams.get('subtitle')?.slice(0, 100)
      : 'Convert, compress, edit, and encrypt files securely in your browser.';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#09090b',
            backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.05) 2%, transparent 0%), radial-gradient(circle at 75px 75px, rgba(255,255,255,0.05) 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Decorative blur elements */}
          <div
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-10%',
              width: '40%',
              height: '40%',
              background: 'rgba(124, 58, 237, 0.4)',
              filter: 'blur(100px)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-10%',
              right: '-10%',
              width: '40%',
              height: '40%',
              background: 'rgba(56, 189, 248, 0.4)',
              filter: 'blur(100px)',
              borderRadius: '50%',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 80px',
              zIndex: 10,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                marginBottom: '40px',
                padding: '12px 24px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '100px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <span style={{ fontSize: 40, color: '#fff' }}>🛡️</span>
              <span style={{ fontSize: 32, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em' }}>SafeTools</span>
            </div>

            <h1
              style={{
                fontSize: 80,
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: '-0.03em',
                marginBottom: '24px',
                backgroundClip: 'text',
                backgroundImage: 'linear-gradient(to bottom right, #ffffff, #a1a1aa)',
                color: 'transparent',
              }}
            >
              {title}
            </h1>
            
            <p
              style={{
                fontSize: 36,
                color: '#a1a1aa',
                lineHeight: 1.4,
                maxWidth: '800px',
                fontWeight: 500,
              }}
            >
              {subtitle}
            </p>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginTop: '60px',
              }}
            >
              <div style={{ display: 'flex', padding: '8px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '8px', fontSize: 24, fontWeight: 600 }}>
                ✓ 100% Offline
              </div>
              <div style={{ display: 'flex', padding: '8px 16px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', borderRadius: '8px', fontSize: 24, fontWeight: 600 }}>
                ✓ No Uploads
              </div>
              <div style={{ display: 'flex', padding: '8px 16px', background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7', borderRadius: '8px', fontSize: 24, fontWeight: 600 }}>
                ✓ Free
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
