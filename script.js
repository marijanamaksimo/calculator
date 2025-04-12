document.addEventListener('DOMContentLoaded', function() {
  const display = document.getElementById('display');
  const buttons = document.querySelectorAll('.button');
  
  let displayValue = '0';
  let firstOperand = null;
  let operator = null;
  let waitingForSecondOperand = false;
  
  // Format display with commas for thousands
  function formatDisplay(value) {
    if (value === 'Error') return value;
    
    // Split on decimal point
    const parts = value.split('.');
    
    // Format the integer part with commas
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Put it back together
    return parts.join('.');
  }
  
  // Update the display with current value
  function updateDisplay() {
    display.textContent = formatDisplay(displayValue);
  }
  
  // Clear all values and reset calculator
  function clearAll() {
    displayValue = '0';
    firstOperand = null;
    operator = null;
    waitingForSecondOperand = false;
    updateDisplay();
  }
  
  // Handle digit input
  function inputDigit(digit) {
    if (waitingForSecondOperand) {
      displayValue = digit;
      waitingForSecondOperand = false;
    } else {
      displayValue = displayValue === '0' ? digit : displayValue + digit;
    }
    updateDisplay();
  }
  
  // Handle decimal point
  function inputDecimal() {
    if (waitingForSecondOperand) {
      displayValue = '0.';
      waitingForSecondOperand = false;
      updateDisplay();
      return;
    }
    
    if (!displayValue.includes('.')) {
      displayValue += '.';
      updateDisplay();
    }
  }
  
  // Perform calculation based on operator
  function calculate(firstOperand, secondOperand, operator) {
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '*':
        return firstOperand * secondOperand;
      case '/':
        return secondOperand !== 0 ? firstOperand / secondOperand : 'Error';
      default:
        return secondOperand;
    }
  }
  
  // Handle operation buttons
  function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);
    
    if (firstOperand === null) {
      firstOperand = inputValue;
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      
      if (result === 'Error') {
        displayValue = 'Error';
      } else {
        displayValue = String(result);
        firstOperand = result;
      }
    }
    
    waitingForSecondOperand = true;
    operator = nextOperator;
    updateDisplay();
  }
  
  // Handle backspace
  function handleBackspace() {
    if (displayValue.length > 1 && !waitingForSecondOperand) {
      displayValue = displayValue.substring(0, displayValue.length - 1);
    } else {
      displayValue = '0';
    }
    updateDisplay();
  }
  
  // Add click event listeners to all buttons
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      // Add animation class
      button.classList.add('animate-press');
      
      // Remove animation class after animation completes
      setTimeout(() => {
        button.classList.remove('animate-press');
      }, 200);
      
      // Handle different button types
      if (button.classList.contains('number-button')) {
        inputDigit(button.textContent);
      } else if (button.classList.contains('operation-button')) {
        let op = button.textContent;
        if (op === '×') op = '*';
        if (op === '÷') op = '/';
        if (op === '−') op = '-';
        handleOperator(op);
      } else if (button.classList.contains('equal-button')) {
        if (operator && firstOperand !== null) {
          handleOperator('=');
        }
      } else if (button.classList.contains('clear-button')) {
        clearAll();
      } else if (button.classList.contains('decimal-button')) {
        inputDecimal();
      } else if (button.classList.contains('backspace-button')) {
        handleBackspace();
      }
    });
  });
  
  // Handle keyboard input
  document.addEventListener('keydown', function(event) {
    const key = event.key;
    
    // Find the corresponding button to animate it
    let buttonToAnimate = null;
    
    if (key >= '0' && key <= '9') {
      event.preventDefault();
      inputDigit(key);
      buttonToAnimate = document.querySelector(`.number-button:nth-child(${key === '0' ? 17 : parseInt(key) + 9})`);
    } else if (key === '.') {
      event.preventDefault();
      inputDecimal();
      buttonToAnimate = document.querySelector('.decimal-button');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      event.preventDefault();
      handleOperator(key);
      let symbol = key;
      if (key === '*') symbol = '×';
      if (key === '/') symbol = '÷';
      if (key === '-') symbol = '−';
      buttonToAnimate = Array.from(document.querySelectorAll('.operation-button'))
        .find(btn => btn.textContent === symbol);
    } else if (key === 'Enter' || key === '=') {
      event.preventDefault();
      if (operator && firstOperand !== null) {
        handleOperator('=');
      }
      buttonToAnimate = document.querySelector('.equal-button');
    } else if (key === 'Escape' || key === 'c' || key === 'C') {
      event.preventDefault();
      clearAll();
      buttonToAnimate = document.querySelector('.clear-button');
    } else if (key === 'Backspace') {
      event.preventDefault();
      handleBackspace();
      buttonToAnimate = document.querySelector('.backspace-button');
    }
    
    // Animate the button if found
    if (buttonToAnimate) {
      buttonToAnimate.classList.add('animate-press');
      setTimeout(() => {
        buttonToAnimate.classList.remove('animate-press');
      }, 200);
    }
  });
  
  // Initialize display
  updateDisplay();
});
