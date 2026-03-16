# Program Logic Explanations
---

## MP15 - Export First 50 Rows to CSV

**Program Logic:**
This program reads a CSV dataset file and exports the first 50 rows exactly as they appear in the file. The program prompts the user to enter the CSV file path, then uses BufferedReader (Java) or the File System module (JavaScript) to read the file line by line. It stores all lines in a list and extracts the first 50 rows, which may include metadata, headers, and data rows depending on the file structure. Finally, it exports these first 50 rows to a new CSV file with a timestamp, which is saved directly to the user's Downloads folder for easy access. The program includes error handling for missing files and invalid paths.

---

## MP16 - Randomly Display 10 Rows

**Program Logic:**
This program reads a CSV dataset and randomly selects 10 rows to display to the user in a formatted table. The program first prompts for the CSV file path and reads all rows from the file including headers and metadata. It uses the Fisher-Yates shuffle algorithm to randomly reorder all the rows, ensuring each selection is truly random and unbiased. The program then displays the 10 randomly selected rows with line numbers and formatted output, along with statistics showing the total rows in the dataset and how many were selected. This approach guarantees that professors and students see different random samples each time they run the program.

---

## MP17 - Find Longest Text Entry

**Program Logic:**
This program searches through all rows in the CSV dataset to find the single longest text entry and provides detailed analysis about it. The program asks the user for the CSV file path, then reads all rows from the file including headers and metadata. It iterates through each row, comparing text lengths to identify the longest entry, and stores its position, length, and content. Finally, it displays a comprehensive report showing where the longest entry was found, its total character count, the actual text, and a character composition breakdown (alphabetic, numeric, spaces, and special characters). This provides valuable insights into the data structure and content distribution within the dataset.

---

## Screenshot
