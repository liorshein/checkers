class Piece {
    constructor(row, col, player, type) {
        this.row = row;
        this.col = col;
        this.player = player;
        this.type = type;
    }

    getOpponent() {
        return this.player === BLACK_PLAYER ? WHITE_PLAYER : BLACK_PLAYER;
    }

    getPossibleMoves(boardData) {
        if (game.currentPlayer !== this.player) {
            let filteredMoves = [];
            return filteredMoves;
        } else {
            let moves;
            if (this.type === REGULAR_PIECE) {
                moves = this.getPieceMoves(boardData);
            } else if (this.type === KING_PIECE) {
                moves = this.getKingMoves(boardData);
            } else {
                console.log("Unknown type", this.type);
            }

            let filteredMoves = [];
            for (const move of moves) {
                const absoluteRow = move[0];
                const absoluteCol = move[1];
                if (absoluteRow >= 0 && absoluteRow <= 7 && absoluteCol >= 0 && absoluteCol <= 7) {
                    filteredMoves.push(move);
                }
            }

            return filteredMoves;
        }
    }

    getPieceMoves(boardData) {
        let result = [];
        let direction = 1;
        if (this.player === WHITE_PLAYER) {
            direction = -1
        }
        // if WHITE_PLAYER -> move up-left / if BLACK_PLAYER -> move down-right.
        let position = [this.row + direction, this.col + direction];
        if (boardData.isEmpty(position[0], position[1])) {
            result.push(position);
        }
        // if WHITE_PLAYER -> move up-right / if BLACK_PLAYER -> move down-left.
        position = [this.row + direction, this.col - direction];
        if (boardData.isEmpty(position[0], position[1])) {
            result.push(position);
        }
        // if WHITE_PLAYER -> move up-left / if BLACK_PLAYER -> move down-right.
        position = [this.row + direction, this.col + direction];
        let positionJump = [this.row + direction * 2, this.col + direction * 2];
        if (boardData.isPlayer(position[0], position[1], this.getOpponent()) && boardData.isEmpty(positionJump[0], positionJump[1])) {
            result.push(positionJump);
        }
        // if WHITE_PLAYER -> move up-right / if BLACK_PLAYER -> move down-left.
        position = [this.row + direction, this.col - direction];
        positionJump = [this.row + direction * 2, this.col - direction * 2];
        if (boardData.isPlayer(position[0], position[1], this.getOpponent()) && boardData.isEmpty(positionJump[0], positionJump[1])) {
            result.push(positionJump);
        }
        return result;
    }

    getKingMoves(boardData) {
        let result = [];
        result = result.concat(this.getMovesInDirection(-1, -1, boardData)); // up-left
        result = result.concat(this.getMovesInDirection(-1, 1, boardData)); // up-right
        result = result.concat(this.getMovesInDirection(1, -1, boardData)); // down-left
        result = result.concat(this.getMovesInDirection(1, 1, boardData)); // down-right
        return result;
    }

    getMovesInDirection(directionRow, directionCol, boardData) {
        let result = [];

        for (let i = 1; i < BOARD_SIZE; i++) {
            let row = this.row + directionRow * i;
            let col = this.col + directionCol * i;
            // Return the move if empty
            if (boardData.isEmpty(row, col)) {
                result.push([row, col]);
            // Return the move + direction if there is an enemy piece for "jump" and then stops.
            } else if (boardData.isPlayer(row, col, this.getOpponent()) && boardData.isEmpty(row + directionRow, col + directionCol)) {
                row = row + directionRow;
                col = col + directionCol;
                result.push([row, col]);
                return result;
            // If it's not empty, doesn't return move and stops.
            } else if (boardData.isPlayer(row, col, this.getOpponent()) && !boardData.isEmpty(row + directionRow, col + directionCol)) {
                return result;
            // If there is a friendly piece, doesn't return move and stops.
            } else if (boardData.isPlayer(row, col, this.player)) {
                return result;
            }
        }
        return result;
    }
}