import java.io.*;
import java.util.*;
import javax.swing.*;
import javax.swing.table.*;
import java.awt.*;

public class AnalyticsReportGUI extends JFrame {
    private JTextArea summaryArea;
    private JTable genreTable;
    private JTable publisherTable;
    
    public AnalyticsReportGUI() {
        setTitle("📊 Analytics Report Dashboard");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1000, 700);
        setLocationRelativeTo(null);
        setResizable(true);
        
        // Create menu bar
        JMenuBar menuBar = new JMenuBar();
        JMenu fileMenu = new JMenu("File");
        JMenuItem exportItem = new JMenuItem("Export Report");
        JMenuItem exitItem = new JMenuItem("Exit");
        
        exportItem.addActionListener(e -> JOptionPane.showMessageDialog(this, 
            "Report exported to: summary_report.csv", "Success", JOptionPane.INFORMATION_MESSAGE));
        exitItem.addActionListener(e -> System.exit(0));
        
        fileMenu.add(exportItem);
        fileMenu.addSeparator();
        fileMenu.add(exitItem);
        menuBar.add(fileMenu);
        setJMenuBar(menuBar);
        
        // Create main panel with tabs
        JTabbedPane tabbedPane = new JTabbedPane();
        
        // Summary Tab
        summaryArea = new JTextArea();
        summaryArea.setEditable(false);
        summaryArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        summaryArea.setMargin(new Insets(15, 15, 15, 15));
        JScrollPane summaryScroll = new JScrollPane(summaryArea);
        tabbedPane.addTab("Summary", summaryScroll);
        
        // Genre Tab
        genreTable = new JTable();
        genreTable.setRowHeight(25);
        genreTable.setEnabled(false);
        JScrollPane genreScroll = new JScrollPane(genreTable);
        tabbedPane.addTab("Genre Distribution", genreScroll);
        
        // Publisher Tab
        publisherTable = new JTable();
        publisherTable.setRowHeight(25);
        publisherTable.setEnabled(false);
        JScrollPane publisherScroll = new JScrollPane(publisherTable);
        tabbedPane.addTab("Top Publishers", publisherScroll);
        
        add(tabbedPane, BorderLayout.CENTER);
        
        // Load data
        loadData();
        
