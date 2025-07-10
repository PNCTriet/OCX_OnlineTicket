import { Resend } from 'resend';
import { NextResponse } from 'next/server';

// Define the ticket type inline to avoid import issues
type TicketWithQuantity = {
  id: string;
  name: string;
  price: number;
  color: string;
  quantity: number;
  sold: number;
  label?: string;
  status: string;
};

export async function POST(request: Request) {
  try {
    // Debug: Check if API key is loaded
    console.log('🔑 API Key loaded:', process.env.RESEND_API_KEY ? 'Yes' : 'No');
    console.log('🔑 API Key value:', process.env.RESEND_API_KEY ? `${process.env.RESEND_API_KEY.substring(0, 10)}...` : 'Not found');
    
    // Initialize Resend inside the function to ensure env vars are loaded
    const resend = new Resend(process.env.RESEND_API_KEY);
    
    const { to, subject, tickets, customerInfo, orderNumber, orderDate, orderTime, totalAmount } = await request.json();
    
    // Tạo HTML template cho email vé điện tử
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vé điện tử OCX4</title>
        <style>
          body { 
            font-family: 'Inter', Arial, sans-serif; 
            margin: 0; 
            padding: 0; 
            background-color: #f4f4f4; 
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
          .ticket-info { 
            background-color: #f8f9fa; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
          }
          .ticket-item { 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            padding: 10px 0; 
            border-bottom: 1px solid #e9ecef; 
          }
          .ticket-item:last-child { 
            border-bottom: none; 
          }
          .total { 
            font-weight: bold; 
            font-size: 18px; 
            color: #c53e00; 
            text-align: right; 
            margin-top: 20px; 
            padding-top: 20px; 
            border-top: 2px solid #c53e00; 
          }
          .customer-info { 
            background-color: #e8f4fd; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
          }
          .order-details { 
            background-color: #fff3cd; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
          }
          .footer { 
            background-color: #343a40; 
            color: white; 
            text-align: center; 
            padding: 20px; 
            font-size: 14px; 
          }
          .qr-code { 
            text-align: center; 
            margin: 20px 0; 
          }
          .qr-code img { 
            width: 150px; 
            height: 150px; 
            border: 2px solid #c53e00; 
            border-radius: 8px; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎫 Vé điện tử OCX4</h1>
            <p>Cảm ơn bạn đã mua vé!</p>
          </div>
          
          <div class="content">
            <div class="order-details">
              <h3>📋 Thông tin đơn hàng</h3>
              <p><strong>Mã đơn hàng:</strong> #${orderNumber}</p>
              <p><strong>Ngày đặt:</strong> ${orderDate} ${orderTime}</p>
            </div>
            
            <div class="customer-info">
              <h3>👤 Thông tin khách hàng</h3>
              <p><strong>Họ tên:</strong> ${customerInfo.fullName}</p>
              <p><strong>Email:</strong> ${customerInfo.email}</p>
              <p><strong>Số điện thoại:</strong> ${customerInfo.phone}</p>
            </div>
            
            <div class="ticket-info">
              <h3>🎭 Chi tiết vé</h3>
              ${tickets.map((ticket: TicketWithQuantity) => `
                <div class="ticket-item">
                  <div>
                    <strong>${ticket.name}</strong><br>
                    <small>${ticket.label || 'Khu vực tiêu chuẩn'}</small>
                  </div>
                  <div>
                    <strong>x${ticket.quantity}</strong><br>
                    <small>${ticket.price.toLocaleString()}đ/vé</small>
                  </div>
                </div>
              `).join('')}
              <div class="total">
                <strong>Tổng cộng: ${totalAmount.toLocaleString()}đ</strong>
              </div>
            </div>
            
            <div class="qr-code">
              <h3>📱 Mã QR vé</h3>
              <p>Quét mã QR này tại cửa vào để được kiểm tra vé</p>
              <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=OCX4-${orderNumber}-${customerInfo.fullName}" alt="QR Code" />
            </div>
            
            <div style="background-color: #d4edda; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3>📅 Thông tin sự kiện</h3>
              <p><strong>Ngày:</strong> 15/12/2024</p>
              <p><strong>Giờ:</strong> 19:00 - 23:00</p>
              <p><strong>Địa điểm:</strong> Sân vận động Quân khu 7, TP.HCM</p>
              <p><strong>Lưu ý:</strong> Vui lòng đến sớm 30 phút trước giờ mở cửa</p>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2024 OCX4 - Sự kiện âm nhạc lớn nhất năm</p>
            <p>Liên hệ: info@ocx4.com | Hotline: 1900-xxxx</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'OCX4 <noreply@resend.dev>', // Sử dụng domain mặc định của Resend
      to: [to],
      subject: subject,
      html: htmlContent,
    });

    console.log('📧 Email sent successfully:', result);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('❌ Error sending email:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
} 