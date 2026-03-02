const fs = require('fs');
const path = require('path');
const readline = require('readline');

class CSVAnalytics {
    constructor() {
        this.csvData = [];
        this.outputPath = path.join(__dirname, 'summary_report.csv');
    }
    
    loadCSV(filename) {
        return new Promise((resolve, reject) => {
            const filePath = path.join(__dirname, filename);
            const stream = fs.createReadStream(filePath);
            const rl = readline.createInterface({
                input: stream,
                crlfDelay: Infinity
            });
            
            let isHeader = true;
            
            rl.on('line', (line) => {
                if (isHeader) {
                    isHeader = false;
                    return;
                }
                
                const parts = line.split(',');
                if (parts.length >= 8) {
                    this.csvData.push({
                        title: parts[1],
                        console: parts[2],
                        genre: parts[3],
                        publisher: parts[4],
                        sales: parts[7]
                    });
                }
            });
            
            rl.on('close', () => {
                console.log(`✓ CSV file loaded successfully!`);
                console.log(`Total Records: ${this.csvData.length}\n`);
                resolve();
            });
            
            rl.on('error', (err) => {
                console.error(`✗ Error loading file: ${err.message}`);
                reject(err);
            });
        });
    }
    
    exportSummary() {
        let csvContent = 'Game Title,Console,Genre,Publisher,Total Sales\n';
        
        this.csvData.forEach(record => {
            csvContent += `${record.title},${record.console},${record.genre},${record.publisher},${record.sales}\n`;
        });
        
        fs.writeFile(this.outputPath, csvContent, (err) => {
            if (err) {
                console.error(`✗ Error exporting file: ${err.message}`);
            } else {
                console.log(`✓ CSV file 'summary_report.csv' exported successfully!`);
                console.log(`Location: ${this.outputPath}`);
            }
        });
    }
    
    displaySample() {
        console.log('Sample Data (First 5 records):');
        console.log('==============================');
        this.csvData.slice(0, 5).forEach(record => {
            console.log(`${record.title} - ${record.console} - $${record.sales}M`);
        });
    }
}

async function main() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.question('Enter CSV filename: ', async (filename) => {
        const analytics = new CSVAnalytics();
        
        try {
            await analytics.loadCSV(filename);
            analytics.displaySample();
            analytics.exportSummary();
        } catch (error) {
            console.error('Failed to process file');
        }
        
        rl.close();
    });
}

main();