import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { checkPaymentReceived, getUserInfoByOrderNumber } from '@/lib/payment-utils';

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

    const { orderNumber, expectedAmount } = await request.json();

    if (!orderNumber || !expectedAmount) {
      return NextResponse.json(
        { success: false, error: 'Missing orderNumber or expectedAmount' },
        { status: 400 }
      );
    }

    // Check if payment was received
    const paymentReceived = checkPaymentReceived(orderNumber, expectedAmount);
    
    // Get user info to check if webhook email was sent
    const userInfo = getUserInfoByOrderNumber(orderNumber);

    console.log('🔍 Payment check result:', {
      orderNumber,
      expectedAmount,
      paymentReceived,
      userEmail: user.email,
      webhookUserEmail: userInfo?.email
    });

    return NextResponse.json({
      success: true,
      paymentReceived,
      orderNumber,
      expectedAmount,
      webhookEmailSent: paymentReceived && userInfo?.email === user.email
    });

  } catch (error) {
    console.error('❌ Error checking payment:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
} 