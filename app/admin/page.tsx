export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { ShieldCheck, Users, ShoppingCart, IndianRupee } from 'lucide-react';
import ApproveButton from '@/components/ApproveButton';

// 1. Define payload interface to handle Prisma's complex types
interface WithdrawalWithAffiliate {
  id: string;
  amount: number;
  createdAt: Date | string;
  affiliate: {
    name: string | null;
    email: string;
  };
}

export default async function AdminDashboard() {
  // 2. Fetch business stats from the unified database schema
  const totalOrders = await prisma.order.count({ where: { status: 'PAID' } });
  const totalUsers = await prisma.user.count();

  // 3. Fetch withdrawals with targeted affiliate selection to optimize speed
  const pendingWithdrawals = await prisma.withdrawal.findMany({
    where: { status: 'PENDING' },
    include: {
      affiliate: {
        select: { name: true, email: true }
      }
    }
  }) as unknown as WithdrawalWithAffiliate[];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header Section */}
      <div className="flex items-center space-x-3 mb-10">
        <ShieldCheck className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">
          Admin Command Center
        </h1>
      </div>

      {/* High-Level Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-hover hover:shadow-md">
          <ShoppingCart className="text-blue-600 mb-2 w-5 h-5" />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Total Orders</p>
          <h3 className="text-3xl font-black text-gray-900">{totalOrders}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-hover hover:shadow-md">
          <Users className="text-purple-600 mb-2 w-5 h-5" />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Partners</p>
          <h3 className="text-3xl font-black text-gray-900">{totalUsers}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-hover hover:shadow-md">
          <IndianRupee className="text-green-600 mb-2 w-5 h-5" />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">Pending Payouts</p>
          <h3 className="text-3xl font-black text-gray-900">{pendingWithdrawals.length}</h3>
        </div>
      </div>

      {/* Interactive Withdrawal Management Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-900">Pending Withdrawal Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs font-bold text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 font-black">Affiliate</th>
                <th className="px-6 py-4 font-black">Requested Amount</th>
                <th className="px-6 py-4 font-black">Date</th>
                <th className="px-6 py-4 text-right font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pendingWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-gray-400 font-medium">
                    No pending requests at this time.
                  </td>
                </tr>
              ) : (
                /* FIXED: Removed unnecessary curly braces that caused syntax error */
                pendingWithdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition duration-200">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{req.affiliate.name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-400 font-medium lowercase tracking-tight">
                        {req.affiliate.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 text-lg">
                      ₹{req.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {new Date(req.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Integrated Client Component for Payout Processing */}
                      <ApproveButton withdrawalId={req.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
