# OCX Online Ticketing Platform

A modern ticketing platform for music events, built with Next.js 15, React, Supabase, and Tailwind CSS.

## 🚀 Features

- **🔐 Authentication**: Google OAuth integration with Supabase
- **🎫 Ticket Management**: Interactive seat selection and ticket purchase
- **📧 Email Integration**: Automated e-ticket delivery via Resend
- **🎨 Modern UI**: Dark theme with responsive design
- **🌐 Multi-language**: Vietnamese and English support
- **📱 Mobile Optimized**: Fully responsive for all devices

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth with Google OAuth
- **Database**: Supabase PostgreSQL
- **Email Service**: Resend
- **Deployment**: Vercel (recommended)

## 📋 Prerequisites

Before running this project, you need to set up:

1. **Supabase Account**: For authentication and database
2. **Google OAuth**: For user authentication
3. **Resend Account**: For email delivery

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone <repository-url>
cd ocx-ticketing
npm install
```

### 2. Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Resend Email Service
RESEND_API_KEY=re_your_actual_api_key_here
```

### 3. Supabase Setup

Follow the detailed setup guide in `SUPABASE_SETUP.md`:

1. Create a Supabase project
2. Configure Google OAuth
3. Set up database schema
4. Configure Row Level Security (RLS)

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 User Flow

1. **Landing Page**: Users browse event information and artist lineup
2. **Ticket Selection**: Choose seats and ticket types
3. **Authentication**: Login with Google OAuth (required for checkout)
4. **Checkout**: Complete purchase with authenticated user context
5. **Email Delivery**: Receive e-tickets via email

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API routes
│   │   ├── purchase-tickets/   # Authenticated ticket purchase
│   │   └── send-email/         # Email delivery
│   ├── auth/                   # Authentication pages
│   │   ├── login/             # Login page
│   │   └── callback/          # OAuth callback
│   ├── checkout/              # Checkout page (protected)
│   └── components/            # Reusable components
├── lib/
│   └── supabase.ts           # Supabase client configuration
└── middleware.ts             # Authentication middleware
```

## 🔐 Authentication Features

- **Google OAuth**: Seamless login with Google accounts
- **Protected Routes**: Middleware protects checkout pages
- **User Context**: Auto-fill user information from Google profile
- **Session Management**: Persistent authentication state
- **Logout Functionality**: Secure session termination

## 📧 Email Features

- **E-ticket Delivery**: Automated email with QR codes
- **Professional Templates**: HTML email templates with branding
- **Resend Integration**: Reliable email delivery service
- **Order Confirmation**: Detailed purchase information

## 🎨 UI/UX Features

- **Dark Theme**: Modern dark interface
- **Responsive Design**: Works on all screen sizes
- **Interactive Elements**: Hover effects and animations
- **Loading States**: Smooth user experience
- **Error Handling**: User-friendly error messages

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Environment Variables for Production

Ensure these are set in your hosting platform:

```env
NEXT_PUBLIC_SUPABASE_URL=your-production-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key
RESEND_API_KEY=your-production-resend-key
```

## 📚 Documentation

- `SUPABASE_SETUP.md`: Detailed Supabase configuration guide
- `RESEND_SETUP.md`: Email service setup instructions
- `ENV_SETUP.md`: Environment variables configuration
- `database_design_EN.md`: Database schema documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:

1. Check the documentation files
2. Review console logs for errors
3. Verify environment variables
4. Test authentication flow

## 🔄 Next Steps

- [ ] Implement real payment gateway
- [ ] Add admin dashboard
- [ ] Create user profile management
- [ ] Add ticket transfer functionality
- [ ] Implement analytics tracking
