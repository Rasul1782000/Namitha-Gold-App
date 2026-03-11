# Namitha Jewellers - Digital Gold Savings App

A modern, mobile-first application for investing in digital gold, tracking savings through SIPs, and managing gold holdings.

## Features

- **Digital Gold Investment**: Buy and sell 24K pure gold instantly.
- **Gold SIP**: Automated Systematic Investment Plans for consistent gold savings.
- **Rewards Program**: Earn free gold through referrals and festive offers.
- **Store Locator**: Find the nearest Namitha Jewellers branch for physical redemption.
- **Market Insights**: AI-powered investment insights based on real-time market trends.
- **Secure Storage**: Your gold is stored in insured vaults.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Motion/React (animations), Recharts (data visualization).
- **Backend**: Express.js (for API proxying and server-side logic).
- **AI Integration**: Google Gemini API for market insights.
- **Styling**: Tailwind CSS with custom branding (Burgundy & Gold theme).

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Development Server**:
   ```bash
   npm run dev
   ```

3. **Environment Variables**:
   Ensure the following environment variables are set in your `.env` file:
   - `GEMINI_API_KEY`: Your Gemini API key for AI insights.

## Project Structure

- `/src/components/common/`: Reusable UI components (Button, Card, Input, Navbar).
- `/src/components/screens/`: Individual screen components.
- `/src/constants.ts`: Mock data and static configurations.
- `/src/types.ts`: TypeScript interfaces and types.
- `/src/App.tsx`: Main application logic and state management.

## Deployment

The application is built for production using `npm run build` and can be deployed to any containerized environment (like Google Cloud Run).
