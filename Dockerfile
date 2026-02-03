# Stage 1: Build the React frontend
FROM node:20-slim AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Final production image
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Copy built frontend from build-stage
COPY --from=build-stage /app/dist ./dist
EXPOSE 8080
CMD ["uvicorn", "phoenix_core_app:app", "--host", "0.0.0.0", "--port", "8080"]

