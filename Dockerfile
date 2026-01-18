# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN chmod -R +x node_modules/.bin
RUN npm run build

# Stage 2: Serve with FastAPI
FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code specifically
COPY phoenix_core_app.py .
COPY backend/ ./backend/
COPY safecore_sdk/ ./safecore_sdk/

# Copy built frontend assets from Stage 1
COPY --from=frontend-builder /app/dist ./dist

# Expose port
EXPOSE 8080

# Environment variables
ENV SAFECORE_CLIENT_SECRET=test-secret-123
ENV PORT=8080

# Run the application using uvicorn CLI
CMD ["uvicorn", "phoenix_core_app:app", "--host", "0.0.0.0", "--port", "8080"]
