FROM node:20-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force


FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3003

COPY --from=deps /app/node_modules ./node_modules

COPY . .

EXPOSE 3003

CMD ["node", "src/server.js"]
