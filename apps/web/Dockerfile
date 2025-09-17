# apps/web/Dockerfile
FROM node:20

WORKDIR /app

COPY . .

RUN npm install -g pnpm && pnpm install

EXPOSE 3000

CMD ["pnpm", "dev"]
