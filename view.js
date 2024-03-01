class TicTacToeView {
    constructor() {
        this.boardElement = document.getElementById('board');
        this.resetButton = document.getElementById('resetBtn');
        this.playerSymbolSelect = document.getElementById('playerSymbol');
    }

    initBoard(cellClickHandler) {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => cellClickHandler(i, j));
                this.boardElement.appendChild(cell);
            }
        }
    }

    updateCell(row, col, player) {
        const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
        cell.innerText = player;
    }

    showAlert(message) {
        alert(message);
    }

    resetUI() {
        const cells = document.getElementsByClassName('cell');
        for (let i = 0; i < cells.length; i++) {
            cells[i].innerText = '';
        }
    }

    bindReset(resetHandler) {
        this.resetButton.addEventListener('click', resetHandler);
    }

    bindPlayerSymbolChange(symbolChangeHandler) {
        this.playerSymbolSelect.addEventListener('change', symbolChangeHandler);
    }

    getPlayerSymbol() {
        return this.playerSymbolSelect.value;
    }
}

export default TicTacToeView;