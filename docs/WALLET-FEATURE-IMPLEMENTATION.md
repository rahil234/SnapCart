# Wallet Feature Implementation

## Overview

This document describes the wallet feature implementation for the SnapCart quick commerce platform.

## Database Schema

### New Models Added

```prisma
model Wallet {
  id           String              @id @default(cuid())
  customerId   String              @unique
  balance      Float               @default(0)
  currency     String              @default("INR")
  isActive     Boolean             @default(true)
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt
  customer     CustomerProfile     @relation(fields: [customerId], references: [id], onDelete: Cascade)
  transactions WalletTransaction[]
}

model WalletTransaction {
  id          String                  @id @default(cuid())
  walletId    String
  amount      Float
  type        WalletTransactionType
  status      WalletTransactionStatus @default(pending)
  description String?
  reference   String?
  orderId     String?
  metadata    Json?
  createdAt   DateTime                @default(now())
  updatedAt   DateTime                @updatedAt
  wallet      Wallet                  @relation(fields: [walletId], references: [id], onDelete: Cascade)
}

enum WalletTransactionType {
  credit
  debit
  refund
  cashback
}

enum WalletTransactionStatus {
  pending
  completed
  failed
  reversed
}
```

## Backend API Endpoints

### Wallet Controller (`/api/wallet`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wallet` | Get wallet information (creates wallet if not exists) |
| GET | `/wallet/transactions` | Get transaction history with pagination |
| POST | `/wallet/add-money` | Add money to wallet |
| POST | `/wallet/validate-balance` | Validate if wallet has sufficient balance |

### Request/Response DTOs

#### Get Wallet Response
```typescript
{
  id: string;
  customerId: string;
  balance: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Add Money Request
```typescript
{
  amount: number;      // Required, minimum 1
  description?: string;
  reference?: string;
}
```

#### Add Money Response
```typescript
{
  transactionId: string;
  newBalance: number;
  amount: number;
  status: string;
}
```

#### Validate Balance Request
```typescript
{
  amount: number;  // Required, minimum 1
}
```

#### Validate Balance Response
```typescript
{
  isValid: boolean;
  currentBalance: number;
  requiredAmount: number;
  shortfall: number;
}
```

## Clean Architecture Structure

```
apps/api/src/modules/wallet/
├── wallet.module.ts
├── domain/
│   ├── entities/
│   │   ├── index.ts
│   │   ├── wallet.entity.ts
│   │   └── wallet-transaction.entity.ts
│   └── repositories/
│       ├── index.ts
│       └── wallet.repository.ts
├── application/
│   ├── wallet-application.module.ts
│   ├── commands/
│   │   ├── index.ts
│   │   ├── add-money-to-wallet.command.ts
│   │   ├── debit-wallet.command.ts
│   │   ├── refund-to-wallet.command.ts
│   │   ├── validate-wallet-balance.command.ts
│   │   └── handlers/
│   │       ├── index.ts
│   │       ├── add-money-to-wallet.handler.ts
│   │       ├── debit-wallet.handler.ts
│   │       ├── refund-to-wallet.handler.ts
│   │       └── validate-wallet-balance.handler.ts
│   └── queries/
│       ├── index.ts
│       ├── get-wallet.query.ts
│       ├── get-wallet-transactions.query.ts
│       └── handlers/
│           ├── index.ts
│           ├── get-wallet.handler.ts
│           └── get-wallet-transactions.handler.ts
├── infrastructure/
│   └── persistence/
│       ├── index.ts
│       └── prisma-wallet.repository.ts
└── interfaces/
    └── http/
        ├── wallet-http.module.ts
        ├── controllers/
        │   └── wallet.controller.ts
        └── dto/
            ├── request/
            │   ├── index.ts
            │   ├── add-money.dto.ts
            │   ├── get-transactions.dto.ts
            │   └── validate-balance.dto.ts
            └── response/
                ├── index.ts
                ├── wallet-response.dto.ts
                ├── wallet-transactions-response.dto.ts
                ├── add-money-response.dto.ts
                └── validate-balance-response.dto.ts
```

## Checkout Integration

### Wallet Payment Flow

1. **Validation** (before order creation):
   - Check if wallet exists for customer
   - Check if wallet is active
   - Validate sufficient balance for order total

2. **Order Creation**:
   - Order is created with `paymentMethod: 'wallet'`
   - Initial `paymentStatus: 'pending'`

3. **Payment Processing** (after order creation):
   - Debit amount from wallet
   - Create wallet transaction with type `DEBIT`
   - Update order `paymentStatus` to `'paid'`
   - Clear cart

### Order Cancellation with Wallet Refund

When a wallet-paid order is cancelled:
1. Check if `paymentMethod === 'wallet'` and `paymentStatus === 'paid'`
2. Create wallet transaction with type `REFUND`
3. Credit refund amount to wallet
4. Update order with `refundAmount` and `paymentStatus: 'refunded'`

## Frontend Integration

### Redux Store

```typescript
// store/wallet/walletSlice.ts
interface WalletState {
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  totalTransactions: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  transactionsStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Actions
- fetchWallet()
- fetchTransactions({ limit, offset })
- addMoneyToWallet({ amount, description?, reference? })
- validateWalletBalance(amount)
- clearWallet()
- updateWalletBalance(balance)
```

### Wallet Page (`/my-account#wallet`)

Features:
- Display current balance with currency
- Add funds button (opens dialog)
- Transaction history with:
  - Transaction type icons (credit, debit, refund, cashback)
  - Amount with color coding (green for credits, red for debits)
  - Status badges
  - Date/time formatting
  - Order reference links

### Checkout Page Integration

- Displays wallet balance in payment method selection
- Disables wallet option if insufficient balance
- Shows shortfall amount with "Add funds" link
- Validates balance before submission
- Refreshes wallet after successful payment

## Usage Examples

### Adding Money to Wallet
```typescript
import { WalletService } from '@/services/wallet.service';

const { data, error } = await WalletService.addMoney(500, 'Added via Razorpay', 'pay_xyz123');
if (!error) {
  console.log('New balance:', data.newBalance);
}
```

### Checking Wallet Balance Before Order
```typescript
import { WalletService } from '@/services/wallet.service';

const { data, error } = await WalletService.validateBalance(orderTotal);
if (!error && data.isValid) {
  // Proceed with wallet payment
} else {
  // Show insufficient balance message
  console.log('Shortfall:', data.shortfall);
}
```

## Security Considerations

1. **Authentication**: All wallet endpoints require JWT authentication
2. **Authorization**: Only customers can access wallet endpoints
3. **Customer Resolution**: Uses `CUSTOMER_IDENTITY_RESOLVER` to map userId to customerId
4. **Atomic Transactions**: Balance updates and transaction creation are done atomically using Prisma transactions
5. **Balance Validation**: Server-side validation before any debit operation

## Migration

Run the following command to apply the database migration:

```bash
cd apps/api
npx prisma migrate dev
```

## Testing Checklist

- [ ] Create wallet (automatic on first access)
- [ ] Add money to wallet
- [ ] View transaction history with pagination
- [ ] Checkout with wallet payment (sufficient balance)
- [ ] Checkout with wallet payment (insufficient balance - should fail)
- [ ] Cancel wallet-paid order (should refund to wallet)
- [ ] View refund transaction in history
