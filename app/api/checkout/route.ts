import { NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Securely calculate the total price using the Database, NOT the client
    let subtotal = 0;
    
    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({ 
        where: { id: item.id } 
      });
      
      if (dbProduct) {
        subtotal += dbProduct.price * item.quantity;
      }
    }

    // 2. Add Tax (18% GST)
    const tax = subtotal * 0.18;
    const finalTotal = subtotal + tax;

    // 3. Razorpay requires the amount in Paise (smallest currency unit)
    // So we multiply the Rupee amount by 100
    const amountInPaise = Math.round(finalTotal * 100);

    // 4. Ask Razorpay to generate an Order ID
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // 5. Send that Order ID back to the Frontend!
    return NextResponse.json({
      orderId: order.id,
      amount: amountInPaise,
      currency: "INR"
    });

  } catch (error) {
    console.error("Razorpay Order Creation Error:", error);
    return NextResponse.json(
      { error: "Failed to initialize payment session" }, 
      { status: 500 }
    );
  }
}