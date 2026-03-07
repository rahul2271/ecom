import { prisma } from '@/lib/prisma'
import { Prisma } from "@prisma/client"
import { ShieldCheck, Users, ShoppingCart, IndianRupee } from 'lucide-react'

export default async function AdminDashboard() {

  // Fetch stats
  const totalOrders = await prisma.order.count({
    where: { status: 'PAID' }
  })

  const totalUsers = await prisma.user.count()

  const pendingWithdrawals = await prisma.withdrawal.findMany({
    where: { status: 'PENDING' },
    include: { affiliate: true }
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">

      {/* Header */}
      <div className="flex items-center space-x-3 mb-10">
        <ShieldCheck className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-black text-gray-900">
          Admin Command Center
        </h1>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <ShoppingCart className="text-blue-600 mb-2" />
          <p className="text-sm text-gray-500 font-bold uppercase">
            Total Orders
          </p>
          <h3 className="text-3xl font-black">{totalOrders}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <Users className="text-purple-600 mb-2" />
          <p className="text-sm text-gray-500 font-bold uppercase">
            Registered Partners
          </p>
          <h3 className="text-3xl font-black">{totalUsers}</h3>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200">
          <IndianRupee className="text-green-600 mb-2" />
          <p className="text-sm text-gray-500 font-bold uppercase">
            Pending Payouts
          </p>
          <h3 className="text-3xl font-black">
            {pendingWithdrawals.length}
          </h3>
        </div>

      </div>

      {/* Withdrawal Table */}
      <div className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-sm">

        <div className="p-6 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-900">
            Pending Withdrawal Requests
          </h2>
        </div>

        <table className="w-full text-left">

          <thead className="text-xs font-bold text-gray-400 uppercase bg-gray-50/50">
            <tr>
              <th className="px-6 py-4">Affiliate</th>
              <th className="px-6 py-4">Requested Amount</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">

            {pendingWithdrawals.map(
              (req: Prisma.WithdrawalGetPayload<{ include: { affiliate: true } }>) => (
                <tr key={req.id} className="hover:bg-gray-50 transition">

                  <td className="px-6 py-4">
                    <p className="font-bold text-gray-900">
                      {req.affiliate.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {req.affiliate.email}
                    </p>
                  </td>

                  <td className="px-6 py-4 font-black text-gray-900">
                    ₹{req.amount}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                      Approve Payout
                    </button>
                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}