'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('family');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('dgcare_user', JSON.stringify({ email, role, name }));
    router.push('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', backgroundColor: 'var(--secondary-mint)' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ backgroundColor: 'var(--bg-white)', padding: '50px', borderRadius: '16px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 40px rgba(11,79,66,0.1)' }}>
          <h2 style={{ fontSize: '32px', color: 'var(--primary-green)', marginBottom: '8px', textAlign: 'center', fontWeight: 'bold' }}>Create your account</h2>
          <p style={{ color: 'var(--text-light)', marginBottom: '32px', textAlign: 'center' }}>Experience peace of mind with our curated care network.</p>
          
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Full Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-light)' }} placeholder="Alex Smith" />
                </div>
                <div style={{ flex: '1 1 200px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>I am a...</label>
                    <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
                        <option value="family">Family Member</option>
                        <option value="caregiver">Professional Caregiver</option>
                    </select>
                </div>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-light)' }} placeholder="alex@example.com" />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid var(--border-light)' }} placeholder="••••••••" />
            </div>
            <button type="submit" style={{ padding: '16px', backgroundColor: 'var(--primary-green)', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '18px', marginTop: '16px', cursor: 'pointer', transition: 'background-color 0.2s' }}>
              Create Account
            </button>
          </form>

          <p style={{ marginTop: '24px', textAlign: 'center', color: 'var(--text-light)' }}>
            Already have an account? <Link href="/login" style={{ color: 'var(--primary-green)', fontWeight: 'bold' }}>Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
