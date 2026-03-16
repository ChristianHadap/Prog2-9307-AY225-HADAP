@echo off
REM CSV Export Analytics - Activity 1 Launcher
title CSV Export Analytics - Activity 1
color 0A

setlocal enabledelayedexpansion

REM Get the directory where this batch file is located (Activity 1)
set "SCRIPT_DIR=%~dp0"

cd /d "%SCRIPT_DIR%"

if errorlevel 1 (
    echo.
    echo ============================================
    echo ERROR: Could not access current directory
    echo ============================================
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo CSV Export Analytics - Activity 1
echo ============================================
echo.

REM Check if Java is installed
echo Checking for Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ============================================
    echo ERROR: Java is NOT installed
    echo ============================================
    echo Opening download page...
    echo.
    
    REM Open the Java download page in default browser
    start https://www.oracle.com/java/technologies/downloads/
    
    echo.
    echo Please:
    echo 1. Download and install Java JDK
    echo 2. Restart your computer
    echo 3. Run this program again
    echo.
    echo ============================================
    echo.
    pause
    exit /b 1
)

echo Java found! Proceeding...
echo.

REM Check if source files exist
if not exist "CSVExportAnalytics.java" (
    echo ERROR: CSVExportAnalytics.java not found!
    pause
    exit /b 1
)

REM Compile the Java files
echo Compiling application...
echo.
javac CSVExportAnalytics.java
if errorlevel 1 (
    echo.
    echo ============================================
    echo ERROR: Compilation failed
    echo ============================================
    echo Please check your Java installation.
    echo ============================================
    echo.
    pause
    exit /b 1
)

echo.
echo Compilation successful!
echo.
echo ============================================
echo Starting application...
echo ============================================
echo.

REM Run the application
java CSVExportAnalytics

echo.
echo Application closed.
echo.
pause
