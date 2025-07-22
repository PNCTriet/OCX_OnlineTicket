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
    
    // Debug: Log received data
    console.log('📧 Email API received data:', {
      to,
      subject,
      ticketsCount: tickets?.length,
      tickets: tickets?.map((t: TicketWithQuantity) => ({ name: t.name, quantity: t.quantity, price: t.price })),
      customerInfo,
      orderNumber,
      totalAmount
    });
    
    // Tạo HTML template cho email vé điện tử
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vé điện tử Ớt Cay Xè</title>
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
          .intro-text {
            background-color: #fff3cd;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #c53e00;
          }
          .ticket-info { 
            background-color: #f8f9fa; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
            border: 2px solid #c53e00;
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
          .terms { 
            background-color: #f8d7da; 
            border-radius: 8px; 
            padding: 20px; 
            margin: 20px 0; 
            border-left: 4px solid #dc3545;
          }
          .contact-info {
            background-color: #d1ecf1;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #17a2b8;
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
          .event-details {
            background-color: #d4edda;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
            border-left: 4px solid #28a745;
          }
          .highlight {
            color: #c53e00;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎫 Vé điện tử Ớt Cay Xè</h1>
            <p>Chào mừng bạn đến với đêm nhạc!</p>
          </div>
          
          <div class="content">
            <div class="intro-text">
              <p><strong>Ớt Cay Xè</strong> xin được gửi tặng bạn vé đêm nhạc nhé, mong bạn sẽ có những phút giây vui vẻ nhất khi tận hưởng âm nhạc cùng bạn bè và người thân.</p>
              <p>Vui lòng kiểm tra thông tin và chuẩn bị sẵn vé tại nơi soát vé.</p>
            </div>
            
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
              <h3>🎭 THÔNG TIN VÉ</h3>
              ${tickets.map((ticket: TicketWithQuantity) => `
                <div class="ticket-item">
                  <div>
                    <strong>Loại vé:</strong> ${ticket.name}<br>
                    <small>Mã vé: ${ticket.id}</small>
                  </div>
                  <div>
                    <strong>Số lượng: ${ticket.quantity}</strong><br>
                    <small>${ticket.price.toLocaleString()}đ/vé</small>
                  </div>
                </div>
              `).join('')}
              <div class="total">
                <strong>Tổng cộng: ${totalAmount.toLocaleString()}đ</strong>
              </div>
            </div>
            
            <div class="event-details">
              <h3>📅 Thông tin sự kiện</h3>
              <p><strong>Thời gian:</strong> 27/09/2025</p>
              <p><strong>Địa điểm:</strong> Quận Sài Gòn</p>
              <p><strong>Loại vé:</strong> Single - 489.000đ/vé</p>
            </div>
            
            <div class="terms">
              <h3>📋 Điều khoản và điều kiện</h3>
              <ul>
                <li>Mỗi vé chỉ dành cho 1 (một) người vào cửa.</li>
                <li>Người tham gia phải trình vé ở cửa để vào sự kiện.</li>
                <li>Người nhận vé tự chịu trách nhiệm bảo mật thông tin mã vé.</li>
                <li>Không hỗ trợ giữ chỗ dưới mọi hình thức.</li>
              </ul>
            </div>
            
            <div class="qr-code">
              <h3>📱 Mã QR vé</h3>
              <p>Quét mã QR này tại cửa vào để được kiểm tra vé</p>
              ${(() => {
                let qrCodes = '';
                let ticketCounter = 1;
                
                console.log('🔍 Generating QR codes for tickets:', tickets);
                
                tickets.forEach((ticket: TicketWithQuantity) => {
                  console.log(`🎫 Processing ticket: ${ticket.name}, quantity: ${ticket.quantity}`);
                  
                  for (let i = 0; i < ticket.quantity; i++) {
                    const ticketNumber = ticketCounter.toString().padStart(2, '0');
                    const qrData = `${orderNumber}-${ticketNumber}`;
                    console.log(`📱 Generated QR for ticket ${ticketCounter}: ${qrData}`);
                    
                    qrCodes += `
                      <div style="margin-bottom: 20px; text-align: center;">
                        <p><strong>Vé ${ticketCounter}:</strong> ${ticket.name}</p>
                        <p><strong>Mã vé:</strong> ${qrData}</p>
                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}" alt="QR Code ${ticketCounter}" />
                      </div>
                    `;
                    ticketCounter++;
                  }
                });
                
                console.log(`✅ Generated ${ticketCounter - 1} QR codes total`);
                return qrCodes;
              })()}
            </div>
            
            <div class="contact-info">
              <h3>📞 Mọi thắc mắc xin liên hệ</h3>
              <p><strong>💌 Email:</strong> otconcert@gmail.com</p>
              <p><strong>☎️ Phone:</strong> 0934782703 - Bora</p>
              <p><strong>✨ Fanpage:</strong> Fanpage chương trình</p>
            </div>
          </div>
          
          <div class="footer">
            <p>© 2024 Ớt Cay Xè - The destination of Indie music</p>
            <p>Follow Ớt Cay Xè để cập nhật thêm thông tin về đêm nhạc nhé!</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: 'Ớt Cay Xè <noreply@otcayxe.com>',
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