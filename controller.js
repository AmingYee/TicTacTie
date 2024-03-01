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

        this.view.initBoard(index => this.cellClick(index));
        this.view.bindReset(this.resetGame.bind(this));
        this.view.bindPlayerSymbolChange(this.changePlayerSymbol.bind(this));
    }

    cellClick(index) {
        const currentPlayer = this.model.getCurrentPlayer();
        if (this.model.getBoard()[index] === '' && currentPlayer === this.playerSymbol) {
            this.model.makeMove(index, currentPlayer);
            this.view.updateCell(index, currentPlayer);
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
        for (let i = 0; i < this.model.getBoard().length; i++) {
            if (this.model.getBoard()[i] === '') {
                this.model.makeMove(i, currentPlayer);
                let score = this.minimax(this.model.getBoard(), 0, false);
                this.model.makeMove(i, '');
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        this.model.makeMove(move, currentPlayer);
        this.view.updateCell(move, currentPlayer);
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
            if (board[i] === '') {
                board[i] = currentPlayer;

                if (this.model.checkWinner(currentPlayer)) {
                    board[i] = '';
                    return isMaximizing ? 10 - depth : -10 + depth;
                }

                board[i] = '';
            }
        }

        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = currentPlayer;

                const score = this.evaluate(board) + this.minimax(board, depth + 1, !isMaximizing);
                bestScore = isMaximizing ? Math.max(score, bestScore) : Math.min(score, bestScore);

                board[i] = '';
            }
        }

        return bestScore;
    }

    evaluate(board) {
        const fieldValues = [3, 2, 3, 2, 4, 2, 3, 2, 3];

        let score = 0;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === this.aiSymbol) {
                score += fieldValues[i];
            } else if (board[i] === this.playerSymbol) {
                score -= fieldValues[i];
            }
        }
        return score;
    }

    resetGame() {
        this.model.resetBoard();
        this.view.resetUI();
        this.model.setCurrentPlayer(this.playerSymbol);
        //console.log("player: " + this.playerSymbol)
        //console.log("ai: " + this.aiSymbol)

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