import { createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';
import { addPendingPayment } from '@/lib/payment-utils';
import { addOrder } from '@/lib/pending-orders';

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse request body
    const { tickets, totalAmount, userInfo } = await request.json();

    // Validate request data
    if (!tickets || !Array.isArray(tickets) || tickets.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid tickets data' },
        { status: 400 }
      );
    }

    if (!totalAmount || totalAmount <= 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid total amount' },
        { status: 400 }
      );
    }

    // For demo purposes, we'll simulate a successful purchase
    const orderId = Date.now();
    const orderNumber = `OCX-${orderId}`;

    // Store user info and tickets in payment system for webhook access
    if (userInfo && userInfo.email) {
      addPendingPayment(orderNumber, totalAmount, userInfo.email, userInfo, tickets);
      addOrder(orderNumber, {
        orderNumber,
        userInfo,
        tickets,
        totalAmount,
        createdAt: new Date().toISOString()
      });
      console.log('💾 Stored user info and tickets for webhook access:', {
        orderNumber,
        userEmail: userInfo.email,
        userInfo,
        tickets
      });
    }

    // Log the purchase for debugging
    console.log('🎫 Purchase processed:', {
      userId: user.id,
      userEmail: user.email,
      tickets,
      totalAmount,
      userInfo,
      orderNumber,
      timestamp: new Date().toISOString()
    });

    // Return success response
    return NextResponse.json({
      success: true,
      data: {
        orderId,
        orderNumber,
        userId: user.id,
        userEmail: user.email,
        tickets,
        totalAmount,
        userInfo,
        purchaseDate: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error processing purchase:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 