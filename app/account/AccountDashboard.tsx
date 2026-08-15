'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, Package, Heart, User as UserIcon } from 'lucide-react';

type Tab = 'profile' | 'orders' | 'wishlist';

interface AccountDashboardProps {
  user: any;
  orders: any[];
  wishlist: any[];
}

export default function AccountDashboard({ user, orders, wishlist }: AccountDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const tabs = [
    { id: 'profile', label: 'PROFILE', icon: <UserIcon size={18} /> },
    { id: 'orders', label: 'ORDERS', icon: <Package size={18} /> },
    { id: 'wishlist', label: 'WISHLIST', icon: <Heart size={18} /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start">
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 flex flex-col gap-2 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className="flex items-center gap-3 px-4 py-3 rounded-md text-left font-display text-lg tracking-wide transition-all duration-200"
            style={{
              background: activeTab === tab.id ? 'var(--wy-yellow)' : 'transparent',
              color: activeTab === tab.id ? '#000000' : 'var(--wy-muted)',
              border: activeTab === tab.id ? 'none' : '1px solid transparent',
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        
        <div className="h-px bg-zinc-800 my-4" />
        
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-4 py-3 text-left font-display text-lg tracking-wide text-red-500 hover:bg-red-500/10 rounded-md transition-colors"
        >
          <LogOut size={18} />
          SIGN OUT
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full bg-[#0D0D0D] border border-zinc-800/50 rounded-xl p-6 lg:p-10 min-h-[500px]">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div
              key="profile"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-display text-3xl">PROFILE DETAILS</h2>
                {user.profile?.role === 'admin' && (
                  <a
                    href="/admin"
                    className="bg-wy-yellow text-black font-display px-4 py-2 rounded-md hover:bg-yellow-400 text-sm"
                  >
                    GO TO ADMIN PORTAL →
                  </a>
                )}
              </div>
              <div className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
                  <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300">
                    {user.email}
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Full Name</label>
                  <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300">
                    {user.profile?.full_name || 'Not provided'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-zinc-500 mb-2">Account Role</label>
                  <div className="px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-md text-zinc-300 capitalize">
                    {user.profile?.role || 'Customer'}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-3xl mb-6">ORDER HISTORY</h2>
              
              {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-xl">
                  <Package size={48} className="text-zinc-700 mb-4" />
                  <h3 className="text-xl font-display mb-2">NO ORDERS YET</h3>
                  <p className="text-zinc-500 mb-6 text-sm">You haven't placed any orders with us yet.</p>
                  <Link href="/shop" className="btn btn-primary">
                    START SHOPPING
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="p-5 border border-zinc-800 rounded-lg bg-zinc-900/50">
                      <div className="flex justify-between items-start mb-4 border-b border-zinc-800 pb-4">
                        <div>
                          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-display text-xl text-yellow-500">GH₵ {order.total_amount}</p>
                          <span className="inline-block mt-1 px-2 py-1 text-[10px] uppercase tracking-wider bg-zinc-800 rounded-sm">
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        {order.order_items?.map((item: any) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-3">
                              <span className="text-zinc-500">{item.quantity}x</span>
                              <span>{item.product_variants?.products?.title || 'Unknown Product'}</span>
                            </div>
                            <span className="text-zinc-400">GH₵ {item.unit_price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'wishlist' && (
            <motion.div
              key="wishlist"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="font-display text-3xl mb-6">SAVED ITEMS</h2>
              
              {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-xl">
                  <Heart size={48} className="text-zinc-700 mb-4" />
                  <h3 className="text-xl font-display mb-2">WISHLIST IS EMPTY</h3>
                  <p className="text-zinc-500 mb-6 text-sm">Save items you love to your wishlist to easily find them later.</p>
                  <Link href="/shop" className="btn btn-outline">
                    EXPLORE COLLECTION
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {wishlist.map((item) => {
                    const product = item.products;
                    if (!product) return null;
                    const image = product.images?.[0] || 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=1000&q=80';
                    const price = product.variants?.[0]?.price || 0;

                    return (
                      <Link href={`/product/${product.slug}`} key={item.id} className="group relative block aspect-[4/5] bg-zinc-900 rounded-xl overflow-hidden">
                        <Image
                          src={image}
                          alt={product.title}
                          fill
                          style={{ objectFit: 'cover' }}
                          className="transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        
                        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="font-display text-lg truncate">{product.title}</p>
                          <p className="text-yellow-500 text-sm font-bold">GH₵ {price}</p>
                        </div>
                        
                        {/* Remove from wishlist button would go here ideally */}
                      </Link>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
