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
        const board = this.model.getBoard();
        const bestMove = this.minMax(board, this.aiSymbol, 0, true);
        this.model.makeMove(bestMove.row, bestMove.col, this.aiSymbol);
        this.view.updateCell(bestMove.row, bestMove.col, this.aiSymbol);

        if (this.model.checkWinner(this.aiSymbol)) {
            this.view.showAlert(`${this.aiSymbol} wins!`);
        } else if (this.model.checkDraw()) {
            this.view.showAlert("It's a draw!");
        } else {
            this.switchPlayer();
        }
    }

    minMax(board, player, depth, isMaximizing, alpha, beta) {
        if (this.model.checkWinner(this.playerSymbol)) {
            return { score: -10 - depth};
        } else if (this.model.checkWinner(this.aiSymbol)) {
            return { score: 10 + depth};
        } else if (this.model.checkDraw()) {
            return { score: 0 };
        }

        const moves = [];

        for (let i = 0; i < 3; i++) {
            for (let ii = 0; ii < 3; ii++) {
                if (board[i][ii] === '') {
                    const move = {};
                    move.row = i;
                    move.col = ii;
                    board[i][ii] = player;

                    const opponent = player === this.aiSymbol ? this.playerSymbol : this.aiSymbol;
                    const result = this.minMax(board, opponent, depth - 1, !isMaximizing);
                    move.score = result.score;

                    board[i][ii] = '';
                    moves.push(move);

                    if (isMaximizing) {
                        alpha = Math.max(alpha, move.score);
                    } else {
                        beta = Math.min(beta, move.score);
                    }

                    if (beta <= alpha) {
                        break;
                    }
                }
            }
        }

        let bestMove;
        if (isMaximizing) {
            let bestScore = -Infinity;
            for (const move of moves) {
                if (move.score > bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            }
        } else {
            let bestScore = Infinity;
            for (const move of moves) {
                if (move.score < bestScore) {
                    bestScore = move.score;
                    bestMove = move;
                }
            }
        }
        return bestMove;
    }

    switchPlayer() {
        this.model.setCurrentPlayer(this.model.getCurrentPlayer() === this.playerSymbol ? this.aiSymbol : this.playerSymbol);
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