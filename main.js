const $buttons = document.querySelectorAll("button");
const $result = document.getElementById("result");

let firstOperand = null;
let secondOperand = null;
let operator = null;
let resetFlag = false;

$buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const buttonText = button.textContent;
        switch (true) {
            case button.classList.contains("number") ||
                button.classList.contains("zero"):
                handleNumberButton(buttonText);
                break;
            case button.classList.contains("clear"):
                handleReset();
                break;
            case button.classList.contains("float"):
                handleFloatButton();
                break;
            case button.classList.contains("operator"):
                handleOperator(buttonText);
                break;
            case button.classList.contains("equals"):
                handleEquals();
                break;
            case button.classList.contains("function") && buttonText === "⌫":
                handleBackspace();
                break;
            default:
                throw Error("찾을 수 없는 형식!");
        }
    });
});

function handleNumberButton(number) {
    if (resetFlag) {
        $result.textContent = number;
        resetFlag = false;
    } else if ($result.textContent === "0") {
        $result.textContent = number;
    } else {
        $result.textContent += number;
    }
}

function handleFloatButton() {
    if (!$result.textContent.includes(".")) {
        $result.textContent += ".";
    }
}

function handleOperator(op) {
    if ($result.textContent === "Error") {
        return;
    }

    const currentValue = parseFloat($result.textContent);

    if (firstOperand === null) {
        firstOperand = currentValue;
        operator = op;
        resetFlag = true;
    } else if (resetFlag) {
        operator = op;
    } else {
        secondOperand = currentValue;

        const result = calculate(firstOperand, secondOperand, operator);

        if (result === "Error") {
            $result.textContent = "Error";
            firstOperand = null;
            operator = null;
            resetFlag = true;
            return;
        }

        $result.textContent = result.toString();
        firstOperand = result; // 계산 결과를 다음 연산의 첫 번째 피연산자로 설정
        operator = op;
        resetFlag = true;
    }
}

function handleEquals() {
    if ($result.textContent === "Error") {
        return;
    }

    if (firstOperand !== null && operator !== null) {
        secondOperand = parseFloat($result.textContent);
        const result = calculate(firstOperand, secondOperand, operator);

        // 에러 발생 시
        if (result === "Error") {
            $result.textContent = "Error";
            firstOperand = null;
            operator = null;
            resetFlag = true;
            return;
        }

        $result.textContent = result.toString();
        firstOperand = result;
        operator = null;
        resetFlag = true;
    }
}

// 연산자
function calculate(a, b, op) {
    // 숫자가 아닌 경우 에러 처리
    if (isNaN(a) || isNaN(b)) {
        return "Error";
    }

    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "x":
            return a * b;
        case "÷":
            // 0으로 나누기 시도 시 에러 처리
            if (b === 0) {
                return "Error";
            }
            return a / b;
        default:
            return b;
    }
}

// 리셋
function handleReset() {
    $result.textContent = "0";
    firstOperand = null;
    secondOperand = null;
    operator = null;
    resetFlag = false;
}

// TODO: 백스페이스
function handleBackspace() {
    if ($result.textContent === "Error") {
        handleReset();
        return;
    }

    if ($result.textContent.length > 1) {
        $result.textContent = $result.textContent.slice(0, -1);
    } else {
        $result.textContent = "0";
    }
}

// TODO: 키보드
document.addEventListener("keydown", (event) => {
    // 정규식: 구글링
    if (/^[0-9]$/.test(event.key)) {
        handleNumberButton(event.key);
    } else if (event.key === ".") {
        handleFloatButton();
    } else if (["+", "-"].includes(event.key)) {
        handleOperator(event.key);
    } else if (event.key === "*") {
        handleOperator("x");
    } else if (event.key === "/") {
        handleOperator("÷");
    } else if (event.key === "=" || event.key === "Enter") {
        handleEquals();
        event.preventDefault();
    } else if (event.key === "Backspace") {
        handleBackspace();
    } else if (event.key === "Escape" || event.key === "Delete") {
        handleReset();
    }
});
