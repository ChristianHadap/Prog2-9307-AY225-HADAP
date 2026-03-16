import javax.swing.*;
import javax.swing.filechooser.FileNameExtensionFilter;
import java.awt.*;
import java.awt.event.*;
import java.awt.Desktop;
import java.io.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * CSVExportAnalyticsReport - GUI Application (Windowed Mode)
 * Features:
 * - File chooser dialog for CSV selection
 * - Real-time analytics calculation
 * - Formatted results display in window
 * - CSV export with save dialog
 */
public class CSVExportAnalyticsReport extends JFrame {
    private JTextField filePathField;
    private JButton browseButton;
    private JButton processButton;
    private JButton exportButton;
    private JTextArea resultsArea;
    private JLabel statusLabel;
    private JProgressBar progressBar;
    private java.util.List<DataRecord> currentRecords;
    private Map<String, Object> currentAnalytics;
    private static final String OUTPUT_FILE = "summary_report.csv";

    public CSVExportAnalyticsReport() {
        setTitle("CSV Export Analytics Report");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(950, 750);
        setLocationRelativeTo(null);
        setResizable(true);

        // Create menu bar with Help
        createMenuBar();

        // Main panel
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(BorderFactory.createEmptyBorder(15, 15, 15, 15));

        // Top panel - File selection
        JPanel topPanel = createTopPanel();
        mainPanel.add(topPanel, BorderLayout.NORTH);

        // Middle panel - Results
        JPanel middlePanel = createMiddlePanel();
        mainPanel.add(middlePanel, BorderLayout.CENTER);

        // Bottom panel - Status and buttons
        JPanel bottomPanel = createBottomPanel();
        mainPanel.add(bottomPanel, BorderLayout.SOUTH);

        setContentPane(mainPanel);
    }

    private void createMenuBar() {
        JMenuBar menuBar = new JMenuBar();
        JMenu helpMenu = new JMenu("Help");
        
        JMenuItem downloadJavaItem = new JMenuItem("Download Java");
        downloadJavaItem.addActionListener(e -> {
            try {
                // Open Java download page
                String url = "https://www.oracle.com/java/technologies/downloads/";
                Desktop.getDesktop().browse(new java.net.URI(url));
            } catch (Exception ex) {
                JOptionPane.showMessageDialog(this,
                    "Could not open browser.\nPlease visit: https://www.oracle.com/java/technologies/downloads/",
                    "Download Java",
                    JOptionPane.INFORMATION_MESSAGE);
            }
        });
        
        JMenuItem aboutItem = new JMenuItem("About");
        aboutItem.addActionListener(e -> {
            JOptionPane.showMessageDialog(this,
                "CSV Export Analytics Report\n\n" +
                "A tool to analyze video game sales data from CSV files.\n\n" +
                "Features:\n" +
                "• Load and analyze CSV data\n" +
                "• Calculate various metrics\n" +
                "• Export results to CSV",
                "About",
                JOptionPane.INFORMATION_MESSAGE);
        });
        
        helpMenu.add(downloadJavaItem);
        helpMenu.addSeparator();
        helpMenu.add(aboutItem);
        menuBar.add(helpMenu);
        
        setJMenuBar(menuBar);
    }

