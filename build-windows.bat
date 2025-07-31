@echo off
echo.
echo ================================================
echo  Building Vikas Milk Center Pro for Windows
echo ================================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if npm is available
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    pause
    exit /b 1
)

echo Node.js and npm are available
echo.

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo Installing dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: Failed to install dependencies
        pause
        exit /b 1
    )
    echo.
)

REM Build the web application
echo Building web application...
npm run build
if %errorlevel% neq 0 (
    echo ERROR: Web build failed
    pause
    exit /b 1
)
echo Web build completed successfully
echo.

REM Build the desktop application for Windows
echo Building Windows desktop application...
echo This may take several minutes...
npx electron-builder --win --x64 --ia32 --publish=never
if %errorlevel% neq 0 (
    echo ERROR: Desktop build failed
    echo.
    echo Troubleshooting:
    echo - Try running as Administrator
    echo - Check Windows Defender settings
    echo - Run: npm cache clean --force
    echo.
    pause
    exit /b 1
)

echo.
echo ================================================
echo  Build completed successfully!
echo ================================================
echo.
echo Built files are located in: dist_electron/
echo.
echo Available executables:
dir /b dist_electron\*.exe 2>nul
dir /b dist_electron\*.msi 2>nul
echo.
echo You can now distribute these files to install the application.
echo.
pause