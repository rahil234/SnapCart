# Use the official Ubuntu image as the base
FROM ubuntu:latest

# # Set the working directory
WORKDIR /app

# # Install required packages: curl, git, and Node.js
RUN apt update && \
    apt install -y curl git && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt install -y nodejs

# # Clone the SnapCart repository
# RUN git clone https://github.com/rahil234/SnapCart.git
# WORKDIR  /app/SnapCart

# RUN npm install

# WORKDIR  /app/SnapCart/server

# # Build the TypeScript code
# RUN npm run build

# Expose the desired port (if needed, adjust based on your app)
EXPOSE 3000
# CMD ["node", "SnapCart/server/dist/src/."]

# Command to run your app
# CMD ["pwd"]  # or adjust to your entry point
# CMD ["ls"]
