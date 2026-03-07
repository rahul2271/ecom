import { prisma } from '@/lib/prisma';
import { ShieldCheck, Users, ShoppingCart, IndianRupee } from 'lucide-react';
import ApproveButton from '@/components/ApproveButton'; // Import the new client button

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
  const totalOrders = await prisma.order.count({ where: { status: 'PAID' } });
  const totalUsers = await prisma.user.count();

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
      <div className="flex items-center space-x-3 mb-10">
        <ShieldCheck className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-black text-gray-900">Admin Command Center</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <ShoppingCart className="text-blue-600 mb-2 w-5 h-5" />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Total Orders</p>
          <h3 className="text-3xl font-black text-gray-900">{totalOrders}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <Users className="text-purple-600 mb-2 w-5 h-5" />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Partners</p>
          <h3 className="text-3xl font-black text-gray-900">{totalUsers}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <IndianRupee className="text-green-600 mb-2 w-5 h-5" />
          <p className="text-sm text-gray-500 font-bold uppercase tracking-tight">Pending Payouts</p>
          <h3 className="text-3xl font-black text-gray-900">{pendingWithdrawals.length}</h3>
        </div>
      </div>

      {/* Withdrawal Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="font-bold text-gray-900">Pending Withdrawal Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-xs font-bold text-gray-400 uppercase bg-gray-50/50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Affiliate</th>
                <th className="px-6 py-4">Requested Amount</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
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
                pendingWithdrawals.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition duration-200">
                    <td className="px-6 py-4">
                      <p className="font-bold text-gray-900">{req.affiliate.name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-400 font-medium lowercase">{req.affiliate.email}</p>
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 text-lg">
                      ₹{req.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                      {new Date(req.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Using the new interactive button */}
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