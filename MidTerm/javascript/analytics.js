const fs = require('fs');
const readline = require('readline');
const path = require('path');

/**
 * DataRecord class represents a single game record from the CSV file
 */
class DataRecord {
    constructor(img, title, console, genre, publisher, developer, criticScore,
                totalSales, naSales, jpSales, palSales, otherSales, releaseDate, lastUpdate) {
        this.img = img;
        this.title = title;
        this.console = console;
        this.genre = genre;
        this.publisher = publisher;
        this.developer = developer;
        this.criticScore = criticScore === '' ? 0 : parseFloat(criticScore);
        this.totalSales = totalSales === '' ? 0 : parseFloat(totalSales);
        this.naSales = naSales === '' ? 0 : parseFloat(naSales);
        this.jpSales = jpSales === '' ? 0 : parseFloat(jpSales);
        this.palSales = palSales === '' ? 0 : parseFloat(palSales);
        this.otherSales = otherSales === '' ? 0 : parseFloat(otherSales);
        this.releaseDate = releaseDate;
        this.lastUpdate = lastUpdate;
    }

    toString() {
        return `${this.title} | ${this.console} | ${this.genre} | ${this.totalSales.toFixed(2)} sales | Score: ${this.criticScore.toFixed(1)}`;
    }
}

/**
 * FileValidator - Validates file path and existence
 */
class FileValidator {
    static validate(filePath) {
        try {
            if (!fs.existsSync(filePath)) {
                return { valid: false, error: 'File does not exist.' };
            }

            const stats = fs.statSync(filePath);
            if (!stats.isFile()) {
                return { valid: false, error: 'Path is not a file.' };
            }

            if (!filePath.toLowerCase().endsWith('.csv')) {
                return { valid: false, error: 'File is not a CSV file.' };
            }

            // Check readability
            fs.accessSync(filePath, fs.constants.R_OK);
            
            return { valid: true };
        } catch (error) {
            return { valid: false, error: error.message };
        }
    }
}

/**
 * CSVParser - Parses CSV data from file
 */
class CSVParser {
    static async parseFile(filePath) {
        return new Promise((resolve, reject) => {
            const records = [];
            let lineNumber = 0;

            const rl = readline.createInterface({
                input: fs.createReadStream(filePath),
                crlfDelay: Infinity
            });

            rl.on('line', (line) => {
                lineNumber++;

                try {
                    // Skip header
                    if (lineNumber === 1) return;

                    const values = this.parseCSVLine(line);
                    if (values.length !== 14) {
                        console.warn(`⚠ Warning: Line ${lineNumber} has incorrect column count. Skipping.`);
                        return;
                    }

                    const record = new DataRecord(
                        values[0],  // img
                        values[1],  // title
                        values[2],  // console
                        values[3],  // genre
                        values[4],  // publisher
                        values[5],  // developer
                        values[6],  // criticScore
                        values[7],  // totalSales
                        values[8],  // naSales
                        values[9],  // jpSales
                        values[10], // palSales
                        values[11], // otherSales
                        values[12], // releaseDate
                        values[13]  // lastUpdate
                    );

                    records.push(record);
                } catch (error) {
                    console.warn(`⚠ Warning: Line ${lineNumber} has invalid data. Skipping.`);
                }
            });

            rl.on('close', () => {
                resolve(records);
            });

            rl.on('error', (error) => {
                reject(error);
            });
        });
    }

    static parseCSVLine(line) {
        const fields = [];
        let current = '';
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];

            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                fields.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }

        fields.push(current.trim());
        return fields;
    }
}

/**
 * Analytics - Performs analytics calculations
 */
