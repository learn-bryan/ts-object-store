# Start with the official Node.js LTS Alpine image
FROM node:lts-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json before other files 
# Utilize Docker cache to speed up builds
#COPY package*.json ./

# Install dependencies
#RUN npm install

# Copy over the rest of the app code
COPY . .

# Install TypeScript globally 
RUN npm install -g typescript 

# Install pg driver 
RUN npm install pg

# Compile TypeScript 
#RUN tsc 

# Start the server
#CMD [ "node", "dist/index.js" ]