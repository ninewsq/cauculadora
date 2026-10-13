const currentValue = document.querySelector("#current-value");
const previousValue = document.querySelector("#previous-value");
const keypad = document.querySelector(".keypad");

let currentOperand = "0";
let previousOperand = "";
let operator = null;
let shouldResetDisplay = false;

function updateDisplay() {
  currentValue.textContent = currentOperand.replace(".", ",");
  previousValue.textContent = operator
    ? `${previousOperand.replace(".", ",")} ${operator}`
    : "";
}

function appendNumber(number) {
  if (shouldResetDisplay || currentOperand === "0" || currentOperand === "Erro") {
    currentOperand = number;
    shouldResetDisplay = false;
  } else if (currentOperand.replace("-", "").length < 15) {
    currentOperand += number;
  }
  updateDisplay();
}

function appendDecimal() {
  if (shouldResetDisplay || currentOperand === "Erro") {
    currentOperand = "0";
    shouldResetDisplay = false;
  }
  if (!currentOperand.includes(".")) currentOperand += ".";
  updateDisplay();
}

function chooseOperator(nextOperator) {
  if (currentOperand === "Erro") return;

  if (operator && !shouldResetDisplay) calculate();
  previousOperand = currentOperand;
  operator = nextOperator;
  shouldResetDisplay = true;
  updateDisplay();
}

function calculate() {
  if (!operator || shouldResetDisplay) return;

  const left = Number(previousOperand);
  const right = Number(currentOperand);
  let result;

  switch (operator) {
    case "+":
      result = left + right;
      break;
    case "−":
      result = left - right;
      break;
    case "×":
      result = left * right;
      break;
    case "÷":
      if (right === 0) {
        currentOperand = "Erro";
        previousOperand = "";
        operator = null;
        shouldResetDisplay = true;
        updateDisplay();
        return;
      }
      result = left / right;
      break;
    default:
      return;
  }

  currentOperand = String(Number(result.toPrecision(10)));
  previousOperand = "";
  operator = null;
  shouldResetDisplay = true;
  updateDisplay();
}

function clearCalculator() {
  currentOperand = "0";
  previousOperand = "";
  operator = null;
  shouldResetDisplay = false;
  updateDisplay();
}

function deleteDigit() {
  if (shouldResetDisplay || currentOperand === "Erro") {
    currentOperand = "0";
    shouldResetDisplay = false;
  } else {
    currentOperand = currentOperand.length > 1
      ? currentOperand.slice(0, -1)
      : "0";
    if (currentOperand === "-") currentOperand = "0";
  }
  updateDisplay();
}

keypad.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.number !== undefined) appendNumber(button.dataset.number);
  else if (button.dataset.operator) chooseOperator(button.dataset.operator);
  else if (button.dataset.action === "decimal") appendDecimal();
  else if (button.dataset.action === "equals") calculate();
  else if (button.dataset.action === "clear") clearCalculator();
  else if (button.dataset.action === "delete") deleteDigit();
});

document.addEventListener("keydown", (event) => {
  if (/^\d$/.test(event.key)) appendNumber(event.key);
  else if (event.key === "." || event.key === ",") appendDecimal();
  else if (event.key === "+") chooseOperator("+");
  else if (event.key === "-") chooseOperator("−");
  else if (event.key === "*") chooseOperator("×");
  else if (event.key === "/") {
    event.preventDefault();
    chooseOperator("÷");
  } else if (event.key === "Enter" || event.key === "=") calculate();
  else if (event.key === "Backspace") deleteDigit();
  else if (event.key === "Escape") clearCalculator();
});

updateDisplay();
