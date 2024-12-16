const expenseForm = document.querySelector('form');
const amountInput = document.querySelector('#amount');
const expenseInput = document.querySelector('#expense');
const categorySelect = document.querySelector('#category');

const expenseListElement = document.querySelector('ul');
const totalExpensesCount = document.querySelector('aside header p span');
const totalExpensesAmount = document.querySelector('aside header h2');

amountInput.addEventListener('input', () => {
    let numericValue = amountInput.value.replace(/\D+/g, '');

    amountInput.value = convertToCents(numericValue);
});

function convertToCents(value) {
    const valueInCents = Number(value) / 100;
    return formatToBRLCurrency(valueInCents);
}

function formatToBRLCurrency(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

expenseForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const newExpense = {
        id: Date.now(),
        amount: amountInput.value,
        description: expenseInput.value,
        categoryId: categorySelect.value,
        categoryName: categorySelect.options[categorySelect.selectedIndex].text, // Capture the name of the selected option
        createdAt: new Date(),
    };

    addExpenseToList(newExpense);
    updateExpenseTotals();
    resetExpenseForm();
});

function resetExpenseForm() {
    expenseInput.value = "";
    amountInput.value = "";
    categorySelect.value = "";

    expenseInput.focus();
}

function addExpenseToList(expense) {
    try {
        const expenseItem = document.createElement('li');
        expenseItem.classList.add('expense');

        const expenseIcon = document.createElement('img');
        expenseIcon.setAttribute('src', `img/${expense.categoryId}.svg`);
        expenseIcon.setAttribute('alt', expense.categoryName);

        const expenseDetails = document.createElement('div');
        expenseDetails.classList.add('expense-details');

        const expenseDescription = document.createElement('strong');
        expenseDescription.textContent = expense.description;
        expenseDetails.appendChild(expenseDescription);

        const expenseCategory = document.createElement('strong');
        expenseCategory.textContent = expense.categoryName;
        expenseDetails.appendChild(expenseCategory);

        const expenseAmount = document.createElement('span');
        expenseAmount.classList.add('expense-amount');
        expenseAmount.innerHTML = `
            <small>R$</small>${expense.amount.toUpperCase().replace("R$", "")}
        `;

        const removeButton = document.createElement('img');
        removeButton.classList.add('remove-button');
        removeButton.setAttribute('src', './img/remove.svg');
        removeButton.setAttribute('alt', 'Remove');

        expenseItem.append(expenseIcon, expenseDetails, expenseAmount, removeButton);
        expenseListElement.appendChild(expenseItem);
    } catch (error) {
        alert('Unable to update expense list!');
        console.error(error);
    }
}

function updateExpenseTotals() {
    try {
        const expenseItems = expenseListElement.children;
        totalExpensesCount.textContent = `
            ${expenseItems.length} ${expenseItems.length > 1 ? 'despesas' : 'despesa'}
        `;
        let total = 0;

        for (let item of expenseItems) {
            let amountElement = item.querySelector('.expense-amount');
            let amountValue = amountElement.textContent.replace(/[^\d]/g, "");

            total += Number(amountValue);
        }
        const formattedTotal = convertToCents(total);
        totalExpensesAmount.innerHTML = `
            <small>R$</small>${formattedTotal.toUpperCase().replace("R$", "")}
        `;
    } catch (error) {
        console.error(error);
        alert('Unable to update totals!');
    }
}

expenseListElement.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-button')) {
        const expenseItem = event.target.closest('.expense');
        expenseItem.remove();
        updateExpenseTotals();
    }
});