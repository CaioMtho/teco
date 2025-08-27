FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:20

RUN apt-get update && \
    apt-get install -y zsh curl git && \
    chsh -s $(which zsh)

RUN npm install -g pnpm

WORKDIR /workspace
