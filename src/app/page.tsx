import Link from 'next/link';

function ShieldHeartSVG() {
  return (
    <svg
      viewBox="0 0 260 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '100%', height: '100%' }}
      aria-label="Shield with heart — DGCare trust icon"
    >
      {/* Outer glow */}
      <ellipse cx="130" cy="280" rx="75" ry="12" fill="rgba(11,79,66,0.12)" />

      {/* Shield body */}
      <path
        d="M130 12 L240 60 L240 152 C240 210 188 258 130 280 C72 258 20 210 20 152 L20 60 Z"
        fill="url(#shieldGradient)"
        filter="url(#shadow)"
      />

      {/* Shield inner highlight */}
      <path
        d="M130 32 L222 74 L222 152 C222 200 178 242 130 262 C82 242 38 200 38 152 L38 74 Z"
        fill="url(#shieldInner)"
        opacity="0.55"
      />

      {/* Heart */}
      <path
        d="M130 195 C130 195 80 162 80 128 C80 110 95 98 110 98 C120 98 128 105 130 110 C132 105 140 98 150 98 C165 98 180 110 180 128 C180 162 130 195 130 195 Z"
        fill="white"
        opacity="0.95"
        filter="url(#heartGlow)"
      />

      {/* Heartbeat line inside heart */}
      <polyline
        points="98,128 108,128 113,114 119,142 124,122 129,133 134,128 152,128"
        stroke="#0b4f42"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Shield checkmark notch at top */}
      <circle cx="130" cy="60" r="14" fill="white" opacity="0.2" />
      <path d="M123 60 L129 66 L139 54" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* Sparkle dots */}
      <circle cx="52"  cy="90"  r="4" fill="#a7f3d0" opacity="0.7" />
      <circle cx="208" cy="90"  r="4" fill="#a7f3d0" opacity="0.7" />
      <circle cx="38"  cy="150" r="3" fill="#6ee7b7" opacity="0.5" />
      <circle cx="222" cy="150" r="3" fill="#6ee7b7" opacity="0.5" />

      <defs>
        <linearGradient id="shieldGradient" x1="20" y1="12" x2="240" y2="280" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#1a7b66" />
          <stop offset="100%" stopColor="#0b4f42" />
        </linearGradient>
        <linearGradient id="shieldInner" x1="38" y1="32" x2="222" y2="262" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="white" stopOpacity="0.25" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <filter id="shadow" x="-10%" y="-5%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0b4f42" floodOpacity="0.25" />
        </filter>
        <filter id="heartGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="5" floodColor="#ffffff" floodOpacity="0.4" />
        </filter>
      </defs>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: '"Segoe UI", Roboto, Arial, sans-serif' }}>

      {/* ── Nav ── */}
      <header style={{ padding: '18px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border-light)', position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px' }}>
            <ShieldHeartSVG />
          </div>
          <span style={{ color: 'var(--primary-green)', fontWeight: '800', fontSize: '22px', letterSpacing: '-0.5px' }}>DGCare</span>
        </div>
        <nav style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <Link href="/login" style={{ padding: '8px 18px', color: 'var(--primary-green)', fontWeight: '600', borderRadius: '6px', transition: 'background 0.2s' }}>
            Log In
          </Link>
          <Link href="/register" style={{ padding: '9px 20px', backgroundColor: 'var(--primary-green)', color: 'white', borderRadius: '6px', fontWeight: '700', boxShadow: '0 2px 8px rgba(11,79,66,0.25)', transition: 'opacity 0.2s' }}>
            Get Started
          </Link>
        </nav>
      </header>

      {/* ── Hero ── */}
      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(145deg, var(--secondary-mint) 0%, #f0faf5 100%)', padding: '60px 40px' }}>
        <div style={{ maxWidth: '1100px', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '60px', flexWrap: 'wrap' }}>

          {/* Left: text */}
          <div style={{ flex: '1 1 360px', maxWidth: '560px' }}>
            {/* Trust pill */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', backgroundColor: 'white', borderRadius: '99px', border: '1px solid #c6e6d8', marginBottom: '24px', fontSize: '13px', fontWeight: '600', color: 'var(--accent-green)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              🛡️ Background-Checked Providers Only
            </div>

            <h1 style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: '1.15', color: 'var(--primary-green)', fontWeight: '800', marginBottom: '20px', letterSpacing: '-1px' }}>
              Trusted Care for <br />
              <em style={{ fontStyle: 'italic', color: 'var(--accent-green)' }}>the Ones Who Matter Most</em>
            </h1>

            <p style={{ fontSize: '17px', color: 'var(--text-dark)', marginBottom: '36px', lineHeight: '1.7', maxWidth: '480px', opacity: 0.85 }}>
              Connect with verified caregivers, track their real-time GPS location, and ensure your loved ones are always safe — through our AI-curated care platform.
            </p>

            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="/register" style={{ padding: '14px 28px', backgroundColor: 'var(--primary-green)', color: 'white', borderRadius: '8px', fontSize: '16px', fontWeight: '700', display: 'inline-block', boxShadow: '0 4px 14px rgba(11,79,66,0.3)', letterSpacing: '0.2px' }}>
                Get Started Free
              </Link>
              <Link href="/login" style={{ padding: '14px 24px', backgroundColor: 'white', color: 'var(--primary-green)', borderRadius: '8px', fontSize: '16px', fontWeight: '600', display: 'inline-block', border: '1.5px solid #c6e6d8' }}>
                View Demo
              </Link>
            </div>

            {/* Social proof */}
            <div style={{ marginTop: '40px', display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
              {[
                { value: '1,200+', label: 'Verified Caregivers' },
                { value: '98%',    label: 'Family Satisfaction' },
                { value: '24 / 7', label: 'Emergency Support' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary-green)' }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text-light)', marginTop: '2px' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: SVG illustration */}
          <div style={{ flex: '0 0 auto', width: 'clamp(220px, 28vw, 300px)', height: 'clamp(260px, 33vw, 350px)', filter: 'drop-shadow(0 12px 30px rgba(11,79,66,0.18))' }}>
            <ShieldHeartSVG />
          </div>

        </div>
      </main>

      {/* ── Footer strip ── */}
      <footer style={{ padding: '16px 40px', backgroundColor: 'var(--bg-white)', borderTop: '1px solid var(--border-light)', textAlign: 'center', fontSize: '13px', color: 'var(--text-light)' }}>
        © 2025 DGCare — Dignity in Every Home
      </footer>
    </div>
  );
}
