#!/bin/bash
# CSV Export Analytics - Activity 1 Launcher
# For Windows PowerShell users

echo ""
echo "==========================================="
echo "CSV Export Analytics - Activity 1"
echo "==========================================="
echo ""

# Check if Java is installed
java -version 2>$null
if ($LASTEXITCODE -ne 0) {
    echo "ERROR: Java is not installed or not in PATH"
    echo "Please install Java JDK from: https://www.oracle.com/java/technologies/downloads/"
    Read-Host "Press Enter to exit"
    exit 1
}

# Compile the Java files
echo "Compiling application..."
javac CSVExportAnalytics.java 2>$null
if ($LASTEXITCODE -ne 0) {
    echo "ERROR: Compilation failed"
    echo "Please check your Java installation"
    Read-Host "Press Enter to exit"
    exit 1
}

# Run the application
echo "Starting application..."
echo ""
java CSVExportAnalytics

Read-Host "Press Enter to exit"