class Analytics {
    static calculate(records) {
        const analytics = {};

        // Total records
        analytics['Total Games'] = records.length;

        // Sales analytics
        analytics['Total Global Sales'] = records.reduce((sum, r) => sum + r.totalSales, 0).toFixed(2);
        analytics['Average Sales Per Game'] = (records.reduce((sum, r) => sum + r.totalSales, 0) / records.length).toFixed(2);
        analytics['Highest Sales'] = Math.max(...records.map(r => r.totalSales)).toFixed(2);

        // Sales by region
        analytics['NA Sales'] = records.reduce((sum, r) => sum + r.naSales, 0).toFixed(2);
        analytics['JP Sales'] = records.reduce((sum, r) => sum + r.jpSales, 0).toFixed(2);
        analytics['PAL Sales'] = records.reduce((sum, r) => sum + r.palSales, 0).toFixed(2);
        analytics['Other Sales'] = records.reduce((sum, r) => sum + r.otherSales, 0).toFixed(2);

        // Genre analytics
        const genreCount = {};
        records.forEach(r => {
            genreCount[r.genre] = (genreCount[r.genre] || 0) + 1;
        });
        const topGenre = Object.keys(genreCount).reduce((a, b) => 
            genreCount[a] > genreCount[b] ? a : b);
        analytics['Top Genre'] = topGenre;
        analytics['Genre Count'] = Object.keys(genreCount).length;

        // Console analytics
        const consoleCount = {};
        records.forEach(r => {
            consoleCount[r.console] = (consoleCount[r.console] || 0) + 1;
        });
        const topConsole = Object.keys(consoleCount).reduce((a, b) => 
            consoleCount[a] > consoleCount[b] ? a : b);
        analytics['Most Popular Console'] = topConsole;

        // Critic score analytics
        const validScores = records.filter(r => r.criticScore > 0);
        if (validScores.length > 0) {
            const avgScore = validScores.reduce((sum, r) => sum + r.criticScore, 0) / validScores.length;
            analytics['Average Critic Score'] = avgScore.toFixed(2);
        } else {
            analytics['Average Critic Score'] = '0.00';
        }

        // Publisher analytics
        const publisherCount = {};
        records.forEach(r => {
            publisherCount[r.publisher] = (publisherCount[r.publisher] || 0) + 1;
        });
        analytics['Total Publishers'] = Object.keys(publisherCount).length;
        const topPublisher = Object.keys(publisherCount).reduce((a, b) => 
            publisherCount[a] > publisherCount[b] ? a : b);
        analytics['Top Publisher'] = topPublisher;

        return analytics;
    }
}

/**
 * CSVExporter - Exports data to CSV file
 */
class CSVExporter {
    static export(filename, analytics, records) {
        return new Promise((resolve, reject) => {
            try {
                let csvContent = 'Metric,Value\n';

                // Write analytics data
                for (const [metric, value] of Object.entries(analytics)) {
                    const escapedMetric = metric.includes(',') ? `"${metric}"` : metric;
                    csvContent += `${escapedMetric},${value}\n`;
                }

                csvContent += '\n';
                csvContent += 'Top 10 Best Selling Games\n';
                csvContent += 'Title,Console,Genre,Total Sales,Critic Score\n';

                // Sort by total sales and get top 10
                const topGames = records
                    .sort((a, b) => b.totalSales - a.totalSales)
                    .slice(0, 10);

                topGames.forEach(record => {
                    const escapedTitle = record.title.includes(',') || record.title.includes('"') 
                        ? `"${record.title.replace(/"/g, '""')}"` 
                        : record.title;
                    csvContent += `${escapedTitle},${record.console},${record.genre},${record.totalSales.toFixed(2)},${record.criticScore.toFixed(1)}\n`;
                });

                fs.writeFile(filename, csvContent, (error) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve();
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }
}

/**
 * Main Application Class
 */
class CSVExportAnalyticsApp {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async run() {
        console.log('=== CSV Export Analytics Report ===\n');

        const filePath = await this.promptForFilePath();
        if (!filePath) {
            console.log('Application terminated.');
            return;
        }

        console.log('\nLoading dataset...');
        try {
            const records = await CSVParser.parseFile(filePath);
            
            if (records.length === 0) {
                console.log('❌ Error: No valid records found in CSV file.');
                return;
            }

            console.log(`✓ Loaded ${records.length} records\n`);

            console.log('Performing analytics...');
            const analytics = Analytics.calculate(records);

            console.log('\n=== ANALYTICS SUMMARY ===\n');
            this.displayResults(analytics);

            console.log('\nExporting to CSV...');
            const outputFile = 'summary_report.csv';
            await CSVExporter.export(outputFile, analytics, records);
            console.log(`✓ Report exported to: ${outputFile}`);

        } catch (error) {
            console.error('❌ Error processing file:', error.message);
        } finally {
            this.rl.close();
        }
    }

    promptForFilePath() {
        return new Promise((resolve) => {
            const prompt = () => {
                this.rl.question('Enter dataset file path: ', (filePath) => {
                    const validation = FileValidator.validate(filePath);

                    if (!validation.valid) {
                        console.log(`❌ Error: ${validation.error} Please try again.`);
                        prompt();
                    } else {
                        console.log('✓ File validated successfully!');
                        resolve(filePath);
                    }
                });
            };

            prompt();
        });
    }

    displayResults(analytics) {
        console.log('Dataset Analysis Report');
        console.log('='.repeat(50));

        for (const [metric, value] of Object.entries(analytics)) {
            console.log(`${metric.padEnd(30)}: ${value}`);
        }

        console.log('='.repeat(50));
    }
}

// Run the application
const app = new CSVExportAnalyticsApp();
app.run().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
});
