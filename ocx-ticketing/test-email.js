// Test script để kiểm tra API email
// Chạy: node test-email.js

const testEmailData = {
  to: "dongnnh2112.work@gmail.com", // Thay bằng email thật của bạn
  subject: "🧪 Test Email - OCX4 Ticket System",
  tickets: [
    {
      id: "test-ticket-1",
      name: "Farmers VIP",
      price: 899000,
      color: "#F06185",
      quantity: 2,
      sold: 20,
      label: "Khu vực C",
      status: "available"
    }
  ],
  customerInfo: {
    fullName: "Nguyễn Văn Test",
    email: "test@example.com",
    phone: "0123456789"
  },
  orderNumber: 1234567890,
  orderDate: "15/12/2024",
  orderTime: "14:30:25",
  totalAmount: 1798000
};

async function testEmailAPI() {
  try {
    console.log('🧪 Testing Email API...');
    
    const response = await fetch('http://localhost:3000/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testEmailData),
    });

    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Email API test successful!');
      console.log('📧 Email sent to:', testEmailData.to);
      console.log('🔢 Order number:', testEmailData.orderNumber);
    } else {
      console.log('❌ Email API test failed!');
      console.log('Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
    console.log('💡 Make sure:');
    console.log('   1. Server is running (npm run dev)');
    console.log('   2. API key is set in .env.local');
    console.log('   3. Replace test@example.com with your real email');
  }
}

// Chạy test
testEmailAPI(); 