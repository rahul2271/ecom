import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag, ArrowRight, Zap } from 'lucide-react';

// 1. Define the Product structure for TypeScript
interface GadgetProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  commission: number;
  createdAt: Date;
}

export default async function Home() {
  // 2. Fetch products with type safety
  let products: GadgetProduct[] = [];
  
  try {
    products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    }) as GadgetProduct[];
  } catch (error) {
    console.error("Database connection error:", error);
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="bg-gray-900 text-white py-20 mb-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-black mb-6">
            Future-Proof Your <span className="text-blue-500">Gear.</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-10">
            Premium gadgets for developers. Earn commission as you grow with RC Tech Solutions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-24">
        <h2 className="text-3xl font-black text-gray-900 mb-12 flex items-center gap-3">
          <Zap className="text-yellow-500 fill-yellow-500" /> Featured Gadgets
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {/* 3. Explicitly type the 'product' parameter in the map */}
          {products.map((product: GadgetProduct) => (
            <div key={product.id} className="group bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300">
              
              <div className="h-72 bg-gray-50 relative overflow-hidden">
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-black text-gray-900 mb-3">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-6 line-clamp-2">{product.description}</p>
                
                <div className="flex justify-between items-center mb-6">
                  <span className="text-3xl font-black text-gray-900">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  <Link 
                    href={`/product/${product.id}`}
                    className="bg-gray-900 text-white p-4 rounded-2xl hover:bg-blue-600 transition-all"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </Link>
                </div>
                
                <div className="pt-5 border-t border-gray-50 flex items-center justify-between">
                   <p className="text-sm text-gray-600 font-medium tracking-tight">Affiliate Earnings</p>
                   <span className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-sm font-black">
                     +{product.commission}%
                   </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}