document.addEventListener("DOMContentLoaded", function () {
    const gpaForm = document.getElementById("gpa-form");
    const coursesList = document.getElementById("courses-list");
    const totalCredits = document.getElementById("total-credits");
    const gpaResult = document.getElementById("gpa");
    const createCoursesBtn = document.getElementById("create-courses");
    const calculateGpaBtn = document.getElementById("calculate-gpa");

    let courses = [];

    const gradePoints = {
        "10": 10, // S
        "9": 9,   // A
        "8": 8,   // B
        "7": 7,   // C
        "6": 6,   // D
        "5": 5    // E
    };

    function updateGPA() {
        let totalCreditPoints = 0;
        let totalCreditsValue = 0;

        courses.forEach(course => {
            totalCreditPoints += course.credits * gradePoints[course.grade.toString()];
            totalCreditsValue += parseFloat(course.credits);
        });

        const calculatedGPA = (totalCreditPoints / totalCreditsValue).toFixed(2);
        totalCredits.textContent = totalCreditsValue;
        gpaResult.textContent = calculatedGPA;

        // Store courses data in localStorage
        localStorage.setItem("savedCourses", JSON.stringify(courses));
    }

    createCoursesBtn.addEventListener("click", function () {
        const numCoursesInput = document.getElementById("num-courses");
        const numCourses = parseInt(numCoursesInput.value);

        if (!isNaN(numCourses) && numCourses > 0) {
            courses = [];
            coursesList.innerHTML = "";

            for (let i = 0; i < numCourses; i++) {
                const courseForm = document.createElement("div");
                courseForm.className = "course-form";
                courseForm.innerHTML = `
                    <p class="course-label">Course ${i + 1}</p>
                    <label for="course-credits-${i}">Credits:</label>
                    <input type="number" id="course-credits-${i}" min="1" step="0.5" required>
                    <label for="course-grade-${i}">Grade:</label>
                    <select id="course-grade-${i}" required>
                        <option value="10">S</option>
                        <option value="9">A</option>
                        <option value="8">B</option>
                        <option value="7">C</option>
                        <option value="6">D</option>
                        <option value="5">E</option>
                    </select>
                `;
                coursesList.appendChild(courseForm);
            }
        }
    });

    calculateGpaBtn.addEventListener("click", function () {
        courses = [];
        const courseForms = document.querySelectorAll(".course-form");

        courseForms.forEach((courseForm, index) => {
            const creditsInput = courseForm.querySelector("input[type='number']");
            const gradeSelect = courseForm.querySelector("select");

            const credits = parseFloat(creditsInput.value);
            const grade = parseInt(gradeSelect.value);

            courses.push({ credits, grade });
        });

        updateGPA();
    });

    // Retrieve stored courses data on page load
    const savedCourses = localStorage.getItem("savedCourses");
    if (savedCourses) {
        courses = JSON.parse(savedCourses);
        courses.forEach((course, index) => {
            const courseForm = document.createElement("div");
            courseForm.className = "course-form";
            courseForm.innerHTML = `
                <p class="course-label">Course ${index + 1}</p>
                <label for="course-credits-${index}">Credits:</label>
                <input type="number" id="course-credits-${index}" min="1" step="0.5" value="${course.credits}" required>
                <label for="course-grade-${index}">Grade:</label>
                <select id="course-grade-${index}" required>
                    <option value="10">S</option>
                    <option value="9">A</option>
                    <option value="8">B</option>
                    <option value="7">C</option>
                    <option value="6">D</option>
                    <option value="5">E</option>
                </select>
            `;
            coursesList.appendChild(courseForm);
            const gradeSelect = courseForm.querySelector(`#course-grade-${index}`);
            gradeSelect.value = course.grade.toString();
        });
        updateGPA();
    }
});
