import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const { withdrawalId } = await request.json();

  // 1. Start a Prisma Transaction (Atomic operation)
  return await prisma.$transaction(async (tx) => {
    const withdrawal = await tx.withdrawal.findUnique({ 
      where: { id: withdrawalId } 
    });

    if (!withdrawal) throw new Error("Withdrawal not found");

    // 2. Mark Withdrawal as Completed
    await tx.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: 'COMPLETED', processedAt: new Date() }
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
}