# Use the official Bun image for building
FROM oven/bun:latest AS builder

WORKDIR /app

# Copy package.json and lock files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the application
RUN bun run build

# Use Nginx to serve the built application
FROM nginx:alpine

# Copy the build output from the builder stage to Nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy a custom Nginx configuration to handle SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]

