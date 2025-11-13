# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copy csproj and restore dependencies
COPY backend/*.csproj ./backend/
WORKDIR /app/backend
RUN dotnet restore

# Copy everything else and build
WORKDIR /app
COPY backend/ ./backend/
WORKDIR /app/backend
RUN dotnet publish -c Release -o /app/out

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Copy the published app from build stage
COPY --from=build /app/out .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:$PORT
ENV ASPNETCORE_ENVIRONMENT=Production

# Expose port (Render uses PORT environment variable)
EXPOSE $PORT

# Run the application
ENTRYPOINT ["dotnet", "backend.dll"]
