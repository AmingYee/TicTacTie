class TicTacToeModel {
    constructor() {
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.human = 'X';
        this.ai = 'O';
        this.currentPlayer = 'X';
    }

    getBoard() {
        return this.board;
    }

    setCurrentPlayer(player) {
        this.currentPlayer = player;
    }

    getCurrentPlayer() {
        return this.currentPlayer;
    }

    makeMove(row, col, player) {
        if (this.board[row][col] === '') {
            this.board[row][col] = player;
            return true;
        }
        return false;
    }

    resetBoard() {
        this.board = [
            ['', '', ''],
            ['', '', ''],
            ['', '', '']
        ];
        this.currentPlayer = this.human;
    }

    checkWinner(player) {
        const winPositions = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],

            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],

            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];
        return winPositions.some(combination => {
            return combination.every(([row, col]) => this.board[row][col] === player);
        });
    }

    checkDraw() {
        return this.board.every(row => row.every(cell => cell !== ''));
    }

    checkWinner2(player, board) {
        const winPositions = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],

            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],

            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];
        return winPositions.some(combination => {
            return combination.every(([row, col]) => board[row][col] === player);
        });
    }

    checkDraw2(board) {
        return board.every(row => row.every(cell => cell !== ''));
    }
}

export default TicTacToeModel;