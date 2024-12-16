const form = document.querySelector('form');
const amount = document.querySelector('#amount');
const expense = document.querySelector('#expense');
const category = document.querySelector('#category');

const expenseList = document.querySelector('ul');

amount.addEventListener('input', () => {
    let value = amount.value.replace(/\D+/g, '');

    // convert money for cents
    value = Number(value) / 100;
    amount.value = formatCurrencyBRL(value);
});

function formatCurrencyBRL(value) {
    value = value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });

    return value;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text, // capture a name of selected option
        created_at: new Date(),
    };

    expenseAdd(newExpense);
});

function expenseAdd(newExpense) {
    try {
        const expenseItem = document.createElement('li');
        expenseItem.classList.add('expense');

        const expenseIcon = document.createElement('img');
        expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute('alt', newExpense.category_name);

        expenseItem.appendChild(expenseIcon);
        expenseList.appendChild(expenseItem);
    } catch (error) {
        alert('Unable to update expense list!');
        console.log(error);
    }
}