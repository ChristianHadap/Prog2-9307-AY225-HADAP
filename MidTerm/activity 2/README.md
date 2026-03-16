# 3×3 Matrix Determinant Solver - Programming Assignment 1

## Assignment Information

| Field | Details |
|-------|---------|
| **Student Name** | HADAP, CHRISTIAN JORGE A. |
| **Student ID** | 19 |
| **Course** | Programming 2 (PROG2) |
| **School** | University of Perpetual Help System DALTA, Molino Campus |
| **Assignment** | Labwork 2 - 3×3 Matrix Determinant Solver |
| **Date Completed** | March 16, 2026 |
| **Repository** | https://github.com/ChristianHadap/Prog2-9307-AY225-HADAP |

---

## Assigned Matrix

The following 3×3 matrix has been assigned to this student:

```
┌           ┐
│  2   4  3 │
│  5   1  6 │
│  3   2  4 │
└           ┘
```

**Determinant Value:** `-3` (negative, non-singular matrix with inverse)

---

## How to Run Both Programs

### Prerequisites
- **Java:** JDK 8 or later installed
- **JavaScript:** Node.js installed

### Step 1: Running the Java Program

Navigate to the `java` folder and compile/execute:

```bash
cd activity 2/java
javac DeterminantSolver.java
java DeterminantSolver
```

### Step 2: Running the JavaScript Program

Navigate to the `js` folder and execute with Node.js:

```bash
cd activity 2/js
node determinant_solver.js
```

---

## File Structure

```
activity 2/
├── java/
│   └── DeterminantSolver.java       (Java implementation)
├── js/
│   └── determinant_solver.js        (JavaScript implementation)
└── README.md                        (This file)
```

---

## Implementation Details

### Cofactor Expansion Formula

Both programs implement cofactor expansion along the first row:

```
det(M) = M[0][0]·(M[1][1]·M[2][2] − M[1][2]·M[2][1]) 
       − M[0][1]·(M[1][0]·M[2][2] − M[1][2]·M[2][0]) 
       + M[0][2]·(M[1][0]·M[2][1] − M[1][1]·M[2][0])
```

### Methods Implemented

**Java (`DeterminantSolver.java`):**
- `computeMinor(int a, int b, int c, int d)` - Calculates 2×2 determinant
- `printMatrix(int[][] m)` - Displays matrix in formatted output
- `solveDeterminant(int[][] m)` - Main solver with step-by-step computation
- `main(String[] args)` - Program entry point

**JavaScript (`determinant_solver.js`):**
- `computeMinor(a, b, c, d)` - Calculates 2×2 determinant
- `printMatrix(m)` - Displays matrix in formatted output
- `solveDeterminant(m)` - Main solver with step-by-step computation

### Key Features

✓ **Hardcoded Matrix** - Matrix is fixed for this student (no user input)  
✓ **Step-by-Step Output** - All three 2×2 minors computed and displayed separately  
✓ **Cofactor Terms** - Each signed cofactor (+1 or -1) shown with calculation  
✓ **Final Determinant** - Clear display of final result  
✓ **Singular Matrix Check** - Detects and warns if determinant = 0  
✓ **Complete Documentation** - Header blocks and inline comments throughout

---

## Sample Output - Expected Results

### Java Program Output

When you run `java DeterminantSolver` from the `java/` folder, you will see:

```
====================================================
  3x3 MATRIX DETERMINANT SOLVER
  Student: HADAP, CHRISTIAN JORGE A.
  Assigned Matrix:
====================================================
[                  ]
|   2   4   3  |
|   5   1   6  |
|   3   2   4  |
[                  ]
====================================================

Expanding along Row 1 (cofactor expansion):

  Step 1 - Minor M11: det([1,6],[2,4]) = (1*4)-(6*2) = 4 - 12 = -8
  Step 2 - Minor M12: det([5,6],[3,4]) = (5*4)-(6*3) = 20 - 18 = 2
  Step 3 - Minor M13: det([5,1],[3,2]) = (5*2)-(1*3) = 10 - 3 = 7

  Cofactor C11 = (+1) * 2 * -8 = -16
  Cofactor C12 = (-1) * 4 * 2 = -8
  Cofactor C13 = (+1) * 3 * 7 = 21

  det(M) = -16 + (-8) + 21 = -3
====================================================
  DETERMINANT = -3
====================================================
```

### JavaScript Program Output

When you run `node determinant_solver.js` from the `js/` folder, you will see:

```
====================================================
  3x3 MATRIX DETERMINANT SOLVER
  Student: HADAP, CHRISTIAN JORGE A.
  Assigned Matrix:
====================================================
┌               ┐
│   2    4    3  │
│   5    1    6  │
│   3    2    4  │
└               ┘
====================================================

Expanding along Row 1 (cofactor expansion):

  Step 1 — Minor M₁₁: det([1,6],[2,4]) = (1×4) - (6×2) = 4 - 12 = -8
  Step 2 — Minor M₁₂: det([5,6],[3,4]) = (5×4) - (6×3) = 20 - 18 = 2
  Step 3 — Minor M₁₃: det([5,1],[3,2]) = (5×2) - (1×3) = 10 - 3 = 7

  Cofactor C₁₁ = (+1) × 2 × -8 = -16
  Cofactor C₁₂ = (-1) × 4 × 2 = -8
  Cofactor C₁₃ = (+1) × 3 × 7 = 21

  det(M) = -16 + (-8) + 21 = -3
====================================================
  ✓  DETERMINANT = -3
====================================================
```

---

## Verification of Results

Both programs produce **identical mathematical results:**

| Metric | Result |
|--------|--------|
| **Minor M₁₁** | -8 |
| **Minor M₁₂** | 2 |
| **Minor M₁₃** | 7 |
| **Cofactor C₁₁** | -16 |
| **Cofactor C₁₂** | -8 |
| **Cofactor C₁₃** | 21 |
| **Final Determinant** | **-3** ✓ |

### Calculation Verification

```
det(M) = C₁₁ + C₁₂ + C₁₃
det(M) = (-16) + (-8) + (21)
det(M) = -24 + 21
det(M) = -3 ✓
```

---

## Program Features & Compliance

### Code Documentation
✓ Student header block with name, ID, course, school, date, and GitHub URL  
✓ Inline comments explaining each major section in student's own words  
✓ Clear method/function documentation  

### Mathematical Implementation
✓ Cofactor expansion along first row (hardcoded, no user input)  
✓ Step-by-step output shows all three 2×2 minors  
✓ Each cofactor term calculated and displayed with signs  
✓ Final determinant computed as sum of cofactors  

### Language Compliance
✓ Java: Public class `DeterminantSolver` with required methods  
✓ JavaScript: Modular functions, Node.js compatible  
✓ Both produce identical determinant values  

### Singular Matrix Handling
For this assignment, det(M) = -3 (non-zero)  
- Matrix is **non-singular** (has an inverse)
- Singular matrix detection code is present but not triggered
- If det = 0, both programs print warning message

---

## Testing Instructions for Professor

To verify both implementations work correctly:

**Test Java:**
```powershell
cd java
javac DeterminantSolver.java
java DeterminantSolver
# Expected output: DETERMINANT = -3
```

**Test JavaScript:**
```powershell
cd js
node determinant_solver.js
# Expected output: DETERMINANT = -3
```

Both should display the same mathematical result: **-3**
