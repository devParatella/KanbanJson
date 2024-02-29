Inicialização:

O script inicia carregando a array de cartões a partir do armazenamento local ou criando uma array vazia se não houver dados previamente armazenados.
Carregamento de Cartões:

Quando o DOM é completamente carregado, o script exibe os cartões existentes na página.
Funções Principais:

getAllCards: Retorna todos os cartões presentes na array, convertendo as datas para objetos Date.
addCard: Adiciona um novo cartão à coluna especificada, verificando duplicatas e o limite de caracteres.
updateCardColumn: Atualiza a coluna de um cartão na array, salva no armazenamento local e atualiza a visualização.
deleteCard e confirmDelete: Excluem um cartão da array, solicitando confirmação antes da exclusão.
editCardText: Permite ao usuário editar o texto de um cartão.
updateCardText: Atualiza o texto de um cartão na array e salva no armazenamento local.
updateCardView: Força o recarregamento da página para atualizar a visualização.
Manipulação da Interface:

Funções para criar elementos HTML representando os cartões e botões.
Manipulação de eventos de clique, arrastar e soltar.
Armazenamento Local:

Usa o armazenamento local para manter os dados dos cartões, convertendo as datas para strings ao salvar e revertendo ao carregar.
Outras Observações:

Há uma função getFormattedDateTime que formata uma data no padrão brasileiro.
A função updateCardView limpa as colunas antes de recriar os cartões, garantindo uma atualização adequada.
