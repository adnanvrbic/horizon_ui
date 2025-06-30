FROM node:lts

WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
COPY . .

RUN npm i --legacy-peer-deps

# Note: Don't expose ports here, Compose will handle that for us

# Start vue.js in development mode based on the preferred package manager
CMD npm run dev -- --host;
