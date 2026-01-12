FROM node:22-alpine

WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

RUN chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3000

CMD ["/bin/sh", "-c", "npx prisma migrate deploy && npm run start:prod"]