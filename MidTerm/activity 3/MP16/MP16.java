import java.io.*;
import java.util.*;

/**
 * MP16 - Randomly Display 10 Rows from Dataset
 * 
 * Program Description:
 * This program reads a CSV dataset file, randomly selects 10 records
 * from the entire dataset, and displays them in a formatted table.
 * It includes error handling for missing files and validates data integrity.
 * 
 * Author: HADAP, CHRISTIAN JORGE A.
 * Date: March 16, 2026
 */

public class MP16 {
    
    /**
     * Main method - Entry point of the program
     * Prompts user for CSV file path and displays random records
     */
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        
        try {
            // Prompt user for dataset file path
            System.out.println("========================================");
            System.out.println("  MP16 - Randomly Display 10 Rows      ");
            System.out.println("========================================");
            System.out.print("\nEnter the CSV dataset file path: ");
            String filePath = scanner.nextLine().trim();
            
            // Read CSV file and store records
            List<String> records = readCSVFile(filePath);
            
            if (records.size() < 10) {
                System.out.println("\n[WARNING] Dataset has less than 10 records.");
                System.out.println("Found: " + records.size() + " records");
            }
            
            if (records.isEmpty()) {
                System.out.println("\n[ERROR] No records found in the CSV file.");
                return;
            }
            
            // Get random 10 rows from dataset
            List<String> randomRecords = getRandomRecords(records, 10);
            
            // Display formatted results
            displayRandomRecords(randomRecords, records.size());
            
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
     * Randomly selects specified number of records from dataset
     * Uses Fisher-Yates shuffle algorithm for random selection
     * 
     * @param records - List of all records
     * @param count - Number of random records to select
     * @return List of randomly selected records
     */
    private static List<String> getRandomRecords(List<String> records, int count) {
        // Ensure count doesn't exceed total records
        int selectCount = Math.min(count, records.size());
        
        // Create a copy of records list to avoid modifying original
        List<String> shuffle = new ArrayList<>(records);
        
        // Fisher-Yates shuffle algorithm
        Random random = new Random();
        for (int i = shuffle.size() - 1; i > 0; i--) {
            int randomIndex = random.nextInt(i + 1);
            // Swap elements
            String temp = shuffle.get(i);
            shuffle.set(i, shuffle.get(randomIndex));
            shuffle.set(randomIndex, temp);
        }
        
        // Return first selectCount elements (randomly shuffled)
        return new ArrayList<>(shuffle.subList(0, selectCount));
    }
    
    /**
     * Displays randomly selected records in formatted table output
     * 
     * @param randomRecords - List of randomly selected records
     * @param totalRecords - Total number of records in dataset
     */
    private static void displayRandomRecords(List<String> randomRecords, int totalRecords) {
        System.out.println("\n========================================");
        System.out.println("     RANDOM RECORD DISPLAY REPORT      ");
        System.out.println("========================================");
        System.out.println("Total records in dataset: " + totalRecords);
        System.out.println("Random records selected: " + randomRecords.size());
        System.out.println("========================================\n");
        
        // Display header
        System.out.println("RANDOMLY SELECTED RECORDS:");
        System.out.println("----------------------------------------");
        
        // Display each random record with line number
        for (int i = 0; i < randomRecords.size(); i++) {
            System.out.println((i + 1) + ". " + randomRecords.get(i));
        }
        
        System.out.println("----------------------------------------");
        System.out.println("\n[SUCCESS] Random record display completed!");
        System.out.println("========================================\n");
    }
}
