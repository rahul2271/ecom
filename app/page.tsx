import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';

export default async function Home() {
  // Fetch products directly from your PostgreSQL database!
  const products = await prisma.product.findMany();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8">Featured Gadgets</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            
            {/* Product Image */}
            <div className="h-64 bg-gray-200 relative">
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="p-6">
              <p className="text-sm text-blue-600 font-semibold mb-1">{product.category}</p>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex justify-between items-center mt-4">
                <span className="text-2xl font-black text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </span>
                <Link 
                  href={`/product/${product.id}`}
                  className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                >
                  View Details
                </Link>
              </div>
              
              {/* Affiliate Teaser */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                 <p className="text-xs text-gray-500 font-medium">
                   🤝 Earn <span className="text-green-600 font-bold">{product.commission}% commission</span> by sharing!
                 </p>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
}