// Inicializa a array de cartões com os dados armazenados localmente ou cria uma array vazia
let cardsArray = JSON.parse(localStorage.getItem("kanbanCards")) || [];

// Aguarda o carregamento completo do DOM e exibe os cartões existentes na página
document.addEventListener("DOMContentLoaded", () => {
  const cards = getAllCards();
  cards.forEach((card) => {
    createCard(card.column, card.text, card.id);
  });
});

// Retorna todos os cartões presentes na array
function getAllCards() {
  return cardsArray;
}

// Adiciona um novo cartão à coluna especificada, atualiza a array e salva no armazenamento local
function addCard(column) {
  const inputId = `${column}-input`;
  const text = document.getElementById(inputId).value;

  if (text) {
    const id = Date.now().toString();
    createCard(column, text, id);
    addCardArray({ id, column, text });
    saveToLocalStorage();
    // Limpa o campo de input após adicionar o cartão
    document.getElementById(inputId).value = "";
  }
}

// Adiciona um cartão à array
function addCardArray(card) {
  cardsArray.push(card);
}

// Adiciona um listener para o evento keypress no campo de input
document
  .getElementById("todo-input")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      addCard("todo");
    }
  });

// Atualiza a coluna de um cartão na array, salva no armazenamento local e atualiza a visualização
function updateCardColumn(cardId, newColumn) {
  const cardIndex = cardsArray.findIndex((card) => card.id === cardId);
  if (cardIndex !== -1) {
    cardsArray[cardIndex].column = newColumn;
    saveToLocalStorage();
    updateCardView();
  }
}

// Cria um novo elemento de cartão e o adiciona à coluna especificada
function createCard(column, text, id) {
  // Cria o elemento de cartão
  const card = document.createElement("div");
  card.draggable = true;
  card.className = "card";
  card.id = id;
  card.dataset.column = column;

  // Limita o texto exibido no cartão a 50 caracteres
  const limitedText = text.length > 50 ? text.substring(0, 50) + "..." : text;
  card.textContent = limitedText;

  // Adiciona os eventos de arrastar e soltar
  card.addEventListener("dragstart", dragStart);
  card.addEventListener("dragover", allowDrop);
  card.addEventListener("drop", drop);

  // Adiciona o cartão à coluna correspondente
  const columnElement = document.getElementById(`${column}-cards`);
  if (columnElement) {
    columnElement.appendChild(card);
  }

  // Cria botões de exclusão e edição e os adiciona ao cartão
  const deleteButton = createButton("Excluir", () => confirmDelete(id));
  const editButton = createButton("Editar", () => editCardText(id));

  card.appendChild(document.createElement("br")); // Adiciona quebra de linha
  card.appendChild(deleteButton);
  card.appendChild(editButton);
}

// Cria um botão com o texto especificado e a função de clique associada
function createButton(text, onClick) {
  const button = document.createElement("button");
  button.textContent = text;
  button.addEventListener("click", onClick);
  return button;
}

// Exclui um cartão da array, salva no armazenamento local e atualiza a visualização
function deleteCard(cardId) {
  const cardIndex = cardsArray.findIndex((card) => card.id === cardId);
  if (cardIndex !== -1) {
    const deletedCard = cardsArray.splice(cardIndex, 1)[0];
    saveToLocalStorage();
    updateCardView();
    alert(`Card "${deletedCard.text}" foi excluído com sucesso.`);
  }
}

// Solicita confirmação antes de excluir um cartão
function confirmDelete(cardId) {
  const confirmDelete = confirm("Tem certeza de que deseja excluir este card?");
  if (confirmDelete) {
    deleteCard(cardId);
  }
}

// Permite ao usuário editar o texto de um cartão
function editCardText(cardId) {
  const newText = prompt("Digite o novo texto:");
  if (newText !== null) {
    updateCardText(cardId, newText);
  }
}

// Atualiza o texto de um cartão na array, salva no armazenamento local e atualiza a visualização
function updateCardText(cardId, newText) {
  const cardIndex = cardsArray.findIndex((card) => card.id === cardId);
  if (cardIndex !== -1) {
    cardsArray[cardIndex].text = newText;
    saveToLocalStorage();
    updateCardView();
    alert("Texto do card atualizado com sucesso.");
  }
}

// Força o recarregamento da página para atualizar a visualização
function updateCardView() {
  location.reload(); // Atualiza a página
}

// Define os dados a serem transferidos durante o início de um arrasto
function dragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.id);
}

// Lida com o evento de soltar, move o cartão para a nova coluna e atualiza a array
function drop(e) {
  e.preventDefault();
  const cardId = e.dataTransfer.getData("text/plain");
  const draggedCard = document.getElementById(cardId);
  let newColumn = e.target.dataset.column;

  if (newColumn === undefined) {
    newColumn = e.target.id;
  }

  if (draggedCard && draggedCard.dataset.column !== newColumn) {
    draggedCard.dataset.column = newColumn;
    const columnElement = document.getElementById(`${newColumn}-cards`);
    if (columnElement) {
      columnElement.appendChild(draggedCard);
      updateCardColumn(cardId, newColumn);
    }
  }
}

// Permite o evento de soltar
function allowDrop(e) {
  e.preventDefault();
}

// Salva a array de cartões no armazenamento local
function saveToLocalStorage() {
  localStorage.setItem("kanbanCards", JSON.stringify(cardsArray));
}
