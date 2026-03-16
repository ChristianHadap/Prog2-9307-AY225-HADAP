import java.io.*;
import java.util.*;

/**
 * MP15 - Export First 50 Rows to CSV
 * 
 * Program Description:
 * This program reads a CSV dataset file, extracts the first 50 rows,
 * and exports them to a new CSV file. It handles errors for missing files
 * and invalid file paths, providing clear user feedback.
 * 
 * Author: HADAP, CHRISTIAN JORGE A.
 * Date: March 16, 2026
 */

public class MP15 {
    
    /**
     * Main method - Entry point of the program
     * Prompts user for CSV file path and processes the data
     */
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        try {
            // Prompt user for dataset file path
            System.out.println("========================================");
            System.out.println("   MP15 - Export First 50 Rows to CSV   ");
            System.out.println("========================================");
            System.out.print("\nEnter the CSV dataset file path: ");
            String filePath = scanner.nextLine().trim();
            
            // Read CSV file and store records
            List<String> records = readCSVFile(filePath);
            
            if (records.isEmpty()) {
                System.out.println("\n[ERROR] No records found in the CSV file.");
                return;
            }
            
            // Extract first 50 rows (or all rows if less than 50)
            int exportRowCount = Math.min(50, records.size());
            List<String> first50Rows = records.subList(0, exportRowCount);
            
            // Export to Downloads folder
            String downloadsPath = System.getProperty("user.home") + "/Downloads/";
            String outputPath = downloadsPath + "MP15_Export_" + System.currentTimeMillis() + ".csv";
            exportToCSV(outputPath, first50Rows);
            
            // Display summary
            System.out.println("\n========================================");
            System.out.println("         EXPORT SUMMARY REPORT         ");
            System.out.println("========================================");
            System.out.println("Total records in source file: " + records.size());
            System.out.println("Rows exported: " + exportRowCount);
            System.out.println("Output file: " + outputPath);
            System.out.println("\n[SUCCESS] Export completed successfully!");
            System.out.println("========================================\n");
            
        } catch (IOException e) {
            System.out.println("\n[ERROR] File operation failed: " + e.getMessage());
        } finally {
            scanner.close();
        }
    }
    
    /**
     * Reads CSV file and stores all records (no filtering)
     * 
     * @param filePath - Path to the CSV file
     * @return List of all records as strings
     * @throws IOException - If file cannot be read
     */
    private static List<String> readCSVFile(String filePath) throws IOException {
        List<String> records = new ArrayList<>();
        
        // Create File object and check if it exists
        File file = new File(filePath);
        if (!file.exists()) {
            throw new IOException("File not found: " + filePath);
        }
        
        // Read file using BufferedReader and FileReader
        try (BufferedReader br = new BufferedReader(new FileReader(file))) {
            String line;
            while ((line = br.readLine()) != null) {
                // Store all lines including empty ones
                records.add(line);
            }
        }
        
        return records;
    }
    
    /**
     * Exports records to a new CSV file
     * 
     * @param outputPath - Path for the output CSV file
     * @param records - List of records to export
     * @throws IOException - If file write operation fails
     */
    private static void exportToCSV(String outputPath, List<String> records) throws IOException {
        // Write records to new CSV file using BufferedWriter and FileWriter
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
            for (String record : records) {
                writer.write(record);
                writer.newLine(); // Write new line after each record
            }
        }
        
        System.out.println("File saved to: " + new File(outputPath).getAbsolutePath());
    }
}
