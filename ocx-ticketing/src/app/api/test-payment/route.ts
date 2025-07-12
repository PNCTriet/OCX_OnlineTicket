import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request: NextRequest) {
  try {
    const resend = new Resend('re_8xw44Kw3_NQN7Nw2YJTMaMszXEC8WppSMre_5km3gdPH_3Q68UwWAXXhN4xgMJY5aBUnd');
    
    // Simulate webhook payload
    const webhookPayload = {
      id: "test_transaction_001",
      account_number: "1234567890",
      amount: 10000,
      content: "#ocx-10000",
      transaction_id: "test_001",
      transaction_time: new Date().toISOString(),
      bank_code: "VPB",
      bank_name: "Vietcombank"
    };

    console.log('🧪 Test payment received:', webhookPayload);

    // Create email content
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Xác nhận thanh toán test</title>
        <style>
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4; 
            line-height: 1.6;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background-color: #ffffff; 
            border-radius: 10px; 
            overflow: hidden; 
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
          }
          .header { 
            background: linear-gradient(135deg, #c53e00 0%, #ff6b35 100%); 
            color: white; 
            padding: 30px; 
            text-align: center; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 800; 
          }
          .content { 
            padding: 30px; 
          }
          .payment-info {
            background-color: #d4edda;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
          }
          .footer { 
            background-color: #343a40; 
            color: white; 
            text-align: center; 
            padding: 20px; 
            font-size: 14px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Xác nhận thanh toán test</h1>
            <p>Ớt Cay Xè - Test Payment Confirmation</p>
          </div>
          
          <div class="content">
            <div class="payment-info">
              <h3>💰 Thông tin giao dịch</h3>
              <p><strong>Số tiền:</strong> 10,000đ</p>
              <p><strong>Nội dung:</strong> #ocx-10000</p>
              <p><strong>Mã giao dịch:</strong> ${webhookPayload.transaction_id}</p>
              <p><strong>Thời gian:</strong> ${new Date(webhookPayload.transaction_time).toLocaleString('vi-VN')}</p>
              <p><strong>Ngân hàng:</strong> ${webhookPayload.bank_name}</p>
            </div>
            
            <div style="background-color: #fff3cd; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3>🎉 Test thành công!</h3>
              <p>Webhook đã nhận được giao dịch và gửi email xác nhận thành công.</p>
              <p>Hệ thống đã sẵn sàng cho production!</p>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2024 Ớt Cay Xè - Test Payment System</p>
            <p>Generated at: ${new Date().toLocaleString('vi-VN')}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'Ớt Cay Xè <noreply@otcayxe.com>',
      to: ['triet.pnc@gmail.com'],
      subject: '✅ Xác nhận thanh toán test - Ớt Cay Xè',
      html: htmlContent,
    });

    console.log('📧 Test email sent successfully:', result);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test payment processed and email sent',
      webhookData: webhookPayload,
      emailResult: result
    });

  } catch (error) {
    console.error('❌ Test payment error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 