const fs = require('fs');
const path = require('path');

function generateAnalyticsReport() {
    const csvFile = 'vgchartz-2024.csv';
    const reportFile = 'summary_report.csv';
    
    try {
        // Read CSV file
        const data = fs.readFileSync(csvFile, 'utf8');
        const lines = data.split('\n');
        
        // Initialize statistics
        const genreCount = {};
        const publisherCount = {};
        let totalSales = 0;
        let gameCount = 0;
        let avgScore = 0;
        let scoredGames = 0;
        
        // Parse CSV (skip header)
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const fields = lines[i].split(',');
            
            if (fields.length >= 7) {
                gameCount++;
                
                // Genre (index 3)
                const genre = fields[3]?.trim();
                if (genre) {
                    genreCount[genre] = (genreCount[genre] || 0) + 1;
                }
                
                // Publisher (index 4)
                const publisher = fields[4]?.trim();
                if (publisher) {
                    publisherCount[publisher] = (publisherCount[publisher] || 0) + 1;
                }
                
                // Total Sales (index 7)
                const sales = parseFloat(fields[7]);
                if (!isNaN(sales)) {
                    totalSales += sales;
                }
                
                // Critic Score (index 6)
                const score = parseFloat(fields[6]);
                if (!isNaN(score)) {
                    avgScore += score;
                    scoredGames++;
                }
            }
        }
        
        // Calculate averages
        const avgCriticScore = scoredGames > 0 ? avgScore / scoredGames : 0;
        
        // Find top genre and publisher
        const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0];
        const topPublisher = Object.entries(publisherCount).sort((a, b) => b[1] - a[1])[0];
        
        // Prepare CSV content
        let csvContent = 'Metric,Value\n';
        csvContent += `Total Games,${gameCount}\n`;
        csvContent += `Total Sales (Millions),${totalSales.toFixed(2)}\n`;
        csvContent += `Average Critic Score,${avgCriticScore.toFixed(2)}\n`;
        csvContent += `Scored Games,${scoredGames}\n`;
        csvContent += `Top Genre,${topGenre[0]},${topGenre[1]}\n`;
        csvContent += `Top Publisher,${topPublisher[0]},${topPublisher[1]}\n`;
        csvContent += '\nGenre Distribution\n';
        csvContent += 'Genre,Count\n';
        
        // Add genre distribution
        Object.entries(genreCount)
            .sort((a, b) => b[1] - a[1])
            .forEach(([genre, count]) => {
                csvContent += `${genre},${count}\n`;
            });
        
        csvContent += '\nTop 10 Publishers\n';
        csvContent += 'Publisher,Count\n';
        
        // Add top 10 publishers
        Object.entries(publisherCount)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .forEach(([publisher, count]) => {
                csvContent += `${publisher},${count}\n`;
            });
        
        // Write to file using fs.writeFile()
        fs.writeFile(reportFile, csvContent, (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            
            console.log('=== ANALYTICS SUMMARY REPORT ===\n');
            console.log('Total Games:', gameCount);
            console.log('Total Sales:', totalSales.toFixed(2) + ' Million');
            console.log('Average Critic Score:', avgCriticScore.toFixed(2));
            console.log('Games with Scores:', scoredGames);
            
            console.log('\nTop Genre:', topGenre[0], `(${topGenre[1]} games)`);
            console.log('Top Publisher:', topPublisher[0], `(${topPublisher[1]} games)`);
            
            console.log('\n=== Genre Distribution ===');
            Object.entries(genreCount)
                .sort((a, b) => b[1] - a[1])
                .forEach(([genre, count]) => {
                    console.log(`${genre}: ${count}`);
                });
            
            console.log('\n=== Top 10 Publishers ===');
            Object.entries(publisherCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .forEach(([publisher, count]) => {
                    console.log(`${publisher}: ${count}`);
                });
            
            console.log('\n✓ Report exported to:', reportFile);
            
            // Save data to JSON for website
            const reportData = {
                totalGames: gameCount,
                totalSales: parseFloat(totalSales.toFixed(2)),
                avgCriticScore: parseFloat(avgCriticScore.toFixed(2)),
                scoredGames: scoredGames,
                topGenre: {
                    name: topGenre[0],
                    count: topGenre[1]
                },
                topPublisher: {
                    name: topPublisher[0],
                    count: topPublisher[1]
                },
                genreDistribution: Object.entries(genreCount)
                    .sort((a, b) => b[1] - a[1])
                    .map(([genre, count]) => ({genre, count})),
                topPublishers: Object.entries(publisherCount)
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 10)
                    .map(([publisher, count]) => ({publisher, count}))
            };
            
            fs.writeFile('report_data.json', JSON.stringify(reportData, null, 2), (err) => {
                if (err) console.error('Error writing JSON:', err);
            });
        });
        
    } catch (err) {
        console.error('Error:', err.message);
    }
}

generateAnalyticsReport();
