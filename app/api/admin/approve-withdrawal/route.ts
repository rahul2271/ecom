import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { withdrawalId } = await request.json();

    // 1. Start a Prisma Transaction (Atomic operation)
    // We explicitly type 'tx' as 'any' to bypass the strict production type check
    return await prisma.$transaction(async (tx: any) => {
      const withdrawal = await tx.withdrawal.findUnique({ 
        where: { id: withdrawalId } 
      });

      if (!withdrawal) {
        return NextResponse.json({ error: "Withdrawal not found" }, { status: 404 });
      }

      // 2. Mark Withdrawal as Completed
      await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { 
          status: 'COMPLETED', 
          processedAt: new Date() 
        }
      });

      // 3. Mark all PAID orders for this affiliate as 'Commission Paid'
      await tx.order.updateMany({
        where: { 
          affiliateId: withdrawal.affiliateId,
          status: 'PAID',
          commissionPaid: false
        },
        data: { commissionPaid: true }
      });

      return NextResponse.json({ success: true });
    });
  } catch (error: any) {
    console.error("Payout Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}