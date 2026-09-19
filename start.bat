@echo off
title DevTrack Attendance Server - Diverse Ideas GMBH
echo ================================================================
echo   Starting DevTrack Local Office Attendance Server...
echo ================================================================
echo.
echo Opening DevTrack in your default browser...
start "" "http://localhost:3000"
echo.
echo DevTrack is running!
echo Keep this command prompt window open while using DevTrack.
echo.
node server.js
pause

