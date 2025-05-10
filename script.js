const display = document.getElementById('display');
let currentInput = ''; // Armazena a entrada atual
let operator = null; // Armazena o operador selecionado
let previousInput = ''; // Armazena a entrada anterior (após um operador)
let shouldResetDisplay = false; // Indica se o display deve ser resetado no próximo dígito

function appendToDisplay(value) {
    if (display.value === 'Erro' || (shouldResetDisplay && !isOperator(value))) {
        display.value = '';
        shouldResetDisplay = false;
    }

    // Evita múltiplos zeros no início, a menos que seja um decimal
    if (display.value === '0' && value !== '.' && !isOperator(value)) {
        display.value = value;
        return;
    }

    // Evita múltiplos pontos decimais
    if (value === '.' && display.value.includes('.')) {
        return;
    }

    display.value += value;
}

function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}

function clearDisplay() {
    display.value = '';
    currentInput = '';
    previousInput = '';
    operator = null;
}

function deleteLast() {
    if (display.value === 'Erro') {
        clearDisplay();
        return;
    }
    display.value = display.value.slice(0, -1);
}

function calculateResult() {
    if (display.value === '' || display.value === 'Erro') {
        return;
    }
    try {
        // Cuidado com eval: Para uma calculadora de produção, um parser de expressão seria mais seguro.
        // Esta implementação simples de 'eval' pode ter problemas com operações sequenciais sem pressionar '=' entre elas
        // ou com a ordem de precedência se não for manuseada explicitamente.
        // Para este exemplo, vamos assumir que o usuário insere uma expressão válida e pressiona '='.

        // Uma forma mais robusta (mas ainda simples) seria:
        currentInput = display.value;
        let result;

        // Verifica se o último caractere é um operador e remove-o se for o caso,
        // ou usa o operando anterior se a entrada terminar com um operador.
        if (isOperator(currentInput.slice(-1))) {
             // Se o usuário digitar "5*=" por exemplo, use "5*5"
            if(previousInput && operator) {
                currentInput = previousInput + operator + previousInput;
            } else {
                // Ou apenas remove o operador final se não houver operando anterior para repetir
                 currentInput = currentInput.slice(0, -1);
            }
        }

        // A função eval pode ser perigosa se a entrada não for controlada.
        // Para uma aplicação real, considere usar uma biblioteca para avaliar expressões matemáticas
        // ou implementar seu próprio parser.
        result = eval(currentInput);

        if (isNaN(result) || !isFinite(result)) {
            display.value = 'Erro';
        } else {
            display.value = parseFloat(result.toFixed(10)); // Limita casas decimais para evitar problemas de precisão
        }
        previousInput = ''; // Reseta para a próxima operação
        operator = null;
        shouldResetDisplay = true; // O próximo número digitado deve limpar o resultado

    } catch (error) {
        display.value = 'Erro';
    }
}

// Adiciona um ouvinte de eventos para teclas do teclado
document.addEventListener('keydown', function(event) {
    const key = event.key;

    if (key >= '0' && key <= '9') {
        appendToDisplay(key);
    } else if (key === '.') {
        appendToDisplay('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        appendToDisplay(key);
    } else if (key === 'Enter' || key === '=') {
        event.preventDefault(); // Previne o comportamento padrão do Enter (ex: submeter formulário)
        calculateResult();
    } else if (key === 'Backspace') {
        deleteLast();
    } else if (key.toLowerCase() === 'c' || key === 'Escape') {
        clearDisplay();
    }
});