import Link from 'next/link';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg-offwhite)', fontFamily: '"Segoe UI", Roboto, Arial, sans-serif' }}>
        <h1 style={{ fontSize: '100px', fontWeight: '800', color: 'var(--primary-green)', marginBottom: '0px', lineHeight: '1' }}>404</h1>
        <h2 style={{ fontSize: '28px', fontWeight: '700', color: 'var(--text-dark)', marginBottom: '16px' }}>Page Not Found</h2>
        <p style={{ fontSize: '16px', color: 'var(--text-light)', marginBottom: '40px', maxWidth: '400px', textAlign: 'center' }}>
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/" style={{ padding: '14px 28px', backgroundColor: 'var(--primary-green)', color: 'white', borderRadius: '8px', fontWeight: '700', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', transition: 'opacity 0.2s' }}>
            <Home size={18} /> Return Home
        </Link>
    </div>
  );
}
