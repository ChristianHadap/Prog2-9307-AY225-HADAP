// Programmer Identifier: Hadap, Christian Jorge A - 22-1279-759

import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;
import java.awt.*;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import javax.swing.RowFilter;

public class JAVA extends JFrame {
    private final DefaultTableModel model;
    private final JTable table;
    private final TableRowSorter<DefaultTableModel> sorter;
    private final JTextField searchField;
    private final JTextField idField;
    private final JTextField firstNameField;
    private final JTextField lastNameField;
    private final JTextField lab1Field;
    private final JTextField lab2Field;
    private final JTextField lab3Field;
    private final JTextField examField;
    private final JTextField attendanceField;

    public JAVA() {
        this.setTitle("Records - Hadap, Christian Jorge A - 22-1279-759");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(1000, 600);
        setLocationRelativeTo(null);

        model = new DefaultTableModel(new Object[]{
                "StudentID",
                "first_name",
                "last_name",
                "LAB WORK 1",
                "LAB WORK 2",
                "LAB WORK 3",
                "PRELIM EXAM",
                "ATTENDANCE GRADE"
        }, 0);
        table = new JTable(model);
        sorter = new TableRowSorter<>(model);
        table.setRowSorter(sorter);
        JScrollPane scrollPane = new JScrollPane(table);

        JPanel inputPanel = new JPanel(new GridBagLayout());
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(4, 4, 4, 4);
        gbc.fill = GridBagConstraints.HORIZONTAL;

        // Row 0
        gbc.gridx = 0; gbc.gridy = 0;
        inputPanel.add(new JLabel("StudentID"), gbc);
        gbc.gridx = 1;
        idField = new JTextField(12);
        inputPanel.add(idField, gbc);

        gbc.gridx = 2; gbc.gridy = 0;
        inputPanel.add(new JLabel("first_name"), gbc);
        gbc.gridx = 3;
        firstNameField = new JTextField(12);
        inputPanel.add(firstNameField, gbc);

        // Row 1
        gbc.gridx = 0; gbc.gridy = 1;
        inputPanel.add(new JLabel("last_name"), gbc);
        gbc.gridx = 1;
        lastNameField = new JTextField(12);
        inputPanel.add(lastNameField, gbc);

        gbc.gridx = 2; gbc.gridy = 1;
        inputPanel.add(new JLabel("LAB WORK 1"), gbc);
        gbc.gridx = 3;
        lab1Field = new JTextField(12);
        inputPanel.add(lab1Field, gbc);

        // Row 2
        gbc.gridx = 0; gbc.gridy = 2;
        inputPanel.add(new JLabel("LAB WORK 2"), gbc);
        gbc.gridx = 1;
        lab2Field = new JTextField(12);
        inputPanel.add(lab2Field, gbc);

        gbc.gridx = 2; gbc.gridy = 2;
        inputPanel.add(new JLabel("LAB WORK 3"), gbc);
        gbc.gridx = 3;
        lab3Field = new JTextField(12);
        inputPanel.add(lab3Field, gbc);

        // Row 3
        gbc.gridx = 0; gbc.gridy = 3;
        inputPanel.add(new JLabel("PRELIM EXAM"), gbc);
        gbc.gridx = 1;
        examField = new JTextField(12);
        inputPanel.add(examField, gbc);

        gbc.gridx = 2; gbc.gridy = 3;
        inputPanel.add(new JLabel("ATTENDANCE GRADE"), gbc);
        gbc.gridx = 3;
        attendanceField = new JTextField(12);
        inputPanel.add(attendanceField, gbc);

        // Search row
        gbc.gridx = 0; gbc.gridy = 4;
        inputPanel.add(new JLabel("Search:"), gbc);
        gbc.gridx = 1;
        searchField = new JTextField(12);
        searchField.setToolTipText("Search by StudentID, Name, or any field");
        inputPanel.add(searchField, gbc);
        
        gbc.gridx = 2;
        JButton searchBtn = new JButton("Search");
        inputPanel.add(searchBtn, gbc);
        
        gbc.gridx = 3;
        JButton clearSearchBtn = new JButton("Clear Search");
        inputPanel.add(clearSearchBtn, gbc);

        // Buttons row
        JPanel btnPanel = new JPanel(new FlowLayout(FlowLayout.LEFT));
        JButton addBtn = new JButton("Add");
        JButton delBtn = new JButton("Delete");
        btnPanel.add(addBtn);
        btnPanel.add(delBtn);
        gbc.gridx = 0; gbc.gridy = 5; gbc.gridwidth = 4;
        inputPanel.add(btnPanel, gbc);

        add(scrollPane, BorderLayout.CENTER);
        add(inputPanel, BorderLayout.SOUTH);

        addBtn.addActionListener(e -> addRecord());
        delBtn.addActionListener(e -> deleteSelected());
        
        // Search functionality
        searchBtn.addActionListener(e -> performSearch());
        clearSearchBtn.addActionListener(e -> clearSearch());
        searchField.addKeyListener(new java.awt.event.KeyAdapter() {
            @Override
            public void keyReleased(java.awt.event.KeyEvent e) {
                performSearch();
            }
        });

        loadCsvOnStartup();
    }

