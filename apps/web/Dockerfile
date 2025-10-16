FROM node:20

ARG USER=node
RUN useradd -m $USER || true

WORKDIR /app

ENV CI=true

RUN npm install -g pnpm@8

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile || pnpm install

COPY . .

RUN chown -R ${USER}:${USER} /app
USER ${USER}

EXPOSE 3000

CMD ["pnpm", "dev", "--", "-H", "0.0.0.0", "-p", "3000"]
