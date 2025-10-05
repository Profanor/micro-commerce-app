# Stage 1: Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy dependency files first (better layer caching)
COPY package*.json pnpm-lock.yaml ./

# Copy the Prisma schema before install (needed for postinstall)
COPY prisma ./prisma

# Install dependencies (includes prisma generate in postinstall)
RUN pnpm install --frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the NestJS app
RUN pnpm build

# Stage 2: Runtime stage
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g pnpm

# Copy only the necessary output
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY package*.json ./

# Expose application port
EXPOSE 4001

# Command to run the server
CMD ["node", "dist/main.js"]
