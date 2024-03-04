// Inicializa a array de cartões com os dados armazenados localmente ou cria uma array vazia
let cardsArray = JSON.parse(localStorage.getItem("kanbanCards")) || [];

// Aguarda o carregamento completo do DOM e exibe os cartões existentes na página
document.addEventListener("DOMContentLoaded", () => {
    const cards = getAllCards();
    // Cria um cartão para cada entrada na array
    cards.forEach((card) => {
        createCard(card.column, card.text, card.id, card.creationDate, card.priority);
    });
});

// Retorna todos os cartões presentes na array
function getAllCards() {
    const cardsArrayString = localStorage.getItem("kanbanCards");
    if (cardsArrayString) {
        // Converte as datas do formato de string para objetos Date
        return JSON.parse(cardsArrayString, (key, value) => {
            if (key === "creationDate") {
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
    const priority = document.getElementById("priority-select").value;

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

        // Cria um ID único para o cartão baseado no timestamp atual
        const id = Date.now().toString();
        const creationDate = new Date();

        // Cria o cartão na interface do usuário
        createCard(column, text, id, creationDate, priority);
        // Adiciona o cartão à array
        addCardArray({ id, column, text, creationDate, priority });
        // Salva a array atualizada no armazenamento local
        saveToLocalStorage();

        // Limpa o campo de input após adicionar o cartão
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
    // Localiza o índice do cartão na array
    const cardIndex = cardsArray.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
        // Atualiza a coluna do cartão na array
        cardsArray[cardIndex].column = newColumn;
        // Salva a array atualizada no armazenamento local
        saveToLocalStorage();
        // Atualiza a visualização dos cartões na interface do usuário
        updateCardView();
    }
}

// Cria um novo elemento de cartão e o adiciona à coluna especificada
function createCard(column, text, id, creationDate, priority) {
    // Cria o elemento de cartão
    const card = document.createElement("p");
    cardText.classList.add("card-text")
    
    const cardDate = document.createElement("p");
    cardDate.classList.add("date-time");
    cardDate.textContent = creationDate;

    const cardPriority = document.createElement("span");
    cardPriority.classList.add("priority");
    cardPriority.textContent = priority;

    card.draggable = true;
    card.className = "card";
    card.classList.add(`priority-${priority}`); // Adiciona a classe de prioridade ao cartão
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
    card.appendChild(cardPriority);
    card.appendChild(cardDate);

    // Adiciona os eventos de arrastar e soltar
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragover", allowDrop);
    card.addEventListener("drop", drop);

    // Adiciona o cartão à coluna correspondente na interface do usuário
    const columnElement = document.getElementById(`${column}-cards`);
    if (columnElement) {
        columnElement.appendChild(card);
    }

    // Cria botões de exclusão e edição e os adiciona ao cartão
    const deleteButton = createImageButton1("assets/trash-can.png", () => confirmDelete(id));
    const editButton = createImageButton2("assets/pen.png", () => editCardText(id));

    // Adiciona os botões ao cartão
    card.appendChild(document.createElement("br")); // Adiciona quebra de linha
    card.appendChild(deleteButton);
    card.appendChild(editButton);
}

// Função auxiliar para formatar a data e hora
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

// Cria um botão com uma imagem para a função de exclusão
function createImageButton1(imageSrc, onClickFunction) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = "Botão de Excluir";
    img.style.cursor = "pointer";
    img.classList.add("trash-can-icon"); // Adiciona a classe "trash-can-icon" à imagem para modificação no CSS
    img.addEventListener("click", onClickFunction);
    return img;
}

// Cria um botão com uma imagem para a função de edição
function createImageButton2(imageSrc, onClickFunction) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = "Botão de Editar";
    img.style.cursor = "pointer";
    img.classList.add("pen-icon"); // Adiciona a classe "pen-icon" à imagem para modificação no CSS
    img.addEventListener("click", onClickFunction);
    return img;
}

 //array de cartões
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
    // Localiza o índice do cartão na array
    const cardIndex = cardsArray.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
        // Atualiza a coluna do cartão na array
        cardsArray[cardIndex].column = newColumn;
        // Salva a array atualizada no armazenamento local
        saveToLocalStorage();
        // Atualiza a visualização dos cartões na interface do usuário
        updateCardView();
    }
}

// Cria um novo elemento de cartão e o adiciona à coluna especificada
function createCard(column, text, id, creationDate, priority) {
    // Cria o elemento de cartão
    const card = document.createElement("div");
    card.draggable = true;
    card.className = "card";
    card.classList.add(`priority-${priority}`); // Adiciona a classe de prioridade ao cartão
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

    // Adiciona os eventos de arrastar e soltar
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragover", allowDrop);
    card.addEventListener("drop", drop);

    // Adiciona o cartão à coluna correspondente na interface do usuário
    const columnElement = document.getElementById(`${column}-cards`);
    if (columnElement) {
        columnElement.appendChild(card);
    }

    // Cria botões de exclusão e edição e os adiciona ao cartão
    const deleteButton = createImageButton1("assets/trash-can.png", () => confirmDelete(id));
    const editButton = createImageButton2("assets/pen.png", () => editCardText(id));

    // Adiciona os botões ao cartão
    card.appendChild(document.createElement("br")); // Adiciona quebra de linha
    card.appendChild(deleteButton);
    card.appendChild(editButton);
}

// Função auxiliar para formatar a data e hora
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

