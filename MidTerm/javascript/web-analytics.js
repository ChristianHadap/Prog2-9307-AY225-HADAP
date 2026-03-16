/**
 * Web-based CSV Analytics - Browser Compatible JavaScript
 */

let currentRecords = [];
let currentAnalytics = {};

// Handle file selection
document.getElementById('fileInput').addEventListener('change', async (event) => {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('fileName').textContent = file.name;
        document.getElementById('fileInfo').style.display = 'block';
        document.getElementById('processBtn').disabled = false;
        currentRecords = [];
    }
});

// Handle drag and drop
const uploadArea = document.getElementById('uploadArea');
uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.style.borderColor = '#764ba2';
    uploadArea.style.background = '#f0f1ff';
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.style.borderColor = '#667eea';
    uploadArea.style.background = '#f8f9ff';
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        document.getElementById('fileInput').files = files;
        const event = new Event('change', { bubbles: true });
        document.getElementById('fileInput').dispatchEvent(event);
    }
});

// Process file
async function processFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file first!');
        return;
    }

    const statusDiv = document.getElementById('status');
    const statusText = document.getElementById('statusText');
    statusDiv.style.display = 'block';
    statusText.textContent = 'Processing file...';

    try {
        // Read file
        const text = await file.text();
        
        // Parse CSV
        currentRecords = parseCSV(text);

        if (currentRecords.length === 0) {
            throw new Error('No valid records found in CSV file.');
        }

        // Calculate analytics
        currentAnalytics = performAnalytics(currentRecords);

        // Display results
        displayResults();

        statusText.textContent = `✓ Successfully processed ${currentRecords.length} records!`;
        statusDiv.style.background = '#e8f5e9';
        statusDiv.style.borderColor = '#28a745';
        statusText.style.color = '#2e7d32';

    } catch (error) {
        statusText.textContent = `✗ Error: ${error.message}`;
        statusDiv.style.background = '#ffebee';
        statusDiv.style.borderColor = '#d32f2f';
        statusText.style.color = '#c62828';
    }
}

// Parse CSV
function parseCSV(text) {
    const lines = text.split('\n');
    const records = [];

    if (lines.length < 2) {
        return records;
    }

    // Skip header
    for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const record = parseCSVLine(line);
        if (record) {
            records.push(record);
        }
    }

    return records;
}

// Parse single CSV line
function parseCSVLine(line) {
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

    if (fields.length >= 14) {
        return {
            img: fields[0],
            title: fields[1],
            console: fields[2],
            genre: fields[3],
            publisher: fields[4],
            developer: fields[5],
            criticScore: parseFloat(fields[6]) || 0,
            totalSales: parseFloat(fields[7]) || 0,
            naSales: parseFloat(fields[8]) || 0,
            jpSales: parseFloat(fields[9]) || 0,
            palSales: parseFloat(fields[10]) || 0,
            otherSales: parseFloat(fields[11]) || 0,
            releaseDate: fields[12],
            lastUpdate: fields[13]
        };
    }

    return null;
}

// Perform analytics calculations
function performAnalytics(records) {
    const metrics = {
        totalRecords: records.length,
        totalSalesSum: 0,
        avgCriticScore: 0,
        avgTotalSales: 0,
        topGenres: {},
        topConsoles: {},
        topPublishers: {},
        topSalesGames: [],
        avgSalesByConsole: {}
    };

    // Calculate totals
    records.forEach(record => {
        metrics.totalSalesSum += record.totalSales;
        metrics.avgCriticScore += record.criticScore;

        // Genre count
        metrics.topGenres[record.genre] = (metrics.topGenres[record.genre] || 0) + 1;

        // Console count
        metrics.topConsoles[record.console] = (metrics.topConsoles[record.console] || 0) + 1;

        // Publisher count
        metrics.topPublishers[record.publisher] = (metrics.topPublishers[record.publisher] || 0) + 1;

        // Sales by console
        if (!metrics.avgSalesByConsole[record.console]) {
            metrics.avgSalesByConsole[record.console] = { total: 0, count: 0 };
        }
        metrics.avgSalesByConsole[record.console].total += record.totalSales;
        metrics.avgSalesByConsole[record.console].count += 1;
    });

    // Calculate averages
    metrics.avgCriticScore = (metrics.avgCriticScore / records.length).toFixed(2);
    metrics.avgTotalSales = (metrics.totalSalesSum / records.length).toFixed(2);

    // Top sales games
    metrics.topSalesGames = [...records]
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 10);

    return metrics;
}

