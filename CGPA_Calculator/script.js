let semesterCounter = 0;

function addSemesters() {
    const totalSemestersInput = document.getElementById("totalSemesters");
    const semesterFieldsDiv = document.getElementById("semesterFields");
    const totalSemesters = parseInt(totalSemestersInput.value);


    if (totalSemestersInput.value === "") {
        // Skip validation if the input value is empty
        return;
    }
    
    if (isNaN(totalSemesters) || totalSemesters <= 0) {
        alert("Please enter a valid number of semesters.");
        return;
    }

    semesterFieldsDiv.innerHTML = ""; // Clear existing fields
    semesterCounter = totalSemesters;

    for (let i = 1; i <= totalSemesters; i++) {
        const semesterField = document.createElement("div");
        semesterField.className = "semester-field";

        const semesterLabel = document.createElement("label");
        semesterLabel.textContent = `Semester ${i}:`;
        semesterLabel.for = `semester-${i}`;
        semesterField.appendChild(semesterLabel);

        const creditsInput = document.createElement("input");
        creditsInput.type = "number";
        creditsInput.id = `semester-${i}-credits`;
        creditsInput.step = "0.5";
        creditsInput.min = "1";
        creditsInput.required = true;
        creditsInput.placeholder = "Credits";
        semesterField.appendChild(creditsInput);

        const gpaInput = document.createElement("input");
        gpaInput.type = "number";
        gpaInput.step = "0.01";
        gpaInput.id = `semester-${i}-gpa`;
        gpaInput.min = "0";
        gpaInput.max = "10";
        gpaInput.required = true;
        gpaInput.placeholder = "GPA";
        semesterField.appendChild(gpaInput);

        creditsInput.addEventListener("keydown", function (event) {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault(); // Prevent the default behavior of arrow keys
                const currentValue = parseFloat(creditsInput.value) || 1; // Default to 1 if input is not a number
                let newValue;

                if (event.key === "ArrowUp") {
                    newValue = currentValue + 0.5;
                } else if (event.key === "ArrowDown") {
                    newValue = currentValue - 0.5;
                }

                // Restrict the value to the range [1, 27]
                newValue = Math.min(27, Math.max(1, newValue));
                creditsInput.value = newValue.toFixed(1);
            }
        });
        semesterFieldsDiv.appendChild(semesterField);
    }
}

function calculateCGPA() {
    const resultDiv = document.getElementById("result");
    let totalCredits = 0;
    let totalWeightedGPA = 0;
    const semesterData = [];

    for (let i = 1; i <= semesterCounter; i++) {
        const creditsInput = document.getElementById(`semester-${i}-credits`);
        const gpaInput = document.getElementById(`semester-${i}-gpa`);
        
        const credits = parseFloat(creditsInput.value);
        const gpa = parseFloat(gpaInput.value);

        if (isNaN(credits) || isNaN(gpa)) {
            resultDiv.innerHTML = "<p>Please enter valid values for all fields.</p>";
            return;
        }

        totalCredits += credits;
        totalWeightedGPA += gpa * credits;

        semesterData.push({ credits, gpa });
    }

    const cgpa = totalWeightedGPA / totalCredits;
    resultDiv.innerHTML = `<p>Your CGPA is: ${cgpa.toFixed(2)}</p>`;

    localStorage.setItem("cgpa", cgpa.toFixed(2));

    // Save semester data to local storage
    localStorage.setItem("semesterData", JSON.stringify(semesterData));
    localStorage.setItem("totalSemesters", semesterCounter);
}

function resetForm() {
    const totalSemestersInput = document.getElementById("totalSemesters");
    const semesterFieldsDiv = document.getElementById("semesterFields");
    const resultDiv = document.getElementById("result");

    totalSemestersInput.value = "";
    semesterFieldsDiv.innerHTML = "";
    resultDiv.innerHTML = "";

    semesterCounter = 0;

    // Clear local storage
    localStorage.removeItem("semesterData");
    localStorage.removeItem("totalSemesters");
    localStorage.removeItem("cgpa");
}

window.addEventListener("load", function () {
    const totalSemestersInput = document.getElementById("totalSemesters");
    const semesterFieldsDiv = document.getElementById("semesterFields");
    const resultDiv = document.getElementById("result");

    const semesterDataJSON = localStorage.getItem("semesterData");
    const savedTotalSemesters = localStorage.getItem("totalSemesters");
    const savedCGPA = localStorage.getItem("cgpa");

    if (semesterDataJSON && savedTotalSemesters) {
        totalSemestersInput.value = savedTotalSemesters;
        addSemesters();

        const semesterData = JSON.parse(semesterDataJSON);
        for (let i = 0; i < semesterData.length; i++) {
            const creditsInput = document.getElementById(`semester-${i + 1}-credits`);
            const gpaInput = document.getElementById(`semester-${i + 1}-gpa`);
            creditsInput.value = semesterData[i].credits;
            gpaInput.value = semesterData[i].gpa;
        }
    }

    if (savedCGPA) {
        resultDiv.innerHTML = `<p>Your CGPA is: ${savedCGPA}</p>`;
    }
});

// ... Your existing code ...

document.addEventListener("DOMContentLoaded", function () {
    // ... Your existing code ...

    const numCoursesInput = document.getElementById("num-courses");

    // Retrieve stored courses data on page load
    const savedCourses = localStorage.getItem("savedCourses");
    if (savedCourses) {
        courses = JSON.parse(savedCourses);

        // Simulate a click on the "create-courses" button to populate course forms
        createCoursesBtn.click();
        
        courses.forEach((course, index) => {
            const courseForm = coursesList.querySelector(`.course-form:nth-child(${index + 1})`);
            if (courseForm) {
                const creditsInput = courseForm.querySelector("input[type='number']");
                const gradeSelect = courseForm.querySelector("select");
                
                creditsInput.value = course.credits;
                gradeSelect.value = course.grade.toString();
            }
        });

        updateGPA();
    }
});

// ... Your existing code ...
