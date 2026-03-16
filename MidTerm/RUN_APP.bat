@echo off
REM CSV Export Analytics Report - Windows Batch Launcher
title CSV Export Analytics Report
color 0A

setlocal enabledelayedexpansion

REM Get the directory where this batch file is located
set "SCRIPT_DIR=%~dp0"
set "JAVA_DIR=%SCRIPT_DIR%java"

cd /d "%JAVA_DIR%"

if errorlevel 1 (
    echo.
    echo ============================================
    echo ERROR: Could not find java folder
    echo ============================================
    echo Path tried: %JAVA_DIR%
    echo.
    pause
    exit /b 1
)

echo.
echo ============================================
echo CSV Export Analytics Report
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
if not exist "DataRecord.java" (
    echo ERROR: DataRecord.java not found!
    pause
    exit /b 1
)

if not exist "CSVExportAnalyticsReport.java" (
    echo ERROR: CSVExportAnalyticsReport.java not found!
    pause
    exit /b 1
)

REM Compile the Java files
echo Compiling application...
echo.
javac DataRecord.java CSVExportAnalyticsReport.java
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
java CSVExportAnalyticsReport

echo.
echo Application closed.
echo.
pause
