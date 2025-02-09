// Constants
var DEBUG_LEVEL = 0;
const maxColumn = 5;
const maxRow = 6;
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Variables
var currentColumn = 1;
var currentRow = 1;
var gameStatus = 0;
var inModal = false;

// Declarations
var answer;

// Core Objects
var dictionary = [];
var answers = [];
const letterStates = {};
for (const letter of alphabet) {
  letterStates[letter] = "default";
}

// Code to run depending on the value of DEBUG_LEVEL
if (DEBUG_LEVEL > 1) {

}

// Show debugging buttons if DEBUG_LEVEL is not 0
function showDebugButtons () {
    if (DEBUG_LEVEL) {
        let ids = ["debug-outlines", "debug-dictionary", "debug-answers"]

        for (const id of ids) {
            let element = document.getElementById(id);
            if (element.style.display === "none") {
                element.style.display = 'flex'
            }
            else {
                element.style.display = 'none'
            }
        }

    }
    else {
        showToast("Only in Debug Mode!")
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

// Function to return determined state of a keyboard button, ensuring no downgrades
function determineFinalState(suggestedState, currentState) {
    let possibleStates = [
        "correct",
        "present",
        "hinted",
        "absent",
        "default"
    ]
    const currentStateIndex = possibleStates.indexOf(currentState);
    const suggestedStateIndex = possibleStates.indexOf(suggestedState); 
    return possibleStates[Math.min(currentStateIndex, suggestedStateIndex)];
}

// Function to upgrade a keyboard letter button, ensuring no downgrades
function upgrade(letter, suggestedState) {

    // Set the data-state attribute to "present" for the matching key
    const container = document.querySelector('.keyboard');
    const buttons = container.querySelectorAll('.key');
    let keyboardButton = Array.from(buttons).find(button => button.innerText === letter);
    let currentState = keyboardButton.dataset.state;

    let finalState = determineFinalState(suggestedState, currentState);
    console.log(`Suggested ${suggestedState} / Current ${currentState} / Final ${finalState}`)

    keyboardButton.setAttribute('data-state', finalState);
    letterStates[letter] = finalState
    console.log(letterStates)

}

// Function to check the submitted guess, and change grid and keyboard colours accordingly
function check() {

    // Dictionary loaded check
    if (dictionary.length == 0) {
        let message = "Dictionary not loaded (CORS)"
        console.log(message);
        showToast(message)
        return "error"
    }

    // Ensure the asynchronous loading of dictionary has finished
    if (!answer) {
        let message = "Page still loading, answer has not been set yet"
        console.log(message);
        showToast(message)
        answer = dictionary[Math.floor(Math.random() * dictionary.length)];
        return "error";
    }

    const gridRow = document.querySelector(`.grid .row:nth-child(${currentRow})`);
    const gridSquares = gridRow.querySelectorAll('.grid .row .square');
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

                // Set the data-state attribute to "correct" for the matching key
                upgrade(letter, 'correct')

            } else {

                console.log(`${letter} is present`)

                // Set the data-state attribute to "present" for the grid-square
                gridSquare.setAttribute('data-state', 'present');

                // Set the data-state attribute to "present" for the matching key
                upgrade(letter, 'present')

            }

        }
        else {

            console.log(`${letter} is not in the answer`)

            // Set the data-state attribute to "absent" for the grid-square
            gridSquare.setAttribute('data-state', 'absent');

                // Set the data-state attribute to "absent" for the matching key
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
    else if (currentRow < maxRow) {
        return "continue"
    }
    else {
        return "incomplete"
    }

}

// Show message and go to the experimental version of the site, at experimental/index.html
function goExperimental() {
    showToast("Going experimental...")
    setTimeout(() => {
        window.location.href = 'experimental';
    }, 1000);
}

// Show message and reload the page
function reloadPage() {
    showToast("Generating new answer...")
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

// Reload the page and clear cache, if possible
function reloadPageHard() {
    window.location.reload(true)
}

// Show answer within a timed toaster
function showAnswer() {
    let message = `The answer is ${answer}`
    showToast(message)

    let defaults = Object.keys(letterStates).filter(key => letterStates[key] === "default");
    let valid = defaults.filter(letter => answer.includes(letter));
    for (const letter of valid) {
        upgrade(letter, "hinted")
    }
    
}

// Get a hint and alter a keyboard button data-state to "hinted", if possible
function getHint() {
    let message = "error"
    let defaults = Object.keys(letterStates).filter(key => letterStates[key] === "default");
    let valid = defaults.filter(letter => answer.includes(letter));
    if (valid) {
        let choice = valid[Math.floor(Math.random() * valid.length)]
        if (choice) {
            message = `${choice} is in the answer!`
            upgrade(choice, "hinted")
        }
        else {
            message = "No more possible hints!"
        }
    }
    showToast(message)
}

// Function to be called in HTML via onclick="pressed(this)" to pass button element as argument
function pressed(button) {

    if (inModal) {
        return
    }

    if ("vibrate" in navigator) {
        navigator.vibrate(40);
    }
    else {
    }

    if (gameStatus === 1) {
        let message = 'Refresh to Play Again!'
        console.log(message);
        showToast(message);
        return
    }
    else if (gameStatus == 2) {
        let message = `The answer is ${answer}`;
        console.log(message);
        showToast(message);
        return
    }

    // Declare buttonValue as a block-scoped constant
    const buttonValue = button.innerText;

    // Find the grid-square for the current row and column (Python equivalent: grid.rows[currentRow][currentColumn])
    const gridSquare = document.querySelector(`.grid .row:nth-child(${currentRow}) .square:nth-child(${currentColumn})`);

    if (button.classList.contains("return")) {

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
            gameStatus = 1
            return
        }
        else if (result === "incomplete") {
            let message = `The answer is ${answer}`;
            console.log(message);
            showToast(message);
            gameStatus = 2

            let defaults = Object.keys(letterStates).filter(key => letterStates[key] === "default");
            let valid = defaults.filter(letter => answer.includes(letter));
            for (const letter of valid) {
                upgrade(letter, "hinted")
            }

            return
        }

    }
    else if (button.classList.contains("backspace")) {

        // Decrement the column
        if (currentColumn > 1) {
            currentColumn--;
        }

        // Find the grid-square for the current row and column (Python equivalent: grid.rows[currentRow][currentColumn])
        const newGridSquare = document.querySelector(`.grid .row:nth-child(${currentRow}) .square:nth-child(${currentColumn})`);

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

    const toaster = document.getElementById('toaster');
    toaster.textContent = message;
    toaster.style.visibility = 'visible';

    // Hide toaster after 3 seconds
    setTimeout(() => {
        toaster.style.visibility = 'hidden';
        toaster.textContent = '';
    }, 1200);

}

// Toggle debug outlines for HTML elements
function toggleDebugOutlines () {

    var root = document.querySelector(':root');
    var rootStyle = getComputedStyle(root);
    const currentOutline = rootStyle.getPropertyValue('--debug-outline')
    const newOutline = currentOutline === '2px' ? '0px' : '2px';
    root.style.setProperty('--debug-outline', newOutline);

    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }

}

// Toggle scrollbar for an HTML element
function toggleScrollbar (id) {
    const element = document.getElementById(id);
    element.classList.toggle('hidden-scrollbar');
}

// Initialisation function to be called when the DOM has loaded
async function init() {

    const keys = document.querySelectorAll('.keyboard .row .key');
    for (const key of keys) {
        key.onclick = function() {
            pressed(key);
        };
    }

    document.addEventListener('keydown', function(event) {

        if (inModal) {
            return
        }
        
        if (event.key === 'Enter') {
          const returnKey = document.querySelector('.return');
          pressed(returnKey)
        }
        else if (event.key === 'Backspace'){
            const backspaceKey = document.querySelector('.backspace');
            pressed(backspaceKey)
        }
        else if (event.code === `Key${event.key.toUpperCase()}`) {
            let letter = event.key.toUpperCase();
            const alphaKeys = document.querySelectorAll('.keyboard .row .key');
            const letterKey = Array.from(alphaKeys).find(key => key.innerText === letter);
            pressed(letterKey)
        }

    });

    // Run populateDictionary function to allow access to valid words
    await populateDictionary()

    // Run populateAnswers function to allow access to valid answers
    await populateAnswers()

    console.log(`Length: ${dictionary.length}`)

    // Set the answer as a random word from the answers list
    answer = answers[Math.floor(Math.random() * answers.length)];
    
    if (DEBUG_LEVEL > 1) {
        answer = 'SHOES'
        let message = `[DEBUGGING] The answer is ${answer}`
        alert(message)
        showToast(message)
    }

    document.addEventListener('keydown', function (event) {
    
        var prevent = true;
    
        if (event.key === 'F1') {
            toggleDebugOutlines()
        }
        else if (event.key === 'F2'){
            toggleScrollbar('outer')
        }
        else if (event.key === 'F3'){
            toggleScrollbar('bottom')
        }
        else {
            prevent = false
        }
    
        if (prevent === true) {
            event.preventDefault()
        }

    });

    let dialog = document.getElementById("test-dialog");
    dialog.addEventListener('close', function() {
        inModal = false;
    });

    if (DEBUG_LEVEL > 0) {
        localStorage.removeItem('hasVisited');
    }

    let visited = localStorage.getItem('hasVisited');

    if (visited === null) {
        showHelp();
        localStorage.setItem('hasVisited', 'true');
    }

}

// Add listener to call init function when the DOM has loaded
document.addEventListener('DOMContentLoaded', init);

// Shgow help as modal dialog
function showHelp() {
    let dialog = document.getElementById("test-dialog");
    inModal = true;
    dialog.showModal();
}