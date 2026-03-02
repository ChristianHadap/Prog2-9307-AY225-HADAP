import javax.swing.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;

public class CSVExportAnalytics extends JFrame {
    private JTextArea reportArea;
    private JButton loadButton, exportButton;
    
    public CSVExportAnalytics() {
        setTitle("CSV Export Analytics Report");
        setSize(600, 500);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
        
        reportArea = new JTextArea(20, 50);
        reportArea.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(reportArea);
        
        loadButton = new JButton("Load CSV File");
        loadButton.addActionListener(e -> loadCSV());
        
        exportButton = new JButton("Export Summary Report");
        exportButton.addActionListener(e -> exportSummary());
        exportButton.setEnabled(false);
        
        panel.add(new JLabel("CSV Analytics Data:"));
        panel.add(scrollPane);
        panel.add(loadButton);
        panel.add(exportButton);
        
        add(panel);
        setVisible(true);
    }
    
    private List<String[]> csvData = new ArrayList<>();
    
    private void loadCSV() {
        JFileChooser fileChooser = new JFileChooser();
        int result = fileChooser.showOpenDialog(this);
        
        if (result == JFileChooser.APPROVE_OPTION) {
            File file = fileChooser.getSelectedFile();
            try {
                csvData.clear();
                List<String> lines = Files.readAllLines(Paths.get(file.getAbsolutePath()));
                
                reportArea.setText("Loading CSV File: " + file.getName() + "\n\n");
                reportArea.append("Total Records: " + (lines.size() - 1) + "\n\n");
                reportArea.append("Sample Data:\n");
                reportArea.append("============\n");
                
                for (int i = 0; i < Math.min(10, lines.size()); i++) {
                    String[] parts = lines.get(i).split(",");
                    csvData.add(parts);
                    reportArea.append(lines.get(i) + "\n");
                }
                
                exportButton.setEnabled(true);
                JOptionPane.showMessageDialog(this, "✓ CSV file loaded successfully!");
                
            } catch (IOException ex) {
                JOptionPane.showMessageDialog(this, "✗ Error loading file: " + ex.getMessage());
            }
        }
    }
    
    private void exportSummary() {
        if (csvData.isEmpty()) {
            JOptionPane.showMessageDialog(this, "✗ No data to export!");
            return;
        }
        
        try {
            String outputPath = "c:\\Users\\Administrator\\Desktop\\HADAP\\Prog2-9307-AY225-HADAP\\MidTerm\\summary_report.csv";
            FileWriter writer = new FileWriter(outputPath);
            
            writer.append("Game Title,Console,Genre,Publisher,Total Sales\n");
            
            for (String[] row : csvData) {
                if (row.length >= 5) {
                    writer.append(row[1]).append(",")
                          .append(row[2]).append(",")
                          .append(row[3]).append(",")
                          .append(row[4]).append(",")
                          .append(row[7]).append("\n");
                }
            }
            
            writer.flush();
            writer.close();
            
            reportArea.append("\n✓ Summary report exported to: summary