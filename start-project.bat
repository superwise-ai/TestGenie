@echo off
echo Starting AI Test Management System...
echo.

REM Start backend server in background
echo Starting backend server...
start "Backend Server" cmd /k "npm run start:backend"

REM Wait a moment for backend to start
timeout /t 3 /nobreak > nul

REM Start frontend server in background
echo Starting frontend server...
start "Frontend Server" cmd /k "npm run dev:frontend"

REM Wait for frontend to start
echo Waiting for servers to start...
timeout /t 8 /nobreak > nul

REM Open the website in default browser
echo Opening website in browser...
start http://localhost:3000

echo.
echo AI Test Management System is starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Both servers are running in separate windows.
echo Close those windows to stop the servers.
echo.
pause 