# Multi-stage build for Phoenix Core PWA
# Stage 1: Build the React/Vite application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json ./
# Ensure we have a fresh lockfile in the container to avoid version conflicts
RUN npm install

# Copy configuration files
COPY tsconfig.json vite.config.ts tailwind.config.js postcss.config.js index.html ./

# Copy source and public directories
COPY src ./src
COPY public ./public

# Build the application
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Update Nginx to listen on port 8080
RUN sed -i 's/listen\s*80;/listen 8080;/g' /etc/nginx/conf.d/default.conf

# Copy built files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create custom nginx config for PWA
RUN echo 'server { \
    listen 8080; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    location /sw.js { \
    add_header Cache-Control "no-cache, no-store, must-revalidate"; \
    add_header Service-Worker-Allowed "/"; \
    } \
    location / { \
    try_files $uri $uri/ /index.html; \
    } \
    location ~* \\.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ { \
    expires 1y; \
    add_header Cache-Control "public, immutable"; \
    } \
    }' > /etc/nginx/conf.d/default.conf

# Expose port 8080
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