// Display results
function displayResults() {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultsDiv = document.getElementById('results');
    const resultsPlaceholder = document.getElementById('resultsPlaceholder');

    let output = '📊 ANALYTICS RESULTS\n';
    output += '='.repeat(80) + '\n\n';

    // Basic stats
    output += `Total Records: ${currentAnalytics.totalRecords}\n`;
    output += `Total Sales: $${currentAnalytics.totalSalesSum.toFixed(2)}M\n`;
    output += `Average Sales per Game: $${currentAnalytics.avgTotalSales}M\n`;
    output += `Average Critic Score: ${currentAnalytics.avgCriticScore}/100\n\n`;

    // Top genres
    output += '📌 TOP GENRES:\n';
    const sortedGenres = Object.entries(currentAnalytics.topGenres)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    sortedGenres.forEach(([genre, count]) => {
        output += `  • ${genre}: ${count} games\n`;
    });

    output += '\n📌 TOP CONSOLES:\n';
    const sortedConsoles = Object.entries(currentAnalytics.topConsoles)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    sortedConsoles.forEach(([console, count]) => {
        output += `  • ${console}: ${count} games\n`;
    });

    output += '\n📌 TOP PUBLISHERS:\n';
    const sortedPublishers = Object.entries(currentAnalytics.topPublishers)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    sortedPublishers.forEach(([publisher, count]) => {
        output += `  • ${publisher}: ${count} games\n`;
    });

    output += '\n🎮 TOP 10 BEST-SELLING GAMES:\n';
    currentAnalytics.topSalesGames.forEach((game, index) => {
        output += `${index + 1}. ${game.title}\n`;
        output += `   Console: ${game.console} | Genre: ${game.genre}\n`;
        output += `   Sales: $${game.totalSales.toFixed(2)}M | Score: ${game.criticScore}/100\n\n`;
    });

    resultsDiv.textContent = output;
    resultsContainer.style.display = 'block';
    resultsPlaceholder.style.display = 'none';
}

// Export results
function exportResults() {
    if (currentRecords.length === 0) {
        alert('No data to export. Process a file first!');
        return;
    }

    let csv = 'ANALYTICS REPORT\n';
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;
    csv += 'SUMMARY STATISTICS\n';
    csv += `Total Records,${currentAnalytics.totalRecords}\n`;
    csv += `Total Sales (Millions),${currentAnalytics.totalSalesSum.toFixed(2)}\n`;
    csv += `Average Sales per Game,${currentAnalytics.avgTotalSales}\n`;
    csv += `Average Critic Score,${currentAnalytics.avgCriticScore}\n\n`;

    csv += 'TOP GENRES\n';
    csv += 'Genre,Count\n';
    Object.entries(currentAnalytics.topGenres)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .forEach(([genre, count]) => {
            csv += `"${genre}",${count}\n`;
        });

    csv += '\nTOP 10 BEST-SELLING GAMES\n';
    csv += 'Rank,Title,Console,Genre,Sales,Critic Score\n';
    currentAnalytics.topSalesGames.forEach((game, index) => {
        csv += `${index + 1},"${game.title}","${game.console}","${game.genre}",${game.totalSales.toFixed(2)},${game.criticScore}\n`;
    });

    // Download CSV
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'analytics_report.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
}
