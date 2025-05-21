const API_URL = 'http://localhost:8080/frutas';

document.addEventListener('DOMContentLoaded', () => {
  fetchFruits();

  document.getElementById('addFruitForm').addEventListener('submit', function (e) {
    e.preventDefault();
    addFruit();
  });
});

function fetchFruits() {
  fetch(`${API_URL}/findall`)
    .then(response => response.json())
    .then(data => {
      renderFruits(data.content);
    })
    .catch(error => console.error('Erro ao buscar frutas:', error));
}

function renderFruits(fruits) {
  const container = document.getElementById('fruitList');
  container.innerHTML = '';

  fruits.forEach(fruit => {
    const fruitDiv = document.createElement('div');
    fruitDiv.classList.add('fruit');

    fruitDiv.innerHTML = `
      <strong>${fruit.name}</strong>
      <div class="details">
        <p><strong>Preço:</strong> R$ ${fruit.price}</p>
        <p><strong>Quantidade:</strong> ${fruit.quantity}</p>

        <div class="edit-section">
          <input type="text" value="${fruit.name}" placeholder="Nome">
          <input type="number" value="${fruit.price}" step="0.01" placeholder="Preço">
          <input type="number" value="${fruit.quantity}" placeholder="Quantidade">
          <div class="action-buttons">
            <button onclick="updateFruit(${fruit.id}, this)">Atualizar</button>
            <button class="delete" onclick="deleteFruit(${fruit.id})">Excluir</button>
          </div>
        </div>
      </div>
    `;

    fruitDiv.addEventListener('click', function (e) {
      if (!e.target.matches('button, input')) {
        this.classList.toggle('expanded');
      }
    });

    container.appendChild(fruitDiv);
  });
}

function updateFruit(id, btn) {
  const parent = btn.closest('.fruit');
  const inputs = parent.querySelectorAll('input');

  const updatedFruit = {
    name: inputs[0].value,
    price: parseFloat(inputs[1].value),
    quantity: parseInt(inputs[2].value)
  };

  fetch(`${API_URL}/update/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updatedFruit)
  })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao atualizar fruta');
      return response.json();
    })
    .then(() => {
      alert('Fruta atualizada com sucesso!');
      fetchFruits();
    })
    .catch(err => alert(err.message));
}

function deleteFruit(id) {
  if (!confirm('Tem certeza que deseja excluir esta fruta?')) return;

  fetch(`${API_URL}/delete/${id}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (response.status !== 204) throw new Error('Erro ao excluir fruta');
      fetchFruits();
    })
    .catch(err => alert(err.message));
}

function addFruit() {
  const name = document.getElementById('name').value;
  const price = parseFloat(document.getElementById('price').value);
  const quantity = parseInt(document.getElementById('quantity').value);

  const newFruit = { name, price, quantity };

  fetch(`${API_URL}/save`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newFruit)
  })
    .then(response => {
      if (!response.ok) throw new Error('Erro ao adicionar fruta');
      return response.json();
    })
    .then(() => {
      alert('Fruta adicionada com sucesso!');
      document.getElementById('addFruitForm').reset();
      fetchFruits();
    })
    .catch(err => alert(err.message));
}
