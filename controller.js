import TicTacToeModel from './model.js';
import TicTacToeView from './view.js';

class TicTacToeController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.playerSymbol = 'X';
        this.aiSymbol = 'O';
        this.maxDepth = 4;
        this.heuristicValues = [
            [2, 1, 2],
            [1, 3, 1],
            [2, 1, 2]
        ];
    }

    init() {
        this.model.setCurrentPlayer(this.playerSymbol);

        this.view.initBoard((row, col) => this.cellClick(row, col));
        this.view.bindReset(this.resetGame.bind(this));
        this.view.bindPlayerSymbolChange(this.changePlayerSymbol.bind(this));
    }

    cellClick(row, col) {
        const currentPlayer = this.model.getCurrentPlayer();
        console.log(`Player ${currentPlayer} clicked on cell (${row}, ${col})`);
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

    async makeAiMove() {
        const board = this.model.getBoard();
        const gameTree = this.generateGameTree(this.model.getBoard(), this.model.getCurrentPlayer());
        console.log(gameTree);
        this.view.drawTree(gameTree)

        let maximizing = true
        if (this.playerSymbol === 'O'){
            maximizing = false;
        }

        const bestMove = await this.minMax(gameTree, this.maxDepth, maximizing, -Infinity, Infinity);

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

    generateGameTree(board, currentPlayer) {
        let rootNode = {
            board: board,
            children: []
        };

        this.generateGameTreeHelper(rootNode, currentPlayer, 0);

        return rootNode;
    }

    generateGameTreeHelper(node, currentPlayer, depth) {
        if (depth >= this.maxDepth || this.model.checkWinner(this.playerSymbol) || this.model.checkWinner(this.aiSymbol) || this.model.checkDraw()) {
            return;
        }

        node.children = [];

        for (let i = 0; i < 3; i++) {
            for (let ii = 0; ii < 3; ii++) {
                if (node.board[i][ii] === '') {
                    const newBoard = JSON.parse(JSON.stringify(node.board));
                    newBoard[i][ii] = currentPlayer;
                    const nextPlayer = currentPlayer === this.playerSymbol ? this.aiSymbol : this.playerSymbol;
                    const childNode = {
                        board: newBoard,
                        move: { row: i, col: ii },
                        children: []
                    };
                    node.children.push(childNode);
                    this.generateGameTreeHelper(childNode, nextPlayer, depth + 1);
                }
            }
        }
    }

    async minMax(node, depth, isMaximizing, alpha, beta) {
        this.view.highlightNode(node, 'red');
        await new Promise(resolve => setTimeout(resolve, 20));

        if (node.children.length === 0 || this.model.checkWinner2('X', node.board) || this.model.checkWinner2('O', node.board) || this.model.checkDraw2(node.board)) {
            let score = this.evaluate(node.board, depth)
            console.log(score)
            console.log(node.board)
            return { score: score };
        }

        const moves = [];

        for (const child of node.children) {
            this.view.highlightNode(node, 'white');
            const result = await this.minMax(child, depth - 1, !isMaximizing, alpha, beta);

            result.row = child.move.row;
            result.col = child.move.col;
            moves.push(result);
            if (isMaximizing) {
                alpha = Math.max(alpha, result.score);
                this.view.updateAlphaBeta(alpha, beta);
            } else {
                beta = Math.min(beta, result.score);
                this.view.updateAlphaBeta(alpha, beta);
            }

            if (beta <= alpha) {
                break;
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

    evaluate(board, depth) {
        let depthPointModifier = depth * 1200;
        if (this.model.checkWinner2('X', board)) {
            return 1000 - depthPointModifier;
        } else if (this.model.checkWinner2('O', board)) {
            return -1000 + depthPointModifier;
        } else if (this.model.checkDraw2(board)) {
            return 0;
        }

        let score = 0;

        for (let i = 0; i < 3; i++) {
            for (let ii = 0; ii < 3; ii++) {
                if (board[i][ii] === 'X') {
                    score += this.heuristicValues[i][ii];
                    score -= depth;
                } else if (board[i][ii] === 'O') {
                    score -= this.heuristicValues[i][ii];
                    score += depth;
                }
            }
        }

        return score;
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