# Use an official Node.js runtime as the base image
FROM node:14 as build-deps

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app's source code to the container
COPY . ./

# Build the React app
RUN npm run build

# Use a lightweight Node.js runtime for the production image
FROM node:14-slim

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the build output from the build-deps image
COPY --from=build-deps /usr/src/app/build ./build

# Expose the port your app will run on (port 3000 in this case)
EXPOSE 3000

# Command to start the app on port 3000
CMD ["npx", "serve", "-s", "build", "-l", "3000"]
