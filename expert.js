let currentExpression = '';
let difficulty = 'Easy';
let usedDigits = new Set(); 

function generateTargetNumber() {
    let min, max;
    if (difficulty == "Easy") {
        min = 1;
        max = 100;
    }
    else if (difficulty == "Medium"){
        min = 100;
        max = 300;
    }
    else if (difficulty == "Hard"){
        min = 300;
        max = 1000;     
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let targetNumber = generateTargetNumber(); 

function updateTargetDisplay() {
    document.getElementById('challenge').innerText = `Make ${targetNumber}`;
}

function setDifficulty(newDifficulty) {
    usedDigits.clear(); 
    currentExpression = ''; 
    difficulty = newDifficulty;
    targetNumber = generateTargetNumber(); 
    updateTargetDisplay(); 
    document.getElementById('expression').innerText = ''; 
    document.getElementById('result').innerText = ''; 
}

function appendToExpression(char) {
    if (!isNaN(char) && usedDigits.has(char)) {
        alert("Each digit can only be used once.");
        return;
    }

    if (!isNaN(char)) {
        usedDigits.add(char);
    }

    if (currentExpression.trim().length === 0 && (char === '+' || char === '-' || char === '*' || char === '/' || char === '^')) {
        alert("Invalid operator usage.");
        return;
    }

    const lastChar = currentExpression[currentExpression.length - 1];

    if ((lastChar === '+' || lastChar === '-' || lastChar === '*' || lastChar === '/' || lastChar === "^") &&
        (char === '+' || char === '-' || char === '*' || char === '/' || lastChar === "^")) {
        alert("Please use one operator at a time.");
        return;
    }

    currentExpression += char;
    document.getElementById('expression').innerText = currentExpression;
}


function clearExpression() {
    currentExpression = '';
    usedDigits.clear();
    document.getElementById('expression').innerText = '';
    document.getElementById('result').innerText = '';
}

function checkAllDigitsUsedOnce() {
    for (let digit = 1; digit <= 9; digit++) {
        if (!usedDigits.has(digit.toString())) {
            return false; 
        }
    }
    return true; 
}

function deleteLastDigit() {
    if (currentExpression.length > 0) {
        const lastChar = currentExpression[currentExpression.length - 1];
        if (!isNaN(lastChar)) {
            usedDigits.delete(lastChar);
        }
        currentExpression = currentExpression.slice(0, -1);
        document.getElementById('expression').innerText = currentExpression;
    }
}

function checkAnswer() {
    if (!checkAllDigitsUsedOnce()) {
        document.getElementById('result').innerText = "You must use all digits from 1-9 exactly once.";
        return;
    }

    const trimmedExpression = currentExpression.trim();
    const firstChar = trimmedExpression.charAt(0);
    const lastChar = trimmedExpression.charAt(trimmedExpression.length - 1);
    const operators = ['+', '-', '*', '/', '^'];

    if (operators.includes(firstChar) || operators.includes(lastChar)) {
        document.getElementById('result').innerText = "Invalid operator usage.";
        return;
    }

    for (let i = 0; i < trimmedExpression.length - 1; i++) {
        if (operators.includes(trimmedExpression.charAt(i)) && operators.includes(trimmedExpression.charAt(i + 1))) {
            document.getElementById('result').innerText = "Please use one operator at a time.";
            return;
        }
    }

    try {
        const evaluatedResult = math.evaluate(currentExpression);
        document.getElementById('result').innerText = `Your expression evaluates to: ${evaluatedResult}`;
        if (Math.abs(evaluatedResult - targetNumber) < 1e-4) {
            alert(`Correct! Your expression matches the target number: ${evaluatedResult}`);
            clearExpression();
            targetNumber = generateTargetNumber();
            updateTargetDisplay();
        } else {
            alert(`Close! Your expression evaluates to: ${evaluatedResult}, but the target was ${targetNumber}. Try again.`);
        }
    } catch (error) {
        document.getElementById('result').innerText = error;
        console.error("Error evaluating expression:", error);
    }
}


document.addEventListener('DOMContentLoaded', updateTargetDisplay);
document.addEventListener('keydown', handleKeyPress);

function handleKeyPress(event) {
    const key = event.key; 
    if (key >= '0' && key <= '9') {
        appendToExpression(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/' || (event.shiftKey && key === '^')) {
        appendToExpression(key);
    } else if (key === '(') {
        appendToExpression('(');
    } else if (key === ')') {
        appendToExpression(')');
    } else if (key === 'Enter') {
        const lastChar = currentExpression.trim().charAt(currentExpression.trim().length - 1);
        const operators = ['+', '-', '*', '/'];
        if (operators.includes(lastChar)) {
            alert("Invalid operator usage.");
            return;
        }
        checkAnswer();
    } else if (key === 'Backspace') {
        deleteLastDigit();
    } else if (key === 'Delete') {
        clearExpression();
    }
}
