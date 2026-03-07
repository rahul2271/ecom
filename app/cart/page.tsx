"use client";

import { useCart } from '@/hooks/useCart';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';

export default function CartPage() {
  const { items, addItem, decreaseQuantity, removeItem } = useCart();
  
  // Hydration fix for Zustand + Local Storage
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Prevent server/client HTML mismatch

  // Calculate totals
  const subtotal = items.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.18; // Assuming 18% GST for gadgets
  const total = subtotal + tax;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div className="bg-gray-100 p-6 rounded-full mb-6">
          <ShoppingBag className="w-16 h-16 text-gray-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added any premium gadgets to your cart yet. Let's fix that!
        </p>
        <Link 
          href="/"
          className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT: Cart Items List */}
        <div className="lg:col-span-8 space-y-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6 shadow-sm hover:shadow-md transition">
              
              {/* Product Image */}
              <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl flex-shrink-0 p-2 border border-gray-100">
                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
              </div>

              {/* Product Details & Quantity */}
              <div className="flex-grow flex flex-col sm:flex-row justify-between w-full">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-blue-600 font-bold mb-4">₹{item.price.toLocaleString('en-IN')}</p>
                  
                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                      <button 
                        onClick={() => decreaseQuantity(item.id)}
                        className="p-2 hover:bg-gray-200 hover:text-blue-600 transition rounded-l-lg text-gray-600"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-900">{item.quantity}</span>
                      <button 
                        onClick={() => addItem(item)}
                        className="p-2 hover:bg-gray-200 hover:text-blue-600 transition rounded-r-lg text-gray-600"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition flex items-center text-sm font-medium"
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Remove
                    </button>
                  </div>
                </div>

                {/* Item Total */}
                <div className="text-right flex flex-col justify-center">
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="text-xl font-black text-gray-900">
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* RIGHT: Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm sticky top-24">
            <h2 className="text-xl font-extrabold text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Estimated Tax (18% GST)</span>
                <span className="font-semibold text-gray-900">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-green-600">Free</span>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 mb-8">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold text-gray-900">Total Order</span>
                <span className="text-3xl font-black text-gray-900">₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <Link href="/checkout" className="w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-xl flex items-center justify-center group active:scale-95">
              Proceed to Checkout
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <div className="mt-4 flex items-center justify-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-gray-400" />
              <p className="text-xs text-gray-500">Secure Checkout powered by Razorpay</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}