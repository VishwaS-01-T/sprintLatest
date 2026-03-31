import React from 'react';
import { Truck, Wallet, RotateCcw } from 'lucide-react';

const BannerSection = () => {
  return (
    <>
      {/* Yellow Banner */}
      <section className="w-full bg-[#E5F525] py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
          {/* Icons */}
          <div className="flex items-center gap-6 mb-8">
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="4" y1="4" x2="20" y2="20" />
              </svg>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </div>
            <div className="w-12 h-12 flex items-center justify-center">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
          </div>
          
          {/* Heading */}
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-black tracking-tight">
            <span className="inline-block bg-[#FF3366] text-black px-4 py-2 transform -rotate-1">
              GOOD SHOES
            </span>
            <span className="ml-4">WILL TAKE YOU TO GOOD PLACES</span>
          </h2>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Shipping */}
          <div className="flex items-center gap-4 p-6 border border-gray-200 rounded-lg">
            <div className="w-16 h-16 flex items-center justify-center">
              <Truck className="w-12 h-12 text-gray-700" strokeWidth={1} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-black">Free shipping</h3>
              <p className="text-gray-500 text-sm">Free shipping for all orders.</p>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div className="flex items-center gap-4 p-6 border border-gray-200 rounded-lg">
            <div className="w-16 h-16 flex items-center justify-center">
              <Wallet className="w-12 h-12 text-gray-700" strokeWidth={1} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-black">Cash on delivery</h3>
              <p className="text-gray-500 text-sm">Cash on delivery at Zero Cost.</p>
            </div>
          </div>

          {/* Easy Return */}
          <div className="flex items-center gap-4 p-6 border border-gray-200 rounded-lg">
            <div className="w-16 h-16 flex items-center justify-center">
              <RotateCcw className="w-12 h-12 text-gray-700" strokeWidth={1} />
            </div>
            <div>
              <h3 className="font-bold text-lg text-black">Easy return</h3>
              <p className="text-gray-500 text-sm">Free 7 day Return and Exchange.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BannerSection;
