# Stage 1: Build the React app
FROM node:18 AS build

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve the production build with Nginx
FROM nginx:alpine

# Create or copy your custom Nginx config
COPY default.conf /etc/nginx/conf.d/default.conf

# Copy the React build output
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
