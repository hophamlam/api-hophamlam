# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install && npm install typescript -g

# Copy all source code to the container
COPY . .

RUN tsc

# Command to run the app
CMD ["node", "dist/main.js"]
