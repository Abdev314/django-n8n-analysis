FROM node:20-alpine

WORKDIR /app

# Only copy package.json (no lock file)
COPY package.json ./

# Install dependencies (creates fresh lock file)
RUN npm install

COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]




