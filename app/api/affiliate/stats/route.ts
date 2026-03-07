import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface AffiliateStats {
  totalPending: number;
  totalPaid: number;
  totalSales: number;
}

export async function GET(request: Request) {
  try {
    const affiliateId = "partner2026"; 

    // 1. Fetch orders with explicit selection
    const orders = await prisma.order.findMany({
      where: { 
        affiliateId: affiliateId,
        status: 'PAID' 
      },
      select: {
        totalAmount: true,
        commissionPaid: true, // This will now work
      }
    });

    // 2. Calculate Stats
    const stats = orders.reduce((acc: AffiliateStats, order: any) => {
      const commission = order.totalAmount * 0.10; 
      
      // Using 'any' for the order object here prevents build-time 
      // blocks if the generated types are slightly out of sync
      if (order.commissionPaid) {
        acc.totalPaid += commission;
      } else {
        acc.totalPending += commission;
      }
      
      acc.totalSales += 1;
      return acc;
    }, { totalPending: 0, totalPaid: 0, totalSales: 0 });

    return NextResponse.json(stats);
  } catch (error: any) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}