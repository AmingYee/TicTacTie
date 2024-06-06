class TicTacToeView {
    initBoard(handleCellClick) {
        const boardElement = document.getElementById('board');
        boardElement.innerHTML = '';
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.addEventListener('click', () => handleCellClick(row, col));
                boardElement.appendChild(cell);
            }
        }
    }

    updateCell(row, col, symbol) {
        const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
        cell.textContent = symbol;
    }

    resetUI() {
        document.querySelectorAll('.cell').forEach(cell => cell.textContent = '');
    }

    bindReset(handleReset) {
        document.getElementById('resetBtn').addEventListener('click', handleReset);
    }

    bindPlayerSymbolChange(handlePlayerSymbolChange) {
        document.getElementById('playerSymbol').addEventListener('change', handlePlayerSymbolChange);
    }

    getPlayerSymbol() {
        return document.getElementById('playerSymbol').value;
    }

    showAlert(message) {
        alert(message);
    }

    drawTree(rootNode) {
        const canvas = document.getElementById('game-tree');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const nodePositions = new Map();
        const canvasWidth = canvas.width;

        this.calculatePositions(rootNode, canvasWidth / 2, 50, canvasWidth, nodePositions, 0);
        this.nodePositions = nodePositions;
        this.renderTree(ctx, rootNode);
    }

    calculatePositions(node, x, y, spaceWidth, nodePositions, depth) {
        if (!node) return;

        nodePositions.set(node, { x, y });

        const childY = y + 80;
        const childrenCount = node.children.length;
        if (childrenCount > 0) {
            const childSpaceWidth = spaceWidth / childrenCount;

            for (let i = 0; i < childrenCount; i++) {
                const childX = x - (spaceWidth / 2) + (i * childSpaceWidth) + (childSpaceWidth / 2);
                this.calculatePositions(node.children[i], childX, childY, childSpaceWidth, nodePositions, depth + 1);
            }
        }
    }

    renderTree(ctx, node) {
        if (!node) return;

        const radius = 18;
        const { x, y } = this.nodePositions.get(node);

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.stroke();

        const boardString = node.board.map(row => row.join('')).join('\n');
        const lines = boardString.split('\n');
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        lines.forEach((line, index) => {
            ctx.fillText(line, x, y - radius + 10 * index);
        });

        for (const child of node.children) {
            const { x: childX, y: childY } = this.nodePositions.get(child);
            ctx.beginPath();
            ctx.moveTo(x, y + radius);
            ctx.lineTo(childX, childY - radius);
            ctx.stroke();
            this.renderTree(ctx, child);
        }
    }

    updateAlphaBeta(alpha, beta) {
        document.getElementById('alpha-value').textContent = alpha;
        document.getElementById('beta-value').textContent = beta;
    }

    highlightNode(node, color) {
        const canvas = document.getElementById('game-tree');
        const ctx = canvas.getContext('2d');
        const radius = 18;

        const position = this.nodePositions.get(node);
        if (position) {
            const { x, y } = position;
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.stroke();
        }
    }
}

export default TicTacToeView;