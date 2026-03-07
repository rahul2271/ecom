import { prisma } from '@/lib/prisma';
import ProductActions from '@/components/ProductActions';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { 
  ShieldCheck, Truck, Star, 
  CheckCircle2, ChevronRight 
} from 'lucide-react';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  
  const product = await prisma.product.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!product) notFound();

  return (
    <div className="bg-white min-h-screen pb-24">
      {/* 1. Breadcrumb Navigation */}
      <div className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-500 flex items-center space-x-2">
          <Link href="/" className="hover:text-blue-600 transition">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <Link href="/shop" className="hover:text-blue-600 transition">Shop</Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.category}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          
          {/* LEFT: Image Gallery */}
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-8 h-[500px] flex items-center justify-center relative overflow-hidden group">
              {/* Badges */}
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                  Best Seller
                </span>
                {product.stock > 0 && (
                  <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm flex items-center">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> In Stock
                  </span>
                )}
              </div>
              
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="max-w-full max-h-full object-contain drop-shadow-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Thumbnail Mockups */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-24 rounded-lg border-2 cursor-pointer bg-gray-50 flex items-center justify-center ${i === 1 ? 'border-blue-600' : 'border-gray-100 hover:border-gray-300'}`}>
                   <img src={product.images[0]} alt="thumb" className="h-16 object-contain opacity-80" />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Information & Buy Actions */}
          <div className="flex flex-col pt-4">
            
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {product.name}
            </h1>
            
            {/* Reviews (Mocked for UI) */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
              </div>
              <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
                124 verified reviews
              </span>
            </div>

            {/* Price Area */}
            <div className="mb-8">
              <div className="flex items-end space-x-3 mb-2">
                <p className="text-5xl font-black text-gray-900">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
                <p className="text-xl text-gray-400 line-through mb-1 font-medium">
                  ₹{(product.price * 1.2).toLocaleString('en-IN')}
                </p>
              </div>
              <p className="text-sm text-green-600 font-bold">Inclusive of all taxes</p>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            {/* 🔥 Interactive Client Component Injected Here 🔥 */}
            <ProductActions 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                category: product.category,
                commission: product.commission,
              }} 
            />

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-8 mt-auto">
              <div className="flex items-center text-gray-700">
                <div className="bg-gray-100 p-3 rounded-full mr-4">
                  <Truck className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <p className="font-bold text-sm">Free Delivery</p>
                  <p className="text-xs text-gray-500">2-4 Business Days</p>
                </div>
              </div>
              <div className="flex items-center text-gray-700">
                <div className="bg-gray-100 p-3 rounded-full mr-4">
                  <ShieldCheck className="w-6 h-6 text-gray-900" />
                </div>
                <div>
                  <p className="font-bold text-sm">1 Year Warranty</p>
                  <p className="text-xs text-gray-500">100% Brand Authentic</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Detailed Tabs Section (Description, Specs, Reviews) */}
        <div className="mt-24 pt-16 border-t border-gray-200">
          <div className="flex space-x-8 border-b border-gray-200 mb-8">
            <h3 className="text-xl font-bold text-blue-600 border-b-2 border-blue-600 pb-4">Product Details</h3>
            <h3 className="text-xl font-medium text-gray-500 hover:text-gray-900 cursor-pointer pb-4">Specifications</h3>
            <h3 className="text-xl font-medium text-gray-500 hover:text-gray-900 cursor-pointer pb-4">Reviews (124)</h3>
          </div>
          <div className="prose max-w-none text-gray-600">
            <p>
              Experience the ultimate in technology with the {product.name}. Designed for professionals and enthusiasts alike, this device brings cutting-edge performance wrapped in a premium build. Whether you are upgrading your setup or looking for the perfect gift, the {product.name} delivers unmatched reliability and style.
            </p>
            <ul className="mt-6 space-y-2 list-disc list-inside">
              <li>Premium build quality and materials.</li>
              <li>Engineered for maximum durability and efficiency.</li>
              <li>Includes standard accessories in the box.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}