// Cria um botão com uma imagem para a função de exclusão
function createImageButton1(imageSrc, onClickFunction) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = "Botão de Excluir";
    img.style.cursor = "pointer";
    img.classList.add("trash-can-icon"); // Adiciona a classe "trash-can-icon" à imagem para modificação no CSS
    img.addEventListener("click", onClickFunction);
    return img;
}

// Cria um botão com uma imagem para a função de edição
function createImageButton2(imageSrc, onClickFunction) {
    const img = document.createElement("img");
    img.src = imageSrc;
    img.alt = "Botão de Editar";
    img.style.cursor = "pointer";
    img.classList.add("pen-icon"); // Adiciona a classe "pen-icon" à imagem para modificação no CSS
    img.addEventListener("click", onClickFunction);
    return img;
}

// Exclui um cartão da array, salva no armazenamento local e atualiza a visualização
function deleteCard(cardId) {
    // Localiza o índice do cartão na array
    const cardIndex = cardsArray.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
        // Remove o cartão da array
        const deletedCard = cardsArray.splice(cardIndex, 1)[0];
        // Salva a array atualizada no armazenamento local
        saveToLocalStorage();
        // Atualiza a visualização dos cartões na interface do usuário
        updateCardView();
        // Exibe uma mensagem de sucesso para o usuário
        alert(`O cartão "${deletedCard.text}" foi excluído com sucesso.`);
    }
}

// Solicita confirmação antes de excluir um cartão
function confirmDelete(cardId) {
    const confirmDelete = confirm("Tem certeza de que deseja excluir este cartão?");
    if (confirmDelete) {
        deleteCard(cardId);
    }
}

// Permite ao usuário editar o texto de um cartão
function editCardText(cardId) {
    // Localiza o índice do cartão na array
    const cardIndex = cardsArray.findIndex((card) => card.id === cardId);
    const cardTextElement = document
        .getElementById(cardId)
        .querySelector(".card-text");

    if (cardIndex !== -1 && cardTextElement) {
        const currentText = cardsArray[cardIndex].text;

        // Cria um elemento de input para a edição
        const inputElement = document.createElement("input");
        inputElement.type = "text";
        inputElement.value = currentText;

        // Substitui o texto pelo input para edição
        cardTextElement.innerHTML = "";
        cardTextElement.appendChild(inputElement);

        // Adiciona um listener para detectar a conclusão da edição
        inputElement.addEventListener("keyup", (e) => {
            if (e.key === "Enter") {
                const newText = inputElement.value;
                cardsArray[cardIndex].text = newText;
                // Salva a array atualizada no armazenamento local
                saveToLocalStorage();
                // Atualiza o texto no cartão após a edição
                cardTextElement.textContent = newText;
                // Exibe uma mensagem de sucesso para o usuário
                alert("O texto do cartão foi atualizado com sucesso.");
            }
        });

        // Foca no input para iniciar a edição
        inputElement.focus();
    }
}

// Atualiza o texto de um cartão na array, salva no armazenamento local e atualiza a visualização
function updateCardText(cardId, newText) {
    // Localiza o índice do cartão na array
    const cardIndex = cardsArray.findIndex((card) => card.id === cardId);
    if (cardIndex !== -1) {
        // Atualiza o texto do cartão na array
        cardsArray[cardIndex].text = newText;
        // Salva a array atualizada no armazenamento local
        saveToLocalStorage();
        // Atualiza a visualização dos cartões na interface do usuário
        updateCardView();
        // Exibe uma mensagem de sucesso para o usuário
        alert("O texto do cartão foi atualizado com sucesso.");
    }
}

// Força o recarregamento da página para atualizar a visualização
function updateCardView() {
    // Obtém os cartões da array
    const cards = getAllCards();
    // Obtém as colunas na interface do usuário
    const todoColumn = document.getElementById("todo-cards");
    const inProgressColumn = document.getElementById("in-progress-cards");
    const doneColumn = document.getElementById("done-cards");

    // Limpa as colunas antes de recriar os cartões
    todoColumn.innerHTML = "";
    inProgressColumn.innerHTML = "";
    doneColumn.innerHTML = "";

    // Recria os cartões nas colunas correspondentes
    cards.forEach((card) => {
        createCard(card.column, card.text, card.id, card.creationDate, card.priority);
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

    // Se a coluna de destino não estiver definida no elemento de destino, usa o ID do elemento
    if (newColumn === undefined) {
        newColumn = e.target.id;
    }

    if (draggedCard && draggedCard.dataset.column !== newColumn) {
        // Atualiza a coluna do cartão na interface do usuário
        draggedCard.dataset.column = newColumn;
        const columnElement = document.getElementById(`${newColumn}-cards`);
        if (columnElement) {
            // Move o cartão para a nova coluna na interface do usuário
            columnElement.appendChild(draggedCard);
            // Atualiza a coluna do cartão na array
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
    // Converte a array de cartões em uma string JSON antes de salvar no armazenamento local
    const cardsArrayString = JSON.stringify(cardsArray, (key, value) => {
        // Converte as datas em formato ISO antes de serializar
        if (value instanceof Date) {
            return value.toISOString();
        }
        return value;
    });
    // Salva a string JSON no armazenamento local
    localStorage.setItem("kanbanCards", cardsArrayString);
}

// Função para alternar entre o modo claro e escuro
function toggleDarkMode() {
    const body = document.body;
    // Adiciona ou remove a classe "dark-mode" no elemento <body> para alternar entre os modos
    body.classList.toggle("dark-mode");
}
