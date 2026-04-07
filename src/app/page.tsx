import Link from 'next/link';

export default function LandingPage() {
  return (
    <>
      {/* Top Navigation Bar */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl z-50 shadow-sm shadow-teal-900/5">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-black text-teal-800 dark:text-teal-200 tracking-tighter">DGCare</span>
          <nav className="hidden md:flex items-center gap-6">
            <a className="text-teal-700 dark:text-teal-300 border-b-2 border-teal-600 pb-1 font-semibold text-sm tracking-tight" href="#">Find Caregiver</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-teal-600 transition-colors font-semibold text-sm tracking-tight" href="#">Become Caregiver</a>
            <a className="text-slate-500 dark:text-slate-400 hover:text-teal-600 transition-colors font-semibold text-sm tracking-tight" href="#">Resources</a>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="px-5 py-2 text-slate-500 hover:text-primary font-bold text-sm transition-all">
            Login
          </Link>
          <Link href="/register" className="px-6 py-2.5 bg-primary text-white rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-container active:scale-95 transition-all">
            Sign Up
          </Link>
        </div>
      </header>

      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative min-h-[921px] flex items-center overflow-hidden hero-gradient px-8 py-20 lg:py-32">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              <span className="inline-block py-1.5 px-4 rounded-full bg-tertiary-container text-on-tertiary-container text-xs font-bold tracking-widest uppercase mb-6">
                Excellence in Clinical Care
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-on-surface tracking-tighter leading-[1.1] mb-8">
                Trusted Care for the <span className="text-primary italic">Ones Who Matter</span> Most
              </h1>
              <p className="text-lg text-on-surface-variant max-w-lg mb-10 leading-relaxed">
                Connecting families with elite, background-verified caregivers through a clinical curation lens. Experience health management with editorial precision.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/register" className="px-8 py-4 bg-primary text-white rounded-full font-bold text-lg hover:bg-primary-container transition-all shadow-2xl shadow-primary/20">Find Caregiver</Link>
                <Link href="/register" className="px-8 py-4 bg-surface-container-high text-on-surface font-bold text-lg rounded-full hover:bg-surface-container-highest transition-all">Become Caregiver</Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-fixed opacity-20 blur-3xl rounded-full"></div>
              <div className="relative z-10 rounded-[2.5rem] overflow-hidden shadow-2xl rotate-1">
                <img
                  alt="A professional young caregiver smiling warmly while assisting an elderly woman in a bright modern sunlit living room with plants"
                  className="w-full aspect-[4/5] object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAA4a8oe6K9322v4nM2lnYJ3U3CdlhCO1mCfsgDCufs5rziAz5W7KBSytlaYcGaJcEPrUuNlg8kqtdGCZ7ZwLVWT9mZm4BxgX_DIzAAtOL7Cq9CPG9Pmutd_sDj_smIStRr6ytY-vjDZRNhLRMnw7J8TOnIL-fGjFYeTdex21RjZDWgdmNyVvUXk3JLDmBqC_Ld0JP1t-PqtW02X9iRBNwB6S0AMz5t251-wcf4jro4NHoMTzRgvQr-Kcc7drSAzGoFQVnMSz_Oq4"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 p-6 bg-white dark:bg-slate-900 rounded-3xl shadow-xl max-w-xs z-20">
                <div className="flex items-center gap-4 mb-3">
                  <span className="p-2 bg-tertiary-container rounded-full text-on-tertiary-container material-symbols-outlined">verified</span>
                  <span className="font-bold text-sm">Verified Credentials</span>
                </div>
                <p className="text-xs text-on-surface-variant leading-tight">Every DGCare professional undergoes a 12-point clinical vetting process.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Signals / Logos */}
        <section className="py-12 bg-surface-container-low">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">security</span>
                <span className="font-bold tracking-tighter text-xl">TRUSTED SECURE</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">medical_services</span>
                <span className="font-bold tracking-tighter text-xl">CLINICAL VETTED</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">family_history</span>
                <span className="font-bold tracking-tighter text-xl">FAMILY FIRST</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-3xl">workspace_premium</span>
                <span className="font-bold tracking-tighter text-xl">PREMIUM SELECT</span>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold mb-6 tracking-tight">The Curation Journey</h2>
              <p className="text-on-surface-variant italic">How we match excellence with your specific family needs.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-1/3 left-0 w-full h-px bg-outline-variant opacity-20 -z-10"></div>
              {/* Step 1 */}
              <div className="group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                  <span className="text-primary font-bold text-2xl group-hover:text-white transition-colors">01</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Create Care Profile</h3>
                <p className="text-on-surface-variant leading-relaxed">Define medical requirements, personality preferences, and schedule through our intuitive digital assessment.</p>
              </div>
              {/* Step 2 */}
              <div className="group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                  <span className="text-primary font-bold text-2xl group-hover:text-white transition-colors">02</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Find Caregiver</h3>
                <p className="text-on-surface-variant leading-relaxed">Browse curated profiles of top-tier clinicians. View video introductions and verified clinical backgrounds.</p>
              </div>
              {/* Step 3 */}
              <div className="group">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8 group-hover:bg-primary transition-colors">
                  <span className="text-primary font-bold text-2xl group-hover:text-white transition-colors">03</span>
                </div>
                <h3 className="text-xl font-bold mb-4">Hire &amp; Connect</h3>
                <p className="text-on-surface-variant leading-relaxed">Book directly through the platform with secure payments and integrated health monitoring dashboard.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Bento Grid */}
        <section className="py-24 px-8 bg-surface-container-low overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-4xl font-bold tracking-tight mb-4">Clinical Intelligence</h2>
              <p className="text-on-surface-variant">Technology designed to empower care, not complicate it.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[800px]">
              {/* Large Card: Monitoring */}
              <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 shadow-sm flex flex-col justify-between group overflow-hidden relative">
                <div>
                  <span className="material-symbols-outlined text-primary text-4xl mb-6">monitoring</span>
                  <h3 className="text-2xl font-bold mb-4">Real-time Health Monitoring</h3>
                  <p className="text-on-surface-variant max-w-sm">Track vital signs and daily routines via our integrated dashboard. Data visualized with editorial clarity.</p>
                </div>
                <div className="mt-8 relative -mb-8 -mr-8">
                  <div className="w-full h-64 bg-slate-50 rounded-tl-3xl p-6 border-l border-t border-slate-100">
                    <div className="flex gap-2 items-end h-full">
                      <div className="w-full bg-primary/20 h-[60%] rounded-t-lg"></div>
                      <div className="w-full bg-primary h-[85%] rounded-t-lg"></div>
                      <div className="w-full bg-primary/40 h-[45%] rounded-t-lg"></div>
                      <div className="w-full bg-primary h-[70%] rounded-t-lg"></div>
                      <div className="w-full bg-primary/60 h-[90%] rounded-t-lg"></div>
                      <div className="w-full bg-primary h-[50%] rounded-t-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Tall Card: Vetting */}
              <div className="md:col-span-4 bg-primary text-white rounded-xl p-8 shadow-xl flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-6xl mb-6">verified_user</span>
                <h3 className="text-2xl font-bold mb-4">100% Background Checked</h3>
                <p className="opacity-80">Rigorous identity, criminal, and professional license verification for every caregiver.</p>
                <button className="mt-8 py-3 px-6 bg-white text-primary rounded-full font-bold">Learn About Vetting</button>
              </div>
              {/* Small Card: AI */}
              <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl mb-4">psychology</span>
                <h3 className="text-xl font-bold mb-2">AI Matching</h3>
                <p className="text-on-surface-variant text-sm">Our algorithm finds the perfect personality match based on 40+ behavioral data points.</p>
              </div>
              {/* Small Card: Calendar */}
              <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl mb-4">calendar_month</span>
                <h3 className="text-xl font-bold mb-2">Smart Calendar</h3>
                <p className="text-on-surface-variant text-sm">Automated scheduling and hour tracking with seamless synchronization to your family devices.</p>
              </div>
              {/* Small Card: Security */}
              <div className="md:col-span-4 bg-surface-container-lowest rounded-xl p-8 shadow-sm">
                <span className="material-symbols-outlined text-primary text-3xl mb-4">encrypted</span>
                <h3 className="text-xl font-bold mb-2">Encrypted Comms</h3>
                <p className="text-on-surface-variant text-sm">All medical updates and messaging are secured with enterprise-grade AES-256 encryption.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-24 px-8 bg-surface">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 tracking-tight">Family Reflections</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Testimonial 1 */}
              <div className="p-10 bg-white rounded-xl shadow-xl shadow-slate-200/50 border-t-4 border-primary">
                <div className="flex gap-1 mb-6 text-primary">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-on-surface mb-8 italic text-lg leading-relaxed">&quot;The level of clinical expertise we found through DGCare is unparalleled. It&apos;s not just care; it&apos;s professional health management that feels personal.&quot;</p>
                <div className="flex items-center gap-4">
                  <img className="w-12 h-12 rounded-full object-cover" alt="Sarah Jenkins" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-WrejRAAF9LmDtTCAyHPFdgfXhkwlrx7tQXtKAmk9IhwuWRSC2aZDioplO-EslgBSml8iv2-J57tlbC9TYtzEJmdKSPq-Sno1rzbr_nCl2SxltHGDATgTteqn9SidzAprDFxEe-axVEQORyYLpd1G57KF67cFptJCEwUZ1HyWoIuQM0IhvwVbmzqDeee7_HgYcdocUFEsmwEMJDerqDv3hvebcDN6SfeRKvrVMAv_Cj73C3gXmXnnEmQIhZUP98N1Hb9ACCeOvR0" />
                  <div>
                    <h4 className="font-bold text-sm">Sarah Jenkins</h4>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Premium Member</p>
                  </div>
                </div>
              </div>
              {/* Testimonial 2 */}
              <div className="p-10 bg-white rounded-xl shadow-xl shadow-slate-200/50">
                <div className="flex gap-1 mb-6 text-primary">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-on-surface mb-8 italic text-lg leading-relaxed">&quot;The monitoring dashboard gave us peace of mind while we were away. Seeing real-time updates from our caregiver changed everything for our family.&quot;</p>
                <div className="flex items-center gap-4">
                  <img className="w-12 h-12 rounded-full object-cover" alt="David Chen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBK2QhvE5AL3qeXmzoj8MPXhSNFsB0TT0YguK7b6L0BDaDdRAF8nYv62ekMetb1VbeTh9MGkgKO9WtOyqCTVSk3xmcL4qRkRmVfQstmvdqhmQbCqPuvG2oj27WqW4yFIflqqFe8Trlsl7zcemGUxrGnZbHZoEycE2WTu5pjPym-Fx6ZVGLwKVN03zYy0f9FseEW_PbYfKIxy4xt52m_X2p5QDMZzisMhnQ99snzN5Fc8RMKcHTZz_WHNmVvOoWo2oZG8dnho9oH-kE" />
                  <div>
                    <h4 className="font-bold text-sm">David Chen</h4>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Enterprise User</p>
                  </div>
                </div>
              </div>
              {/* Testimonial 3 */}
              <div className="p-10 bg-white rounded-xl shadow-xl shadow-slate-200/50">
                <div className="flex gap-1 mb-6 text-primary">
                  {[1,2,3,4,5].map(i => (
                    <span key={i} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-on-surface mb-8 italic text-lg leading-relaxed">&quot;I was hesitant about finding care online, but DGCare&apos;s clinical curation process removed all doubt. Our caregiver is now practically family.&quot;</p>
                <div className="flex items-center gap-4">
                  <img className="w-12 h-12 rounded-full object-cover" alt="Robert Miller" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfEoCNyaEUOOfSDvxR-wtnqSZ75Fk7rG-715XVf3p3KIPW6AKQJZbbuT5o3kI1Y5CSzUHJXvk8jcxClpTgPF2iMA2KamavGnAKuzq_OQFZgpWTJX7BF8PnZMmLHY33yDvE0GBrj7PoumJ95inhNPkSxYCS2sPJDxZbqpZswRnEEJVQSMH8Bzoyk9TOrHSi7Z8Y1KU5YlEF1nJzikiozM5FLX_57i2-KC9lZf-3fKkQ713Zp9EjxVldZnAYJ3yufn49-gjVx27BH3w" />
                  <div>
                    <h4 className="font-bold text-sm">Robert Miller</h4>
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest">Verified Family</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary -z-10"></div>
          <div className="absolute top-0 right-0 w-1/2 h-full bg-primary-container opacity-30 transform skew-x-12"></div>
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-5xl font-bold mb-8 tracking-tight">Care Starts with Trust.</h2>
            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">Join the premium network of families and clinicians dedicated to health excellence.</p>
            <div className="flex flex-wrap justify-center gap-6">
              <Link href="/register" className="px-10 py-5 bg-white text-primary rounded-full font-bold text-xl hover:scale-105 transition-transform shadow-2xl">Start Your Search</Link>
              <button className="px-10 py-5 bg-transparent border-2 border-white/30 text-white rounded-full font-bold text-xl hover:bg-white/10 transition-colors">Book a Consultation</button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 dark:bg-slate-900 py-12 px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <div className="flex flex-col gap-4">
            <span className="font-bold text-slate-900 dark:text-white text-2xl">DGCare</span>
            <p className="text-slate-500 text-xs uppercase tracking-widest leading-relaxed">Editorial Healthcare Excellence. Providing elite clinical matches since 2024.</p>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-xs uppercase tracking-widest">
              <li><a className="text-slate-500 hover:text-teal-500 opacity-80 hover:opacity-100 transition-opacity" href="#">Find Caregiver</a></li>
              <li><a className="text-slate-500 hover:text-teal-500 opacity-80 hover:opacity-100 transition-opacity" href="#">Become Caregiver</a></li>
              <li><a className="text-slate-500 hover:text-teal-500 opacity-80 hover:opacity-100 transition-opacity" href="#">Resources</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Legal</h4>
            <ul className="space-y-4 text-xs uppercase tracking-widest">
              <li><a className="text-slate-500 hover:text-teal-500 opacity-80 hover:opacity-100 transition-opacity" href="#">Privacy</a></li>
              <li><a className="text-slate-500 hover:text-teal-500 opacity-80 hover:opacity-100 transition-opacity" href="#">Terms</a></li>
              <li><a className="text-slate-500 hover:text-teal-500 opacity-80 hover:opacity-100 transition-opacity" href="#">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold mb-6">Connect</h4>
            <ul className="space-y-4 text-xs uppercase tracking-widest">
              <li><a className="text-slate-500 hover:text-teal-500 opacity-80 hover:opacity-100 transition-opacity" href="#">Careers</a></li>
              <li><a className="text-slate-500 hover:text-teal-500 opacity-80 hover:opacity-100 transition-opacity" href="#">Newsletter</a></li>
              <li><a className="text-slate-500 hover:text-teal-500 opacity-80 hover:opacity-100 transition-opacity" href="#">Media Kit</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <span className="text-xs uppercase tracking-widest text-slate-400">© 2024 DGCare Platform. Editorial Healthcare Excellence.</span>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-slate-400 hover:text-teal-500 cursor-pointer">public</span>
            <span className="material-symbols-outlined text-slate-400 hover:text-teal-500 cursor-pointer">clinical_notes</span>
          </div>
        </div>
      </footer>
    </>
  );
}
