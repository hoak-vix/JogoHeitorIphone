document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.querySelector('.board-container');
    const piecesContainer = document.querySelector('.pieces');
    const resetButton = document.getElementById('resetButton');
    const startGameButton = document.getElementById('startGameButton');
    const playerTurnIndicator = document.getElementById('playerTurnIndicator');
    const statusMessage = document.getElementById('statusMessage');
    let currentPlayer = 1; // 1 or 2
    let draggedPiece = null;
    let isInitialSetup = true; // Flag para indicar a configuração inicial do tabuleiro

    const createBoard = () => {
        // Adicionar rótulos de colunas (A a E)
        const columnLabelsContainer = document.querySelector('.column-labels');
        const columnLabels = ['A', 'B', 'C', 'D', 'E'];
        columnLabelsContainer.innerHTML = '';
        columnLabels.forEach(label => {
            const cell = document.createElement('div');
            cell.classList.add('column-label');
            cell.textContent = label;
            columnLabelsContainer.appendChild(cell);
        });

        // Adicionar rótulos de linhas (1 a 6)
        const rowLabelsContainer = document.querySelector('.row-labels');
        rowLabelsContainer.innerHTML = '';
        for (let i = 1; i <= 6; i++) {
            const cell = document.createElement('div');
            cell.classList.add('row-label');
            cell.textContent = i;
            rowLabelsContainer.appendChild(cell);
        }

        // Criar células do tabuleiro
        const board = document.querySelector('.board');
        board.innerHTML = '';
        for (let i = 0; i < 30; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i; // Adiciona um índice para identificar a célula
            board.appendChild(cell);
        }

        // Adicionar eventos de drag and drop
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('dragover', (e) => {
                e.preventDefault();
            });

            cell.addEventListener('drop', (e) => {
                if (draggedPiece) {
                    const player = parseInt(draggedPiece.dataset.player, 10);
                    const cellIndex = parseInt(cell.dataset.index, 10);
                    const pieceNumber = parseInt(draggedPiece.dataset.number, 10);

                    // Verificar se é a configuração inicial ou a fase de movimentação
                    if (isInitialSetup) {
                        // Verificar se a célula está na área permitida para o jogador
                        const validCell = (player === 1 && cellIndex < 10) || (player === 2 && cellIndex >= 20);
                        
                        if (validCell) {
                            cell.appendChild(draggedPiece);
                            // Alternar a vez do jogador
                            currentPlayer = currentPlayer === 1 ? 2 : 1;
                            updatePlayerTurnIndicator();
                        }
                    } else {
                        // Fase de movimentação
                        if (player !== currentPlayer) {
                            alert("Não é sua vez!");
                            return;
                        }

                        const targetPiece = cell.querySelector('.piece');
                        if (targetPiece) {
                            const targetPlayer = parseInt(targetPiece.dataset.player, 10);
                            const targetNumber = parseInt(targetPiece.dataset.number, 10);

                            if (player !== targetPlayer &&
                                (pieceNumber === 1 && targetNumber === 7 || pieceNumber >= targetNumber)) {
                                targetPiece.remove();
                                if (targetNumber === 0) {
                                    alert(`Jogador ${currentPlayer} ganhou!`);
                                    resetBoard();
                                    return;
                                }
                            } else {
                                alert("Movimento inválido!");
                                return;
                            }
                        }

                        const validMove = isValidMove(draggedPiece, cell);
                        if (validMove) {
                            cell.appendChild(draggedPiece);
                            currentPlayer = currentPlayer === 1 ? 2 : 1;
                            updatePlayerTurnIndicator();
                        } else {
                            alert("Movimento inválido!");
                        }
                    }
                }
            });
        });
    };

    const createPieces = () => {
        piecesContainer.innerHTML = '';
        const pieces = [
            ...Array(8).fill().map((_, i) => ({ player: 1, number: i })),
            ...Array(8).fill().map((_, i) => ({ player: 2, number: i }))
        ];

        pieces.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.classList.add('piece', `player${piece.player}`);
            pieceElement.textContent = piece.number;
            pieceElement.draggable = true;
            pieceElement.dataset.player = piece.player;
            pieceElement.dataset.number = piece.number;
            piecesContainer.appendChild(pieceElement);
        });
    };

    const isValidMove = (piece, targetCell) => {
        const pieceCell = piece.parentElement;
        const pieceIndex = parseInt(pieceCell.dataset.index, 10);
        const targetIndex = parseInt(targetCell.dataset.index, 10);

        const rowDifference = Math.floor(targetIndex / 5) - Math.floor(pieceIndex / 5);
        const colDifference = (targetIndex % 5) - (pieceIndex % 5);

        return Math.abs(rowDifference) <= 1 && Math.abs(colDifference) <= 1 &&
            (rowDifference === 0 || colDifference === 0);
    };

    const updatePlayerTurnIndicator = () => {
        playerTurnIndicator.textContent = `Jogador ${currentPlayer}`;
        playerTurnIndicator.className = `player-turn player${currentPlayer}`;
    };

    const resetBoard = () => {
        createBoard();
        createPieces();
        currentPlayer = 1;
        updatePlayerTurnIndicator();
        isInitialSetup = true;
        statusMessage.textContent = '';
    };

    document.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('piece')) {
            draggedPiece = e.target;
            e.target.classList.add('dragging');
        }
    });

    document.addEventListener('dragend', (e) => {
        if (e.target.classList.contains('piece')) {
            e.target.classList.remove('dragging');
            draggedPiece = null;
        }
    });

    startGameButton.addEventListener('click', () => {
        isInitialSetup = false;
        statusMessage.textContent = 'Jogo Iniciado!';
    });

    resetButton.addEventListener('click', () => {
        resetBoard();
    });

    resetBoard();
});
