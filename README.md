# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = "postgresql://neondb_owner:npg_GOi3FIMhx4nD@ep-quiet-leaf-a5ukvqbf-pooler.us-east-2.aws.neon.tech/neondb?sslmode=require"
}

enum UserStatus {
  ONLINE
  OFFLINE
  IN_GAME
  MATCHMAKING
  AWAY
}

enum TransactionStatus {
    PENDING
    ACCEPTED
    FAILED
}

enum TransactionType {
  // "deposit", "withdraw", "fee", "reward", "bet"
  DEPOSIT 
  WITHDRAW 
  FEE 
  REWARD 
  BET 
}

enum EmailVerificationType {
  PENDING
  SUCCESS
  FAILED
}
enum FriendshipStatus {
    PENDING
    ACCEPTED
    BLOCKED 
}




model User {
  id            String   @id @default(uuid())
  username      String   @unique
  email         String   @unique
  emailVerified Boolean @default(false)
  passwordHash  String
  avatarUrl     String?

  // Premium Features
  isPremium     Boolean  @default(false)
  premiumSince  DateTime? // optional field

  // Wallet
  wallet        Wallet?

  // Game Stats
  gamesPlayed   Int      @default(0)
  gamesWon      Int      @default(0)
  gamesLost     Int      @default(0)
  rating        Int      @default(0) // used for leaderboard



  // Game Matching
  status        UserStatus   @default(OFFLINE) 

  // Friends
  sentRequests    Friendship[] @relation("SentRequests")
  receivedRequests Friendship[] @relation("ReceivedRequests")

  // Betting and Transactions
  transactions  Transaction[]
  bets          Bet[]

  // Timestamps
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}


model Wallet {
  id         String   @id @default(uuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String   @unique

  balance    Float      @default(0.0) // in tokens
  currency   String   @default("tokens")

  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model Transaction {
  id         String   @id @default(uuid())
  user       User     @relation(fields: [userId], references: [id])
  userId     String

  type       TransactionType   // "deposit", "withdraw", "fee", "reward", "bet"
  amount     Int
  status     TransactionStatus   
  reference  String?  // optional for Stripe/payments

  createdAt  DateTime @default(now())
}


model Bet {
  id          String   @id @default(uuid())
  players     User[]   // 2 players involved

  amount      Int      // total amount at stake
  winnerId    String?  // winner's userId (if decided)
  fee         Int      // platform cut (usually 10%)

  createdAt   DateTime @default(now())
  resolvedAt  DateTime?
}

model Friendship {
  id         String   @id @default(uuid())

  sender     User     @relation("SentRequests", fields: [senderId], references: [id])
  senderId   String

  receiver   User     @relation("ReceivedRequests", fields: [receiverId], references: [id])
  receiverId String

  status     FriendshipStatus  @default(PENDING) // pending, accepted, blocked
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([senderId, receiverId])
}

model VerifyEmail {
  id         String               @id @default(uuid())
  email      String                @unique
  otpHashed  String               // better to store hashed OTP
  expiry     DateTime
  status     EmailVerificationType @default(PENDING)
  createdAt  DateTime             @default(now())
  resolvedAt DateTime?            @updatedAt

  @@index([email, status]) // quick lookups
}



 // "prisma": "prisma",
  // "migrate": "prisma migrate dev",