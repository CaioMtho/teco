FROM mcr.microsoft.com/devcontainers/dotnet:8.0

RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
  && apt-get update \
  && apt-get install -y nodejs \
  && npm install -g pnpm

RUN apt-get install -y zsh git && chsh -s $(which zsh)

WORKDIR /workspace
