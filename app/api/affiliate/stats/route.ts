import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Define the shape of our stats object for TypeScript
interface AffiliateStats {
  totalPending: number;
  totalPaid: number;
  totalSales: number;
}

export async function GET(request: Request) {
  try {
    // For testing/initial setup: Use the ID of the affiliate you seeded
    // In production, this would come from your Auth session (e.g., NextAuth)
    const affiliateId = "partner2026"; 

    // 2. Fetch all successful orders linked to this affiliate
    const orders = await prisma.order.findMany({
      where: { 
        affiliateId: affiliateId,
        status: 'PAID' 
      }
    });

    // 3. Calculate Stats with explicit typing for the accumulator
    const stats = orders.reduce((acc: AffiliateStats, order) => {
      // Standard 10% commission logic for RC Tech Solutions gadgets
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
  } catch (error) {
    console.error("Stats Error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}