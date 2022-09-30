class Game {
    constructor() {
        this.boardData = new BoardData();
        this.currentPlayer = WHITE_PLAYER;
        this.winner = undefined;
        this.blackCount = 12;
        this.whiteCount = 12;
    }
    // Tries to actually make a move. Returns true if successful.
    tryMove(piece, row, col) {
        const possibleMoves = piece.getPossibleMoves(game.boardData);
        for (const possibleMove of possibleMoves) {
            if (possibleMove[0] === row && possibleMove[1] === col) {
                // eat up-left.
                if (row < piece.row && col < piece.col) {
                    this.removeEnemy(piece, row + 1, col + 1);
                // eat up-right.
                } else if (row < piece.row && col > piece.col) { 
                    this.removeEnemy(piece, row + 1, col - 1);
                // eat down-left.
                } else if (row > piece.row && col < piece.col) {
                    this.removeEnemy(piece, row - 1, col + 1);
                // eat down-right.
                } else if (row > piece.row && col > piece.col) {
                    this.removeEnemy(piece, row - 1, col - 1);
                }
                // Moves the eating piece to the location where the eaten piece was.
                piece.row = row;
                piece.col = col;
                // If piece moves to the far end of opponent board side, it becames king.
                if (piece.row === 0 || piece.row === 7) {
                    piece.type = KING_PIECE
                }
                // Switches turns.
                this.currentPlayer = piece.getOpponent();

                // Added a player's turn message.
                const whoPlays = document.getElementById('turn');
                const playerNow = piece.getOpponent().charAt(0).toUpperCase() + piece.getOpponent().slice(1);
                whoPlays.textContent = "Player's turn: " + playerNow;
                if (this.currentPlayer === WHITE_PLAYER) {
                    whoPlays.style.backgroundColor = piece.getOpponent();
                    whoPlays.style.color = '#000000';
                } else if (this.currentPlayer === BLACK_PLAYER) {
                    whoPlays.style.backgroundColor = piece.getOpponent();
                    whoPlays.style.color = '#ffffff';
                }
                // Determine if there is a winner.
                this.isWinner();
                return true;
            }
        }
        return false;
    }
    // Checks if there is an enemy and if so, removes it.
    removeEnemy(piece, row, col) {
        for (let enemy of this.boardData.pieces) {
            if (enemy.row === row && enemy.col === col && enemy.player === piece.getOpponent()) {
                this.boardData.removePiece(row, col);
                // Helps determine the winner.
                if (enemy.player === BLACK_PLAYER) {
                    this.blackCount--;
                } else {
                    this.whiteCount--;
                }
            }
        }
    }
    // Checks if there is an winner on two possibilities:
    isWinner() {
        // No more pieces on the board.
        if (this.blackCount === 0) {
            game.winner = WHITE_PLAYER;
        } else if (this.whiteCount === 0) {
            game.winner = BLACK_PLAYER;
        }
        // Player can't move.
        let blackList = [];
        let whiteList = [];
        for (let piece of this.boardData.pieces) {
            if (piece.player === this.currentPlayer) {
                const possibleMoves = piece.getPossibleMoves(game.boardData);
                for (let possibleMove of possibleMoves) {
                    if (this.currentPlayer === BLACK_PLAYER) {
                        blackList.push([possibleMove[0], possibleMove[1]])
                    } else {
                        whiteList.push([possibleMove[0], possibleMove[1]])
                    }
                }
            }
        }
        if (this.currentPlayer !== WHITE_PLAYER && blackList.length === 0) {
            game.winner = WHITE_PLAYER;
        } else if (this.currentPlayer !== BLACK_PLAYER && whiteList.length === 0) {
            game.winner = BLACK_PLAYER
        }
    }
    // Checks what pieces can move.
    canMove() {
        let piecesCanMove = [];
        for (let piece of this.boardData.pieces) {
            const possibleMoves = piece.getPossibleMoves(game.boardData);
            if (possibleMoves.length > 0) {
                piecesCanMove.push(piece);
            }
        }
        return piecesCanMove;
    }
    // Checks if there are pieces that have to move.
    haveToJump() {
        let mustJump = [];
        let jumpMovesPossible = [];
        let pieceMustJump = [];
        for (let piece of this.boardData.pieces) {
            const possibleMoves = piece.getPossibleMoves(game.boardData);
            for (let possibleMove of possibleMoves) {
                let rowDiff = possibleMove[0] - piece.row
                let colDiff = possibleMove[1] - piece.col
                // Checks if there is an enemy piece in between possibleMove & "jumping" piece and returns that piece.
                // Checks up-left
                if (rowDiff < 0 && colDiff < 0 && this.boardData.isPlayer(possibleMove[0] + 1, possibleMove[1] + 1, piece.getOpponent())) {
                    pieceMustJump.push(piece);
                    jumpMovesPossible.push(possibleMove);
                }
                // Checks up-right
                if (rowDiff < 0 && colDiff > 0 && this.boardData.isPlayer(possibleMove[0] + 1, possibleMove[1] - 1, piece.getOpponent())) {
                    pieceMustJump.push(piece);
                    jumpMovesPossible.push(possibleMove);
                }
                // Checks down-left
                if (rowDiff > 0 && colDiff < 0 && this.boardData.isPlayer(possibleMove[0] - 1, possibleMove[1] + 1, piece.getOpponent())) {
                    pieceMustJump.push(piece);
                    jumpMovesPossible.push(possibleMove);
                }
                // Checks down-right
                if (rowDiff > 0 && colDiff > 0 && this.boardData.isPlayer(possibleMove[0] - 1, possibleMove[1] - 1, piece.getOpponent())) {
                    pieceMustJump.push(piece);
                    jumpMovesPossible.push(possibleMove);
                }
            }
        }
        mustJump.push(pieceMustJump);
        mustJump.push(jumpMovesPossible)
        return mustJump;
    }
}