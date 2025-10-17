FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /src

COPY *.sln ./
COPY TecoApi/*.csproj ./TecoApi/
RUN dotnet restore

COPY . .

WORKDIR /src/TecoApi

EXPOSE 5000

CMD ["dotnet", "watch", "run", "--urls", "http://0.0.0.0:5000"]
