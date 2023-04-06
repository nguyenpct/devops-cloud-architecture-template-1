FROM node:19-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile --ignore-scripts --prefer-offline

COPY . .

RUN yarn prisma generate && yarn build

FROM node:19-alpine

WORKDIR /app

COPY package.json yarn.lock ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

RUN yarn install --frozen-lockfile --ignore-scripts --prefer-offline --production

RUN yarn prisma generate

ENV NODE_ENV production

EXPOSE 3000

# CMD ["node", "dist/main.js"]
CMD npx prisma migrate deploy && node dist/main.js