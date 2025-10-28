FROM node:20-alpine

RUN apk add --no-cache git sudo

WORKDIR /workspace

COPY . .

RUN npm install -g pnpm

RUN pnpm install

RUN chown -R node:node /workspace

USER node

EXPOSE 3000

CMD ["pnpm", "dev"]
