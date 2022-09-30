class BoardData {
    constructor() {
        this.addPiecesData();
    }
    // Creates list of pieces (24 total).
    addPiecesData() {
        this.pieces = [];

        for (let row = 0; row < BOARD_SIZE; row++) {
            if (row === 0 || row === 2) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    if (col % 2 !== 0) {
                        this.pieces.push(new Piece(row, col, BLACK_PLAYER, REGULAR_PIECE));
                    }
                }
            } else if (row === 1) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    if (col % 2 === 0) {
                        this.pieces.push(new Piece(row, col, BLACK_PLAYER, REGULAR_PIECE));
                    }
                }
            } else if (row === 5 || row === 7) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    if (col % 2 === 0) {
                        this.pieces.push(new Piece(row, col, WHITE_PLAYER, REGULAR_PIECE));
                    }
                }
            } else if (row === 6) {
                for (let col = 0; col < BOARD_SIZE; col++) {
                    if (col % 2 !== 0) {
                        this.pieces.push(new Piece(row, col, WHITE_PLAYER, REGULAR_PIECE));
                    }
                }
            }
        }
    }
    // Returns piece in row, col, or undefined if not exists.
    getPiece(row, col) {
        for (const piece of this.pieces) {
            if (piece.row === row && piece.col === col) {
                return piece;
            }
        }
    }
    // Checks if the location is empty.
    isEmpty(row, col) {
        return this.getPiece(row, col) === undefined;
    }
    // Checks if the location contains a piece.
    isPlayer(row, col, player) {
        const piece = this.getPiece(row, col);
        return piece !== undefined && piece.player === player;
    }
    // Removes the piece from the pieces array.
    removePiece(row, col) {
        for (let i = 0; i < this.pieces.length; i++) {
            const piece = this.pieces[i];
            if (piece.row === row && piece.col === col) {
                this.pieces.splice(i, 1);
                return piece;
            }
        }
    }
}