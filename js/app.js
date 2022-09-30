//* Global variables =================================================================================================================================================================================================================
const BOARD_SIZE = 8;
const BLACK_PLAYER = 'black';
const WHITE_PLAYER = 'white';
const CHECKERS_BOARD_ID = 'checkers-board';
const REGULAR_PIECE = 'regular';
const KING_PIECE = 'king';

let table;
let game;
let selectedCell;
let pieceMustJump;
let jumpMovesPossible;
let piecesCanMove;

//* Non-main functions =================================================================================================================================================================================================================

function highlightPiece(row, col) {
    const cell = table.rows[row].cells[col];
    cell.classList.add('highlight');
}

//* Main functions =================================================================================================================================================================================================================
// Coloring aspects of the pieces && possible moves.
function colorRelated(row, col) {
    // Clear all previous colors.
    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            table.rows[i].cells[j].classList.remove('possible-move')
            table.rows[i].cells[j].classList.remove('selected')
        }
    }
    // Show the possible moves of each piece by color.
    const piece = game.boardData.getPiece(row, col);
    if (piece !== undefined) {
        let possibleMoves = piece.getPossibleMoves(game.boardData);
        // Show *all* possible moves of each piece by color if no one has to jump.
        if (mustJump[1].length === 0) {
            for (let possibleMove of possibleMoves) {
                table.rows[possibleMove[0]].cells[possibleMove[1]].classList.add('possible-move');
            }
        } else {
            // Show just jump possible moves of each piece by color.
            for (let i = 0; i < mustJump[1].length; i++) {
                for (let possibleMove of possibleMoves) {
                    if (possibleMove[0] === mustJump[1][i][0] && possibleMove[1] === mustJump[1][i][1]) {
                        table.rows[possibleMove[0]].cells[possibleMove[1]].classList.add('possible-move');
                    }
                }
            }
        }
    }
    // Coloring the piece which is clicked on.
    selectedCell = piece;
    table.rows[row].cells[col].classList.add('selected');
}
// Called when the user clicks on a piece/cell.
function onCellClick(row, col) {
    mustJump = game.haveToJump();
    // jumpMovesPossible = game.jumpMoves();
    // If no one has to jump, works as usual.
    if (mustJump[0].length === 0) {
        // If the user can make a move to the location, it makes a move and recreates the whole board.
        if (selectedCell !== undefined && game.tryMove(selectedCell, row, col)) {
            selectedCell = undefined;
            createBoard(game.boardData);
            // If the user can't make a move, when another cell is clicked it the colors transform accordingly.
        } else {
            colorRelated(row, col);
        }
        // If a pieve has to jump, letting the player to click only on that piece, or toggle between the pieces that has to jump.
    } else if (mustJump[0].length === 1) {
        if (mustJump[0][0].row === row && mustJump[0][0].col === col || mustJump[1][0][0] === row && mustJump[1][0][1] === col) {
            if (selectedCell !== undefined && game.tryMove(selectedCell, row, col)) {
                selectedCell = undefined;
                createBoard(game.boardData);
            } else {
                colorRelated(row, col);
            }
        }
    }
    else {
        for (let i = 0; i < mustJump[1].length; i++) {
            if (mustJump[0][i].row === row && mustJump[0][i].col === col || mustJump[1][i][0] === row && mustJump[1][i][1] === col) {
                if (selectedCell !== undefined && game.tryMove(selectedCell, row, col)) {
                    selectedCell = undefined;
                    createBoard(game.boardData);
                } else {
                    colorRelated(row, col);
                }
            }
        }
    }
}
// Adds a "p" element to the cell.
function createPieces(cell, player) {
    const p = document.createElement('p');
    p.className = player + '-piece';
    cell.appendChild(p)
}
// Creates empty chess board.
function createBoard(boardData) {
    // "Refreshing" the whole board in order to get new board state.
    table = document.getElementById(CHECKERS_BOARD_ID);
    if (table !== null) {
        table.remove();
    }
    // Create empty chess HTML board.
    table = document.createElement('table');
    table.id = CHECKERS_BOARD_ID;
    document.body.appendChild(table);
    for (let row = 0; row < BOARD_SIZE; row++) {
        const rowElement = table.insertRow();
        for (let col = 0; col < BOARD_SIZE; col++) {
            const cell = rowElement.insertCell();
            if ((row + col) % 2 === 0) {
                cell.className = 'red-cell';
            } else {
                cell.className = 'black-cell';
                // Giving only black cells the click event.
                cell.addEventListener('click', () => onCellClick(row, col));
            }
        }
    }
    // Add pieces to cell by using the function createPieces.
    for (let piece of boardData.pieces) {
        const cell = table.rows[piece.row].cells[piece.col];
        createPieces(cell, piece.player, piece.type);
    }
    // Highlights all the pieces in the board that can move.
    piecesCanMove = game.canMove();
    for (let piece of piecesCanMove) {
        mustJump = game.haveToJump()
        if (mustJump[0].length === 0) {
            highlightPiece(piece.row, piece.col);
        } else {
            for (let i = 0; i < mustJump[0].length; i++) {
                if (piece.row === mustJump[0][i].row && piece.col === mustJump[0][i].col) {
                    highlightPiece(piece.row, piece.col);
                }
            }
        }
    }
    // If the is a king piece on the board, adds a crown img to the piece.
    for (let piece of boardData.pieces) {
        if (piece.type === KING_PIECE) {
            const cell = table.rows[piece.row].cells[piece.col];
            const kingSymbol = document.createElement('img');
            kingSymbol.src = 'images/king.png';
            kingSymbol.className = 'king-symbol';
            cell.appendChild(kingSymbol)
        }
    }
    // If there is a winner, create a winner message & disable the click event.
    if (game.winner !== undefined) {
        const winnerDiv = document.createElement('div');
        const winnerMsg = document.createElement('p')
        const winner = game.winner.charAt(0).toUpperCase() + game.winner.slice(1);
        winnerMsg.textContent = 'The winner is...(drumrolls)... ' + winner + '!';
        winnerDiv.className = 'winnerMessage';
        table.appendChild(winnerDiv);
        winnerDiv.appendChild(winnerMsg)
        // Disable the click event by setting the function to nothing.
        onCellClick = function onCellClick() { }
        // Create a reset button to reload the whole page.
        const resetButton = document.createElement('button');
        resetButton.setAttribute('onclick', 'location.reload()');
        resetButton.className = 'resetButton';
        resetButton.textContent = 'Reset Game';
        document.body.appendChild(resetButton);
    }
}
// Creates the full chess board with the pieces inside it.
function initGame() {
    game = new Game();
    createBoard(game.boardData);
}

//* Main event =================================================================================================================================================================================================================
// The event that initiate the whole game.
window.addEventListener('load', initGame);