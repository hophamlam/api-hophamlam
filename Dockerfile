# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# label the image
LABEL org.opencontainers.image.source https://github.com/gaolamthuy/gaolamthuy-api

# Copy package.json and package-lock.json to the container
# This is done before copying the entire source code to leverage Docker cache layers
COPY package*.json ./

# Install app dependencies
# Including TypeScript as a dev dependency in package.json is recommended
RUN npm install

# Copy all source code to the container
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Run the app as a non-root user for security purposes
# Create a user and switch to it
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Command to run the app
CMD ["node", "dist/main.js"]
