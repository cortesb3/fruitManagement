document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('fruit-form');
    const input = document.getElementById('fruit-input');
    const list = document.getElementById('fruit-list');
    const baseURL = '';

    // load fruits from backend
    fetch(`${baseURL}/fruits`)
        .then(res => res.json())
        .then(data => data.fruits.forEach(f => createListItem(f.name)))
        .catch(console.error);

    form.addEventListener('submit', async event => {
        event.preventDefault();
        const name = input.value.trim();
        if (!name) return;
        const res = await fetch(`${baseURL}/fruits`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ name })
        });
        const saved = await res.json();
        createListItem(saved.name);
        input.value = '';
    });

    function createListItem(fruitName) {
        const li = document.createElement('li');
        // create a span for the fruit name so flex can align items
        const nameSpan = document.createElement('span');
        nameSpan.textContent = fruitName;
        nameSpan.classList.add('fruit-name');
        const btn = document.createElement('button');
        btn.textContent = 'Remove';
        btn.classList.add('remove');
        btn.addEventListener('click', async () => {
            await fetch(`${baseURL}/fruits/${encodeURIComponent(fruitName)}`, { method: 'DELETE' });
            li.remove();
        });
        li.append(nameSpan, btn);
        list.append(li);
    }
});