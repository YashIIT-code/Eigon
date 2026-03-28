FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Expose Vite dev server port
EXPOSE 5173

# Listen on all hosts
CMD ["npm", "run", "dev", "--", "--host"]