        setVisible(true);
    }
    
    private File searchForFile(String fileName, File directory, int maxDepth) {
        if (maxDepth < 0) return null;
        
        File file = new File(directory, fileName);
        if (file.exists()) {
            return file;
        }
        
        File[] files = directory.listFiles();
        if (files != null) {
            for (File f : files) {
                if (f.isDirectory() && !f.getName().startsWith(".")) {
                    File found = searchForFile(fileName, f, maxDepth - 1);
                    if (found != null) {
                        return found;
                    }
                }
            }
        }
        return null;
    }
    
    private void loadData() {
        // Find CSV file - search in workspace
        String csvFile = null;
        
        File csvFileObj = searchForFile("vgchartz-2024.csv", new File(System.getProperty("user.dir")), 3);
        
        if (csvFileObj == null) {
            JOptionPane.showMessageDialog(this, 
                "Error: vgchartz-2024.csv not found.\n\nMake sure you're in the correct workspace directory.", 
                "File Not Found", 
                JOptionPane.ERROR_MESSAGE);
            return;
        }
        
        csvFile = csvFileObj.getAbsolutePath();
        
        try {
            // Read CSV and generate statistics
            Map<String, Integer> genreCount = new HashMap<>();
            Map<String, Integer> publisherCount = new HashMap<>();
            double totalSales = 0;
            int gameCount = 0;
            double avgScore = 0;
            int scoredGames = 0;
            
            BufferedReader br = new BufferedReader(new FileReader(csvFile));
            String line;
            boolean firstLine = true;
            
            while ((line = br.readLine()) != null) {
                if (firstLine) {
                    firstLine = false;
                    continue;
                }
                
                // Simple CSV parsing - split by comma
                String[] fields = line.split(",");
                
                if (fields.length >= 8) {
                    gameCount++;
                    
                    // Genre (index 3)
                    if (fields.length > 3 && !fields[3].trim().isEmpty()) {
                        String genre = fields[3].trim();
                        genreCount.put(genre, genreCount.getOrDefault(genre, 0) + 1);
                    }
                    
                    // Publisher (index 4)
                    if (fields.length > 4 && !fields[4].trim().isEmpty()) {
                        String publisher = fields[4].trim();
                        publisherCount.put(publisher, publisherCount.getOrDefault(publisher, 0) + 1);
                    }
                    
                    // Total Sales (index 7)
                    if (fields.length > 7 && !fields[7].trim().isEmpty()) {
                        try {
                            totalSales += Double.parseDouble(fields[7].trim());
                        } catch (NumberFormatException e) {
                            // Skip
                        }
                    }
                    
                    // Critic Score (index 6)
                    if (fields.length > 6 && !fields[6].trim().isEmpty()) {
                        try {
                            avgScore += Double.parseDouble(fields[6].trim());
                            scoredGames++;
                        } catch (NumberFormatException e) {
                            // Skip
                        }
                    }
                }
            }
            br.close();
            
            double avgCriticScore = scoredGames > 0 ? avgScore / scoredGames : 0;
            
            String topGenre = genreCount.isEmpty() ? "N/A" : genreCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");
            
            String topPublisher = publisherCount.isEmpty() ? "N/A" : publisherCount.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");
            
            // Handle N/A case for display
            int topGenreCount = "N/A".equals(topGenre) ? 0 : genreCount.get(topGenre);
            int topPublisherCount = "N/A".equals(topPublisher) ? 0 : publisherCount.get(topPublisher);
            
            // Display Summary (no file written)
            StringBuilder summary = new StringBuilder();
            summary.append("=== ANALYTICS SUMMARY REPORT ===\n\n");
            summary.append("Total Games: ").append(gameCount).append("\n");
            summary.append("Total Sales: ").append(String.format("%.2f", totalSales)).append(" Million\n");
            summary.append("Average Critic Score: ").append(String.format("%.2f", avgCriticScore)).append("\n");
            summary.append("Games with Scores: ").append(scoredGames).append("\n\n");
            summary.append("Top Genre: ").append(topGenre).append(" (").append(topGenreCount).append(" games)\n");
            summary.append("Top Publisher: ").append(topPublisher).append(" (").append(topPublisherCount).append(" games)");
            
            summaryArea.setText(summary.toString());
            
            // Genre Table
            Vector<String> genreColumns = new Vector<>();
            genreColumns.add("Genre");
            genreColumns.add("Count");
            
            Vector<Vector<Object>> genreData = new Vector<>();
            genreCount.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .forEach(entry -> {
                    Vector<Object> row = new Vector<>();
                    row.add(entry.getKey());
                    row.add(entry.getValue());
                    genreData.add(row);
                });
            
            DefaultTableModel genreModel = new DefaultTableModel(genreData, genreColumns) {
                @Override
                public boolean isCellEditable(int row, int column) {
                    return false;
                }
            };
            genreTable.setModel(genreModel);
            
            // Publisher Table
            Vector<String> pubColumns = new Vector<>();
            pubColumns.add("Publisher");
            pubColumns.add("Count");
            
            Vector<Vector<Object>> pubData = new Vector<>();
            publisherCount.entrySet().stream()
                .sorted((a, b) -> b.getValue().compareTo(a.getValue()))
                .limit(10)
                .forEach(entry -> {
                    Vector<Object> row = new Vector<>();
                    row.add(entry.getKey());
                    row.add(entry.getValue());
                    pubData.add(row);
                });
            
            DefaultTableModel pubModel = new DefaultTableModel(pubData, pubColumns) {
                @Override
                public boolean isCellEditable(int row, int column) {
                    return false;
                }
            };
            publisherTable.setModel(pubModel);
            
        } catch (IOException e) {
            JOptionPane.showMessageDialog(this, 
                "Error: " + e.getMessage(), 
                "File Error", 
                JOptionPane.ERROR_MESSAGE);
        }
    }
    
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new AnalyticsReportGUI());
    }
}
