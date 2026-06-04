# Stage 1: Build Angular app
FROM node:22-alpine AS build

# Install pnpm globally
RUN corepack enable && corepack prepare pnpm@11.1.3 --activate

WORKDIR /app

# Copy dependency files first for better caching
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile || pnpm install

# Copy source code
COPY . .

# Build for production
RUN pnpm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built Angular app from build stage
# Angular 21 with @angular/build:application outputs to dist/<project-name>/browser
COPY --from=build /app/dist/atlas-frontend/browser /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
