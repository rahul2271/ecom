"use client";

import { useEffect, useState } from 'react';
import { Wallet, Clock, CheckCircle, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ totalPending: 0, totalPaid: 0, totalSales: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch('/api/affiliate/stats');
      const data = await res.json();
      setStats(data);
      setLoading(false);
    }
    fetchStats();
  }, []);
// Inside your Dashboard component
const handleWithdraw = async () => {
  const res = await fetch('/api/affiliate/withdraw', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: stats.totalPending }),
  });

  if (res.ok) {
    alert("Withdrawal request submitted! Our team will review it within 24 hours.");
  } else {
    const data = await res.json();
    alert(data.error);
  }
};
  if (loading) return <div className="p-10 text-center">Loading your earnings...</div>;
  

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Pending Commission Card */}
        <div className="bg-white border-2 border-orange-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-2xl">
              <Clock className="text-orange-600 w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-orange-600 uppercase tracking-widest">Pending</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900">₹{stats.totalPending.toLocaleString()}</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">To be paid next month</p>
        </div>
// Add this button under your "Pending" card
<button 
  onClick={handleWithdraw}
  disabled={stats.totalPending < 1000}
  className="mt-4 w-full bg-orange-600 text-white py-3 rounded-xl font-bold hover:bg-orange-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
>
  {stats.totalPending < 1000 ? 'Min. ₹1,000 required' : 'Request Payout'}
</button>
        {/* Paid Commission Card */}
        <div className="bg-white border-2 border-green-100 rounded-3xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-2xl">
              <CheckCircle className="text-green-600 w-6 h-6" />
            </div>
            <span className="text-xs font-bold text-green-600 uppercase tracking-widest">Paid</span>
          </div>
          <h2 className="text-4xl font-black text-gray-900">₹{stats.totalPaid.toLocaleString()}</h2>
          <p className="text-gray-500 mt-2 text-sm font-medium">Total earnings received</p>
        </div>

        {/* Sales Card */}
        <div className="bg-blue-600 rounded-3xl p-8 shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-blue-500 p-3 rounded-2xl">
              <TrendingUp className="text-white w-6 h-6" />
            </div>
          </div>
          <h2 className="text-4xl font-black">{stats.totalSales}</h2>
          <p className="text-blue-100 mt-2 text-sm font-medium">Total referred sales</p>
        </div>

      </div>
    </div>
  );
}