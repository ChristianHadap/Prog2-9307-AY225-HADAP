/**
 * =====================================================
 * Student Name    : HADAP, CHRISTIAN JORGE A.
 * Course          : Math 101 — Linear Algebra
 * Assignment      : Programming Assignment 1 — 3x3 Matrix Determinant Solver
 * School          : University of Perpetual Help System DALTA, Molino Campus
 * Date            : March 16, 2026
 * GitHub Repo     : https://github.com/[your-username]/uphsd-cs-hadap-christian
 * Runtime         : Node.js (run with: node determinant_solver.js)
 *
 * Description:
 *   JavaScript equivalent of DeterminantSolver.java. This script computes
 *   the determinant of the same hardcoded 3x3 matrix using cofactor expansion
 *   along the first row. All intermediate steps are logged to the console
 *   using console.log() for complete transparency of the solution process.
 * =====================================================
 */

// ── SECTION 1: Matrix Declaration ───────────────────────────────────
// The assigned 3x3 matrix is declared as a 2D JavaScript array.
// These are the same matrix values as the Java version: [2, 4, 3], [5, 1, 6], [3, 2, 4]
// Outer array contains three rows, each inner array contains three column values.
const matrix = [
    [2, 4, 3],   // Row 1
    [5, 1, 6],   // Row 2
    [3, 2, 4]    // Row 3
];

// ── SECTION 2: Matrix Printer ────────────────────────────────────────
// This helper function displays a 3x3 matrix in a formatted box-style output.
// Each row is printed on its own line with aligned numeric columns and borders.
// Uses template literals for clean string interpolation and formatting.
function printMatrix(m) {
    console.log(`┌               ┐`);
    m.forEach(row => {
        const fmt = row.map(v => v.toString().padStart(3)).join("  ");
        console.log(`│ ${fmt}  │`);
    });
    console.log(`└               ┘`);
}

// ── SECTION 3: 2×2 Determinant Helper ───────────────────────────────
// This function computes the determinant of a 2x2 matrix given four scalar values.
// The determinant formula for a 2x2 matrix is: ad - bc
// This function is invoked three times to calculate each 2x2 minor during cofactor expansion.
// Parameters: a, b = first row of 2x2 sub-matrix; c, d = second row
function computeMinor(a, b, c, d) {
    // Calculate the 2x2 determinant: (a * d) - (b * c)
    const product1 = a * d;
    const product2 = b * c;
    return product1 - product2;
}

// ── SECTION 4: Step-by-Step Determinant Solver ──────────────────────
// Main solving function that computes the determinant via cofactor expansion.
// Execution flow:
//   1. Print a formatted header with the student name and assigned matrix display
//   2. Calculate all three 2x2 minors by removing rows and columns systematically
//   3. Log each minor's arithmetic showing the intermediate products
//   4. Apply the alternating sign rule to generate signed cofactor terms
//   5. Sum the three cofactors to obtain the final determinant
//   6. Check if determinant equals zero (indicates a singular matrix)
function solveDeterminant(m) {
    const line = "=".repeat(52);

    // Print problem header and matrix display
    console.log(line);
    console.log("  3x3 MATRIX DETERMINANT SOLVER");
    console.log("  Student: HADAP, CHRISTIAN JORGE A.");
    console.log("  Assigned Matrix:");
    console.log(line);
    printMatrix(m);
    console.log(line);
    console.log();
    console.log("Expanding along Row 1 (cofactor expansion):");
    console.log();

    // ── Step 1: Minor M₁₁ ──
    // Remove row 0 and column 0 from the original matrix.
    // The remaining elements are located at: [1][1], [1][2], [2][1], [2][2]
    const minor11 = computeMinor(m[1][1], m[1][2], m[2][1], m[2][2]);
    const calc11 = `${m[1][1]}×${m[2][2]} - ${m[1][2]}×${m[2][1]} = ${m[1][1] * m[2][2]} - ${m[1][2] * m[2][1]}`;
    console.log(
        `  Step 1 — Minor M₁₁: det([${m[1][1]},${m[1][2]}],[${m[2][1]},${m[2][2]}]) = ` +
        `(${m[1][1]}×${m[2][2]}) - (${m[1][2]}×${m[2][1]}) = ${m[1][1] * m[2][2]} - ${m[1][2] * m[2][1]} = ${minor11}`
    );

    // ── Step 2: Minor M₁₂ ──
    // Remove row 0 and column 1 from the original matrix.
    // The remaining elements are located at: [1][0], [1][2], [2][0], [2][2]
    const minor12 = computeMinor(m[1][0], m[1][2], m[2][0], m[2][2]);
    console.log(
        `  Step 2 — Minor M₁₂: det([${m[1][0]},${m[1][2]}],[${m[2][0]},${m[2][2]}]) = ` +
        `(${m[1][0]}×${m[2][2]}) - (${m[1][2]}×${m[2][0]}) = ${m[1][0] * m[2][2]} - ${m[1][2] * m[2][0]} = ${minor12}`
    );

    // ── Step 3: Minor M₁₃ ──
    // Remove row 0 and column 2 from the original matrix.
    // The remaining elements are located at: [1][0], [1][1], [2][0], [2][1]
    const minor13 = computeMinor(m[1][0], m[1][1], m[2][0], m[2][1]);
    console.log(
        `  Step 3 — Minor M₁₃: det([${m[1][0]},${m[1][1]}],[${m[2][0]},${m[2][1]}]) = ` +
        `(${m[1][0]}×${m[2][1]}) - (${m[1][1]}×${m[2][0]}) = ${m[1][0] * m[2][1]} - ${m[1][1] * m[2][0]} = ${minor13}`
    );

    // ── Cofactor Terms ──
    // Each cofactor is created by multiplying the matrix element by its corresponding minor.
    // The alternating sign pattern (+1, -1, +1) is applied to columns 0, 1, 2 respectively.
    // C₁₁ = m[0][0] × minor11 (positive sign)
    // C₁₂ = -m[0][1] × minor12 (negative sign)
    // C₁₃ = m[0][2] × minor13 (positive sign)
    const c11 =  m[0][0] * minor11;
    const c12 = -m[0][1] * minor12;
    const c13 =  m[0][2] * minor13;

    console.log();
    console.log(`  Cofactor C₁₁ = (+1) × ${m[0][0]} × ${minor11} = ${c11}`);
    console.log(`  Cofactor C₁₂ = (-1) × ${m[0][1]} × ${minor12} = ${c12}`);
    console.log(`  Cofactor C₁₃ = (+1) × ${m[0][2]} × ${minor13} = ${c13}`);

    // ── Final Determinant ──
    // Add all three cofactor terms together to obtain the matrix determinant value.
    const det = c11 + c12 + c13;
    console.log();
    console.log(`  det(M) = ${c11} + (${c12}) + ${c13} = ${det}`);
    console.log(line);
    console.log(`  ✓  DETERMINANT = ${det}`);

    // ── Singular Matrix Check ──
    // A determinant of zero indicates the matrix is singular (non-invertible).
    // In this case, print a warning message to alert the user to this mathematical property.
    if (det === 0) {
        console.log("  ⚠ The matrix is SINGULAR — it has no inverse.");
    }
    console.log(line);
}

// ── SECTION 5: Program Entry Point ──────────────────────────────────
// This is the main execution point of the script.
// Call the solveDeterminant function with the student's assigned matrix.
solveDeterminant(matrix);
