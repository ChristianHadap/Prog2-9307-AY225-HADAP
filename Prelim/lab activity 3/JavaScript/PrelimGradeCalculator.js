const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise(resolve => {
        rl.question(question, answer => {
            const num = parseFloat(answer);
            if (isNaN(num)) {
                resolve(NaN);
            } else {
                resolve(num);
            }
        });
    });
}

async function getValidAbsences() {
    while (true) {
        const absences = await askQuestion("Enter number of absences: ");
        if (isNaN(absences)) {
            console.log("ERROR: Invalid input. Please enter a valid number.");
            continue;
        }
        if (absences < 0 || absences > 4) {
            console.log("ERROR: Absences must be between 0 and 4.");
            continue;
        }
        return absences;
    }
}

async function getValidLabWork(labNumber) {
    while (true) {
        const grade = await askQuestion(`Enter Lab Work ${labNumber} grade: `);
        if (isNaN(grade)) {
            console.log("ERROR: Invalid input. Please enter a valid number.");
            continue;
        }
        if (grade < 0 || grade > 100) {
            console.log("ERROR: Grade must be between 0 and 100.");
            continue;
        }
        return grade;
    }
}

async function main() {
    console.log("========================================");
    console.log("    PRELIM GRADE CALCULATOR");
    console.log("========================================\n");
    
    // Input collection with error handling
    const absences = await getValidAbsences();
    const labWork1 = await getValidLabWork(1);
    const labWork2 = await getValidLabWork(2);
    const labWork3 = await getValidLabWork(3);
    
    // Check for automatic failure due to absences
    if (absences >= 4) {
        console.log("\n========================================");
        console.log("          COMPUTATION RESULTS");
        console.log("========================================\n");
        console.log("AUTOMATIC FAILURE");
        console.log(`  Absences: ${absences} (4 or more absences = automatic failure)`);
        console.log("\n========================================\n");
        rl.close();
        return;
    }
    
    // Calculate Lab Work Average
    const labWorkAverage = (labWork1 + labWork2 + labWork3) / 3;
    
    // Calculate Attendance Score: 100% - (absences × 10)
    const attendanceScore = 100 - (absences * 10);
    
    // Calculate Class Standing = 40% Attendance + 60% Lab Work Average
    const classStanding = (0.40 * attendanceScore) + (0.60 * labWorkAverage);
    
    // Calculate required Prelim Exam scores
    // examScore = (targetGrade - 0.30 * classStanding) / 0.70
    const rawPassingScore = (75 - (0.30 * classStanding)) / 0.70;
    const rawExcellentScore = (100 - (0.30 * classStanding)) / 0.70;
    
    // Display results
    console.log("\n========================================");
    console.log("          COMPUTATION RESULTS");
    console.log("========================================\n");
    
    console.log("ATTENDANCE SCORE:");
    console.log(`  Absences: ${absences}`);
    console.log(`  Attendance Score = 100% - (${absences} * 10) = ${attendanceScore.toFixed(0)}%`);
    
    console.log("\nLAB WORK GRADES:");
    console.log(`  Lab Work 1: ${labWork1.toFixed(0)}`);
    console.log(`  Lab Work 2: ${labWork2.toFixed(0)}`);
    console.log(`  Lab Work 3: ${labWork3.toFixed(0)}`);
    console.log(`  Lab Work Average: ${labWorkAverage.toFixed(0)}`);
    
    console.log("\nCLASS STANDING:");
    console.log(`  (40% Attendance + 60% Lab Work Average)`);
    console.log(`  = (0.40 * ${attendanceScore.toFixed(0)}) + (0.60 * ${labWorkAverage.toFixed(0)})`);
    console.log(`  = ${classStanding.toFixed(0)}`);
    
    console.log("\nREQUIRED PRELIM EXAM SCORE TO:");
    console.log("\nFormula: examScore = (targetGrade - 0.30 * classStanding) / 0.70");
    
    if (rawPassingScore > 100) {
        console.log("\n  To PASS (75):");
        console.log(`  = (75 - 0.30 * ${classStanding.toFixed(0)}) / 0.70`);
        console.log(`  = (75 - ${(0.30 * classStanding).toFixed(0)}) / 0.70`);
        console.log(`  = ${(75 - (0.30 * classStanding)).toFixed(0)} / 0.70`);
        console.log(`  = ${rawPassingScore.toFixed(0)} (NOT POSSIBLE - requires > 100)`);
    } else if (rawPassingScore < 0) {
        console.log(`  PASS (75): 0 (Already passing with current standing)`);
    } else {
        console.log("\n  To PASS (75):");
        console.log(`  = (75 - 0.30 * ${classStanding.toFixed(0)}) / 0.70`);
        console.log(`  = (75 - ${(0.30 * classStanding).toFixed(0)}) / 0.70`);
        console.log(`  = ${(75 - (0.30 * classStanding)).toFixed(0)} / 0.70`);
        console.log(`  = ${rawPassingScore.toFixed(0)}`);
    }
    
    if (rawExcellentScore > 100) {
        console.log("\n  To EXCEL (100):");
        console.log(`  = (100 - 0.30 * ${classStanding.toFixed(0)}) / 0.70`);
        console.log(`  = (100 - ${(0.30 * classStanding).toFixed(0)}) / 0.70`);
        console.log(`  = ${(100 - (0.30 * classStanding)).toFixed(0)} / 0.70`);
        console.log(`  = ${rawExcellentScore.toFixed(0)} (NOT POSSIBLE - requires > 100)`);
    } else if (rawExcellentScore < 0) {
        console.log(`  EXCEL (100): 0 (Already excellent with current standing)`);
    } else {
        console.log("\n  To EXCEL (100):");
        console.log(`  = (100 - 0.30 * ${classStanding.toFixed(0)}) / 0.70`);
        console.log(`  = (100 - ${(0.30 * classStanding).toFixed(0)}) / 0.70`);
        console.log(`  = ${(100 - (0.30 * classStanding)).toFixed(0)} / 0.70`);
        console.log(`  = ${rawExcellentScore.toFixed(0)}`);
    }
    
    console.log("\n========================================");
    console.log("            REMARKS");
    console.log("========================================\n");
    
    if (rawPassingScore > 100) {
        console.log("CRITICAL: Even with a perfect Prelim Exam score (100),");
        console.log("  you cannot achieve a passing grade of 75.");
        console.log("  Your current Class Standing is too low.");
    } else if (rawPassingScore <= 0) {
        console.log("EXCELLENT NEWS!");
        console.log("  You are already guaranteed to pass the Prelim period");
        console.log("  with your current Class Standing alone!");
        
        if (rawExcellentScore <= 0) {
            console.log("  You are also already guaranteed an Excellent grade (100)!");
        } else if (rawExcellentScore <= 100) {
            console.log(`  You can achieve an Excellent grade with ${rawExcellentScore.toFixed(0)} in the Prelim Exam.`);
        }
    } else {
        console.log("You can achieve a passing grade.");
        console.log(`  Required Prelim Exam Score: ${rawPassingScore.toFixed(0)}`);
        
        if (rawExcellentScore <= 0) {
            console.log("  You are already guaranteed an Excellent grade (100)!");
        } else if (rawExcellentScore <= 100) {
            console.log(`  An excellent grade is achievable with ${rawExcellentScore.toFixed(0)} in the Prelim Exam.`);
        } else {
            console.log("  To achieve an Excellent grade (100), you would need more than 100");
            console.log("  in the Prelim Exam, which is not possible.");
        }
    }
    
    rl.close();
}

main();
