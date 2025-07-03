# Step 1: Install dependencies and build the app
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (cache layer)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy all files and build
COPY . .
RUN npm run build

# Step 2: Serve the app using Next.js's built-in server
FROM node:18-alpine AS runner

# Set environment to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy built app and node_modules from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Port (change if you use a custom one)
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
