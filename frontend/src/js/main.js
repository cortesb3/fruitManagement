document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fruit-form');
    const input = document.getElementById('fruit-input');
    const list = document.getElementById('fruit-list');
    let fruits = JSON.parse(localStorage.getItem('fruits')) || [];

    fruits.forEach(fruit => createListItem(fruit));

    form.addEventListener('submit', event => {
        event.preventDefault();
        const fruit = input.value.trim();
        if (!fruit) return;
        fruits.push(fruit);
        localStorage.setItem('fruits', JSON.stringify(fruits));
        createListItem(fruit);
        input.value = '';
    });

    function createListItem(fruit) {
        const li = document.createElement('li');
        li.textContent = fruit;
        const btn = document.createElement('button');
        btn.textContent = 'Remove';
        btn.classList.add('remove');
        btn.addEventListener('click', () => {
            fruits = fruits.filter(f => f !== fruit);
            localStorage.setItem('fruits', JSON.stringify(fruits));
            li.remove();
        });
        li.appendChild(btn);
        list.appendChild(li);
    }
});