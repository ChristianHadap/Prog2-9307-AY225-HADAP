import java.io.*;
import java.util.*;

/**
 * MP17 - Find the Longest Text Entry in Dataset
 * 
 * Program Description:
 * This program reads a CSV dataset file, searches through all records
 * to find the longest text entry, and displays its statistics including
 * position, length, and character composition. It includes comprehensive
 * error handling and formatted output.
 * 
 * Author: HADAP, CHRISTIAN JORGE A.
 * Date: March 16, 2026
 */

public class MP17 {
    
    /**
     * Inner class to store longest entry information
     */
    private static class LongestEntry {
        String content;      // The actual longest text
        int length;          // Length of the text
        int lineNumber;      // Line number in dataset
        int columnNumber;    // Column number if parsing CSV fields
        
        LongestEntry(String content, int length, int lineNumber) {
            this.content = content;
            this.length = length;
            this.lineNumber = lineNumber;
        }
    }
    
    /**
     * Main method - Entry point of the program
     * Prompts user for CSV file path and finds longest text entry
     */
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        try {
            // Prompt user for dataset file path
            System.out.println("========================================");
            System.out.println(" MP17 - Find Longest Text Entry       ");
            System.out.println("========================================");
            System.out.print("\nEnter the CSV dataset file path: ");
            String filePath = scanner.nextLine().trim();
            
            // Read CSV file and store records
            List<String> records = readCSVFile(filePath);
            
            if (records.isEmpty()) {
                System.out.println("\n[ERROR] No records found in the CSV file.");
                return;
            }
            
            // Find the longest text entry in dataset
            LongestEntry longest = findLongestEntry(records);
            
            // Display formatted results
            displayLongestEntryReport(longest, records.size());
            
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
     * Finds the longest text entry in the entire dataset
     * Iterates through all records and compares text lengths
     * 
     * @param records - List of all records
     * @return LongestEntry object containing longest text information
     */
    private static LongestEntry findLongestEntry(List<String> records) {
        // Initialize with first record
        LongestEntry longest = new LongestEntry(records.get(0), records.get(0).length(), 1);
        
        // Iterate through all records to find longest
        for (int i = 1; i < records.size(); i++) {
            String currentRecord = records.get(i);
            int currentLength = currentRecord.length();
            
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
     * Displays comprehensive report of the longest text entry
     * Shows statistics, character composition, and position information
     * 
     * @param longest - LongestEntry object with longest information
     * @param totalRecords - Total number of records in dataset
     */
    private static void displayLongestEntryReport(LongestEntry longest, int totalRecords) {
        System.out.println("\n========================================");
        System.out.println("   LONGEST TEXT ENTRY ANALYSIS REPORT   ");
        System.out.println("========================================\n");
        
        // Display dataset statistics
        System.out.println("DATASET STATISTICS:");
        System.out.println("  Total records: " + totalRecords);
        System.out.println("----------------------------------------");
        
        // Display longest entry information
        System.out.println("\nLONGEST ENTRY INFORMATION:");
        System.out.println("  Position (Line Number): " + longest.lineNumber);
        System.out.println("  Total Characters: " + longest.length);
        System.out.println("  Content: " + longest.content);
        System.out.println("----------------------------------------");
        
        // Display character composition analysis
        System.out.println("\nCHARACTER COMPOSITION:");
        analyzeCharacterComposition(longest.content);
        
        System.out.println("----------------------------------------");
        System.out.println("\n[SUCCESS] Longest text entry analysis completed!");
        System.out.println("========================================\n");
    }
    
    /**
     * Analyzes and displays character composition of text
     * Counts alphabetic, numeric, and special characters
     * 
     * @param text - Text to analyze
     */
    private static void analyzeCharacterComposition(String text) {
        int alphabetic = 0;
        int numeric = 0;
        int special = 0;
        int spaces = 0;
        
        // Count character types
        for (char c : text.toCharArray()) {
            if (Character.isLetter(c)) {
                alphabetic++;
            } else if (Character.isDigit(c)) {
                numeric++;
            } else if (Character.isWhitespace(c)) {
                spaces++;
            } else {
                special++;
            }
        }
        
        // Display character counts
        System.out.println("  Alphabetic characters: " + alphabetic);
        System.out.println("  Numeric characters: " + numeric);
        System.out.println("  Spaces: " + spaces);
        System.out.println("  Special characters: " + special);
    }
}
