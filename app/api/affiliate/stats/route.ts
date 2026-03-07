import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    // In a real app, you'd get the current user's ID from a session/token
    // For now, let's use a dummy ID for testing
    const affiliateId = "clp_123456789"; 

    // 1. Fetch all orders referred by this affiliate
    const orders = await prisma.order.findMany({
      where: { 
        affiliateId: affiliateId,
        status: 'PAID' 
      },
      include: {
        // We don't need the full product data, just the total amount
      }
    });

    // 2. Calculate Stats
    // Since we store commission as a percentage on the Product, 
    // in a production app you'd join with the Product table.
    // For this example, we'll use a standard 10% calculation logic.
    const stats = orders.reduce((acc, order) => {
      const commission = order.totalAmount * 0.10; // 10% commission logic
      
      if (order.commissionPaid) {
        acc.totalPaid += commission;
      } else {
        acc.totalPending += commission;
      }
      
      acc.totalSales += 1;
      return acc;
    }, { totalPending: 0, totalPaid: 0, totalSales: 0 });

    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}