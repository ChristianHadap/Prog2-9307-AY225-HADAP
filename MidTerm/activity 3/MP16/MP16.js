// MP16 - Randomly Display 10 Rows from Dataset
// 
// Program Description:
// This program reads a CSV dataset file using Node.js File System module,
// randomly selects 10 records from the entire dataset, and displays them
// in a formatted output. It includes comprehensive error handling.
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
    console.log('  MP16 - Randomly Display 10 Rows      ');
    console.log('========================================');
    
    // Prompt user for dataset file path
    rl.question('\nEnter the CSV dataset file path: ', (filePath) => {
        processDataset(filePath);
    });
}

/**
 * Reads CSV file and randomly selects 10 records
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
        
        // Check if dataset has fewer than 10 records
        if (records.length < 10) {
            console.log('\n[WARNING] Dataset has less than 10 records.');
            console.log('Found: ' + records.length + ' records');
        }
        
        // Get random 10 records from dataset
        const randomRecords = getRandomRecords(records, 10);
        
        // Display formatted results
        displayRandomRecords(randomRecords, records.length);
        
    } catch (error) {
        console.log('\n[ERROR] File operation failed: ' + error.message);
    } finally {
        rl.close();
    }
}

/**
 * Randomly selects records from dataset using Fisher-Yates algorithm
 * 
 * @param {Array} records - Array of all records
 * @param {number} count - Number of random records to select
 * @return {Array} Array of randomly selected records
 */
function getRandomRecords(records, count) {
    // Ensure count doesn't exceed total records
    const selectCount = Math.min(count, records.length);
    
    // Create a copy of records array to avoid modifying original
    const shuffle = [...records];
    
    // Fisher-Yates shuffle algorithm for random selection
    for (let i = shuffle.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        // Swap elements
        const temp = shuffle[i];
        shuffle[i] = shuffle[randomIndex];
        shuffle[randomIndex] = temp;
    }
    
    // Return first selectCount elements (randomly shuffled)
    return shuffle.slice(0, selectCount);
}

/**
 * Displays randomly selected records in formatted table output
 * 
 * @param {Array} randomRecords - Array of randomly selected records
 * @param {number} totalRecords - Total number of records in dataset
 */
function displayRandomRecords(randomRecords, totalRecords) {
    console.log('\n========================================');
    console.log('     RANDOM RECORD DISPLAY REPORT      ');
    console.log('========================================');
    console.log('Total records in dataset: ' + totalRecords);
    console.log('Random records selected: ' + randomRecords.length);
    console.log('========================================\n');
    
    // Display header
    console.log('RANDOMLY SELECTED RECORDS:');
    console.log('----------------------------------------');
    
    // Display each random record with line number
    for (let i = 0; i < randomRecords.length; i++) {
        console.log((i + 1) + '. ' + randomRecords[i]);
    }
    
    console.log('----------------------------------------');
    console.log('\n[SUCCESS] Random record display completed!');
    console.log('========================================\n');
}

// Run the main program
main();
