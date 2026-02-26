# RuPay Select Tracker

A comprehensive web application to track and manage your RuPay Select Debit Card benefits, vouchers, and redemptions. Perfect for users with multiple RuPay Select cards who want to maximize their card privileges.

## Features

### 🔐 Authentication & User Management
- Secure email/password authentication via Supabase
- User profile management with customizable settings
- Protected routes with middleware

### 💳 Card Management
- Add and manage multiple RuPay Select cards
- Support for different card variants (Select, Platinum, Gold, Classic)
- Track card details (bank, last 4 digits, custom names)
- Edit and delete cards with confirmation

### 🎟️ Voucher Tracking
- Create vouchers for each card with different cycle types:
  - **Monthly** (12 periods: Jan-Dec)
  - **Quarterly** (4 periods: Q1-Q4)
  - **Half-Yearly** (2 periods: H1-H2)
  - **Yearly** (1 period: Annual)

### 📊 Status Tracking
Track voucher periods with multiple statuses:
- **Pending** (Amber) - Not yet redeemed or sold
- **Redeemed** (Green) - Successfully used
- **Sold** (Blue) - Sold to someone else
- **Paused** (Gray) - Temporarily on hold
- **Expired** (Red) - No longer valid

### 🏷️ Voucher Categories
Pre-defined categories for common RuPay Select benefits:
- Airport Lounge Access
- OTT Subscriptions (Netflix, Prime, etc.)
- Fitness & Wellness (Cult.fit, gyms)
- Dining & Restaurants
- Shopping Offers
- Health & Medical
- Travel Benefits
- Golf Privileges
- Concierge Services
- Insurance Coverage
- Entertainment
- Other Benefits

### 📈 Dashboard & Analytics
- Overview statistics (total cards, vouchers, redeemed, sold)
- Visual status breakdown
- Recent vouchers list
- Quick actions for adding cards/vouchers

### 📤 Data Export
- Export vouchers to CSV format
- Easy backup and sharing

### 📚 RuPay Benefits Information
- Comprehensive guide to RuPay Select benefits
- Participating banks list
- Pro tips for maximizing benefits

### 🎨 Modern UI/UX
- Clean, modern interface with Tailwind CSS
- Gradient backgrounds and glassmorphism effects
- Responsive design for mobile and desktop
- Smooth animations and transitions

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier works fine)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rupay-select-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your Supabase credentials to `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

5. Set up the database:
   - Go to your Supabase project SQL Editor
   - Run the SQL from `supabase/schema.sql`

6. Start the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

### Setting up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → API
4. Copy the "URL" and "anon public" key
5. Paste them into your `.env.local` file
6. Go to the SQL Editor
7. Run the schema from `supabase/schema.sql`

## Usage Guide

### First Time Setup
1. Sign up for a new account
2. Add your RuPay Select cards
3. Create vouchers for each benefit
4. Track redemption status for each period

### Managing Cards
- Click "Add Card" to add a new RuPay Select card
- Select your bank from the dropdown
- Enter the last 4 digits of your card
- Choose the card variant (Select, Platinum, etc.)

### Adding Vouchers
1. Click "Add Voucher"
2. Select the card this voucher belongs to
3. Choose a category (e.g., Lounge Access, OTT)
4. Select cycle type (Quarterly, Half-Yearly, etc.)
5. Set an estimated value (optional)
6. Save

### Tracking Status
- Click on any period badge in the vouchers table
- Select the appropriate status:
  - **Pending**: Haven't used it yet
  - **Redeemed**: Successfully used the benefit
  - **Sold**: Sold the voucher to someone else
  - **Paused**: Temporarily not using

### Exporting Data
- Click "Export CSV" button on the dashboard
- Download your vouchers data for backup

## Database Schema

The application uses the following tables:

- **profiles**: User profile information
- **cards**: RuPay card details per user
- **vouchers**: Voucher definitions with cycle type
- **voucher_periods**: Individual periods for each voucher with status tracking

Row Level Security (RLS) is enabled on all tables to ensure users can only access their own data.

## Roadmap

- [ ] Push notifications for upcoming expirations
- [ ] Dark mode support
- [ ] Calendar view for benefit timelines
- [ ] Statistics charts and graphs
- [ ] Mobile app (React Native)
- [ ] Family sharing feature
- [ ] Automated benefit reminders via email

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open source and available under the MIT License.

## Support

If you have any questions or need help, please open an issue on GitHub.

---

Made with ❤️ for RuPay Select cardholders