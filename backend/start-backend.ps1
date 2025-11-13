Write-Host "Starting Backend Server..." -ForegroundColor Green
Set-Location $PSScriptRoot
dotnet run --launch-profile http
