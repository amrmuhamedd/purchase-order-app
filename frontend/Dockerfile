# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

RUN npm install -g react-scripts
# Copy the rest of the application files to the container
COPY . .

# Expose the port on which the frontend will run (replace 3000 with your desired port)
EXPOSE 3000

# Start the frontend server
CMD [ "npm", "start" ]
