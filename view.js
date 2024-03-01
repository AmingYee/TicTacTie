class TicTacToeView {
    constructor() {
        this.boardElement = document.getElementById('board');
        this.resetButton = document.getElementById('resetBtn');
        this.playerSymbolSelect = document.getElementById('playerSymbol');
    }

    initBoard(cellClickHandler) {
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.id = i;
            cell.addEventListener('click', () => cellClickHandler(i));
            this.boardElement.appendChild(cell);
        }
    }

    updateCell(index, player) {
        document.getElementById(index).innerText = player;
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