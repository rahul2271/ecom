import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    const affiliateId = "clp_123456789"; // Replace with real session ID later

    // 1. Calculate current unpaid earnings
    const unpaidOrders = await prisma.order.findMany({
      where: { 
        affiliateId: affiliateId,
        status: 'PAID',
        commissionPaid: false 
      }
    });

    const availableBalance = unpaidOrders.reduce((acc, order) => acc + (order.totalAmount * 0.10), 0);

    // 2. Validation
    if (amount > availableBalance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }
    if (amount < 1000) {
      return NextResponse.json({ error: "Minimum withdrawal is ₹1,000" }, { status: 400 });
    }

    // 3. Create Withdrawal Request
    const withdrawal = await prisma.withdrawal.create({
      data: {
        amount: amount,
        affiliateId: affiliateId,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, withdrawal });
  } catch (error) {
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}