import type { Metadata } from 'next';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import StoreMap from '@/components/StoreMap';
import { STORE_LOCATION } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with WEAR YUNG support. We are here to help with your premium streetwear orders, sizing, and general inquiries.',
};

export default function ContactPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8F9FA', color: '#18181B', paddingTop: '4rem' }}>
      {/* Main Content Grid */}
      <section className="section-wy" style={{ padding: '2rem 0 6rem' }}>
        <div className="container-wy">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
            }}
          >
            {/* Left Column: Contact Information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', paddingTop: '1rem' }}>
              <div>
                <h1
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '2.5rem',
                    color: '#18181B',
                    letterSpacing: '0.02em',
                    marginBottom: '1rem',
                    textTransform: 'uppercase'
                  }}
                >
                  Contact Support
                </h1>
                <p style={{ color: '#52525B', marginBottom: '2.5rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
                  Reach out through any of the channels below. Our team is available and ready to assist you with orders, sizing, or general inquiries. We typically respond within 24 hours.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Phone */}
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        background: '#FFFFFF',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: '#D4A000',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <Phone size={22} />
                    </div>
                    <div style={{ paddingTop: '0.25rem' }}>
                      <h3 style={{ color: '#18181B', fontWeight: 700, marginBottom: '0.25rem', fontSize: '1.05rem' }}>Phone Lines</h3>
                      <p style={{ color: '#3F3F46', fontSize: '0.95rem', marginBottom: '0.35rem', fontWeight: 600 }}>
                        0545355585
                      </p>
                      <div style={{ color: '#71717A', fontSize: '0.85rem', lineHeight: 1.5 }}>
                        <p style={{ fontWeight: 600, color: '#52525B', marginBottom: '0.15rem' }}>Shop Opening Hours:</p>
                        <p>Mon - Sat: 8:30am – 10:30pm</p>
                        <p>Sun: 1:00pm – 10:00pm</p>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp */}
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        background: '#FFFFFF',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: '#D4A000',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <MessageSquare size={22} />
                    </div>
                    <div style={{ paddingTop: '0.25rem' }}>
                      <h3 style={{ color: '#18181B', fontWeight: 700, marginBottom: '0.25rem', fontSize: '1.05rem' }}>WhatsApp Support</h3>
                      <p style={{ color: '#3F3F46', fontSize: '0.95rem', marginBottom: '0.25rem', fontWeight: 600 }}>
                        0545355585 (@WEAR_YUNG)
                      </p>
                      <a href="https://wa.me/233545355585" target="_blank" rel="noopener noreferrer" style={{ color: '#D4A000', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }} className="hover:underline">
                        Chat on WhatsApp (0545355585) &rarr;
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        background: '#FFFFFF',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: '#D4A000',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <Mail size={22} />
                    </div>
                    <div style={{ paddingTop: '0.25rem' }}>
                      <h3 style={{ color: '#18181B', fontWeight: 700, marginBottom: '0.25rem', fontSize: '1.05rem' }}>Email Address</h3>
                      <p style={{ color: '#3F3F46', fontSize: '0.95rem', fontWeight: 600 }}>
                        wearyungworldwide@gmail.com
                      </p>
                    </div>
                  </div>

                  {/* Address */}
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                    <div
                      style={{
                        background: '#FFFFFF',
                        padding: '1rem',
                        borderRadius: '12px',
                        color: '#D4A000',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <MapPin size={22} />
                    </div>
                    <div style={{ paddingTop: '0.25rem' }}>
                      <h3 style={{ color: '#18181B', fontWeight: 700, marginBottom: '0.25rem', fontSize: '1.05rem' }}>Headquarters</h3>
                      <p style={{ color: '#3F3F46', fontSize: '0.95rem', lineHeight: 1.6 }}>
                        Koforidua, behind B Foster Bakery<br />
                        Ghana
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div style={{ marginTop: '1rem' }}>
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    color: '#71717A',
                    letterSpacing: '0.1em',
                    marginBottom: '1rem',
                    textTransform: 'uppercase'
                  }}
                >
                  Follow Us
                </h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <a
                    href="#"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '50%',
                      color: '#18181B',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      transition: 'all 200ms ease',
                    }}
                    className="hover:border-[#D4A000] hover:text-[#D4A000]"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                  <a
                    href="#"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '44px',
                      height: '44px',
                      background: '#FFFFFF',
                      border: '1px solid #E5E7EB',
                      borderRadius: '50%',
                      color: '#18181B',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                      transition: 'all 200ms ease',
                    }}
                    className="hover:border-[#D4A000] hover:text-[#D4A000]"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Right Column: Support Form */}
            <div>
              <div
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '16px',
                  padding: 'clamp(1.5rem, 5vw, 3rem) clamp(1.2rem, 4vw, 2.5rem)',
                  boxShadow: '0 10px 40px -10px rgba(0,0,0,0.04)',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.75rem',
                    color: '#18181B',
                    letterSpacing: '0.02em',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase'
                  }}
                >
                  Send a Message
                </h2>
                <p style={{ color: '#52525B', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                  Fill out the form below and we will get back to you as soon as possible.
                </p>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label htmlFor="name" style={{ color: '#3F3F46', fontSize: '0.85rem', fontWeight: 600 }}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Kwesi Gyan"
                        className="input-wy"
                        required
                        style={{ padding: '0.85rem 1rem', background: '#F8F9FA', color: '#18181B', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label htmlFor="email" style={{ color: '#3F3F46', fontSize: '0.85rem', fontWeight: 600 }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        placeholder="kwesi@example.com"
                        className="input-wy"
                        required
                        style={{ padding: '0.85rem 1rem', background: '#F8F9FA', color: '#18181B', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label htmlFor="phone" style={{ color: '#3F3F46', fontSize: '0.85rem', fontWeight: 600 }}>
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        placeholder="+233..."
                        className="input-wy"
                        style={{ padding: '0.85rem 1rem', background: '#F8F9FA', color: '#18181B', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <label htmlFor="orderId" style={{ color: '#3F3F46', fontSize: '0.85rem', fontWeight: 600 }}>
                        Order Number (Optional)
                      </label>
                      <input
                        type="text"
                        id="orderId"
                        placeholder="e.g. WY-12345"
                        className="input-wy"
                        style={{ padding: '0.85rem 1rem', background: '#F8F9FA', color: '#18181B', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="subject" style={{ color: '#3F3F46', fontSize: '0.85rem', fontWeight: 600 }}>
                      Subject *
                    </label>
                    <select
                      id="subject"
                      className="input-wy"
                      required
                      defaultValue=""
                      style={{ padding: '0.85rem 1rem', background: '#F8F9FA', color: '#18181B', border: '1px solid #E5E7EB', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <option value="" disabled>Select an inquiry type</option>
                      <option value="order_status">Order Status & Tracking</option>
                      <option value="sizing">Sizing & Fit Advice</option>
                      <option value="delivery">Delivery & Shipping Inquiries</option>
                      <option value="product_restock">Product Restocks & Capsule Drops</option>
                      <option value="wholesale">Wholesale / Partnerships</option>
                      <option value="general">General Inquiry</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label htmlFor="message" style={{ color: '#3F3F46', fontSize: '0.85rem', fontWeight: 600 }}>
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      placeholder="How can we help you today?"
                      className="input-wy"
                      required
                      style={{ padding: '0.85rem 1rem', background: '#F8F9FA', color: '#18181B', border: '1px solid #E5E7EB', borderRadius: '8px', resize: 'vertical' }}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{
                      marginTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      padding: '1.15rem',
                      fontSize: '1rem',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      borderRadius: '8px',
                      background: '#D4A000',
                      color: '#FFFFFF',
                      border: 'none',
                      transition: 'background 200ms ease',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Send Message</span>
                    <Send size={18} />
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Physical Store Map */}
          <div style={{ marginTop: '4rem' }}>
            <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <span style={{ color: '#D4A000', fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Find Our Store
                </span>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.85rem', color: '#18181B', letterSpacing: '0.02em', textTransform: 'uppercase', marginTop: '0.2rem', marginBottom: 0 }}>
                  Physical Store Location
                </h2>
                <p style={{ color: '#52525B', fontSize: '0.95rem', marginTop: '0.25rem' }}>
                  Visit us in Koforidua, behind B Foster Bakery.
                </p>
              </div>
              <a
                href={STORE_LOCATION.directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.65rem 1.25rem',
                  borderRadius: '8px',
                  background: '#18181B',
                  color: '#FFFFFF',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                  transition: 'background 0.2s ease',
                }}
              >
                Get Directions &rarr;
              </a>
            </div>
            <StoreMap />
          </div>
        </div>
      </section>
    </div>
  );
}
