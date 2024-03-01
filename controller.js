import TicTacToeModel from './model.js';
import TicTacToeView from './view.js';

class TicTacToeController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.playerSymbol = 'X';
        this.aiSymbol = 'O';
    }

    init() {
        this.model.setCurrentPlayer(this.playerSymbol);

        this.view.initBoard((row, col) => this.cellClick(row, col));
        this.view.bindReset(this.resetGame.bind(this));
        this.view.bindPlayerSymbolChange(this.changePlayerSymbol.bind(this));
    }

    cellClick(row, col) {
        const currentPlayer = this.model.getCurrentPlayer();
        if (this.model.getBoard()[row][col] === '' && currentPlayer === this.playerSymbol) {
            this.model.makeMove(row, col, currentPlayer);
            this.view.updateCell(row, col, currentPlayer);
            if (this.model.checkWinner(currentPlayer)) {
                this.view.showAlert(`${currentPlayer} wins!`);
                this.resetGame();
            } else if (this.model.checkDraw()) {
                this.view.showAlert("It's a draw!");
                this.resetGame();
            } else {
                this.switchPlayer();
                setTimeout(() => this.makeAiMove(), 420);
            }
        }
    }

    makeAiMove() {
        const currentPlayer = this.model.getCurrentPlayer();
        let bestScore = -Infinity;
        let move;
        const board = this.model.getBoard();
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === '') {
                    board[i][j] = currentPlayer;
                    let score = this.minimax(board, 0, false);
                    board[i][j] = '';
                    if (score > bestScore) {
                        bestScore = score;
                        move = { row: i, col: j };
                    }
                }
            }
        }
        this.model.makeMove(move.row, move.col, currentPlayer);
        this.view.updateCell(move.row, move.col, currentPlayer);
        if (this.model.checkWinner(currentPlayer)) {
            this.view.showAlert(`${currentPlayer} wins!`);
        } else if (this.model.checkDraw()) {
            this.view.showAlert("It's a draw!");
        } else {
            this.switchPlayer();
        }
    }

    switchPlayer() {
        this.model.setCurrentPlayer(this.model.getCurrentPlayer() === this.playerSymbol ? this.aiSymbol : this.playerSymbol);
    }

    minimax(board, depth, isMaximizing) {
        const currentPlayer = isMaximizing ? this.aiSymbol : this.playerSymbol;

        if (this.model.checkWinner(this.playerSymbol)) {
            return -10 + depth;
        } else if (this.model.checkWinner(this.aiSymbol)) {
            return 10 - depth;
        } else if (this.model.checkDraw()) {
            return 0;
        }

        let MAX_DEPTH = 9;

        if (depth >= MAX_DEPTH) {
            return this.evaluate(board);
        }

        let bestScore = isMaximizing ? -Infinity : Infinity;

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === '') {
                    board[i][j] = currentPlayer;

                    if (this.model.checkWinner(currentPlayer)) {
                        board[i][j] = '';
                        return isMaximizing ? 10 - depth : -10 + depth;
                    }

                    board[i][j] = '';
                }
            }
        }

        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === '') {
                    board[i][j] = currentPlayer;

                    const score = this.evaluate(board) + this.minimax(board, depth + 1, !isMaximizing);
                    bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);

                    board[i][j] = '';
                }
            }
        }

        return bestScore;
    }

    evaluate(board) {
        const fieldValues = [3, 2, 3, 2, 4, 2, 3, 2, 3];

        let score = 0;
        for (let i = 0; i < board.length; i++) {
            for (let j = 0; j < board[i].length; j++) {
                if (board[i][j] === this.aiSymbol) {
                    score += fieldValues[i * 3 + j];
                } else if (board[i][j] === this.playerSymbol) {
                    score -= fieldValues[i * 3 + j];
                }
            }
        }
        return score;
    }

    resetGame() {
        this.model.resetBoard();
        this.view.resetUI();
        this.model.setCurrentPlayer(this.playerSymbol);

        if (this.playerSymbol === 'O') {
            this.switchPlayer();
            this.makeAiMove();
        }
    }

    changePlayerSymbol() {
        const newPlayerSymbol = this.view.getPlayerSymbol();
        this.playerSymbol = newPlayerSymbol;
        this.aiSymbol = newPlayerSymbol === 'X' ? 'O' : 'X';
        this.resetGame();
    }
}

const model = new TicTacToeModel();
const view = new TicTacToeView();
const controller = new TicTacToeController(model, view);

controller.init();