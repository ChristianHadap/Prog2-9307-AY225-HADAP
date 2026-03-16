#!/bin/bash
# CSV Export Analytics Report - PowerShell Launcher
# For Windows PowerShell users

cd java
echo ""
echo "==========================================="
echo "CSV Export Analytics Report"
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
javac DataRecord.java CSVExportAnalyticsReport.java 2>$null
if ($LASTEXITCODE -ne 0) {
    echo "ERROR: Compilation failed"
    echo "Please check your Java installation"
    Read-Host "Press Enter to exit"
    exit 1
}

# Run the application
echo "Starting application..."
echo ""
java CSVExportAnalyticsReport

Read-Host "Press Enter to exit"
