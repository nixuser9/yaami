# Use Node.js LTS base image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM node:20-alpine

# Install Electron dependencies
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    xvfb \
    dbus

# Set working directory
WORKDIR /app

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/public ./public

# Create directories for config persistence
RUN mkdir -p /app/config /app/downloads

# Expose port for web version (if implementing web UI)
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV DISPLAY=:99
ENV ELECTRON_ENABLE_LOGGING=1

# Create volume mount points
VOLUME ["/app/config", "/app/downloads"]

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'Xvfb :99 -screen 0 1024x768x16 &' >> /start.sh && \
    echo 'sleep 2' >> /start.sh && \
    echo 'dbus-daemon --system --fork' >> /start.sh && \
    echo 'npm start' >> /start.sh && \
    chmod +x /start.sh

# Start the application
CMD ["/start.sh"]
