// MP15 - Export First 50 Rows to CSV
// 
// Program Description:
// This program reads a CSV dataset file using Node.js File System module,
// extracts the first 50 rows, and exports them to a new CSV file.
// It includes error handling for missing files and invalid paths.
// 
// Author: HADAP, CHRISTIAN JORGE A.
// Date: March 16, 2026

const fs = require('fs');
const readline = require('readline');
const path = require('path');

// Create interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Main function - Entry point of the program
function main() {
    console.log('========================================');
    console.log('   MP15 - Export First 50 Rows to CSV   ');
    console.log('========================================');
    
    // Prompt user for dataset file path
    rl.question('\nEnter the CSV dataset file path: ', (filePath) => {
        processDataset(filePath);
    });
}

/**
 * Reads CSV file and extracts first 50 rows
 * 
 * @param {string} filePath - Path to the CSV file
 */
function processDataset(filePath) {
    // Trim whitespace from input
    filePath = filePath.trim();
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        console.log('\n[ERROR] File not found: ' + filePath);
        rl.close();
        return;
    }
    
    try {
        // Read CSV file using Node.js File System module
        const data = fs.readFileSync(filePath, 'utf-8');
        
        // Parse CSV data into array (split by newlines) - no filtering
        let records = data.split('\n');
        
        if (records.length === 0) {
            console.log('\n[ERROR] No records found in the CSV file.');
            rl.close();
            return;
        }
        
        // Extract first 50 rows (or all rows if less than 50)
        const exportRowCount = Math.min(50, records.length);
        const first50Rows = records.slice(0, exportRowCount);
        
        // Generate output filename with timestamp (save to Downloads folder)
        const os = require('os');
        const timestamp = Date.now();
        const downloadsPath = path.join(os.homedir(), 'Downloads');
        const outputPath = path.join(downloadsPath, `MP15_Export_${timestamp}.csv`);
        
        // Export to new CSV file in Downloads
        exportToCSV(outputPath, first50Rows, records.length, exportRowCount);
        
    } catch (error) {
        console.log('\n[ERROR] File operation failed: ' + error.message);
    } finally {
        rl.close();
    }
}

/**
 * Exports records to a new CSV file
 * 
 * @param {string} outputPath - Path for the output CSV file
 * @param {Array} records - Array of records to export
 * @param {number} totalRecords - Total records in source file
 * @param {number} exportRowCount - Number of rows exported
 */
function exportToCSV(outputPath, records, totalRecords, exportRowCount) {
    try {
        // Write records to new CSV file
        const csvContent = records.join('\n');
        fs.writeFileSync(outputPath, csvContent, 'utf-8');
        
        // Display export summary
        console.log('\n========================================');
        console.log('         EXPORT SUMMARY REPORT         ');
        console.log('========================================');
        console.log('Total records in source file: ' + totalRecords);
        console.log('Rows exported: ' + exportRowCount);
        console.log('Output file: ' + outputPath);
        console.log('\n[SUCCESS] Export completed successfully!');
        console.log('File saved to: ' + path.resolve(outputPath));
        console.log('========================================\n');
        
    } catch (error) {
        console.log('\n[ERROR] Failed to export CSV: ' + error.message);
    }
}

// Run the main program
main();
