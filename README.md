# Namitha Jewellers DigiGold Application

A premium digital gold investment platform built with React, Express, and SQLite.

## 🚀 Recent Improvements

### 1. 🎨 Typography & Design
- **Open Sans Integration**: Replaced the previous fonts with **Open Sans** for a cleaner, modern, and highly readable interface, as requested.
- **Compact UI**: Reduced padding, font sizes, and component dimensions to ensure the application fits perfectly on smaller screens and provides a dense, professional "app-like" experience.
- **GSAP Animations**: Integrated **GSAP** for high-performance animations, including a custom splash screen and a "Spotlight" mouse-follow effect on the gold price card (inspired by **ReactBits**).

### 2. 🛠️ Tech Stack Upgrades
- **PrimeReact**: Integrated **PrimeReact** components for professional-grade UI elements.
- **GSAP**: Added for advanced motion and interaction effects.
- **Mobile-First Optimization**: While this is a web application, it is designed with a "React Native" feel, optimized for mobile viewports.

### 2. 🤖 AI Market Insights
- **Gemini-Powered Advisor**: Integrated the **Gemini 3 Flash** model to provide real-time, professional investment insights based on the current gold price.
- **Dynamic Updates**: The AI advisor now analyzes market trends and provides actionable advice (Buy/Hold) directly on the dashboard.

### 3. 📊 Enhanced User Experience
- **More Dummy Data**: Added realistic dummy data for **Active SIP Plans** and **Rewards (Referral Bonus & Loyalty Points)** to showcase the full potential of the app.
- **Live Price Tracking**: Real-time gold price updates every 30 seconds with a visual area chart.
- **Bento Grid Dashboard**: A structured, professional layout that organizes information hierarchically.

### 4. 🧪 Robustness & Testing
- **TDD Approach**: Backend endpoints are verified using **Vitest** and **Supertest**.
- **Secure Auth**: JWT-based authentication with password hashing.

---

## 💡 Future Improvements

To take this application to the next level, we recommend:

1. **Real Gold API Integration**:
   - Currently, the price is simulated. Integrating a real-time API like [GoldAPI.io](https://www.goldapi.io/) or [MetalpriceAPI](https://metalpriceapi.com/) would provide 100% accurate market data.

2. **Payment Gateway Integration**:
   - Implement a real payment gateway like **Razorpay** or **Stripe** for actual INR transactions.

3. **KYC Automation**:
   - Integrate an OCR-based KYC system (e.g., using Gemini or a specialized service) to automatically verify Aadhar/PAN cards.

4. **Push Notifications**:
   - Use WebSockets or Firebase Cloud Messaging to notify users of significant price drops or SIP debit reminders.

5. **NVIDIA NIM Integration**:
   - For even more advanced market analysis, we could leverage **NVIDIA NIM** hosted LLMs (like Llama 3 or Mixtral) to perform deep sentiment analysis on global financial news and its impact on gold prices.

---

## 🛠️ How to Run Tests
Run the following command to execute the test suite:
```bash
npx vitest run
```
