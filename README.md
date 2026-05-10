# EdgeFlow — AI Trading Journal

The AI-powered trading journal for serious traders.

## Quick Start

### 1. Install
npm install

### 2. Environment Variables
cp .env.example .env.local
Fill in all values.

### 3. Database
npm run db:push
npm run db:seed

### 4. Run
npm run dev

Open http://localhost:3000

Demo login: demo@edgeflow.app / password123

## Deploy to Vercel

1. Push to GitHub
2. Connect repo at vercel.com
3. Add all env vars in Vercel dashboard
4. Deploy

## Stack
- Next.js 14 + TypeScript
- PostgreSQL + Prisma
- NextAuth v5
- Anthropic Claude AI
- Stripe payments
- Cloudinary storage
- TailwindCSS + Recharts
