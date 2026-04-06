import Link from 'next/link';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-white)', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ color: 'var(--primary-green)', fontWeight: 'bold', fontSize: '24px' }}>DGCare</div>
        <nav style={{ display: 'flex', gap: '20px' }}>
          <Link href="/login" style={{ padding: '8px 16px', color: 'var(--primary-green)', fontWeight: '500' }}>Log In</Link>
          <Link href="/register" style={{ padding: '8px 16px', backgroundColor: 'var(--primary-green)', color: 'white', borderRadius: '4px', fontWeight: '500' }}>Sign Up</Link>
        </nav>
      </header>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--secondary-mint)', padding: '40px' }}>
        <div style={{ maxWidth: '600px' }}>
          <h1 style={{ fontSize: '48px', color: 'var(--primary-green)', marginBottom: '20px' }}>
            Trusted Care for <br/> <i>the Ones Who Matter Most</i>
          </h1>
          <p style={{ fontSize: '18px', color: 'var(--text-dark)', marginBottom: '30px', lineHeight: '1.6' }}>
            Connect with verified caregivers, track their real-time location, and ensure the safety of your loved ones through our premium AI-curated platform.
          </p>
          <Link href="/register" style={{ padding: '12px 24px', backgroundColor: 'var(--primary-green)', color: 'white', borderRadius: '4px', fontSize: '18px', fontWeight: 'bold', display: 'inline-block' }}>
            Get Started
          </Link>
        </div>
        <div style={{ marginLeft: '40px' }}>
          <div style={{ width: '300px', height: '300px', backgroundColor: 'var(--accent-green)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '20px', boxShadow: '0 10px 25px rgba(11, 79, 66, 0.2)' }}>
            [Illustration Placeholder]
          </div>
        </div>
      </main>
    </div>
  );
}
