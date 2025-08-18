# Admin Panel

A modern admin panel for managing travel and hospitality services, built with Next.js 14, Bun, and MySQL.

## Features

- 🔐 JWT Authentication
- 🎨 Modern Airbnb-style UI with Tailwind CSS
- 🌙 Dark mode support
- 📱 Fully responsive design
- 🔄 Real-time data updates with SWR
- 📊 Dashboard with key metrics
- 📝 CRUD operations for:
  - Flights
  - Hotels
  - Cars
  - Tours
  - Properties
  - Bookings
  - Payments

## Tech Stack

- **Runtime**: Bun
- **Framework**: Next.js 14 (App Router)
- **Database**: MySQL
- **Styling**: Tailwind CSS + shadcn/ui
- **Authentication**: JWT with HTTP-only cookies
- **State Management**: SWR
- **Icons**: Lucide React

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd admin-panel
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Copy the environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update the environment variables in `.env.local` with your values.

5. Set up the database:
   ```bash
   mysql -u your_username -p your_database < setup.sql
   ```

6. Start the development server:
   ```bash
   bun run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Login

- Email: admin@example.com
- Password: admin123

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── (auth)/         # Protected routes
│   ├── api/            # API routes
│   └── login/          # Public routes
├── components/         # React components
│   ├── ui/            # UI components
│   └── theme-provider # Theme context
├── lib/               # Utilities
│   ├── auth.ts       # Authentication helpers
│   ├── db.ts         # Database connection
│   └── utils.ts      # Helper functions
└── middleware.ts     # Auth middleware
```

## API Routes

- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Clear auth cookie
- `GET /api/auth/me` - Get current user
- `GET /api/stats` - Get dashboard statistics

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 