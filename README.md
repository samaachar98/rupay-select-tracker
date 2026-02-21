# 💳 Rupay Select Voucher Tracker

A beautiful, mobile-friendly Next.js application for tracking Rupay Select debit card benefits and vouchers.

## 🎯 Features

- **Editable Tables**: Add/remove cards and vouchers easily
- **Quarterly/Half-Year/Yearly Tracking**: Mark redemption by cycle
- **Mobile-Friendly**: Responsive design for all devices
- **Beautiful UI**: Modern interface with Tailwind CSS
- **Local Storage**: Persist your data across sessions
- **Easy Customization**: Add new cards and benefits anytime

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Vercel account (for deployment)

### Installation

```bash
npm install
# or
yarn install
```

### Development

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
rupay-select-tracker/
├── src/
│   ├── app/
│   │   └── page.tsx          # Main page
│   ├── components/
│   │   ├── columns.tsx       # Table columns config
│   │   ├── data-table.tsx    # Data table component
│   │   └── ui/               # UI components
│   ├── lib/
│   │   └── utils.ts          # Utility functions
│   └── styles/
│       └── globals.css       # Global styles
├── public/                    # Public assets
├── package.json
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_APP_NAME="Rupay Select Tracker"
```

## 📱 Mobile Responsiveness

The application is fully responsive and works beautifully on:
- Desktop browsers
- Tablets
- Mobile phones

## 🎨 UI Components Used

- **TanStack Table**: Powerful data table with sorting, filtering, pagination
- **shadcn/ui**: Beautiful pre-built components
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Clean, modern icons
- **Radix UI**: Accessible primitive components

## 🔄 Data Management

The application uses local storage to persist your voucher data. Your tracking information will be saved automatically.

## 🛠️ Customization

### Adding New Cards

1. Click "Add Card" button
2. Enter card details (bank name, last 4 digits, etc.)
3. Save the card

### Adding New Vouchers

1. Select a card
2. Click "Add Voucher"
3. Enter voucher details (name, cycle type, notes)
4. Save the voucher

### Marking Redemption

- Check the appropriate quarter/half-year/year checkbox when you redeem a voucher
- The "Last Redeemed" column updates automatically

## 🌐 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Set up automatic deployments
3. Deploy to production

### Manual Deployment

```bash
npm run build
npm start
```

## 📝 License

MIT License

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 🙏 Acknowledgements

- Next.js team for the amazing framework
- TanStack for the excellent table library
- shadcn for the beautiful UI components
- Radix UI for accessible primitives

---

**Built with ❤️ for Rupay Select users**