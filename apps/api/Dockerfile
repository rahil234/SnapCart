# ----------------------------
# 1. BUILDER STAGE
# ----------------------------
FROM node:22-alpine AS builder

WORKDIR /app

ENV DATABASE_URL=postgresql://user:password@localhost:5432/dbname

RUN corepack enable

# Copy only package files first -> better caching
COPY package.json ./

# Install dependencies (production + dev)
RUN pnpm install

# Copy source
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Create optimized Next.js production build
RUN pnpm run build


# ----------------------------
# 2. RUNNER STAGE
# ----------------------------
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only required files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma/schema.prisma ./prisma/schema.prisma

RUN npm install --omit=dev

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3000

CMD ["node", "dist/main.js"]
