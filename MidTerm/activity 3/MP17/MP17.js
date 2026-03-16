// MP17 - Find the Longest Text Entry in Dataset
// 
// Program Description:
// This program reads a CSV dataset file using Node.js File System module,
// searches through all records to find the longest text entry, and displays
// comprehensive statistics including character composition and position.
// 
// Author: HADAP, CHRISTIAN JORGE A.
// Date: March 16, 2026

const fs = require('fs');
const readline = require('readline');

// Create interface for user input
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Main function - Entry point of the program
function main() {
    console.log('========================================');
    console.log(' MP17 - Find Longest Text Entry       ');
    console.log('========================================');
    
    // Prompt user for dataset file path
    rl.question('\nEnter the CSV dataset file path: ', (filePath) => {
        processDataset(filePath);
    });
}

/**
 * Reads CSV file and finds the longest text entry
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
        // Read file using Node.js File System module
        const data = fs.readFileSync(filePath, 'utf-8');
        
        // Parse CSV data into array (split by newlines) - no filtering
        let records = data.split('\n');
        
        if (records.length === 0) {
            console.log('\n[ERROR] No records found in the CSV file.');
            rl.close();
            return;
        }
        
        // Find the longest text entry in dataset
        const longest = findLongestEntry(records);
        
        // Display formatted report
        displayLongestEntryReport(longest, records.length);
        
    } catch (error) {
        console.log('\n[ERROR] File operation failed: ' + error.message);
    } finally {
        rl.close();
    }
}

/**
 * Finds the longest text entry in dataset
 * Iterates through all records and compares text lengths
 * 
 * @param {Array} records - Array of all records
 * @return {Object} Object containing longest entry information
 */
function findLongestEntry(records) {
    // Initialize with first record
    let longest = {
        content: records[0],
        length: records[0].length,
        lineNumber: 1
    };
    
    // Iterate through all records to find longest
    for (let i = 1; i < records.length; i++) {
        const currentRecord = records[i];
        const currentLength = currentRecord.length;
        
        // Compare with current longest
        if (currentLength > longest.length) {
            longest.content = currentRecord;
            longest.length = currentLength;
            longest.lineNumber = i + 1;
        }
    }
    
    return longest;
}

/**
 * Displays comprehensive report of longest text entry
 * Shows statistics, character composition, and position
 * 
 * @param {Object} longest - Object with longest entry information
 * @param {number} totalRecords - Total number of records in dataset
 */
function displayLongestEntryReport(longest, totalRecords) {
    console.log('\n========================================');
    console.log('   LONGEST TEXT ENTRY ANALYSIS REPORT   ');
    console.log('========================================\n');
    
    // Display dataset statistics
    console.log('DATASET STATISTICS:');
    console.log('  Total records: ' + totalRecords);
    console.log('----------------------------------------');
    
    // Display longest entry information
    console.log('\nLONGEST ENTRY INFORMATION:');
    console.log('  Position (Line Number): ' + longest.lineNumber);
    console.log('  Total Characters: ' + longest.length);
    console.log('  Content: ' + longest.content);
    console.log('----------------------------------------');
    
    // Display character composition analysis
    console.log('\nCHARACTER COMPOSITION:');
    analyzeCharacterComposition(longest.content);
    
    console.log('----------------------------------------');
    console.log('\n[SUCCESS] Longest text entry analysis completed!');
    console.log('========================================\n');
}

/**
 * Analyzes and displays character composition of text
 * Counts alphabetic, numeric, and special characters
 * 
 * @param {string} text - Text to analyze
 */
function analyzeCharacterComposition(text) {
    let alphabetic = 0;
    let numeric = 0;
    let special = 0;
    let spaces = 0;
    
    // Count character types
    for (let c of text) {
        if (/[a-zA-Z]/.test(c)) {
            alphabetic++;
        } else if (/[0-9]/.test(c)) {
            numeric++;
        } else if (/\s/.test(c)) {
            spaces++;
        } else {
            special++;
        }
    }
    
    // Display character counts
    console.log('  Alphabetic characters: ' + alphabetic);
    console.log('  Numeric characters: ' + numeric);
    console.log('  Spaces: ' + spaces);
    console.log('  Special characters: ' + special);
}

// Run the main program
main();
