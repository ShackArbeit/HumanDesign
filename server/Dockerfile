FROM node:20-slim

ENV NODE_ENV=production
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src

USER node
CMD ["node", "src/index.js"]
