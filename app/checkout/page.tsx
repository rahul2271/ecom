"use client";

import { useState, useEffect } from 'react';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { Lock, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
  });

  // 1. Calculate totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18;
  const finalTotal = subtotal + tax;

  // 2. Load Affiliate Tracking & Redirect if empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
    // Check for affiliate cookie set by our middleware/tracking logic
    const match = document.cookie.match(new RegExp('(^| )affiliate_track=([^;]+)'));
    if (match) setAffiliateCode(match[2]);
  }, [items, router]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Please check your connection.");
      setIsProcessing(false);
      return;
    }

    try {
      // 3. Create Order on Backend
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // 4. Razorpay Modal Configuration
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, 
        amount: data.amount, 
        currency: data.currency,
        name: "GadgetStore",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response: any) {
          // 5. SECURE VERIFICATION STEP
          // This calls your /api/verify route to save to DB and check signatures
          const verifyRes = await fetch('/api/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items: items,
              customerDetails: formData,
              affiliateId: affiliateCode 
            }),
          });

          if (verifyRes.ok) {
            clearCart();
            router.push('/checkout/success');
          } else {
            const errorData = await verifyRes.json();
            alert(`Payment verification failed: ${errorData.error}`);
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
        },
        theme: {
          color: "#2563eb", 
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong initializing the payment.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-center space-x-2 mb-12">
        <Lock className="w-6 h-6 text-green-600" />
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Secure Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-50 pb-4">Shipping Information</h2>
          
          <form onSubmit={handlePayment} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input 
                  required
                  type="text" 
                  placeholder="Rahul Chauhan"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none transition"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input 
                  required
                  type="email" 
                  placeholder="rahul@example.com"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none transition"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
              <input 
                required
                type="text" 
                placeholder="123 Main St, Batala"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none transition"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none transition"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                <input 
                  required
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-600 outline-none transition"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isProcessing}
              className={`w-full mt-8 bg-blue-600 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-xl flex items-center justify-center ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'active:scale-95'}`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Securing Transaction...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pay ₹{finalTotal.toLocaleString('en-IN')}
                </>
              )}
            </button>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center space-x-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain bg-gray-50 rounded p-1" />
                    <div>
                      <p className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>GST (18%)</span>
                <span className="font-semibold text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              {affiliateCode && (
                <div className="flex justify-between text-xs text-green-600 font-bold bg-green-50 p-2 rounded">
                  <span>Affiliate Referral Applied</span>
                  <span>Active</span>
                </div>
              )}
            </div>

            <div className="border-t border-gray-900 pt-4 flex justify-between items-end">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-3xl font-black text-blue-600">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-2 bg-green-50 text-green-700 p-3 rounded-lg border border-green-200">
              <ShieldCheck className="w-5 h-5" />
              <p className="text-xs font-medium">Verified Secure Transaction</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}