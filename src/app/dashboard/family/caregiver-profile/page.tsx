'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CaregiverProfile() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-surface text-on-surface antialiased font-body">
      {/* SideNavBar */}
      <aside className="hidden md:flex flex-col p-8 gap-y-6 h-screen w-72 fixed left-0 bg-white border-r border-outline-variant/30 z-40">
        <div className="mb-6">
          <Link href="/">
            <img src="/logo.jpg" alt="DGCare Logo" className="h-10 w-auto mb-2" />
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-outline">Caregiver Database</p>
          </Link>
        </div>
        <nav className="flex-1 space-y-1">
          <Link className="flex items-center gap-3 p-3 text-sm font-semibold text-secondary hover:bg-surface-container rounded-lg transition-colors" href="/dashboard/family">
            <span className="material-symbols-outlined">family_restroom</span>
            <span>Family Dashboard</span>
          </Link>
          <Link className="flex items-center gap-3 p-3 text-sm font-semibold bg-primary/10 text-primary rounded-lg transition-colors" href="/dashboard/family/booking">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person_search</span>
            <span>Caregivers Directory</span>
          </Link>
          <a className="flex items-center gap-3 p-3 text-sm font-semibold text-secondary hover:bg-surface-container rounded-lg transition-colors" href="#">
            <span className="material-symbols-outlined">event_available</span>
            <span>Bookings</span>
          </a>
          <a className="flex items-center gap-3 p-3 text-sm font-semibold text-secondary hover:bg-surface-container rounded-lg transition-colors" href="#">
            <span className="material-symbols-outlined">chat</span>
            <span>Messages</span>
          </a>
          <a className="flex items-center gap-3 p-3 text-sm font-semibold text-secondary hover:bg-surface-container rounded-lg transition-colors" href="#">
            <span className="material-symbols-outlined">monitoring</span>
            <span>Monitoring</span>
          </a>
        </nav>
        <Link href="/dashboard/family/booking" className="mt-auto bg-primary text-center text-on-primary py-3.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all block">
            New Booking
        </Link>
      </aside>

      {/* Main Content Canvas */}
      <main className="flex-1 md:ml-72 p-6 md:p-12 max-w-[1400px]">
        {/* TopAppBar */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-6">
            <button onClick={() => router.back()} className="w-12 h-12 rounded-full flex items-center justify-center border border-outline-variant hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-outline font-extrabold">Caregiver Profile</span>
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight">Priya Sharma</h2>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="w-12 h-12 rounded-full flex items-center justify-center border border-outline-variant hover:bg-surface-container-low transition-colors text-secondary">
              <span className="material-symbols-outlined">share</span>
            </button>
            <button className="w-12 h-12 rounded-full flex items-center justify-center border border-outline-variant hover:bg-surface-container-low transition-colors text-secondary">
              <span className="material-symbols-outlined">favorite</span>
            </button>
          </div>
        </header>

        {/* Bento Layout Profile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Media & Primary Info */}
          <div className="lg:col-span-8 space-y-10">
            {/* Hero Card */}
            <div className="bg-white rounded-2xl p-10 flex flex-col md:flex-row gap-10 border border-outline-variant/20 shadow-sm">
              <div className="w-full md:w-72 h-80 rounded-xl overflow-hidden shadow-md shrink-0">
                <img alt="Caregiver Portrait" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBX7hInPuXEiA6olEpM2g4fj2oEWgZeHSB2tDlRMnpzAeuoYf_QVLXCgBIc20fsBTre4WUvoLEUL5V-oBWfDq3_LwGigEnhpMxZiHBGGGFfHuPkgg6ddRoNMvYFiqgfzESTF0L57N0THfuMjVByFgQcF1kEqzTSC85KR__9XIm8PjoCGlvSzLtxEvZq8Jt4LPG3Dxkj3SNEjhVdQRNnnWgMlKDgltJJTOJpHqSNCT9BhSzrH1hPvurJuL1XaatYo6grfhlLQKTZpy9F" />
              </div>
              <div className="flex-1 space-y-6">
                <div className="flex flex-wrap gap-3">
                  <span className="bg-primary/10 text-primary text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-primary/20">
                    <span className="material-symbols-outlined text-[14px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    Professional Caregiver
                  </span>
                  <span className="bg-amber-50 text-amber-800 text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1.5 border border-amber-200/50">
                    <span className="material-symbols-outlined text-[14px]">home_pin</span>
                    DGCare Verified
                  </span>
                </div>
                <h1 className="text-5xl font-extrabold text-on-surface tracking-tighter">Priya Sharma</h1>
                <p className="text-secondary text-lg leading-relaxed">
                  Certified Senior Caregiver (GNM, HHA) with 12 years of clinical expertise in Maharashtra, now offering hybrid care that blends professional medical support with warm, community-focused companionship. Fluent in English, Hindi, and Marathi.
                </p>

                {/* Interests Section */}
                <div className="pt-2">
                  <p className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-3">Interests & Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="flex items-center gap-1.5 px-3 py-1.5 interest-badge rounded-lg text-xs font-bold border border-gray-200">
                      <span className="material-symbols-outlined text-[16px]">potted_plant</span>
                      Gardening
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 interest-badge rounded-lg text-xs font-bold border border-gray-200">
                      <span className="material-symbols-outlined text-[16px]">auto_stories</span>
                      Storytelling
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 interest-badge rounded-lg text-xs font-bold border border-gray-200">
                      <span className="material-symbols-outlined text-[16px]">pets</span>
                      Pet Friendly
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 interest-badge rounded-lg text-xs font-bold border border-gray-200">
                      <span className="material-symbols-outlined text-[16px]">restaurant</span>
                      Healthy Indian Diet
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1.5 interest-badge rounded-lg text-xs font-bold border border-gray-200">
                      <span className="material-symbols-outlined text-[16px]">music_note</span>
                      Classical Music
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-8 pt-6 border-t border-outline-variant/10">
                  <div>
                    <p className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">Rating</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl font-extrabold">4.9</span>
                      <span className="material-symbols-outlined text-amber-500 text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">Tenure</p>
                    <p className="text-2xl font-extrabold text-on-surface">12y</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-1">Base Rate</p>
                    <p className="text-2xl font-extrabold text-on-surface">₹450<span className="text-sm font-medium text-outline">/hr</span></p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Intro Section */}
            <div className="relative group aspect-video bg-surface-container-high rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent z-10"></div>
              <img alt="Cinematic interior" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9-BcVtp1T7KAyyWAKXpPz8bjw9OHhZukVm4uIZ6ty6VTfdKEJok5QZZ_Xw0kEpWz5b0bSSqIx_zkN3pRfvIA6vy3rKDDV3mw8uoEKy_Jq2Rj2pD_SbrRApQa6gWRKHPOO8tfkl8G-s9Np5HU70gKXsgdhQPjSo-7Z3d3YfeMNyK07ISjHAP2J6c82TBrCY862ngnsjO792jvaDrv9HK-xlwEOoZG0KcKjM_nH3mUiGNYNG4CSLDLZO5ovcgXGZ7AjXq-E_PmkK7Bh" />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <button className="w-24 h-24 bg-white/20 backdrop-blur-xl border border-white/30 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all">
                  <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                </button>
              </div>
              <div className="absolute bottom-8 left-10 z-20">
                <h3 className="text-white text-2xl font-extrabold tracking-tight">Philosophy: Beyond the Chart</h3>
                <p className="text-white/80 font-medium">2:14 • Merging clinical rigor with local compassion</p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-8">
              <div className="flex justify-between items-end border-b border-outline-variant/20 pb-4">
                <h3 className="text-3xl font-extrabold tracking-tight">Recent Feedback</h3>
                <button className="text-primary font-bold text-sm flex items-center gap-1 hover:underline">
                  View all 142 testimonials <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl border border-outline-variant/20 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary">SJ</div>
                    <div>
                      <p className="font-extrabold text-sm">Shruti Joshi</p>
                      <div className="flex text-amber-500">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-secondary leading-relaxed italic text-sm">"Priya provided exceptional clinical care, but it was the small things—like making my mother's favorite local dish perfectly—that truly made her feel like family."</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl border border-outline-variant/20 shadow-sm">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary">RM</div>
                    <div>
                      <p className="font-extrabold text-sm">Rahul Mehta</p>
                      <div className="flex text-amber-500">
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-secondary leading-relaxed italic text-sm">"Highly professional and extremely reliable. She handles medication management and complex mobility needs with absolute confidence. Grateful to connect with her via DGCare."</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Booking & Availability */}
          <div className="lg:col-span-4 space-y-10">
            {/* Availability Card */}
            <div className="bg-white rounded-2xl p-8 border border-outline-variant/20 shadow-md sticky top-12">
              <h3 className="text-xl font-extrabold mb-6 tracking-tight">Flexible Availability</h3>
              
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-sm">May 2026</span>
                <div className="flex gap-1">
                  <button className="p-1.5 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined text-lg">chevron_left</span></button>
                  <button className="p-1.5 hover:bg-surface-container rounded-full transition-colors"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-8 text-center">
                <span className="text-[10px] font-extrabold text-outline/50">M</span>
                <span className="text-[10px] font-extrabold text-outline/50">T</span>
                <span className="text-[10px] font-extrabold text-outline/50">W</span>
                <span className="text-[10px] font-extrabold text-outline/50">T</span>
                <span className="text-[10px] font-extrabold text-outline/50">F</span>
                <span className="text-[10px] font-extrabold text-outline/50">S</span>
                <span className="text-[10px] font-extrabold text-outline/50">S</span>
                
                {/* Mini Calendar Items */}
                <div className="aspect-square flex items-center justify-center text-xs text-outline/30">27</div>
                <div className="aspect-square flex items-center justify-center text-xs text-outline/30">28</div>
                <div className="aspect-square flex items-center justify-center text-xs text-outline/30">29</div>
                <div className="aspect-square flex items-center justify-center text-xs font-extrabold bg-primary text-on-primary rounded-lg shadow-sm">30</div>
                <div className="aspect-square flex items-center justify-center text-xs font-semibold hover:bg-surface-container rounded-lg cursor-pointer">1</div>
                <div className="aspect-square flex items-center justify-center text-xs font-semibold hover:bg-surface-container rounded-lg cursor-pointer">2</div>
                <div className="aspect-square flex items-center justify-center text-xs font-semibold hover:bg-surface-container rounded-lg cursor-pointer">3</div>
                <div className="aspect-square flex items-center justify-center text-xs font-semibold bg-primary/5 text-primary rounded-lg border border-primary/10">4</div>
                <div className="aspect-square flex items-center justify-center text-xs font-semibold bg-primary/5 text-primary rounded-lg border border-primary/10">5</div>
                <div className="aspect-square flex items-center justify-center text-xs font-semibold hover:bg-surface-container rounded-lg cursor-pointer">6</div>
              </div>

              {/* Weekly Breakdown */}
              <div className="mb-8 border-t border-outline-variant/10 pt-6">
                <p className="text-[10px] text-outline font-extrabold uppercase tracking-widest mb-4">Typical Weekly Schedule</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="w-10 font-bold text-outline">Mon-Fri</span>
                    <div className="flex-1 flex gap-1 justify-end">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md font-bold border border-emerald-100">Morning</span>
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md font-bold border border-emerald-100">Afternoon</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded-md font-medium italic border border-gray-100">Evening</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="w-10 font-bold text-outline">Sat</span>
                    <div className="flex-1 flex gap-1 justify-end">
                      <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-md font-bold border border-emerald-100">Morning</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded-md font-medium italic border border-gray-100">Afternoon</span>
                      <span className="px-2 py-1 bg-gray-50 text-gray-400 rounded-md font-medium italic border border-gray-100">Evening</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-outline/50">
                    <span className="w-10 font-bold">Sun</span>
                    <span className="italic font-medium">Rest Day</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-surface-container-low rounded-xl mb-8 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-outline">
                  <span>Session Type</span>
                  <span className="text-on-surface">Flexi-Care</span>
                </div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wide text-outline">
                  <span>Base Rate</span>
                  <span className="text-primary text-base font-extrabold tracking-tight">₹1800.00 / 4h</span>
                </div>
              </div>

              <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-extrabold text-lg shadow-xl shadow-primary/10 hover:shadow-primary/20 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
                <span className="material-symbols-outlined">calendar_today</span>
                Book Priya Sharma
              </button>
              <p className="text-[10px] text-center mt-6 text-outline font-extrabold uppercase tracking-widest">Flexible rescheduling • Secure Payments via UPI</p>
            </div>

            {/* Skills Detail Card */}
            <div className="bg-surface-container rounded-2xl p-8 space-y-8 border border-outline-variant/10">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-outline mb-4">Clinical Mastery</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm font-semibold text-secondary">
                    <span className="material-symbols-outlined text-primary text-[18px]">medical_services</span>
                    <span>Medication Administration</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm font-semibold text-secondary">
                    <span className="material-symbols-outlined text-primary text-[18px]">transfer_within_a_station</span>
                    <span>Safe Mobility & Transfers</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-[0.2em] text-outline mb-4">Community & Home</h4>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm font-semibold text-secondary">
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">potted_plant</span>
                    <span>Adaptive Gardening Therapy</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm font-semibold text-secondary">
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">auto_stories</span>
                    <span>Reminiscence & Storytelling</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm font-semibold text-secondary">
                    <span className="material-symbols-outlined text-amber-600 text-[18px]">shopping_basket</span>
                    <span>Curated Grocery Shopping</span>
                  </li>
                </ul>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
