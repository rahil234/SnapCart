# Copilot Instructions – Quick Commerce Platform

This file defines **global instructions** for AI copilots and contributors working on this project. The goal is to avoid
re‑prompting architectural, domain, and convention details every time.

---

## 🧠 Project Overview

This is a **quick commerce (q‑commerce) website**, similar to *Blinkit / Zepto / Instamart*.

### Core Characteristics

- Delivers **groceries and stationery items within minutes**
- Real‑time, cart‑driven ordering
- Coupon and discount support (offers handled separately)
- Customer‑centric domain model

---

## 🧱 Tech Stack

### Backend

- **NestJS**
- **Prisma ORM**
- **PostgreSQL** (assumed unless specified otherwise)
- **Swagger / OpenAPI** for API documentation and client generation

### Frontend

- **React**
- Typed API client generated from Swagger

### Monorepo

- **Turborepo**

```text
apps/
  api/        # NestJS backend
  web/        # React frontend
packages/
  ui/
  config/
```

---

## 🧩 Architectural Principles

### 1. Feature‑First Modular Design (CCP)

The backend strictly follows **Component / Capability‑Centric Packaging (CCP)**:

- Each **feature** is its own NestJS module
- No horizontal layers like `controllers/`, `services/` at root

```text
apps/api/src/modules/cart/
  application/
  domain/
  infrastructure/
  interface/
```

---

### 2. Clean Architecture (Mandatory)

Every feature module follows **Clean Architecture**:

#### Layers

- **Domain**
    - Entities
    - Value Objects
    - Domain rules

- **Application**
    - Use cases
    - Commands / Queries (CQRS style where applicable)
    - Ports (interfaces)

- **Infrastructure**
    - Prisma repositories
    - External integrations
    - Adapters implementing ports

- **Interface**
    - Controllers
    - DTOs
    - Guards / Interceptors
    - Swagger decorators

#### Rules

- Domain must not depend on any other layer
- Application depends only on Domain
- Infrastructure depends on Application
- Interface depends on Application

---

## 🔁 CQRS Guidelines

- **Queries**: read‑only, no side effects
- **Commands**: mutate state
- Cart, Orders, Coupons follow CQRS style where useful
- Queries may join / populate data for read models

---

## 🗃️ Database & Prisma

- Prisma is used **only inside Infrastructure layer**
- Prisma models are never exposed directly to controllers
- Always map Prisma models → Domain → DTOs

---

## 📜 Swagger & API Contract Rules

Swagger is a **first‑class citizen**.

### Strict Typing (Very Important)

- All **request and response DTOs must be explicit**
- No `any`
- No implicit responses

### Custom Decorator: `@ApiResponseWithType`

Use the custom decorator everywhere:

```ts
@ApiResponseWithType(
  {
    allowPagination: true,
    isArray: true,
  },
  UserResponseDto,
  Status.Ok
)
```

#### Decorator Behavior

- First argument: Swagger options
    - `allowPagination?: boolean`
    - `isArray?: boolean`
    - Supports **all standard Swagger options**

- Second argument: **Response DTO type**
- Third argument:
    - HTTP status
    - Used for **both Swagger and NestJS response status**

### Status Convention

- Always use `Status.Ok`, `Status.Created`, etc.
- Do not hardcode numeric HTTP status codes

---

## 👤 Authentication & Identity Resolution

### User Identity

- Use:

```ts
@UserId()
userId
:
string
@UserRole()
role
:
Role
```

- `@UserId` extracts userId from auth token
- `@UserRole` extracts role

### Customer Resolution (Important)

- **Customers are NOT equal to users**
- For customer‑specific flows:

```text
userId → CustomerResolver → customerId
```

#### Rules

- Controllers should never manually query customer tables
- Always use **CustomerResolver** for customerId resolution
- Resolution happens in **application layer or guards**, not domain

---

## 🛒 Cart & Ordering Philosophy

- Cart is the **source of truth** for checkout
- Checkout always happens from cart, not directly from product
- Coupons apply at **cart / checkout level**, not order creation

---

## 🎟️ Coupons & Discounts

- Coupons are independent from offers
- Products may have a `discountPercentage`
- Coupons:
    - Validated in application layer
    - Applied against cart totals
    - Stored as applied state in cart

---

## 🚫 What NOT To Do

- ❌ Do not bypass Clean Architecture layers
- ❌ Do not return Prisma models directly
- ❌ Do not place business logic in controllers
- ❌ Do not mix customerId and userId
- ❌ Do not create shared "utils" that hide domain logic

---

## ✅ Expected Copilot Behavior

When generating code, always:

1. Respect **feature‑first modules**
2. Follow **Clean Architecture boundaries**
3. Use **CQRS style** where applicable
4. Generate **strict DTOs**
5. Apply **Swagger decorators consistently**
6. Resolve `customerId` via **CUSTOMER_IDENTITY_RESOLVER**
7. Prefer clarity over shortcuts

---

## 📌 Goal

This document exists so **these rules never need to be re‑explained**.

Any generated code, suggestion, or refactor **must comply with this file by default**.

