# MoneyTracker

A personal expense tracking app built with React Native and Expo. Track daily expenses, categorize spending, view monthly summaries, and sync data to the cloud with Firebase Firestore.

## Features

- **Add, edit, and delete expenses** with amount, category, and optional description
- **18 predefined categories** — Food & Dining, Groceries, Shopping, Fuel, Rent, Bills & Utilities, EMI, Investment, and more
- **Monthly view** with easy month navigation
- **Monthly summary** showing total spending at a glance
- **Swipe actions** — swipe left on any expense to edit or delete
- **Cloud sync** — data is stored locally with AsyncStorage and synced to Firebase Firestore
- **Input validation** — real-time checks on amount and description fields

## Tech Stack

- **React Native 0.79** with **Expo 53**
- **React 19** / **TypeScript 5.8**
- **Firebase Firestore** for cloud storage
- **AsyncStorage** for local persistence
- **react-native-gesture-handler** for swipe interactions

## Getting Started

### Prerequisites

- Node.js
- npm or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- Xcode (for iOS) or Android Studio (for Android)

### Installation

```bash
git clone https://github.com/deXterbed/MoneyTracker.git
cd MoneyTracker
npm install
```

### Running the App

```bash
npm start       # Start Expo dev server
npm run ios     # Run on iOS simulator
npm run android # Run on Android emulator
npm run web     # Run in browser
```

## Project Structure

```
MoneyTracker/
├── App.tsx                # Root component and state management
├── firebaseConfig.js      # Firebase configuration
├── storageSync.ts         # Local/cloud sync logic
├── components/
│   ├── ExpenseForm.tsx    # Add/edit expense form
│   ├── ExpenseList.tsx    # Swipeable expense list
│   └── ExpenseSummary.tsx # Monthly total summary
├── types/
│   └── expense.ts         # TypeScript interfaces and constants
└── assets/                # App icons and splash screen
```

## Data Model

```typescript
interface Expense {
  id: string;
  amount: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time: string;
  category: string;
}
```

## Categories

Food & Dining · Groceries · Instamart · Shopping · Entertainment · Fuel · Rent · Maintenance · Bills & Utilities · EMI · Deposit · Investment · Direct Transfer · Credit Card · Health & Fitness · Education · Travel · Other
