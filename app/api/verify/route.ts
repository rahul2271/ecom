import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      items,
      customerDetails,
      affiliateCode // Received from the checkout's tracking cookie
    } = await request.json();

    // 1. Security: Verify the HMAC signature from Razorpay
    const secret = process.env.RAZORPAY_KEY_SECRET!;
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // 2. Lookup the Affiliate by their code (if provided)
    let referrer = null;
    if (affiliateCode) {
      referrer = await prisma.user.findUnique({
        where: { affiliateCode: affiliateCode }
      });
    }

    // 3. Create/Update the Customer and the Order in one transaction
    const totalAmount = items.reduce((acc: number, item: any) => 
      acc + (item.price * item.quantity), 0) * 1.18;

    const order = await prisma.order.create({
      data: {
        razorpayOrderId: razorpay_order_id,
        totalAmount: totalAmount,
        status: 'PAID',
        customer: {
          connectOrCreate: {
            where: { email: customerDetails.email },
            create: {
              email: customerDetails.email,
              name: customerDetails.name,
              password: 'GUEST_PASSWORD_HASH', // You'll update this with real Auth later
              role: 'CUSTOMER'
            }
          }
        },
        // Link the affiliate using the ID found in step 2
        ...(referrer && {
          affiliate: {
            connect: { id: referrer.id }
          }
        })
      }
    });

    return NextResponse.json({ success: true, orderId: order.id });

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}