    private void loadCsvOnStartup() {
        String[] candidates = new String[]{
                "MOCK_DATA.csv",
                Paths.get("..", "MOCK_DATA.csv").toString(),
                Paths.get("Prog2-9307-AY225-HADAP", "Pre-lim-Exam", "MOCK_DATA.csv").toString(),
                Paths.get("Prog2-9307-AY225-HADAP", "Pre-lim-Exam", "java", "MOCK_DATA.csv").toString(),
                "class_records.csv",
                Paths.get("..", "class_records.csv").toString()
        };

        boolean loaded = false;
        for (String fileName : candidates) {
            try {
                Files.lines(Paths.get(fileName)).forEach(line -> {
                    String trimmed = line.trim();
                    if (trimmed.isEmpty()) return;
                    String[] parts = trimmed.split(",");
                    String firstCell = parts[0].trim().replace("\"", "");
                    if (firstCell.equalsIgnoreCase("StudentID")) return; // skip header
                    if (parts.length >= 8) {
                        Object[] row = new Object[8];
                        for (int i = 0; i < 8; i++) {
                            row[i] = parts[i].trim().replace("\"", "");
                        }
                        model.addRow(row);
                    }
                });
                loaded = true;
                break;
            } catch (IOException ignored) {
            }
        }

        if (!loaded) {
            JOptionPane.showMessageDialog(
                    this,
                    "Unable to read CSV. Tried MOCK_DATA.csv and class_records.csv in current and parent folder",
                    "File Read Error",
                    JOptionPane.ERROR_MESSAGE
            );
        }
    }

    private void addRecord() {
        String id = idField.getText().trim();
        String first = firstNameField.getText().trim();
        String last = lastNameField.getText().trim();
        String lab1 = lab1Field.getText().trim();
        String lab2 = lab2Field.getText().trim();
        String lab3 = lab3Field.getText().trim();
        String exam = examField.getText().trim();
        String attendance = attendanceField.getText().trim();
        if (id.isEmpty() || first.isEmpty() || last.isEmpty() || lab1.isEmpty() || lab2.isEmpty() || lab3.isEmpty() || exam.isEmpty() || attendance.isEmpty()) {
            JOptionPane.showMessageDialog(this, "Please fill all fields.");
            return;
        }
        model.addRow(new Object[]{id, first, last, lab1, lab2, lab3, exam, attendance});
        idField.setText("");
        firstNameField.setText("");
        lastNameField.setText("");
        lab1Field.setText("");
        lab2Field.setText("");
        lab3Field.setText("");
        examField.setText("");
        attendanceField.setText("");
    }

    private void deleteSelected() {
        int row = table.getSelectedRow();
        if (row >= 0) {
            model.removeRow(row);
        } else {
            JOptionPane.showMessageDialog(this, "Select a row to delete.");
        }
    }

    private void performSearch() {
        String searchText = searchField.getText().trim();
        if (searchText.isEmpty()) {
            sorter.setRowFilter(null);
        } else {
            try {
                RowFilter<DefaultTableModel, Integer> rf = RowFilter.regexFilter("(?i)" + java.util.regex.Pattern.quote(searchText));
                sorter.setRowFilter(rf);
            } catch (java.util.regex.PatternSyntaxException e) {
                sorter.setRowFilter(null);
            }
        }
    }

    private void clearSearch() {
        searchField.setText("");
        sorter.setRowFilter(null);
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> new JAVA().setVisible(true));
    }
}
