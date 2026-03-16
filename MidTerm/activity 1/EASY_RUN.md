# 🚀 How to Run CSV Export Analytics (Activity 1)

## EASIEST WAY (Just Double-Click!)

### On Windows:
1. **Open the Activity 1 folder**
2. **Double-click `RUN_APP.bat`** 
3. The application will:
   - Check if Java is installed
   - Automatically compile the code
   - Launch the application window

That's it! No command line needed.

---

## Alternative: PowerShell Method

If the batch file doesn't work, try:

1. Right-click on `RUN_APP.ps1`
2. Select "Run with PowerShell"
3. Click "Run" if you see a security prompt

---

## For Mac/Linux Users

Use the provided shell script or run in terminal:

```bash
cd activity\ 1
javac CSVExportAnalytics.java
java CSVExportAnalytics
```

---

## What You Need

- **Java JDK** (version 11 or higher)
  - Download from: https://www.oracle.com/java/technologies/downloads/
  - Already installed? The script will find it automatically!

---

## Troubleshooting

### If it says "Java not found"
- Java isn't installed or not added to your system PATH
- Download and install Java JDK from oracle.com
- Restart your computer after installation

### If you see errors
- Make sure you have `java` and `javascript` folders in MidTerm
- Ensure `DataRecord.java` and `CSVExportAnalyticsReport.java` are both present
- Try the PowerShell method instead

---

## How to Use the Application

Once the window opens:

1. **Select CSV File**: Click "Browse..." to select your CSV file
2. **Process Data**: Click "Process & Analyze"
3. **View Results**: Analytics will display in the window
4. **Export Report**: Click "Export to CSV" to save summary_report.csv

---

## File Locations

```
MidTerm/
├── RUN_APP.bat          ← Double-click this!
├── RUN_APP.ps1          ← Or right-click and run this
├── EASY_RUN.md          ← This file
├── java/
│   ├── CSVExportAnalyticsReport.java
│   └── DataRecord.java
├── javascript/
│   └── analytics.js     (Run from terminal with: node analytics.js)
└── vgchartz-2024.csv    ← Sample CSV file to test
```

---

## Share with Your Professor

You can send your professor:
1. The entire `MidTerm` folder
2. They just need to double-click `RUN_APP.bat`
3. No installation or configuration needed!

---

## For Developers / Manual Compilation

If you want to compile manually from terminal:

```powershell
cd MidTerm\java
javac DataRecord.java CSVExportAnalyticsReport.java
java CSVExportAnalyticsReport
```

---

**Questions?** Check the README.md in the MidTerm folder for full documentation.
