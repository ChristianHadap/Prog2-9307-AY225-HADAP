import javax.swing.*;
import java.awt.*;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

// Attendance Tracker - A simple application to track attendance
public class AttendanceTracker {

    public static void main(String[] args) {
        // Create the GUI on the Event Dispatch Thread
        SwingUtilities.invokeLater(() -> createWindow());
    }

    private static void createWindow() {
        // Create the main window
        JFrame frame = new JFrame("Attendance Tracker");
        frame.setSize(400, 280);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLocationRelativeTo(null);
        frame.setLayout(new GridLayout(5, 2, 10, 10));

        // Create text fields
        JTextField nameField = new JTextField();
        JTextField timeField = new JTextField();
        JTextField signatureField = new JTextField();

        // Create course dropdown
        String[] courses = {"Select Course", "BSCS 1st Year", "BSCS 2nd Year", "BSCS 3rd Year", "BSCS 4th Year", 
                           "IT 1st Year", "IT 2nd Year", "IT 3rd Year", "IT 4th Year",};
        JComboBox<String> courseCombo = new JComboBox<>(courses);

        // Auto-populate time and signature
        timeField.setText(getCurrentDateTime());
        signatureField.setText(generateSignature());

        // Make certain fields read-only
        timeField.setEditable(false);
        signatureField.setEditable(false);

        // Add labels and fields to the window
        frame.add(new JLabel("Attendance Name:"));
        frame.add(nameField);
        frame.add(new JLabel("Course / Year:"));
        frame.add(courseCombo);
        frame.add(new JLabel("Time In:"));
        frame.add(timeField);
        frame.add(new JLabel("E-Signature:"));
        frame.add(signatureField);

        // Create buttons
        JButton submitButton = new JButton("Submit");
        JButton clearButton = new JButton("Clear");

        frame.add(submitButton);
        frame.add(clearButton);

        // Submit button action
        submitButton.addActionListener(e -> {
            String name = nameField.getText().trim();
            String course = (String) courseCombo.getSelectedItem();
            
            // Get current system time (latest time) to prevent cheating
            String time = getCurrentDateTime();

            // Validate name field
            if (name.isEmpty()) {
                JOptionPane.showMessageDialog(frame, "Attendance Name is required!", "Validation Error", JOptionPane.ERROR_MESSAGE);
                nameField.requestFocus();
                return;
            }

            if (name.length() < 2) {
                JOptionPane.showMessageDialog(frame, "Attendance Name must be at least 2 characters!", "Validation Error", JOptionPane.ERROR_MESSAGE);
                nameField.requestFocus();
                return;
            }

            if (!name.matches("[a-zA-Z\\s]+")) {
                JOptionPane.showMessageDialog(frame, "Attendance Name can only contain letters and spaces!", "Validation Error", JOptionPane.ERROR_MESSAGE);
                nameField.requestFocus();
                return;
            }

            // Validate course field
            if (course.equals("Select Course")) {
                JOptionPane.showMessageDialog(frame, "Please select a course!", "Validation Error", JOptionPane.ERROR_MESSAGE);
                courseCombo.requestFocus();
                return;
            }

            // Update time field with current system time
            timeField.setText(time);

            // All validations passed - show success message
            JOptionPane.showMessageDialog(frame, 
                "Attendance Recorded!\n\nName: " + name + 
                "\nCourse: " + course +
                "\nTime: " + time +
                "\nSignature: " + signatureField.getText(),
                "Success", JOptionPane.INFORMATION_MESSAGE);
        });

        // Clear button action
        clearButton.addActionListener(e -> {
            nameField.setText("");
            courseCombo.setSelectedIndex(0);
            timeField.setText(getCurrentDateTime());
            signatureField.setText(generateSignature());
        });

        // Display the window
        frame.setVisible(true);
    }

    // Get current system date and time
    private static String getCurrentDateTime() {
        return new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());
    }

    // Generate a unique signature
    private static String generateSignature() {
        return UUID.randomUUID().toString().substring(0, 12).toUpperCase();
    }
}
