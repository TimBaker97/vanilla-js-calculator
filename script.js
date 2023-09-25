// Select the keys and input and output into the DOM
// querySelector is used on the keys to select them all as not all of them have the same class

const keys = document.querySelectorAll('.key');
const display_input = document.querySelector('.display .input');
const display_output = document.querySelector('.display .output');

// This is the stringed input
let input = '';

// Gives the data-key value of the operator in question. eg 5 will give the value of 5
for (let key of keys) {
    const value = key.dataset.key;

    key.addEventListener('click', () => {
        // if AC is pressed then the display is cleared to an empty string
        if (value == 'clear') {
            input = '';
            display_input.innerHTML = '';
            display_output.innerHTML = '';
        // If backspace is pressed then the last value is removed using slice
        } else if (value == 'backspace') {
            input = input.slice(0, -1);
            display_input.innerHTML = CleanInput(input);
        } else if (value == '=') {
            let result = eval(PrepareInput(input));

            display_output.innerHTML = CleanOutput(result);
        } else if (value == 'brackets') {
            // First, if there is no singular starting bracket then we must add one.
            // Secondly, if we do have a starter and outer bracket and the last outer bracker has a larger index (i.e comes after the opening bracket) then there after we add a new opening bracket.
            if (
                input.indexOf('(') == -1 || 
                input.indexOf('(') != -1 && 
                input.indexOf(')') != -1 && 
                input.lastIndexOf('(') < input.lastIndexOf(')')
            ) {
                input += '(';
            } else if (
                input.indexOf('(') != -1 &&
                input.indexOf(')') == -1 ||
                input.indexOf('(') != -1 && 
                input.indexOf(')') != -1 &&
                input.lastIndexOf('(') > input.lastIndexOf(')')
            ) {
                input += ')';
            } 

            display_input.innerHTML = CleanInput(input);
        } else {
            if (ValidateInput(value)) {
                input += value;
                display_input.innerHTML = CleanInput(input);
            }
        }
    })
}

function CleanInput(input) {
    let input_array = input.split('');
    let input_array_length = input_array.length;

    // Clean every character so it goes into the input nicely
    for (let i = 0; i < input_array_length; i++) {
        if (input_array[i] == '*') {
            input_array[i] = ` <span class="operator">x</span> `;
        } else if (input_array[i] == '+') {
            input_array[i] = ` <span class="operator">+</span> `;
        } else if (input_array[i] == '-') {
            input_array[i] = ` <span class="operator">-</span> `;
        } else if (input_array[i] == '/') {
            input_array[i] = ` <span class="operator">÷</span> `;
        } else if (input_array[i] == '(') {
            input_array[i] = `<span class="brackets">(</span>`;
        } else if (input_array[i] == ')') {
            input_array[i] = `<span class="brackets">)</span>`;
        } else if (input_array[i] == '%') {
            input_array[i] = `<span class="percent">%</span>`;
        }
    }

    return input_array.join('');
}

function CleanOutput(output) {
    let output_string = output.toString();
    let decimal = output_string.split('.')[1];
    output_string = output_string.split('.')[0];

    let output_array = output_string.split('');

    // Obtains every 3rd output backwards
    if (output_array.length > 3) {
        for (let i = output_array.length - 3; i > 0; i-= 3) {
            output_array.splice(i, 0, ',');
        }
    }

    if (decimal) {
        output_array.push('.');
        output_array.push(decimal)
    }

    return output_array.join('');
}


// This stops any of the operators being pressed multiple times so can't get xxx or --- or ... etc
function ValidateInput(value) {
    let last_input = input.slice(-1);
    let operators = ['+', '-', '*', "/"]

    if (value == '.' && last_input == '.') {
        return false;
    }

    // if an item from the operators array is included 
    if (operators.includes(value)) {
        if (operators.includes(last_input)) {
            return false;
        } else {
            return true;
        }
    }

    return true;
}

function PrepareInput(input) {
    let input_array = input.split('');

    for (let i = 0; i < input_array.length; i++) {
        if (input_array[i] == '%') {
            input_array[i] = '/100';
        }
    }

    return input_array.join('');
}