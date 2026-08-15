'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import {
  User,
  ShoppingBag,
  MapPin,
  Sparkles,
  CreditCard,
  HelpCircle,
  MessageCircle,
  Bell,
  FileText,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Edit3,
  X,
  Check,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface CustomerDashboardProps {
  initialUser: {
    id: string;
    email: string;
    created_at: string;
  };
  initialProfile: {
    id: string;
    full_name: string | null;
    phone_number: string | null;
    address: any;
    role: string;
    created_at: string;
  } | null;
  initialOrders: any[];
}

export default function CustomerDashboard({
  initialUser,
  initialProfile,
  initialOrders,
}: CustomerDashboardProps) {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState(initialProfile);
  const [orders] = useState(initialOrders || []);

  // UI state
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditAddressOpen, setIsEditAddressOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isMomoModalOpen, setIsMomoModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isReleaseNotesOpen, setIsReleaseNotesOpen] = useState(false);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);

  // Form states
  const [fullNameInput, setFullNameInput] = useState(profile?.full_name || '');
  const [phoneInput, setPhoneInput] = useState(profile?.phone_number || '');
  const [savingProfile, setSavingProfile] = useState(false);

  // Address Form state
  const currentAddress = profile?.address || {};
  const [streetInput, setStreetInput] = useState(currentAddress.street || '');
  const [cityInput, setCityInput] = useState(currentAddress.city || '');
  const [regionInput, setRegionInput] = useState(currentAddress.region || 'Greater Accra');
  const [postalCodeInput, setPostalCodeInput] = useState(currentAddress.postal_code || '');
  const [digitalAddressInput, setDigitalAddressInput] = useState(currentAddress.digital_address || '');
  const [savingAddress, setSavingAddress] = useState(false);

  // Notification toggle
  const [dropAlerts, setDropAlerts] = useState(true);

  // Formatted date
  const memberYear = new Date(initialUser.created_at || profile?.created_at || Date.now()).getFullYear();

  // Order stats
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'pending' || o.status === 'processing'
  ).length;

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: initialUser.id,
        full_name: fullNameInput,
        phone_number: phoneInput,
      })
      .select()
      .single();

    if (!error && data) {
      setProfile((prev: any) => ({ ...prev, ...data }));
      setIsEditProfileOpen(false);
    }
    setSavingProfile(false);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAddress(true);

    const updatedAddress = {
      street: streetInput,
      city: cityInput,
      region: regionInput,
      postal_code: postalCodeInput,
      digital_address: digitalAddressInput,
    };

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: initialUser.id,
        address: updatedAddress,
      })
      .select()
      .single();

    if (!error && data) {
      setProfile((prev: any) => ({ ...prev, ...data }));
      setIsEditAddressOpen(false);
    }
    setSavingAddress(false);
  };

  // Avatar initials
  const initials = (profile?.full_name || initialUser.email)
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-[#0B0B0C] text-white pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Top Bar / Breadcrumb */}
        <div className="flex items-center justify-between mb-8 text-sm">
          <div className="flex items-center gap-2 text-zinc-500">
            <Link href="/" className="hover:text-[#FFC800] transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-zinc-300 font-medium">Account</span>
          </div>

          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 text-zinc-400 hover:text-red-400 transition-colors text-xs uppercase tracking-widest px-3 py-1.5 rounded-lg border border-zinc-800/80 hover:border-red-500/30 bg-[#141416]"
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-[#141416] border border-zinc-800 rounded-2xl p-6 lg:p-8 mb-8 relative overflow-hidden shadow-xl">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FFC800]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-5">
              {/* Avatar with Electric Yellow Ring */}
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-zinc-900 border-2 border-[#FFC800] shadow-[0_0_15px_rgba(255,200,0,0.25)] flex items-center justify-center text-xl font-bold font-mono text-[#FFC800] tracking-wider">
                  {initials || 'WY'}
                </div>
                <div className="absolute bottom-0 right-0 w-5 h-5 bg-[#10b981] border-2 border-[#141416] rounded-full" title="Active" />
              </div>

              {/* User Identity */}
              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
                    {profile?.full_name || 'WEAR YUNG Member'}
                  </h1>

                  {/* VIP Status Chip */}
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase bg-[#FFC800]/10 text-[#FFC800] border border-[#FFC800]/30">
                    <Sparkles size={11} /> VIP DROP ACCESS
                  </span>
                </div>

                <div className="flex items-center gap-3 mt-1.5 text-zinc-400 text-xs flex-wrap">
                  <span>{initialUser.email}</span>
                  <span>•</span>
                  <span className="text-zinc-500">Member since {memberYear}</span>
                  {profile?.phone_number && (
                    <>
                      <span>•</span>
                      <span className="text-zinc-400">{profile.phone_number}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Edit Profile Action */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-zinc-900 border border-zinc-700/70 hover:border-[#FFC800] text-zinc-200 hover:text-white transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <Edit3 size={13} />
                <span>Edit Profile</span>
              </button>

              {profile?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase bg-[#FFC800] text-black hover:bg-yellow-400 transition-colors shadow-sm"
                >
                  <span>Admin Portal</span>
                  <ExternalLink size={13} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Quick Metric Cards (2-Column Grid on Web) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

          {/* My Orders Card */}
          <div className="bg-[#141416] border border-zinc-800 hover:border-zinc-700 transition-all rounded-2xl p-6 group flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                  My Orders
                </span>
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FFC800] group-hover:scale-105 transition-transform">
                  <ShoppingBag size={18} />
                </div>
              </div>

              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-3xl lg:text-4xl font-bold font-mono text-white">
                  {totalOrdersCount}
                </span>
                <span className="text-xs text-zinc-500 uppercase tracking-wider">
                  Total Orders Placed
                </span>
              </div>

              <p className="text-xs text-zinc-400">
                {pendingOrdersCount > 0 ? (
                  <span className="text-[#FFC800] font-medium flex items-center gap-1.5">
                    <Clock size={12} /> {pendingOrdersCount} order{pendingOrdersCount > 1 ? 's' : ''} currently in fulfillment
                  </span>
                ) : (
                  'All shipments completed & delivered.'
                )}
              </p>
            </div>

            <button
              onClick={() => setIsOrdersModalOpen(true)}
              className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-[#FFC800] hover:text-yellow-400 tracking-wider uppercase group-hover:translate-x-0.5 transition-transform text-left"
            >
              <span>View Order History</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Saved Addresses Card */}
          <div className="bg-[#141416] border border-zinc-800 hover:border-zinc-700 transition-all rounded-2xl p-6 group flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold tracking-widest text-zinc-400 uppercase">
                  Saved Delivery Address
                </span>
                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-[#FFC800] group-hover:scale-105 transition-transform">
                  <MapPin size={18} />
                </div>
              </div>

              {currentAddress.street ? (
                <div>
                  <p className="text-sm font-semibold text-white mb-1">
                    {currentAddress.street}
                  </p>
                  <p className="text-xs text-zinc-400">
                    {currentAddress.city}, {currentAddress.region}{' '}
                    {currentAddress.postal_code && `(${currentAddress.postal_code})`}
                  </p>
                  {currentAddress.digital_address && (
                    <p className="text-[11px] font-mono text-zinc-500 mt-1">
                      GPS: {currentAddress.digital_address}
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <p className="text-sm text-zinc-300 font-medium">No primary address saved</p>
                  <p className="text-xs text-zinc-500 mt-1">
                    Add your shipping address for one-click checkout on exclusive drops.
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsEditAddressOpen(true)}
              className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs font-bold text-[#FFC800] hover:text-yellow-400 tracking-wider uppercase group-hover:translate-x-0.5 transition-transform text-left"
            >
              <span>{currentAddress.street ? 'Edit Address' : 'Add Address'}</span>
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Streetwear Exclusive Banner (WEAR YUNG DROP PASS) */}
        <div className="bg-gradient-to-r from-[#18181B] via-[#151518] to-[#18181B] border border-[#FFC800]/25 rounded-2xl p-6 lg:p-7 mb-8 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-full bg-[#FFC800]/10 blur-2xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FFC800] animate-pulse" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#FFC800]">
                  ACTIVE MEMBERSHIP
                </span>
              </div>
              <h2 className="text-xl lg:text-2xl font-bold tracking-wide text-white uppercase">
                WEAR YUNG DROP PASS — 2026 TIER
              </h2>
              <p className="text-xs text-zinc-400 max-w-xl leading-relaxed">
                Enjoy 15-minute early access to all Friday capsule drops, free priority Accra/Kumasi courier dispatch, and private archive restocks.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#FFC800] hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
            >
              <Package size={14} />
              <span>Explore Latest Drops</span>
            </Link>
          </div>
        </div>

        {/* Settings & Utility Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Column 1: Payment & Billing */}
          <div className="bg-[#141416] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-800/80">
                <CreditCard size={16} className="text-[#FFC800]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                  Payment & Billing
                </h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsMomoModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left group"
                >
                  <span className="text-xs text-zinc-300 font-medium">
                    MoMo & Card Receipts
                  </span>
                  <ChevronRight size={14} className="text-zinc-500 group-hover:text-[#FFC800] group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 mt-6">
              Receipts are issued instantly upon payment confirmation.
            </p>
          </div>

          {/* Column 2: Concierge & Support */}
          <div className="bg-[#141416] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-800/80">
                <HelpCircle size={16} className="text-[#FFC800]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                  Concierge & Support
                </h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsFaqModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left group"
                >
                  <span className="text-xs text-zinc-300 font-medium">
                    Help Center & Sizing FAQs
                  </span>
                  <ChevronRight size={14} className="text-zinc-500 group-hover:text-[#FFC800] group-hover:translate-x-0.5 transition-all" />
                </button>

                <a
                  href="https://wa.me/2335959738962?text=Hello%20WEAR%20YUNG%20Concierge,%20I%20need%20assistance"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left group"
                >
                  <div className="flex items-center gap-2">
                    <MessageCircle size={14} className="text-emerald-400" />
                    <span className="text-xs text-zinc-300 font-medium">
                      WhatsApp VIP Concierge
                    </span>
                  </div>
                  <ExternalLink size={13} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                </a>

                {/* Drop Alerts Toggle */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 border border-zinc-800">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-[#FFC800]" />
                    <span className="text-xs text-zinc-300 font-medium">
                      Drop Push Alerts
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDropAlerts(!dropAlerts)}
                    className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                      dropAlerts ? 'bg-[#FFC800]' : 'bg-zinc-800'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-black transition-transform ${
                        dropAlerts ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-zinc-500 mt-6">
              VIP Concierge response time: &lt; 15 mins.
            </p>
          </div>

          {/* Column 3: Brand & Legal */}
          <div className="bg-[#141416] border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-zinc-800/80">
                <ShieldCheck size={16} className="text-[#FFC800]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-300">
                  Brand & Legal
                </h3>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => setIsReleaseNotesOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left group"
                >
                  <span className="text-xs text-zinc-300 font-medium">
                    Release Notes & What&apos;s New
                  </span>
                  <ChevronRight size={14} className="text-zinc-500 group-hover:text-[#FFC800] group-hover:translate-x-0.5 transition-all" />
                </button>

                <button
                  onClick={() => setIsLegalModalOpen(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all text-left group"
                >
                  <span className="text-xs text-zinc-300 font-medium">
                    Terms & Privacy Policy
                  </span>
                  <ChevronRight size={14} className="text-zinc-500 group-hover:text-[#FFC800] group-hover:translate-x-0.5 transition-all" />
                </button>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 mt-6">
              © {new Date().getFullYear()} WEAR YUNG LLC.
            </p>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MODALS & DRAWERS */}
      {/* ========================================================================= */}

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {isEditProfileOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141416] border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Edit Personal Details
                </h3>
                <button
                  onClick={() => setIsEditProfileOpen(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullNameInput}
                    onChange={(e) => setFullNameInput(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#FFC800]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+233 55 000 0000"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#FFC800]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={initialUser.email}
                    disabled
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900/40 border border-zinc-800/60 text-zinc-500 text-sm cursor-not-allowed"
                  />
                  <span className="text-[10px] text-zinc-500 mt-1 block">
                    Email cannot be changed directly for security.
                  </span>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="flex-1 py-3 rounded-xl bg-[#FFC800] hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    {savingProfile ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Address Modal */}
      <AnimatePresence>
        {isEditAddressOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141416] border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Update Delivery Address
                </h3>
                <button
                  onClick={() => setIsEditAddressOpen(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-1.5">
                    Street / House / Landmark
                  </label>
                  <input
                    type="text"
                    value={streetInput}
                    onChange={(e) => setStreetInput(e.target.value)}
                    placeholder="e.g. 14 Boundary Road, East Legon"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#FFC800]"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-1.5">
                      City / Town
                    </label>
                    <input
                      type="text"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      placeholder="Accra"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#FFC800]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-1.5">
                      Region
                    </label>
                    <select
                      value={regionInput}
                      onChange={(e) => setRegionInput(e.target.value)}
                      className="w-full px-3 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#FFC800]"
                    >
                      <option value="Greater Accra">Greater Accra</option>
                      <option value="Ashanti">Ashanti</option>
                      <option value="Western">Western</option>
                      <option value="Central">Central</option>
                      <option value="Eastern">Eastern</option>
                      <option value="Volta">Volta</option>
                      <option value="Northern">Northern</option>
                      <option value="Other">Other Region</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-1.5">
                      Ghana Post GPS
                    </label>
                    <input
                      type="text"
                      value={digitalAddressInput}
                      onChange={(e) => setDigitalAddressInput(e.target.value)}
                      placeholder="e.g. GA-183-9021"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#FFC800]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-zinc-400 mb-1.5">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      value={postalCodeInput}
                      onChange={(e) => setPostalCodeInput(e.target.value)}
                      placeholder="00233"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm focus:outline-none focus:border-[#FFC800]"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsEditAddressOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="flex-1 py-3 rounded-xl bg-[#FFC800] hover:bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    {savingAddress ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Orders Modal */}
      <AnimatePresence>
        {isOrdersModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141416] border border-zinc-800 rounded-2xl w-full max-w-2xl max-h-[85vh] p-6 relative shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800">
                <div>
                  <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                    Order History & Dispatches
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {orders.length} order{orders.length === 1 ? '' : 's'} placed under this account
                  </p>
                </div>
                <button
                  onClick={() => setIsOrdersModalOpen(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag size={36} className="mx-auto text-zinc-600 mb-3" />
                    <p className="text-sm font-semibold text-zinc-300">No orders found</p>
                    <p className="text-xs text-zinc-500 mt-1">
                      Explore our catalog to place your first streetwear order.
                    </p>
                    <Link
                      href="/shop"
                      onClick={() => setIsOrdersModalOpen(false)}
                      className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-xl bg-[#FFC800] text-black font-bold text-xs uppercase"
                    >
                      Go to Shop
                    </Link>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col gap-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[11px] font-mono text-zinc-500 block">
                            ORDER #{order.id.slice(0, 8)}
                          </span>
                          <span className="text-xs text-zinc-400">
                            {new Date(order.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-[#FFC800] block">
                            GH₵ {order.total_amount}
                          </span>
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                            {order.status}
                          </span>
                        </div>
                      </div>

                      {order.order_items && order.order_items.length > 0 && (
                        <div className="pt-2 border-t border-zinc-800 text-xs text-zinc-400 space-y-1">
                          {order.order_items.map((item: any) => (
                            <div key={item.id} className="flex justify-between">
                              <span>
                                {item.product_variants?.products?.title || 'Item'} × {item.quantity}
                              </span>
                              <span className="text-zinc-300 font-mono">
                                GH₵ {item.unit_price}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MoMo & Receipts Modal */}
      <AnimatePresence>
        {isMomoModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141416] border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Billing & MoMo Receipts
                </h3>
                <button
                  onClick={() => setIsMomoModalOpen(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs text-zinc-400">
                <p>
                  All digital receipts and Mobile Money confirmations for purchases made through Paystack or Stripe are emailed directly to:
                </p>
                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-xl font-mono text-zinc-200">
                  {initialUser.email}
                </div>
                <p>
                  Need an official VAT invoice or custom corporate receipt? Please message the concierge team via WhatsApp with your Order ID.
                </p>
              </div>

              <button
                onClick={() => setIsMomoModalOpen(false)}
                className="w-full mt-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* FAQs Modal */}
      <AnimatePresence>
        {isFaqModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141416] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Concierge FAQ & Sizing
                </h3>
                <button
                  onClick={() => setIsFaqModalOpen(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4 text-xs text-zinc-300 max-h-96 overflow-y-auto pr-1">
                <div>
                  <p className="font-bold text-white mb-1">How do Friday Capsule Drops work?</p>
                  <p className="text-zinc-400 leading-relaxed">
                    Drops occur every Friday at 6:00 PM GMT. VIP members get instant priority checkout 15 minutes before public unlock.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">What are the delivery timelines?</p>
                  <p className="text-zinc-400 leading-relaxed">
                    Same-day delivery in Greater Accra for orders before 2:00 PM. Nationwide deliveries across Ghana take 24–48 hours.
                  </p>
                </div>
                <div>
                  <p className="font-bold text-white mb-1">How do WEAR YUNG hoodies fit?</p>
                  <p className="text-zinc-400 leading-relaxed">
                    Our silhouettes feature a heavy-weight, dropped-shoulder boxy cut. True to size for a streetwear drape, or size down for tailored fit.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsFaqModalOpen(false)}
                className="w-full mt-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider"
              >
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Release Notes Modal */}
      <AnimatePresence>
        {isReleaseNotesOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141416] border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Release Notes — v2.4
                </h3>
                <button
                  onClick={() => setIsReleaseNotesOpen(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-3 text-xs text-zinc-400">
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#FFC800] mt-0.5 flex-shrink-0" />
                  <span>Real-time Supabase Auth & Account Sync integration.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#FFC800] mt-0.5 flex-shrink-0" />
                  <span>VIP Drop Pass tier access enabled for 2026 registered accounts.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-[#FFC800] mt-0.5 flex-shrink-0" />
                  <span>Enhanced delivery address book with Ghana Post GPS support.</span>
                </div>
              </div>

              <button
                onClick={() => setIsReleaseNotesOpen(false)}
                className="w-full mt-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Legal & Privacy Modal */}
      <AnimatePresence>
        {isLegalModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#141416] border border-zinc-800 rounded-2xl w-full max-w-md p-6 relative shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5 pb-4 border-b border-zinc-800">
                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                  Terms & Privacy
                </h3>
                <button
                  onClick={() => setIsLegalModalOpen(false)}
                  className="text-zinc-400 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="text-xs text-zinc-400 space-y-3 leading-relaxed">
                <p>
                  WEAR YUNG respects your privacy. All customer data is secured with enterprise Row Level Security (RLS) policies.
                </p>
                <p>
                  Orders placed during exclusive drop windows are final sale due to limited inventory allocation.
                </p>
              </div>

              <button
                onClick={() => setIsLegalModalOpen(false)}
                className="w-full mt-6 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider"
              >
                I Understand
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