    private JPanel createTopPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 0));
        panel.setBorder(BorderFactory.createTitledBorder("Step 1: Select Dataset File"));

        // File path input
        filePathField = new JTextField();
        filePathField.setEditable(false);
        filePathField.setFont(new Font("Monospaced", Font.PLAIN, 11));

        // Browse button
        browseButton = new JButton("Browse...");
        browseButton.setFocusPainted(false);
        browseButton.addActionListener(e -> browseFile());

        // Process button
        processButton = new JButton("Process & Analyze");
        processButton.setFocusPainted(false);
        processButton.setEnabled(false);
        processButton.addActionListener(e -> processFile());

        // Add components
        panel.add(filePathField, BorderLayout.CENTER);
        panel.add(browseButton, BorderLayout.EAST);

        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        buttonPanel.add(processButton);
        panel.add(buttonPanel, BorderLayout.SOUTH);

        return panel;
    }

    private JPanel createMiddlePanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));
        panel.setBorder(BorderFactory.createTitledBorder("Step 2: Analytics Results"));

        // Results area
        resultsArea = new JTextArea();
        resultsArea.setEditable(false);
        resultsArea.setFont(new Font("Monospaced", Font.PLAIN, 11));
        resultsArea.setLineWrap(true);
        resultsArea.setWrapStyleWord(true);
        resultsArea.setText("Load a CSV file and click 'Process & Analyze' to see results here.");

        // Scroll pane
        JScrollPane scrollPane = new JScrollPane(resultsArea);
        scrollPane.setVerticalScrollBarPolicy(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED);
        scrollPane.setHorizontalScrollBarPolicy(JScrollPane.HORIZONTAL_SCROLLBAR_AS_NEEDED);

        panel.add(scrollPane, BorderLayout.CENTER);

        return panel;
    }

    private JPanel createBottomPanel() {
        JPanel panel = new JPanel(new BorderLayout(10, 10));

        // Status label
        statusLabel = new JLabel("Ready");
        statusLabel.setFont(new Font("Arial", Font.PLAIN, 11));

        // Progress bar
        progressBar = new JProgressBar();
        progressBar.setVisible(false);

        // Export button
        exportButton = new JButton("Export to CSV");
        exportButton.setFocusPainted(false);
        exportButton.addActionListener(e -> exportCSV());
        exportButton.setEnabled(false);

        // Button panel
        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 0));
        buttonPanel.add(exportButton);

        // Status panel
        JPanel statusPanel = new JPanel(new BorderLayout(10, 0));
        statusPanel.add(statusLabel, BorderLayout.WEST);
        statusPanel.add(progressBar, BorderLayout.CENTER);

        panel.add(statusPanel, BorderLayout.NORTH);
        panel.add(buttonPanel, BorderLayout.SOUTH);

        return panel;
    }

    private void browseFile() {
        JFileChooser fileChooser = new JFileChooser();
        
        // Open directly to the Downloads folder
        File downloadsFolder = new File(System.getProperty("user.home"), "Downloads");
        if (downloadsFolder.exists()) {
            fileChooser.setCurrentDirectory(downloadsFolder);
        }
        
        fileChooser.setFileSelectionMode(JFileChooser.FILES_ONLY);
        fileChooser.setFileFilter(new FileNameExtensionFilter("CSV Files (*.csv)", "csv"));

        int result = fileChooser.showOpenDialog(this);
        if (result == JFileChooser.APPROVE_OPTION) {
            File selectedFile = fileChooser.getSelectedFile();
            filePathField.setText(selectedFile.getAbsolutePath());
            processButton.setEnabled(true);
            statusLabel.setText("File selected: " + selectedFile.getName());
        }
    }

    private void processFile() {
        String filePath = filePathField.getText().trim();
        if (filePath.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please select a file first!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        File dataFile = new File(filePath);

        // Validate file
        if (!dataFile.exists()) {
            JOptionPane.showMessageDialog(this, "File does not exist!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (!dataFile.isFile()) {
            JOptionPane.showMessageDialog(this, "Selected path is not a file!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (!dataFile.getName().toLowerCase().endsWith(".csv")) {
            JOptionPane.showMessageDialog(this, "File is not a CSV file!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        if (!dataFile.canRead()) {
            JOptionPane.showMessageDialog(this, "File is not readable!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        // Show progress
        resultsArea.setText("Loading dataset...");
        statusLabel.setText("Processing file: " + dataFile.getName());
        progressBar.setVisible(true);
        progressBar.setIndeterminate(true);
        processButton.setEnabled(false);
        exportButton.setEnabled(false);

        // Process in background thread
        new Thread(() -> {
            try {
                currentRecords = loadCSVData(dataFile);

                if (currentRecords.isEmpty()) {
                    SwingUtilities.invokeLater(() -> {
                        resultsArea.setText("Error: No valid records found in CSV file.");
                        statusLabel.setText("Failed to load data");
                        progressBar.setVisible(false);
                        processButton.setEnabled(true);
                    });
                    return;
                }

                currentAnalytics = performAnalytics(currentRecords);
                String results = formatResults(currentAnalytics, currentRecords);

                SwingUtilities.invokeLater(() -> {
                    resultsArea.setText(results);
                    statusLabel.setText("✓ Loaded " + currentRecords.size() + " records - Ready to export");
                    progressBar.setVisible(false);
                    processButton.setEnabled(true);
                    exportButton.setEnabled(true);
                });
            } catch (Exception e) {
                SwingUtilities.invokeLater(() -> {
                    resultsArea.setText("Error: " + e.getMessage());
                    statusLabel.setText("Error during processing");
                    progressBar.setVisible(false);
                    processButton.setEnabled(true);
                });
            }
        }).start();
    }

    private void exportCSV() {
        if (currentAnalytics == null || currentRecords == null) {
            JOptionPane.showMessageDialog(this, "No data to export. Process a file first!", "Error", JOptionPane.ERROR_MESSAGE);
            return;
        }

        JFileChooser fileChooser = new JFileChooser();
        fileChooser.setDialogTitle("Save Analytics Report");
        fileChooser.setSelectedFile(new File(OUTPUT_FILE));
        fileChooser.setFileFilter(new FileNameExtensionFilter("CSV Files (*.csv)", "csv"));

        int result = fileChooser.showSaveDialog(this);
        if (result == JFileChooser.APPROVE_OPTION) {
            File saveFile = fileChooser.getSelectedFile();

            // Ensure .csv extension
            String fileName = saveFile.getName();
            if (!fileName.toLowerCase().endsWith(".csv")) {
                saveFile = new File(saveFile.getParentFile(), fileName + ".csv");
            }

            try {
                exportSummaryReport(saveFile.getAbsolutePath(), currentAnalytics, currentRecords);
                statusLabel.setText("✓ Report exported to: " + saveFile.getName());
                JOptionPane.showMessageDialog(this, "Report successfully exported to:\n" + saveFile.getAbsolutePath(), 
                    "Success", JOptionPane.INFORMATION_MESSAGE);
            } catch (IOException e) {
                JOptionPane.showMessageDialog(this, "Error exporting file: " + e.getMessage(), 
                    "Error", JOptionPane.ERROR_MESSAGE);
                statusLabel.setText("Error exporting file");
            }
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            CSVExportAnalyticsReport frame = new CSVExportAnalyticsReport();
            frame.setVisible(true);
        });
    }
    
    private java.util.List<DataRecord> loadCSVData(File file) throws IOException {
        java.util.List<DataRecord> records = new ArrayList<>();
        
        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            String line;
            int lineNumber = 0;
            
            // Skip header
            reader.readLine();
            
            while ((line = reader.readLine()) != null) {
                lineNumber++;
                try {
                    String[] values = parseCSVLine(line);
                    
                    if (values.length != 14) {
                        continue;
                    }
                    
                    DataRecord record = new DataRecord(
                        values[0], values[1], values[2], values[3],
                        values[4], values[5], values[6], values[7],
                        values[8], values[9], values[10], values[11],
                        values[12], values[13]
                    );
                    
                    records.add(record);
                } catch (NumberFormatException e) {
                    // Skip invalid lines
                }
            }
        }
        
        return records;
    }
    
    private String[] parseCSVLine(String line) {
        java.util.List<String> fields = new ArrayList<>();
        StringBuilder current = new StringBuilder();
        boolean inQuotes = false;
        
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            
            if (c == '"') {
                inQuotes = !inQuotes;
            } else if (c == ',' && !inQuotes) {
                fields.add(current.toString().trim());
                current = new StringBuilder();
            } else {
                current.append(c);
            }
        }
        
        fields.add(current.toString().trim());
        return fields.toArray(new String[0]);
    }
    
    private Map<String, Object> performAnalytics(java.util.List<DataRecord> records) {
        Map<String, Object> analytics = new LinkedHashMap<>();

        analytics.put("Total Games", records.size());

        double totalSales = records.stream().mapToDouble(DataRecord::getTotalSales).sum();
        analytics.put("Total Global Sales", String.format("%.2f", totalSales));

        double avgSales = records.stream().mapToDouble(DataRecord::getTotalSales).average().orElse(0);
        analytics.put("Average Sales Per Game", String.format("%.2f", avgSales));

        double maxSales = records.stream().mapToDouble(DataRecord::getTotalSales).max().orElse(0);
        analytics.put("Highest Sales", String.format("%.2f", maxSales));

        double naSales = records.stream().mapToDouble(DataRecord::getNaSales).sum();
        double jpSales = records.stream().mapToDouble(DataRecord::getJpSales).sum();
        double palSales = records.stream().mapToDouble(DataRecord::getPalSales).sum();
        double otherSales = records.stream().mapToDouble(DataRecord::getOtherSales).sum();

        analytics.put("NA Sales", String.format("%.2f", naSales));
        analytics.put("JP Sales", String.format("%.2f", jpSales));
        analytics.put("PAL Sales", String.format("%.2f", palSales));
        analytics.put("Other Sales", String.format("%.2f", otherSales));

        Map<String, Integer> genreCount = new HashMap<>();
        for (DataRecord record : records) {
            genreCount.merge(record.getGenre(), 1, Integer::sum);
        }
        analytics.put("Top Genre", genreCount.entrySet().stream()
            .max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("N/A"));
        analytics.put("Genre Count", genreCount.size());

        Map<String, Integer> consoleCount = new HashMap<>();
        for (DataRecord record : records) {
            consoleCount.merge(record.getConsole(), 1, Integer::sum);
        }
        analytics.put("Most Popular Console", consoleCount.entrySet().stream()
            .max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("N/A"));

        double avgScore = records.stream()
            .filter(r -> r.getCriticScore() > 0)
            .mapToDouble(DataRecord::getCriticScore).average().orElse(0);
        analytics.put("Average Critic Score", String.format("%.2f", avgScore));

        Map<String, Integer> publisherCount = new HashMap<>();
        for (DataRecord record : records) {
            publisherCount.merge(record.getPublisher(), 1, Integer::sum);
        }
        analytics.put("Total Publishers", publisherCount.size());
        analytics.put("Top Publisher", publisherCount.entrySet().stream()
            .max(Map.Entry.comparingByValue()).map(Map.Entry::getKey).orElse("N/A"));

        return analytics;
    }
    
    private String formatResults(Map<String, Object> analytics, java.util.List<DataRecord> records) {
        StringBuilder sb = new StringBuilder();

        sb.append("=== ANALYTICS SUMMARY ===\n\n");
        sb.append("Dataset Analysis Report\n");
        sb.append("=".repeat(50)).append("\n");

        for (Map.Entry<String, Object> entry : analytics.entrySet()) {
            sb.append(String.format("%-30s: %s\n", entry.getKey(), entry.getValue()));
        }

        sb.append("=".repeat(50)).append("\n\n");
        sb.append("TOP 10 BEST SELLING GAMES\n");
        sb.append("=".repeat(50)).append("\n");
        sb.append(String.format("%-40s | %-15s | %s\n", "Title", "Console", "Sales\n"));
        sb.append("-".repeat(75)).append("\n");

        records.stream()
            .sorted((a, b) -> Double.compare(b.getTotalSales(), a.getTotalSales()))
            .limit(10)
            .forEach(record -> {
                String title = record.getTitle().length() > 40 
                    ? record.getTitle().substring(0, 37) + "..." 
                    : record.getTitle();
                sb.append(String.format("%-40s | %-15s | %.2f\n", 
                    title, record.getConsole(), record.getTotalSales()));
            });

        return sb.toString();
    }
    
    private void exportSummaryReport(String filename, Map<String, Object> analytics, java.util.List<DataRecord> records) 
            throws IOException {
        try (FileWriter writer = new FileWriter(filename)) {
            writer.write("Metric,Value\n");

            for (Map.Entry<String, Object> entry : analytics.entrySet()) {
                String metric = entry.getKey();
                Object value = entry.getValue();

                metric = metric.contains(",") ? "\"" + metric + "\"" : metric;
                writer.write(metric + "," + value + "\n");
            }

            writer.write("\n");
            writer.write("Top 10 Best Selling Games\n");
            writer.write("Title,Console,Genre,Total Sales,Critic Score\n");

            records.stream()
                .sorted((a, b) -> Double.compare(b.getTotalSales(), a.getTotalSales()))
                .limit(10)
                .forEach(record -> {
                    try {
                        writer.write(String.format("\"%s\",%s,%s,%.2f,%.1f\n",
                            record.getTitle().replace("\"", "\"\""),
                            record.getConsole(),
                            record.getGenre(),
                            record.getTotalSales(),
                            record.getCriticScore()));
                    } catch (IOException e) {
                        // ignore
                    }
                });
        }
    }
}
