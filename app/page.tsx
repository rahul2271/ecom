import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Zap } from 'lucide-react';

export default async function Home() {
  // 1. Fetch products with error handling for production stability
  let products = [];
  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' } // Show newest gadgets first
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - RC Tech Solutions Brand */}
      <div className="bg-gray-900 text-white py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Future-Proof Your <span className="text-blue-500">Gear.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Premium gadgets for developers and creators. Build your setup and earn as you grow with our affiliate network.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2">
              Browse Gadgets <ShoppingBag className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
            <Zap className="text-yellow-500 fill-yellow-500" /> Featured Gadgets
          </h2>
          <div className="h-px flex-1 bg-gray-100 mx-8 hidden md:block"></div>
        </div>
        
        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => (
            <div key={product.id} className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-blue-100 transition-all duration-300">
              
              {/* Optimized Next.js Image */}
              <div className="h-72 bg-gray-50 relative overflow-hidden">
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-sm">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Product Details */}
              <div className="p-8">
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-2">
                  {product.description}
                </p>
                
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Price</p>
                    <span className="text-3xl font-black text-gray-900">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Link 
                    href={`/product/${product.id}`}
                    className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition-all group-hover:rotate-[-5deg]"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
                
                {/* Dynamic Affiliate Commission Display */}
                <div className="pt-5 border-t border-gray-50 flex items-center justify-between">
                   <p className="text-sm text-gray-600 font-medium">
                     Affiliate Earnings
                   </p>
                   <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-black">
                     +{product.commission}%
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-500 font-bold text-xl">No gadgets found in the database.</p>
            <p className="text-gray-400 text-sm mt-2">Run 'npx prisma db seed' to populate your store.</p>
          </div>
        )}
      </div>
    </div>
  );
}