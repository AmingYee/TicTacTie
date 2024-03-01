class TicTacToeModel {
    constructor() {
        this.board = ['', '', '', '', '', '', '', '', ''];
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

    makeMove(index, player) {
        this.board[index] = player;
    }

    resetBoard() {
        this.board = ['', '', '', '', '', '', '', '', ''];
        this.currentPlayer = this.human;
    }

    checkWinner(player) {
        const winPositions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPositions.some(combination => {
            return combination.every(index => this.board[index] === player);
        });
    }

    checkDraw() {
        return this.board.every(cell => cell !== '');
    }
}

export default TicTacToeModel;