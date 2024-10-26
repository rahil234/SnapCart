# Use the official Ubuntu image as the base
FROM node

# Set the working directory
WORKDIR /app

# Install required packages: curl, git, and Node.js
# RUN apt update && \
#     apt install -y curl git && \
#     curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
#     apt install -y nodejs && \
#     apt clean && \
#     rm -rf /var/lib/apt/lists/*

# Clone the SnapCart repository
# RUN git clone https://github.com/rahil234/SnapCart.git

# Set the working directory to the cloned repo
# COPY . .
# WORKDIR /app/SnapCart

# RUN npm install
# # Install npm dependencies
# WORKDIR /app/SnapCart/server

# # Build the TypeScript code
# RUN npm run build

# Expose the desired port (if needed, adjust based on your app)
EXPOSE 3000

# Command to run your app
CMD ["npm", "start"]
