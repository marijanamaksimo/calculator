// Calculator state
let currentResult = 0;
let currentInput = 0;
let currentOperation = null;

// DOM elements
const numberInput = document.getElementById('number-input');
const currentCalculation = document.getElementById('current-calculation');
const currentResultDisplay = document.getElementById('current-result');
const operationButtons = {
  add: document.getElementById('btn-add'),
  subtract: document.getElementById('btn-subtract'),
  multiply: document.getElementById('btn-multiply'),
  divide: document.getElementById('btn-divide')
};

// Error handling
function handleError(message) {
  currentResultDisplay.textContent = message;
  currentResultDisplay.classList.add('error');
  setTimeout(() => {
    currentResultDisplay.classList.remove('error');
    resetCalculator();
  }, 2000);
}

function resetCalculator() {
  currentResult = 0;
  currentInput = 0;
  currentOperation = null;
  numberInput.value = '';
  currentCalculation.textContent = '0';
  currentResultDisplay.textContent = '0';
}

// Operation functions
function performOperation() {
  const inputValue = parseFloat(numberInput.value);
  
  if (isNaN(inputValue)) {
    handleError('Invalid input');
    return;
  }

  switch(currentOperation) {
    case 'add':
      currentResult += inputValue;
      break;
    case 'subtract':
      currentResult -= inputValue;
      break;
    case 'multiply':
      currentResult *= inputValue;
      break;
    case 'divide':
      if (inputValue === 0) {
        handleError('Cannot divide by zero');
        return;
      }
      currentResult /= inputValue;
      break;
    default:
      currentResult = inputValue;
  }

  currentResultDisplay.textContent = currentResult;
  numberInput.value = '';
}

// Event listeners
Object.entries(operationButtons).forEach(([operation, button]) => {
  button.addEventListener('click', () => {
    currentOperation = operation;
    performOperation();
  });
});

// Keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    performOperation();
  }
  // Add more key mappings as needed
});

// Initialize calculator
resetCalculator();
