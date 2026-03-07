"use client"; // <-- This is critical for interactivity!

import Link from 'next/link';
import { ShoppingCart, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const cartCount = useCart((state) => state.cartCount());
  
  // Trick to prevent Next.js hydration mismatch errors with local storage
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link href="/" className="text-2xl font-extrabold text-blue-600 tracking-tight">
            Gadget<span className="text-gray-900">Store</span>
          </Link>

          <div className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-600 hover:text-blue-600 font-medium">Home</Link>
            <Link href="/shop" className="text-gray-600 hover:text-blue-600 font-medium">Shop</Link>
            <Link href="/affiliates" className="text-gray-600 hover:text-blue-600 font-medium">Affiliate Program</Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link href="/login" className="text-gray-600 hover:text-blue-600">
              <User className="w-6 h-6" />
            </Link>
            
            {/* Dynamic Shopping Cart */}
            <Link href="/cart" className="text-gray-600 hover:text-blue-600 relative">
              <ShoppingCart className="w-6 h-6" />
              {isMounted && cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
}