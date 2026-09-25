// 1. SELECT EXISTING DOM ELEMENTS
const workoutForm = document.getElementById('workout-form');
const exerciseInput = document.getElementById('exercise');
const weightInput = document.getElementById('weight');
const repsInput = document.getElementById('reps');
const workoutList = document.getElementById('workout-list');

const totalCountEl = document.getElementById('total-count');
const totalWeightEl = document.getElementById('total-weight');

// 2. INITIALIZE GLOBAL STATE (Load from localStorage if available, else start empty)
let workoutsArray = JSON.parse(localStorage.getItem('savedWorkouts')) || [];

// 3. CORE FUNCTION: CALCULATE AND UPDATE STATS
function updateStatsDashboard() {
    // Calculate total count
    const totalCount = workoutsArray.length;
    
    // Calculate cumulative weight using JavaScript reduce method
    const totalWeight = workoutsArray.reduce((accumulator, currentWorkout) => {
        return accumulator + (Number(currentWorkout.weight) * Number(currentWorkout.reps));
    }, 0);

    // Inject updated text calculations back into the DOM strings
    totalCountEl.textContent = totalCount;
    totalWeightEl.textContent = `${totalWeight} kg`;
}

// 4. CORE FUNCTION: RENDER TABLE ITEMS ON THE SCREEN
function renderWorkoutsTable() {
    // Clear out the table contents to prevent duplicate UI rendering
    workoutList.innerHTML = '';

    // Loop through the array data items and map them into HTML strings
    workoutsArray.forEach((workoutItem, index) => {
        const tableRow = document.createElement('tr');

        tableRow.innerHTML = `
            <td><strong>${workoutItem.name}</strong></td>
            <td>${workoutItem.weight} kg</td>
            <td>${workoutItem.reps}</td>
            <td><button class="btn-delete" onclick="deleteWorkoutEntry(${index})">Delete</button></td>
        `;

        workoutList.appendChild(tableRow);
    });

    // Keep synchronization running smoothly
    updateStatsDashboard();
    localStorage.setItem('savedWorkouts', JSON.stringify(workoutsArray));
}

// 5. EVENT HANDLER: SUBMIT FORM AND LOG OBJECT
workoutForm.addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page from refreshing automatically

    // Build the clean schema payload object
    const newWorkoutObj = {
        name: exerciseInput.value.trim(),
        weight: weightInput.value,
        reps: repsInput.value
    };

    // Push new payload entry into global tracking state array
    workoutsArray.push(newWorkoutObj);

    // Re-render UI views dynamically
    renderWorkoutsTable();

    // Reset input fields cleanly
    workoutForm.reset();
    exerciseInput.focus();
});

// 6. ACTION HANDLER: REMOVE AN ELEMENT FROM THE STATE
window.deleteWorkoutEntry = function(targetIndex) {
    // Splice array item out completely by its unique targeted index key
    workoutsArray.splice(targetIndex, 1);
    
    // Refresh DOM engine synchronization
    renderWorkoutsTable();
};

// 7. INITIAL BOOT ENGINE RUN ON LOAD
renderWorkoutsTable();