import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. Define the Order structure for the balance calculation
interface UnpaidOrder {
  totalAmount: number;
}

export async function POST(request: Request) {
  try {
    const { amount } = await request.json();
    
    // Using your seeded affiliate code for testing
    const affiliateId = "partner2026"; 

    // 2. Fetch only necessary fields for unpaid orders
    const unpaidOrders = await prisma.order.findMany({
      where: { 
        affiliateId: affiliateId,
        status: 'PAID',
        commissionPaid: false 
      },
      select: {
        totalAmount: true
      }
    });

    // 3. Explicitly type 'acc' and 'order' to fix Vercel build errors
    const availableBalance = unpaidOrders.reduce(
      (acc: number, order: UnpaidOrder) => acc + (order.totalAmount * 0.10), 
      0
    );

    // 4. Business Logic Validations
    if (amount > availableBalance) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }
    
    if (amount < 1000) {
      return NextResponse.json({ error: "Minimum withdrawal is ₹1,000" }, { status: 400 });
    }

    // 5. Create Withdrawal Request in the database
    const withdrawal = await prisma.withdrawal.create({
      data: {
        amount: amount,
        affiliateId: affiliateId,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, withdrawal });
  } catch (error: any) {
    console.error("Withdrawal Request Error:", error);
    return NextResponse.json({ error: "Request failed" }, { status: 500 });
  }
}