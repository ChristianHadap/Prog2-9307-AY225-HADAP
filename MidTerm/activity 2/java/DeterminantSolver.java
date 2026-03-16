/**
 * =====================================================
 * Student Name    : HADAP, CHRISTIAN JORGE A.
 * Course          : Math 101 — Linear Algebra
 * Assignment      : Programming Assignment 1 — 3x3 Matrix Determinant Solver
 * School          : University of Perpetual Help System DALTA, Molino Campus
 * Date            : March 16, 2026
 * GitHub Repo     : https://github.com/[your-username]/uphsd-cs-hadap-christian
 *
 * Description:
 *   This program computes the determinant of a hardcoded 3x3 matrix assigned
 *   to HADAP, CHRISTIAN JORGE A. for Math 101. The solution is computed using cofactor
 *   expansion along the first row. Each intermediate step (2x2 minor,
 *   cofactor term, running sum) is printed to the console in a readable format.
 * =====================================================
 */
public class DeterminantSolver {

    // -- SECTION 1: Matrix Declaration -----------------------------------
    // The assigned 3x3 matrix is declared as a 2D integer array in row-major order.
    // These are the specific matrix values assigned to this student.
    // Matrix rows are stored as: [2, 4, 3], [5, 1, 6], [3, 2, 4]
    static int[][] matrix = {
        { 2, 4, 3 },   // Row 1 of assigned matrix
        { 5, 1, 6 },   // Row 2 of assigned matrix
        { 3, 2, 4 }    // Row 3 of assigned matrix
    };

    // -- SECTION 2: 2x2 Determinant Helper --------------------------------
    // This method calculates the determinant of a 2x2 matrix from four individual elements.
    // The formula used is: determinant = (a * d) - (b * c)
    // This helper is invoked three times during cofactor expansion to compute each minor.
    static int computeMinor(int a, int b, int c, int d) {
        // Apply the 2x2 determinant formula: ad - bc
        int product1 = a * d;
        int product2 = b * c;
        return product1 - product2;
    }

    // -- SECTION 3: Matrix Printer ----------------------------------------
    // This helper method displays a 3x3 matrix in a clean, box-formatted style.
    // Each row is printed on a separate line with proper spacing and borders.
    // Called at the beginning of the solution to show the problem matrix clearly.
    static void printMatrix(int[][] m) {
        System.out.println("[                  ]");
        for (int[] row : m) {
            System.out.printf("|  %2d  %2d  %2d  |%n", row[0], row[1], row[2]);
        }
        System.out.println("[                  ]");
    }

    // -- SECTION 4: Step-by-Step Determinant Solver -------------------------
    // This is the main solving function that computes the full determinant via cofactor expansion.
    // It performs the following steps in order:
    //   (a) Display a formatted header and the original matrix
    //   (b) Compute the three 2x2 minors by removing row 0 and each column in turn
    //   (c) Print each minor's calculation with intermediate arithmetic
    //   (d) Calculate the three signed cofactor terms using the alternating sign pattern
    //   (e) Display the final determinant as the sum of the three cofactors
    //   (f) Check if the determinant is zero (singular matrix case)
    static void solveDeterminant(int[][] m) {

        // Print the header section and the matrix
        System.out.println("=".repeat(52));
        System.out.println("  3x3 MATRIX DETERMINANT SOLVER");
        System.out.println("  Student: HADAP, CHRISTIAN JORGE A.");
        System.out.println("  Assigned Matrix:");
        System.out.println("=".repeat(52));
        printMatrix(m);
        System.out.println("=".repeat(52));
        System.out.println();
        System.out.println("Expanding along Row 1 (cofactor expansion):");
        System.out.println();

        // -- Step 1: Compute minor M11 --
        // To find M11, remove row 0 and column 0 from the matrix.
        // The remaining 2x2 sub-matrix has elements from positions [1][1], [1][2], [2][1], [2][2].
        int minor11 = computeMinor(m[1][1], m[1][2], m[2][1], m[2][2]);
        System.out.printf("  Step 1 - Minor M11: det([%d,%d],[%d,%d]) = (%d*%d)-(%d*%d) = %d - %d = %d%n",
            m[1][1], m[1][2], m[2][1], m[2][2],
            m[1][1], m[2][2], m[1][2], m[2][1], 
            m[1][1] * m[2][2], m[1][2] * m[2][1], minor11);

        // -- Step 2: Compute minor M12 --
        // To find M12, remove row 0 and column 1 from the matrix.
        // The remaining 2x2 sub-matrix has elements from positions [1][0], [1][2], [2][0], [2][2].
        int minor12 = computeMinor(m[1][0], m[1][2], m[2][0], m[2][2]);
        System.out.printf("  Step 2 - Minor M12: det([%d,%d],[%d,%d]) = (%d*%d)-(%d*%d) = %d - %d = %d%n",
            m[1][0], m[1][2], m[2][0], m[2][2],
            m[1][0], m[2][2], m[1][2], m[2][0],
            m[1][0] * m[2][2], m[1][2] * m[2][0], minor12);

        // -- Step 3: Compute minor M13 --
        // To find M13, remove row 0 and column 2 from the matrix.
        // The remaining 2x2 sub-matrix has elements from positions [1][0], [1][1], [2][0], [2][1].
        int minor13 = computeMinor(m[1][0], m[1][1], m[2][0], m[2][1]);
        System.out.printf("  Step 3 - Minor M13: det([%d,%d],[%d,%d]) = (%d*%d)-(%d*%d) = %d - %d = %d%n",
            m[1][0], m[1][1], m[2][0], m[2][1],
            m[1][0], m[2][1], m[1][1], m[2][0],
            m[1][0] * m[2][1], m[1][1] * m[2][0], minor13);

        // -- Cofactor Terms --
        // Each cofactor is computed by multiplying the matrix element by its corresponding minor,
        // then applying the alternating sign pattern: +, -, +
        // C11 uses +sign (position [0][0]), C12 uses -sign (position [0][1]), C13 uses +sign (position [0][2])
        int c11 =  m[0][0] * minor11;
        int c12 = -m[0][1] * minor12;
        int c13 =  m[0][2] * minor13;

        System.out.println();
        System.out.printf("  Cofactor C11 = (+1) * %d * %d = %d%n", m[0][0], minor11, c11);
        System.out.printf("  Cofactor C12 = (-1) * %d * %d = %d%n", m[0][1], minor12, c12);
        System.out.printf("  Cofactor C13 = (+1) * %d * %d = %d%n", m[0][2], minor13, c13);

        // -- Final Determinant --
        // The determinant is obtained by summing all three cofactor terms together.
        int det = c11 + c12 + c13;
        System.out.printf("%n  det(M) = %d + (%d) + %d = %d%n", c11, c12, c13, det);
        System.out.println("=".repeat(52));
        System.out.printf("  DETERMINANT = %d%n", det);

        // -- Singular Matrix Check --
        // A determinant of zero indicates the matrix is singular (non-invertible).
        // In this case, print a warning message to inform the user.
        if (det == 0) {
            System.out.println("  WARNING: The matrix is SINGULAR - it has no inverse.");
        }
        System.out.println("=".repeat(52));
    }

    // -- SECTION 5: Entry Point -----------------------------------------
    // The main method serves as the program's entry point when the Java application is executed.
    // It calls the solveDeterminant() function with the student's assigned matrix.
    public static void main(String[] args) {
        solveDeterminant(matrix);
    }

}
