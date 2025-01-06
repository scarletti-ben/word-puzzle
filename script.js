// Settings
var debugging = 0;

// Constants
const maxColumn = 5;
const maxRow = 6;

// Declare answer variable to be assigned a value later
var answer;

// Variables
var currentColumn = 1;
var currentRow = 1;
var dictionary = [];
var answers = [];

// Code to run if debugging level is at a certain level
if (debugging > 1) {

    // Override console.log function to show alerts
    console.stdlog = console.log.bind(console); 
    console.log = function(){
        window.alert('Console: ' + arguments[0]);
        console.stdlog.apply(console, arguments);
    }

}

// Asynchronous function to fetch dictionary.txt and populate dictionary list
async function populateDictionary() {
    try {
        const response = await fetch('dictionary.txt');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        dictionary = text.split('\n').map(word => word.trim().toUpperCase());
        console.log("Loaded dictionary.txt");
    } catch (error) {
        console.error('Error loading dictionary:', error);
    }
}

// Asynchronous function to fetch answers.txt and populate answers list
async function populateAnswers() {
    try {
        const response = await fetch('answers.txt');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        answers = text.split('\n').map(word => word.trim().toUpperCase());
        console.log("Loaded answers.txt");
    } catch (error) {
        console.error('Error loading answers:', error);
    }
}

// Function to upgrade a keyboard letter button, ensuring it never downgrades
function upgrade(letter, suggestedState) {
    // Set the data-state attribute to "present" for the matching keyboard-button
    let finalState;
    const container = document.querySelector('.keyboard-container');
    const buttons = container.querySelectorAll('.keyboard-button');
    let keyboardButton = Array.from(buttons).find(button => button.innerText === letter);
    let currentState = keyboardButton.dataset.state;

    if (suggestedState === "correct" || currentState === "correct"){
        finalState = "correct";
    }
    else if (suggestedState === "present" || currentState === "present") {
        finalState = "present";
    }
    else {
        finalState = "absent";
    }
    keyboardButton.setAttribute('data-state', finalState);
}

// Function to check the current guess
function check() {

    // Ensure the asynchronous loading of dictionary has finished
    if (!answer) {
        let message = "Page still loading, answer has not been set yet"
        console.log(message);
        showToast(message)
        answer = dictionary[Math.floor(Math.random() * dictionary.length)];
        return "error";
    }

    const gridRow = document.querySelector(`.grid-row:nth-child(${currentRow})`);
    const gridSquares = gridRow.querySelectorAll('.grid-square');
    const gridArray = Array.from(gridSquares)

    // Get the number of filled squares
    let count = gridArray.filter(element => element.innerText !== "").length;

    // Cancel the check if there are not enough letters
    if (count < maxColumn) {
        let message = "Not enough letters"
        console.log(message);
        showToast(message)
        return "error"
    }

    // Declare guess as a block-level constant and use string join for all letters
    const guess = gridArray.map(element => element.innerText).join('');

    // Cancel the check if the word is not in the dictionary
    if (!dictionary.includes(guess)) {
        let message = `${guess} not in dictionary`
        console.log(message);
        showToast(message)
        return "error"
    }
    else {
        console.log(`The word ${guess} is in the dictionary`);
    }

    // For loop to set data-state for each letter
    gridArray.forEach((gridSquare, index) => {

        // Declare letter as a block-scoped variable
        let letter = gridSquare.innerText

        // Check letters in guess against those in the answer
        if (answer.includes(letter)) {

            console.log(`${letter} is in the answer`)
            
            if (answer[index] === letter) {

                console.log(`${letter} is correct`)

                // Set the data-state attribute to "correct" for the grid-square
                gridSquare.setAttribute('data-state', 'correct');

                // Set the data-state attribute to "correct" for the matching keyboard-button
                upgrade(letter, 'correct')

            } else {

                console.log(`${letter} is present`)

                // Set the data-state attribute to "present" for the grid-square
                gridSquare.setAttribute('data-state', 'present');

                // Set the data-state attribute to "present" for the matching keyboard-button
                upgrade(letter, 'present')

            }

        }
        else {

            console.log(`${letter} is not in the answer`)

            // Set the data-state attribute to "absent" for the grid-square
            gridSquare.setAttribute('data-state', 'absent');

                // Set the data-state attribute to "absent" for the matching keyboard-button
                upgrade(letter, 'absent')

        }
        
    });

    // Disable current present letters if there are more of that letter in the guess than in the answer
    guessSet = new Set(guess);
    console.log(guessSet)
    for (let letter of guessSet) {

        let oversupplyCounter = (guess.split(letter).length - 1) - (answer.split(letter).length - 1);

        console.log(`Oversupply : ${oversupplyCounter}`)

        if (answer.includes(letter)){

            // Iterate over gridArray in reverse
            for (let index = gridArray.length - 1; index >= 0; index--) {
                if (oversupplyCounter < 1) break;
                console.log(letter)
                let gridSquare = gridArray[index];
                if (gridSquare.innerText === letter && gridSquare.dataset.state === "present") {
                    gridSquare.setAttribute('data-state', 'absent');
                    oversupplyCounter--;
                };
            };

        };

    }

    // Send appropriate return code
    if (guess == answer) {
        return "complete"
    }
    else {
        return "continue"
    }

}

