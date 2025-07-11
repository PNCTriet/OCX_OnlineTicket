import { createServerClient } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

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

    // Here you would typically:
    // 1. Validate ticket availability
    // 2. Create order in database
    // 3. Process payment
    // 4. Update ticket inventory
    // 5. Send confirmation email

    // For demo purposes, we'll simulate a successful purchase
    const orderId = Date.now();
    const orderNumber = `OCX-${orderId}`;

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