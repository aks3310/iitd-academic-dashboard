@echo off
title IITD Academic Telemetry Dashboard
echo ===================================================
echo   IIT DELHI ACADEMIC TELEMETRY DASHBOARD
echo   Bungie Marathon Engine // Status: Initializing
echo ===================================================
echo.
echo Starting local telemetry server on http://localhost:3000 ...
start "" http://localhost:3000
node server.js
if %ERRORLEVEL% NEQ 0 (
  echo.
  echo Notice: If Node is unavailable, opening index.html directly...
  start "" index.html
)
pause