// Function to be called in HTML via onclick="pressed(this)" to pass button element as argument
function pressed(button) {

    // Declare buttonValue as a block-scoped constant
    const buttonValue = button.innerText;

    // Find the grid-square for the current row and column (Python equivalent: grid_rows[currentRow][currentColumn])
    const gridSquare = document.querySelector(`.grid-row:nth-child(${currentRow}) .grid-square:nth-child(${currentColumn})`);

    if (buttonValue == "ENTER") {

        let result = check()

        if (result !== "error") {

            // Increment the row and reset the column
            currentRow++;
            currentColumn = 1;

        }

        if (result === "complete") {
            let message = 'Congratulations!'
            console.log(message);
            showToast(message)
            return
        }

    }
    else if (buttonValue.trim() == "") {
        
        // Decrement the column
        if (currentColumn > 1) {
            currentColumn--;
        }

        // Find the grid-square for the current row and column (Python equivalent: grid_rows[currentRow][currentColumn])
        const newGridSquare = document.querySelector(`.grid-row:nth-child(${currentRow}) .grid-square:nth-child(${currentColumn})`);

        
        // Set the data-state attribute to "default" for the new grid-square
        newGridSquare.setAttribute('data-state', 'default');

        // Set the text of the new grid-square to an empty string
        newGridSquare.innerText = "";

    }
    else if (currentColumn <= maxColumn) {

        // Set the text of the grid-square to buttonValue
        gridSquare.innerText = buttonValue;

        // Set the data-state attribute to "active" for the grid-square
        gridSquare.setAttribute('data-state', 'active');

        // Move to the next column
        currentColumn++;

    }
    else {

        console.log(`Cannot add ${buttonValue} to grid`);

    }
    
}

// Toasting function to add a temporary toast message
function showToast(message) {
    console.log("enter")
    const toaster = document.getElementById('toaster');
    toaster.textContent = message;
    toaster.style.visibility = 'visible';

    // Hide toaster after 3 seconds
    setTimeout(() => {
        toaster.style.visibility = 'hidden';
        toaster.textContent = '';
    }, 1200);
}

// Initialisation function to be called when the DOM has loaded
async function init() {

    // Run populateDictionary function to allow access to valid words
    await populateDictionary()

    // Run populateAnswers function to allow access to valid answers
    await populateAnswers()

    console.log(`Length: ${dictionary.length}`)

    // Set the answer as a random word from the answers list
    answer = answers[Math.floor(Math.random() * answers.length)];
    
    if (debugging) {
        answer = 'SHOES'
        answer = 'SHOWN'
        answer = 'SPILT'
        alert(`The answer is ${answer}`)
    }
    
}


// Add listener to call init function when the DOM has loaded
document.addEventListener('DOMContentLoaded', init);
