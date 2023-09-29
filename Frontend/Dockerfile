# Use Node.js image as the base image for building the frontend
FROM node:14 as builder

# Set the working directory in the container
WORKDIR /app

# Copy the frontend source code to the container
COPY . .

# Install dependencies
RUN npm install

# Build the React app for production
RUN npm run build

# Use the official Nginx image as the base image for serving the frontend
FROM nginx:latest

# Copy the built frontend artifacts to the Nginx server directory
COPY --from=builder /app/build /usr/share/nginx/html
