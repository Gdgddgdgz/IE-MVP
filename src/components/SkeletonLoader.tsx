export function FullPageSkeleton({ role }: { role: 'family' | 'caregiver' }) {
  const sidebarColor = role === 'family' ? 'var(--primary-green)' : '#093a31';
  return (
    <div className="dashboard-layout">
      <style>{`
        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }
        .skel-base {
          background-color: #e5e7eb;
          background-image: linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.4) 20%, rgba(255,255,255,0) 40%);
          background-repeat: no-repeat;
          background-size: 1000px 100%;
          animation: shimmer 1.5s infinite linear;
          border-radius: 8px;
        }
        .skel-dark {
          background-color: rgba(255,255,255,0.1);
          background-image: linear-gradient(90deg, rgba(255,255,255,0) 0, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0) 40%);
          background-repeat: no-repeat;
          background-size: 1000px 100%;
          animation: shimmer 1.5s infinite linear;
          border-radius: 8px;
        }
      `}</style>
      <div className="sidebar" style={{ backgroundColor: sidebarColor }}>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div className="skel-dark" style={{ width: '140px', height: '28px', marginBottom: '40px' }} />
          <div className="skel-dark" style={{ width: '100%', height: '48px', marginBottom: '16px', borderRadius: '8px' }} />
          <div className="skel-dark" style={{ width: '100%', height: '48px', marginBottom: '16px', borderRadius: '8px' }} />
        </div>
      </div>
      <div className="main-content">
        <div className="skel-base" style={{ width: '70%', maxWidth: '350px', height: '38px', marginBottom: '12px' }} />
        <div className="skel-base" style={{ width: '90%', maxWidth: '500px', height: '20px', marginBottom: '40px' }} />
        
        <div className="skel-base" style={{ height: '160px', width: '100%', marginBottom: '24px', borderRadius: '12px' }} />
        
        <div className="grid-3">
             <div className="skel-base" style={{ height: '120px', borderRadius: '12px' }} />
             <div className="skel-base" style={{ height: '120px', borderRadius: '12px' }} />
             <div className="skel-base" style={{ height: '120px', borderRadius: '12px' }} />
        </div>
      </div>
    </div>
  );
}
