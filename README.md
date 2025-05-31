# OCX_OnlineTicket

A modern landing page for an Indie music event, built with Next.js 15, React, and Tailwind CSS.

## Features
- **Dark mode only**: The entire site uses a modern dark theme for a consistent, stylish look.
- **Multi-language support**: Instantly switch between Vietnamese and English.
- **Responsive design**: Fully optimized for mobile, tablet, and desktop.
- **Animated sponsor logo slider**: Sponsors' logos are displayed in a continuous sliding carousel.
- **Social links**: Prominent, centered icons for Facebook, Instagram, TikTok, Threads, and Email in the footer.
- **Artist lineup**: Card-style grid with hover effects, showing artist info and images.
- **Tickets section**: Information and call-to-action for ticket purchase.
- **FAQ section**: Frequently asked questions for attendees.
- **Sticky header**: Always-visible navigation with language switcher.

## Technology Stack
- **Next.js 15** (App Router)
- **React 18**
- **Tailwind CSS**
- **TypeScript**

## Pages & Flow
- **Landing Page** (`/`):
  - **Header**: Logo, event name, navigation menu (About, Line-up, Tickets, FAQ), language switcher.
  - **Hero Section**: Event highlight, date, location, and main call-to-action.
  - **Line-up Section**: Grid of artists with images and genre, hover to see more info.
  - **Tickets Section**: Ticket types, prices, and purchase button.
  - **FAQ Section**: Common questions and answers.
  - **Footer**: Animated sponsor logos slider, social media icons, and contact info.

### User Flow
1. User lands on the homepage and sees the event highlight (Hero).
2. User can scroll or use the sticky navigation to jump to Line-up, Tickets, or FAQ.
3. User can switch language at any time via the header.
4. User can view artist details, ticket options, and get answers to common questions.
5. User can follow social links or contact via email in the footer.

## Ticket Purchase Page (`/ticket`)

A dedicated, professional ticket purchase page with a modern, card-based dark UI.

**Key features:**
- **Custom Header:** Separate from the homepage, includes event logo, event name, and a button to return to the homepage.
- **Event Info Card:** Shows event name, time, and venue.
- **Interactive Seat Map:** Selectable seats, color-coded by ticket type (VVIP, VIP, PREMIUM, MUSIC LOVER, STANDARD), with real-time selection and summary.
- **User Info Form:** Collects recipient's name, email, and phone number.
- **Payment Method:** Two tabs: Bank Transfer (with QR code and account info) and Credit Card (UI only).
- **Countdown Timer:** Real-time countdown for seat reservation, disables payment when expired.
- **Order Summary:** Lists selected seats, ticket types, total price, policy agreement checkbox, and confirm payment button.
- **E-ticket Notification:** After payment confirmation, a card notifies the user that the e-ticket has been sent to their email.
- **Footer:** Reuses the animated sponsor logo slider and social links from the homepage.
- **Component-driven:** All sections are modular, easy to maintain and extend.
- **No backend required:** All data and logic are mocked for demo purposes.

**Navigation:**
- The "Buy Ticket" button on the homepage now redirects to `/ticket`.

## Demo Screenshot
![Demo Screenshot](link-to-uploaded-image)

## How to run locally
```bash
npm install
npm run dev
```

---
*Replace `link-to-uploaded-image` with your actual image link after uploading.*