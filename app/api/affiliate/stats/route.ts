import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Define the Stats structure
interface AffiliateStats {
  totalPending: number;
  totalPaid: number;
  totalSales: number;
}

// 2. Define the Order structure to satisfy the reduce function
interface OrderItem {
  totalAmount: number;
  commissionPaid: boolean;
}

export async function GET(request: Request) {
  try {
    const affiliateId = "partner2026"; 

    const orders = await prisma.order.findMany({
      where: { 
        affiliateId: affiliateId,
        status: 'PAID' 
      },
      select: {
        totalAmount: true,
        commissionPaid: true,
      }
    });

    // 3. Explicitly type both 'acc' and 'order'
    const stats = orders.reduce((acc: AffiliateStats, order: OrderItem) => {
      const commission = order.totalAmount * 0.10; 
      
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