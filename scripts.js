const form = document.querySelector('form');
const amount = document.querySelector('#amount');
const expense = document.querySelector('#expense');
const category = document.querySelector('#category');

const expenseList = document.querySelector('ul');
const expensesQuantity = document.querySelector('aside header p span');
const expensesTotalAmount = document.querySelector('aside header h2');

amount.addEventListener('input', () => {
    let value = amount.value.replace(/\D+/g, '');

    amount.value = convertToCents(value);
});

function convertToCents(value) {
    value = Number(value) / 100;
    return formatCurrencyBRL(value);
}

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
        amount: amount.value,
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text, // capture a name of selected option
        created_at: new Date(),
    };

    expenseAdd(newExpense);
    updateTotals();
});

function expenseAdd(newExpense) {
    try {
        const expenseItem = document.createElement('li');
        expenseItem.classList.add('expense');

        const expenseIcon = document.createElement('img');
        expenseIcon.setAttribute('src', `img/${newExpense.category_id}.svg`);
        expenseIcon.setAttribute('alt', newExpense.category_name);

        const expenseInfo = document.createElement('div');
        expenseInfo.classList.add('expense-info');
        const expenseName = document.createElement('strong');
        expenseName.textContent = newExpense.expense;
        expenseInfo.appendChild(expenseName);
        const categoryName = document.createElement('strong');
        categoryName.textContent = newExpense.category_name;
        expenseInfo.appendChild(categoryName);

        const expenseAmount = document.createElement('span');
        expenseAmount.classList.add('expense-amount');
        expenseAmount.innerHTML = 
                                `
                                    <small>R$</small>${newExpense.amount.toUpperCase().replace("R$", "")}
                                `;

        const removeIcon = document.createElement('img');
        removeIcon.classList.add('remove-icon');
        removeIcon.setAttribute('src', './img/remove.svg');
        removeIcon.setAttribute('alt', 'remover');

        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
        expenseList.appendChild(expenseItem);
    } catch (error) {
        alert('Unable to update expense list!');
        console.log(error);
    }
}

function updateTotals() {
    try {
        const items = expenseList.children;
        expensesQuantity.textContent = `
            ${items.length} ${items.length > 1 ? 'despensas' : 'despensa'}
        `;
        let total = 0;

        for (let item of items) {
            let amount = item.querySelector('.expense-amount');
            let value = amount.textContent.replace(/[^\d]/g, "");

            value = Number(value);
            total += value;
        }
        total = convertToCents(total);
        expensesTotalAmount.innerHTML = 
                                    `
                                        <small>R$</small>${total.toUpperCase().replace("R$", "")}
                                    `;
    } catch (error) {
        console.log(error);
        alert('Unable to update totals!');
    }
}