#Base Image configuring
FROM node:alpine

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
# RUN npm install --production
RUN npm install

# Copy application source
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable for MongoDB URI (can be overridden)
ENV MONGO_URI=mongodb://mongo:27017/snapcart

# Start the Node.js app
CMD ["npm", "start"]