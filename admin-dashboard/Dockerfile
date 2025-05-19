FROM node:18 as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with platform-specific handling
RUN npm cache clean --force \
    && npm install \
    && npm uninstall esbuild \
    && npm install --save-dev esbuild@latest \
    && npm rebuild esbuild --platform=linux --arch=x64

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production image
FROM nginx:alpine

# Copy the build output
COPY --from=build /app/dist/admin-dashboard /usr/share/nginx/html

# Copy nginx config
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 4200

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
