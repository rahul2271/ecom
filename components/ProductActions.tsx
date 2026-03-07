"use client";

import { ShoppingCart, Zap, Share2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useState } from 'react';

interface ProductActionsProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    commission: number;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const addItem = useCart((state) => state.addItem);
  const [copied, setCopied] = useState(false);

  // Affiliate Link Generator Logic
  const handleCopyAffiliateLink = () => {
    // In production, you would fetch the logged-in user's actual affiliate ID
    const dummyAffiliateId = "partner_123"; 
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const link = `${appUrl}/product/${product.id}?ref=${dummyAffiliateId}`;
    
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <>
      {/* Buy Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button 
          onClick={() => addItem({ id: product.id, name: product.name, price: product.price, image: product.image, quantity: 1 })}
          className="w-full bg-blue-50 text-blue-700 border border-blue-200 px-6 py-4 rounded-xl font-bold text-lg hover:bg-blue-100 transition-colors flex items-center justify-center active:scale-95"
        >
          <ShoppingCart className="w-5 h-5 mr-2" />
          Add to Cart
        </button>
        <button className="w-full bg-gray-900 text-white px-6 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-xl flex items-center justify-center active:scale-95">
          <Zap className="w-5 h-5 mr-2 fill-current" />
          Buy Now
        </button>
      </div>

      {/* Affiliate Action */}
      <div className="mt-4 mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Share2 className="w-24 h-24 text-green-600" />
        </div>
        <div className="relative z-10">
          <h4 className="font-extrabold text-green-900 text-lg mb-2 flex items-center">
            Partner & Earn ₹{(product.price * (product.commission / 100)).toLocaleString('en-IN')}!
          </h4>
          <p className="text-green-800 text-sm mb-4 leading-relaxed pr-8">
            Are you a tech reviewer? Share your unique link and earn a massive <strong>{product.commission}% commission</strong> when someone buys this {product.category.toLowerCase()}.
          </p>
          <button 
            onClick={handleCopyAffiliateLink}
            className={`${copied ? 'bg-green-800' : 'bg-green-600'} text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-green-700 transition-colors flex items-center shadow-md`}
          >
            <Share2 className="w-4 h-4 mr-2" />
            {copied ? 'Link Copied to Clipboard!' : 'Generate Affiliate Link'}
          </button>
        </div>
      </div>
    </>
  );
}