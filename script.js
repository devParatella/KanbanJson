// Inicializa a array de cartões com os dados armazenados localmente ou cria uma array vazia
let cardsArray = JSON.parse(localStorage.getItem("kanbanCards")) || [];

// Aguarda o carregamento completo do DOM e exibe os cartões existentes na página
document.addEventListener("DOMContentLoaded", () => {
  const cards = getAllCards();
  cards.forEach((card) => {
    createCard(card.column, card.text, card.id, card.creationDate);
  });
});

// Retorna todos os cartões presentes na array
function getAllCards() {
  const cardsArrayString = localStorage.getItem("kanbanCards");
  if (cardsArrayString) {
    return JSON.parse(cardsArrayString, (key, value) => {
      if (key === "creationDate" || key === "creationDate") {
        return new Date(value);
      }
      return value;
    });
  }
  return [];
}

// variável com o valor máximo de caracteres por card
const MAX_CHARACTERS = 400;

// Adiciona um novo cartão à coluna especificada, atualiza a array e salva no armazenamento local
function addCard(column) {
  const inputId = `${column}-input`;
  const text = document.getElementById(inputId).value;

  if (text) {
    // Verifica se o texto já existe na array
    if (isTextAlreadyExists(text)) {
      alert("Esta tarefa já existe. Por favor, insira uma tarefa diferente.");
      return;
    }

    // Verifica se o texto excede o limite de caracteres
    if (text.length > MAX_CHARACTERS) {
      alert(`O texto do cartão não pode exceder ${MAX_CHARACTERS} caracteres.`);
      return;
    }

    const id = Date.now().toString();
    const creationDate = new Date();

    createCard(column, text, id, creationDate);
    addCardArray({ id, column, text, creationDate });
    saveToLocalStorage();

    document.getElementById(inputId).value = "";
  }
}

// Função para verificar se o texto já existe na array de cartões
function isTextAlreadyExists(newText) {
  return cardsArray.some((card) => card.text === newText);
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
  console.log(cardsArray);

  const cardIndex = cardsArray.findIndex((card) => card.id === cardId);
  if (cardIndex !== -1) {
    cardsArray[cardIndex].column = newColumn;
    saveToLocalStorage();
    updateCardView();
  }
}

// Cria um novo elemento de cartão e o adiciona à coluna especificada
function createCard(column, text, id, creationDate) {
  // Cria o elemento de cartão
  const card = document.createElement("div");
  card.draggable = true;
  card.className = "card";
  card.id = id;
  card.dataset.column = column;

  // Cria o elemento de texto do cartão com a classe .card-text
  const cardText = document.createElement("div");
  cardText.className = "card-text";
  cardText.textContent = text;

  // Adiciona a hora e a data ao card
  const dateTime = document.createElement("div");
  dateTime.className = "date-time";
  dateTime.textContent = `${getFormattedDateTime(creationDate)}`;
  card.appendChild(dateTime);

  // Adiciona o texto ao cartão
  card.appendChild(cardText);

  function getFormattedDateTime(date) {
    if (date instanceof Date) {
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };

      const formattedDateTime = date.toLocaleString("pt-BR", options);
      return formattedDateTime;
    }
    return "";
  }

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
  console.log(cardsArray);

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

// Substituindo a função editCardText anterior por esta
function editCardText(cardId) {
  const cardIndex = cardsArray.findIndex((card) => card.id === cardId);
  const cardTextElement = document
    .getElementById(cardId)
    .querySelector(".card-text");

  if (cardIndex !== -1 && cardTextElement) {
    const currentText = cardsArray[cardIndex].text;

    // Criar um elemento de input para a edição
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.value = currentText;

    // Substituir o texto pelo input para edição
    cardTextElement.innerHTML = "";
    cardTextElement.appendChild(inputElement);

    // Adicionar um listener para detectar a conclusão da edição
    inputElement.addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        const newText = inputElement.value;
        cardsArray[cardIndex].text = newText;
        saveToLocalStorage();
        // Atualizar o texto no card após a edição
        cardTextElement.textContent = newText;
        alert("Texto do card atualizado com sucesso.");
      }
    });

    // Focar no input para iniciar a edição
    inputElement.focus();
  }
}

//função substituida
/*function editCardText(cardId) {
  const newText = prompt("Digite o novo texto:");
  if (newText !== null) {
    updateCardText(cardId, newText);
  }
}*/

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
  console.log(cardsArray);

  const cards = getAllCards();
  const todoColumn = document.getElementById("todo-cards");
  const inProgressColumn = document.getElementById("in-progress-cards");
  const doneColumn = document.getElementById("done-cards");

  // Limpa as colunas antes de recriar os cartões
  todoColumn.innerHTML = "";
  inProgressColumn.innerHTML = "";
  doneColumn.innerHTML = "";

  // Recria os cartões nas colunas correspondentes
  cards.forEach((card) => {
    createCard(card.column, card.text, card.id, card.creationDate);
  });
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
  const cardsArrayString = JSON.stringify(cardsArray, (key, value) => {
    if (value instanceof Date) {
      return value.toISOString();
    }
    return value;
  });
  localStorage.setItem("kanbanCards", cardsArrayString);
}
