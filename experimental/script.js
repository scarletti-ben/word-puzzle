// Settings
var debugging = 0;

// Constants
const maxColumn = 5;
const maxRow = 6;

// Declare answer variable to be assigned a value later
var answer = "";

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const letterStates = {};
for (const letter of alphabet) {
  letterStates[letter] = "default";
}

// Variables
var currentColumn = 1;
var currentRow = 1;

var gameStatus = 0;

// Code to run if debugging level is at a certain level
if (debugging > 1) {

    // Override console.log function to show alerts
    console.stdlog = console.log.bind(console); 
    console.log = function(){
        window.alert('Console: ' + arguments[0]);
        console.stdlog.apply(console, arguments);
    }

}

// Go normal
function goNormal() {
    showToast("Returning to normal...")
    setTimeout(() => {
        
        var link = "/";
        var url = window.location.origin;
        if (url.includes("github.io")) {
            const path = window.location.pathname.split('/')[1];
            link += path
        }
        window.location.href = link
          
    }, 1000);
}

function specialAction () {
    if (debugging) {
        let ids = ["debug-outlines"]

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

//
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

// Function to upgrade a keyboard letter button, ensuring it never downgrades
function upgrade(letter, suggestedState) {
    // Set the data-state attribute to "present" for the matching key
    const container = document.querySelector('#keyboard');
    const buttons = container.querySelectorAll('.key');
    let keyboardButton = Array.from(buttons).find(button => button.innerText === letter);
    let currentState = keyboardButton.dataset.state;

    let finalState = determineFinalState(suggestedState, currentState);
    console.log(`Suggested ${suggestedState} / Current ${currentState} / Final ${finalState}`)

    keyboardButton.setAttribute('data-state', finalState);
    letterStates[letter] = finalState
    console.log(letterStates)
}

// Function to check the current guess
function check() {

    const gridRow = document.querySelector(`#grid .row:nth-child(${currentRow})`);
    const gridSquares = gridRow.querySelectorAll('#grid .row .square');
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

// Reload the page
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

// Show answer as an alert / toast
function showAnswer() {
    let message = `The answer is ${answer}`
    showToast(message)

    let defaults = Object.keys(letterStates).filter(key => letterStates[key] === "default");
    let valid = defaults.filter(letter => answer.includes(letter));
    for (const letter of valid) {
        upgrade(letter, "hinted")
    }
    
}

// Get a hint by altering a keyboard button state
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
    const gridSquare = document.querySelector(`#grid .row:nth-child(${currentRow}) .square:nth-child(${currentColumn})`);

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
        const newGridSquare = document.querySelector(`#grid .row:nth-child(${currentRow}) .square:nth-child(${currentColumn})`);

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

    // Postit
    // Only works in Chrome on Android :D
    if ("vibrate" in navigator) {
      // Trigger a short vibration (in milliseconds)
      navigator.vibrate(200);  // 200ms vibration
    }

}

// Toggle scrollbar for an HTML element
function toggleScrollbar (id) {

    const element = document.getElementById(id);
    element.classList.toggle('hidden-scrollbar');

}

// Function to return certain element dimensions as a single string
function getValues() {

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    var message = `Viewport: ${viewportWidth.toFixed(1)}x${viewportHeight.toFixed(1)}`;

    function addElement(id) {
        var element = document.getElementById(id);
        var rect = element.getBoundingClientRect();
        var w = rect.width
        var h = rect.height
        var w2 = (w / viewportWidth).toFixed(2)
        var h2 = (h / viewportHeight).toFixed(2)
        message += `\n${id}: ${w.toFixed(1)}x${h.toFixed(1)} => [~${w2}vw, ~${h2}vh]`;
    }

    addElement('outer')
    addElement('top')
    addElement('bottom')
    addElement('keyboard')
    addElement('grid')

    return message

}


// Initialisation function to be called when the DOM has loaded
async function init() {

    const keys = document.querySelectorAll('#keyboard .row .key');
    for (const key of keys) {
        key.onclick = function() {
            pressed(key);
        };
    }

    document.addEventListener('keydown', function(event) {
        
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
            const alphaKeys = document.querySelectorAll('#keyboard .row .key');
            const letterKey = Array.from(alphaKeys).find(key => key.innerText === letter);
            pressed(letterKey)
        }

    });
    
    // Clear answer so it doesn't come from main site accidentally
    answer = "";
    for (let i = 0; i < 5; i++) {
        const randomIndex = Math.floor(Math.random() * alphabet.length);
        answer += alphabet[randomIndex];
    }
    // alert(`Answer: ${answer}`)

    document.addEventListener('keydown', function (event) {
    
        var prevent = true;
    
        if (event.key === 'F1') {
            var message = getValues()
            alert(message);
        }
        else if (event.key === 'F2'){
            toggleDebugOutlines()
        }
        else if (event.key === 'F3'){
            toggleScrollbar('outer')
        }
        else if (event.key === 'F4'){
            toggleScrollbar('bottom')
        }
        else {
            prevent = false
        }
    
        if (prevent === true) {
            event.preventDefault()
        }

    });

}

// Add listener to call init function when the DOM has loaded
document.addEventListener('DOMContentLoaded', init);