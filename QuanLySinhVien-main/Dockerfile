FROM mcr.microsoft.com/dotnet/aspnet:8.0-windowsservercore-ltsc2022 AS base
WORKDIR /app
EXPOSE 5146

ENV ASPNETCORE_URLS=http://+:5146

FROM mcr.microsoft.com/dotnet/sdk:8.0-windowsservercore-ltsc2022 AS build
ARG configuration=Release
WORKDIR /src
COPY ["QuanLySinhVienApi.csproj", "."]
RUN dotnet restore "QuanLySinhVienApi.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "QuanLySinhVienApi.csproj" -c %configuration% -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "QuanLySinhVienApi.csproj" -c %configuration% -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "QuanLySinhVienApi.dll"]
