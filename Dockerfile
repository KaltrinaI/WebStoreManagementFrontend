# Stage 1: Build the React app
FROM node:18 AS build
WORKDIR /app

# Copy package files and install dependencies.
COPY package*.json ./
RUN npm install

# Copy the remaining source code and build the app.
COPY . .
RUN npm run build

# Stage 2: Serve the production build with Nginx.
FROM nginx:alpine
# Copy the build output to the nginx html folder.
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80 (the default for nginx)
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
