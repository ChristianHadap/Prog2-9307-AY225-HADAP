import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class PrelimGradeCalculatorGUI extends JFrame {
    private JTextField absencesField, lw1Field, lw2Field, lw3Field;
    private JEditorPane remarksArea;
    private JLabel attendanceLabel, labLabel, classLabel, passLabel, excelLabel;
    private JButton calculateButton, clearButton;

    public PrelimGradeCalculatorGUI() {
        // Frame setup
        setTitle("Prelim Grade Calculator");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(900, 600);
        setLocationRelativeTo(null);
        setResizable(false);
        setBackground(new Color(245, 245, 245));

        // Main panel
        JPanel mainPanel = new JPanel();
        mainPanel.setLayout(new BorderLayout(0, 15));
        mainPanel.setBackground(new Color(245, 245, 245));
        mainPanel.setBorder(new EmptyBorder(20, 20, 20, 20));

        // Header
        JPanel headerPanel = new JPanel();
        headerPanel.setLayout(new BoxLayout(headerPanel, BoxLayout.Y_AXIS));
        headerPanel.setBackground(new Color(245, 245, 245));
        JLabel titleLabel = new JLabel("Prelim Grade Calculator");
        titleLabel.setFont(new Font("Arial", Font.BOLD, 24));
        JLabel subtitleLabel = new JLabel("Determine your required Prelim Exam score");
        subtitleLabel.setFont(new Font("Arial", Font.PLAIN, 12));
        subtitleLabel.setForeground(new Color(100, 100, 100));
        headerPanel.add(titleLabel);
        headerPanel.add(subtitleLabel);
        mainPanel.add(headerPanel, BorderLayout.NORTH);

        // Content panel - 3 columns: Input | Results | Remarks
        JPanel contentPanel = new JPanel();
        contentPanel.setLayout(new GridLayout(1, 3, 15, 0));
        contentPanel.setBackground(new Color(245, 245, 245));

        // Column 1: Input
        contentPanel.add(createInputPanel());

        // Column 2: Metrics
        contentPanel.add(createMetricsPanel());

        // Column 3: Scores & Remarks
        contentPanel.add(createScoresRemarksPanel());

        mainPanel.add(contentPanel, BorderLayout.CENTER);

        add(mainPanel);
        setVisible(true);
    }

    private JPanel createMetricsPanel() {
        JPanel metricsPanel = new JPanel();
        metricsPanel.setLayout(new BoxLayout(metricsPanel, BoxLayout.Y_AXIS));
        metricsPanel.setBackground(Color.WHITE);
        metricsPanel.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(new Color(224, 224, 224), 1),
            new EmptyBorder(15, 15, 15, 15)
        ));

        JLabel title = new JLabel("YOUR SCORES");
        title.setFont(new Font("Arial", Font.BOLD, 12));
        title.setForeground(new Color(100, 100, 100));
        metricsPanel.add(title);
        metricsPanel.add(Box.createVerticalStrut(10));

        // Attendance
        attendanceLabel = new JLabel("90%");
        metricsPanel.add(createSmallMetric("Attendance", attendanceLabel, new Color(220, 240, 250)));
        metricsPanel.add(Box.createVerticalStrut(8));

        // Lab Average
        labLabel = new JLabel("1");
        metricsPanel.add(createSmallMetric("Lab Average", labLabel, new Color(240, 240, 240)));
        metricsPanel.add(Box.createVerticalStrut(8));

        // Class Standing
        classLabel = new JLabel("37");
        metricsPanel.add(createSmallMetric("Class Standing", classLabel, new Color(250, 245, 220)));
        metricsPanel.add(Box.createVerticalGlue());

        return metricsPanel;
    }

    private JPanel createSmallMetric(String label, JLabel valueLabel, Color bgColor) {
        JPanel metric = new JPanel();
        metric.setLayout(new BorderLayout(10, 5));
        metric.setBackground(bgColor);
        metric.setBorder(new EmptyBorder(8, 10, 8, 10));
        metric.setMaximumSize(new Dimension(Integer.MAX_VALUE, 50));

        JLabel labelText = new JLabel(label);
        labelText.setFont(new Font("Arial", Font.PLAIN, 10));
        labelText.setForeground(new Color(100, 100, 100));

        valueLabel.setFont(new Font("Arial", Font.BOLD, 18));
        valueLabel.setForeground(new Color(51, 51, 51));

        JPanel rightPanel = new JPanel();
        rightPanel.setLayout(new BoxLayout(rightPanel, BoxLayout.Y_AXIS));
        rightPanel.setBackground(bgColor);
        rightPanel.add(labelText);
        rightPanel.add(valueLabel);

        metric.add(rightPanel, BorderLayout.CENTER);
        return metric;
    }

    private JPanel createScoresRemarksPanel() {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
        panel.setBackground(Color.WHITE);
        panel.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(new Color(224, 224, 224), 1),
            new EmptyBorder(15, 15, 15, 15)
        ));

        JLabel title = new JLabel("REQUIRED EXAM SCORES");
        title.setFont(new Font("Arial", Font.BOLD, 11));
        title.setForeground(new Color(100, 100, 100));
        panel.add(title);
        panel.add(Box.createVerticalStrut(8));

        // Pass score
        JPanel passPanel = new JPanel();
        passPanel.setLayout(new BorderLayout());
        passPanel.setBackground(new Color(232, 245, 233));
        passPanel.setBorder(new EmptyBorder(8, 10, 8, 10));
        JLabel passLbl = new JLabel("To Pass (75):");
        passLbl.setFont(new Font("Arial", Font.PLAIN, 10));
        passLabel = new JLabel("—");
        passLabel.setFont(new Font("Arial", Font.BOLD, 16));
        passPanel.add(passLbl, BorderLayout.WEST);
        passPanel.add(passLabel, BorderLayout.EAST);
        panel.add(passPanel);
        panel.add(Box.createVerticalStrut(8));

        // Excel score
        JPanel excelPanel = new JPanel();
        excelPanel.setLayout(new BorderLayout());
        excelPanel.setBackground(new Color(240, 250, 240));
        excelPanel.setBorder(new EmptyBorder(8, 10, 8, 10));
        JLabel excelLbl = new JLabel("To Excel (100):");
        excelLbl.setFont(new Font("Arial", Font.PLAIN, 10));
        excelLabel = new JLabel("—");
        excelLabel.setFont(new Font("Arial", Font.BOLD, 16));
        excelPanel.add(excelLbl, BorderLayout.WEST);
        excelPanel.add(excelLabel, BorderLayout.EAST);
        panel.add(excelPanel);
        panel.add(Box.createVerticalStrut(15));

        JLabel remarksTitle = new JLabel("REMARKS");
        remarksTitle.setFont(new Font("Arial", Font.BOLD, 12));
        remarksTitle.setForeground(new Color(100, 100, 100));
        panel.add(remarksTitle);
        panel.add(Box.createVerticalStrut(8));

        // Remarks area
        remarksArea = new JEditorPane();
        remarksArea.setContentType("text/html");
        remarksArea.setFont(new Font("Arial", Font.PLAIN, 11));
        remarksArea.setEditable(false);
        remarksArea.setBackground(new Color(249, 249, 249));
        remarksArea.setForeground(new Color(51, 51, 51));
        remarksArea.setBorder(new LineBorder(new Color(224, 224, 224), 1));
        remarksArea.setText("<p style='margin: 0; font-size: 12px; color: #555;'>Enter your grades to see remarks</p>");
        panel.add(remarksArea);

        return panel;
    }

    private JPanel createInputPanel() {
        JPanel inputPanel = new JPanel();
        inputPanel.setLayout(new BoxLayout(inputPanel, BoxLayout.Y_AXIS));
        inputPanel.setBackground(Color.WHITE);
        inputPanel.setBorder(BorderFactory.createCompoundBorder(
            new LineBorder(new Color(224, 224, 224), 1),
            new EmptyBorder(20, 20, 20, 20)
        ));

        JLabel inputTitle = new JLabel("Enter Your Grades");
        inputTitle.setFont(new Font("Arial", Font.BOLD, 16));
        inputTitle.setAlignmentX(Component.LEFT_ALIGNMENT);
        inputPanel.add(inputTitle);
        inputPanel.add(Box.createVerticalStrut(15));

        // Absences
        inputPanel.add(createInputField("Number of Absences (0-4)", absencesField = new JTextField(10)));
        inputPanel.add(Box.createVerticalStrut(12));

        // Lab Work 1
        inputPanel.add(createInputField("Lab Work 1 (0-100)", lw1Field = new JTextField(10)));
        inputPanel.add(Box.createVerticalStrut(12));

        // Lab Work 2
        inputPanel.add(createInputField("Lab Work 2 (0-100)", lw2Field = new JTextField(10)));
        inputPanel.add(Box.createVerticalStrut(12));

        // Lab Work 3
        inputPanel.add(createInputField("Lab Work 3 (0-100)", lw3Field = new JTextField(10)));
        inputPanel.add(Box.createVerticalStrut(20));

        // Buttons
        JPanel buttonPanel = new JPanel();
        buttonPanel.setLayout(new GridLayout(1, 2, 10, 0));
        buttonPanel.setBackground(Color.WHITE);
        buttonPanel.setAlignmentX(Component.LEFT_ALIGNMENT);
        buttonPanel.setMaximumSize(new Dimension(Integer.MAX_VALUE, 40));

        calculateButton = new JButton("Calculate");
        calculateButton.setFont(new Font("Arial", Font.BOLD, 13));
        calculateButton.setBackground(new Color(51, 51, 51));
        calculateButton.setForeground(Color.WHITE);
        calculateButton.setFocusPainted(false);
        calculateButton.addActionListener(new CalculateButtonListener());

        clearButton = new JButton("Clear");
        clearButton.setFont(new Font("Arial", Font.BOLD, 13));
        clearButton.setBackground(new Color(153, 153, 153));
        clearButton.setForeground(Color.WHITE);
        clearButton.setFocusPainted(false);
        clearButton.addActionListener(new ClearButtonListener());

        buttonPanel.add(calculateButton);
        buttonPanel.add(clearButton);

        inputPanel.add(buttonPanel);
        inputPanel.add(Box.createVerticalGlue());

        return inputPanel;
    }

    private JPanel createInputField(String label, JTextField field) {
        JPanel fieldPanel = new JPanel();
        fieldPanel.setLayout(new BoxLayout(fieldPanel, BoxLayout.Y_AXIS));
        fieldPanel.setBackground(Color.WHITE);
        fieldPanel.setAlignmentX(Component.LEFT_ALIGNMENT);

        JLabel fieldLabel = new JLabel(label);
        fieldLabel.setFont(new Font("Arial", Font.PLAIN, 12));
        fieldLabel.setForeground(new Color(85, 85, 85));
        fieldPanel.add(fieldLabel);
        fieldPanel.add(Box.createVerticalStrut(4));

        field.setFont(new Font("Arial", Font.PLAIN, 13));
        field.setBorder(new LineBorder(new Color(221, 221, 221), 1));
        field.setMaximumSize(new Dimension(Integer.MAX_VALUE, 35));
        fieldPanel.add(field);

        return fieldPanel;
    }

    private class CalculateButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            try {
                int absences = Integer.parseInt(absencesField.getText());
                double lw1 = Double.parseDouble(lw1Field.getText());
                double lw2 = Double.parseDouble(lw2Field.getText());
                double lw3 = Double.parseDouble(lw3Field.getText());

                if (absences < 0 || absences > 4) {
                    JOptionPane.showMessageDialog(null, " Absences must be between 0 and 4.", 
                        "Input Error", JOptionPane.ERROR_MESSAGE);
                    return;
                }

                if (lw1 < 0 || lw1 > 100 || lw2 < 0 || lw2 > 100 || lw3 < 0 || lw3 > 100) {
                    JOptionPane.showMessageDialog(null, " Lab Work grades must be between 0 and 100.", 
                        "Input Error", JOptionPane.ERROR_MESSAGE);
                    return;
                }

                if (absences >= 4) {
                    attendanceLabel.setText("FAIL");
                    labLabel.setText("—");
                    classLabel.setText("—");
                    passLabel.setText("—");
                    excelLabel.setText("—");
                    remarksArea.setText("<h3 style='margin: 0 0 10px 0; font-size: 14px; color: #333;'> Automatic Failure</h3>" + 
                        "<p style='margin: 0; font-size: 12px; color: #555;'>You have <strong>" + absences + " absences</strong>. With 4 or more absences, you automatically fail the Prelim period.</p>");
                    remarksArea.setBackground(new Color(255, 235, 238));
                    return;
                }

                double labWorkAverage = (lw1 + lw2 + lw3) / 3.0;
                double attendanceScore = 100 - (absences * 10);
                double classStanding = (0.40 * attendanceScore) + (0.60 * labWorkAverage);
                double rawPassingScore = (75 - (0.30 * classStanding)) / 0.70;
                double rawExcellentScore = (100 - (0.30 * classStanding)) / 0.70;

                // Update labels
                attendanceLabel.setText(String.format("%.0f%%", attendanceScore));
                labLabel.setText(String.format("%.0f", labWorkAverage));
                classLabel.setText(String.format("%.0f", classStanding));

                // Update exam scores
                if (rawPassingScore > 100) {
                    passLabel.setText(" Not Possible");
                } else if (rawPassingScore < 0) {
                    passLabel.setText("Already Pass");
                } else {
                    passLabel.setText(String.format("%.0f", rawPassingScore));
                }

                if (rawExcellentScore > 100) {
                    excelLabel.setText(" Not Possible");
                } else if (rawExcellentScore < 0) {
                    excelLabel.setText("Already Excel");
                } else {
                    excelLabel.setText(String.format("%.0f", rawExcellentScore));
                }

                // Update remarks
                String remarksText = "";
                if (rawPassingScore > 100) {
                    remarksText = "<h3 style='margin: 0 0 10px 0; font-size: 14px; color: #333;'> Critical Notice</h3>" + 
                        "<p style='margin: 0; font-size: 12px; color: #555;'>Even with a perfect Prelim Exam score (100), you cannot achieve a passing grade of 75 with your current Class Standing of <strong>" + 
                        String.format("%.0f", classStanding) + "</strong>. Your Class Standing is too low.</p>";
                    remarksArea.setBackground(new Color(255, 235, 238));
                } else if (rawPassingScore <= 0) {
                    remarksText = "<h3 style='margin: 0 0 10px 0; font-size: 14px; color: #333;'>Excellent News!</h3>" + 
                        "<p style='margin: 0; font-size: 12px; color: #555;'>You are already guaranteed to pass the Prelim period with your current Class Standing of <strong>" + 
                        String.format("%.0f", classStanding) + "</strong>!<br><br>";
                    if (rawExcellentScore <= 0) {
                        remarksText += "You are also already guaranteed an Excellent grade (100)!";
                    } else if (rawExcellentScore <= 100) {
                        remarksText += "You can achieve an Excellent grade with a score of <strong>" + String.format("%.0f", rawExcellentScore) + "</strong> in the Prelim Exam.";
                    }
                    remarksText += "</p>";
                    remarksArea.setBackground(new Color(232, 245, 233));
                } else {
                    remarksText = "<h3 style='margin: 0 0 10px 0; font-size: 14px; color: #333;'>You Can Pass!</h3>" + 
                        "<p style='margin: 0; font-size: 12px; color: #555;'>Based on your current Class Standing of <strong>" + String.format("%.0f", classStanding) + 
                        "</strong>, you can achieve a passing grade.<br><br>";
                    if (rawExcellentScore <= 0) {
                        remarksText += "You are already guaranteed an Excellent grade (100)!";
                    } else if (rawExcellentScore <= 100) {
                        remarksText += "An excellent grade (100) is achievable with a score of <strong>" + String.format("%.0f", rawExcellentScore) + "</strong> in the Prelim Exam.";
                    } else {
                        remarksText += "To achieve an Excellent grade (100), you would need more than 100 in the Prelim Exam, which is not possible.";
                    }
                    remarksText += "</p>";
                    remarksArea.setBackground(new Color(232, 245, 233));
                }

                remarksArea.setText(remarksText);

            } catch (NumberFormatException ex) {
                JOptionPane.showMessageDialog(null, " Please enter valid numbers.", 
                    "Input Error", JOptionPane.ERROR_MESSAGE);
            }
        }
    }

    private class ClearButtonListener implements ActionListener {
        @Override
        public void actionPerformed(ActionEvent e) {
            absencesField.setText("");
            lw1Field.setText("");
            lw2Field.setText("");
            lw3Field.setText("");
            attendanceLabel.setText("90%");
            labLabel.setText("1");
            classLabel.setText("37");
            passLabel.setText("—");
            excelLabel.setText("—");
            remarksArea.setText("<p style='margin: 0; font-size: 12px; color: #555;'>Enter your grades to see remarks</p>");
            remarksArea.setBackground(new Color(249, 249, 249));
            absencesField.requestFocus();
        }
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new PrelimGradeCalculatorGUI());
    }
}
