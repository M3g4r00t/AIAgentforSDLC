# Base Image
FROM node:18-alpine

# Working Directory
WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install --production

# Source Code
COPY . .

# Environment
ENV PORT=4000
EXPOSE 4000

# Start
CMD ["npm", "start"]
