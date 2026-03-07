# Capital • Personal Finance

A premium, modern finance tracking application built for precision, clarity, and ease of use. Manage your wealth with a sophisticated interface that supports real-time analytics, budget monitoring, and comprehensive transaction tracking.

![Capital App Preview](https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6)

## ✨ Features

- **📊 Intelligent Dashboard**: Real-time summary of your financial health with interactive spending charts.
- **📄 Transaction Management**: Clean, searchable list of all income and expenses with category filtering.
- **🎯 Budget Tracking**: Set monthly spending limits per category and monitor progress with visual indicators.
- **🌓 Dynamic Theming**: Fully integrated Light and Dark modes with automatic system preference detection.
- **🛡️ Secure Authentication**: Built-in user security with specialized "Security Settings" for password management.
- **🎨 Premium UI/UX**: Modern SaaS aesthetic featuring glassmorphism, subtle animations, and professional typography.
- **📱 Responsive Design**: Fully optimized for desktop, tablet, and mobile viewing.

## 🚀 Tech Stack

- **Core**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with Persistence
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Analytics/Charts**: [Recharts](https://recharts.org/)
- **Database/ORM**: [Prisma](https://www.prisma.io/) with SQLite/PostgreSQL
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Finance-Tracker-App
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your database URL and other secrets:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key"
   ```

4. **Initialize Database**:
   ```bash
   npx prisma db push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📖 Architecture & Pattern

The application follows a clean, modular architecture:

- `app/`: Next.js App Router pages and API routes.
- `components/`: Reusable UI components and feature-specific modules.
- `store/`: Zustand stores for global state management.
- `utils/`: Common helpers, formatters, and category logic.
- `types/`: Shared TypeScript interfaces and Zod schemas.
- `prisma/`: Database schema and migrations.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
