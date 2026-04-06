'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('family');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('dgcare_user', JSON.stringify({ email, role }));
    router.push('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--primary-green)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ backgroundColor: 'var(--bg-white)', padding: '40px', borderRadius: '12px', width: '100%', maxWidth: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
          <h2 style={{ fontSize: '28px', color: 'var(--primary-green)', marginBottom: '8px', textAlign: 'center' }}>Welcome Back</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '24px', textAlign: 'center' }}>Log in to access your sanctuary for care.</p>
          
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }} placeholder="alex@example.com" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }} placeholder="••••••••" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>I am a...</label>
              <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                <option value="family">Family Member</option>
                <option value="caregiver">Professional Caregiver</option>
              </select>
            </div>
            <button type="submit" style={{ padding: '14px', backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', marginTop: '8px', cursor: 'pointer' }}>
              Sign In
            </button>
          </form>

          <p style={{ marginTop: '20px', textAlign: 'center', color: 'var(--text-light)' }}>
            Don't have an account? <Link href="/register" style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
