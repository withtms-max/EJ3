@echo off
cd /d %~dp0

echo ==========================================
echo [1/4] Closing any running Dart processes...
taskkill /F /IM dart.exe /T 2>nul
echo Done.
echo ==========================================

echo [2/4] Cleaning build artifacts (Result of previous attempts)...
call C:\flutter\bin\flutter.bat clean
if errorlevel 1 (
    echo Warning: Clean command had issues. Retrying...
    timeout /t 2
    call C:\flutter\bin\flutter.bat clean
)
echo Done.
echo ==========================================

echo [3/4] Restoring packages (Ensuring version 0.4.7)...
call C:\flutter\bin\flutter.bat pub get
echo Done.
echo ==========================================

echo [4/4] Launching app in Chrome...
echo (This may take a minute or two after a clean build)
call C:\flutter\bin\flutter.bat config --enable-web
call C:\flutter\bin\flutter.bat run -d chrome

if errorlevel 1 (
    echo ==========================================
    echo ERROR: App failed to launch.
    echo Please check the error messages above.
    echo ==========================================
)
pause
