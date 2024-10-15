const canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');
let current;

class Maze {
    constructor(size, row, columns) {
        this.size = size;
        this.row = row;
        this.columns = columns;
        this.grid = [];
        this.stack = [];
    }

    setup() {
        for (let r = 0; r < this.row; r++) {
            let row = [];
            for (let c = 0; c < this.columns; c++) {
                let cell = new Cell(this.size, this.grid, this.row, this.columns, r, c);
                row.push(cell);
            }
            this.grid.push(row);
        }
        current = this.grid[0][0];
    }

    draw() {
        canvas.width = this.size;
        canvas.height = this.size;
        canvas.style.background = 'black';

        this.grid.forEach(row => {
            row.forEach(cell => {
                cell.show();
            });
        });
        this.DFSMaze();
        requestAnimationFrame(() => {
            this.draw();
        });
    }

    DFSMaze() {
        current.visited = true;
        let next = current.getRandomNeighbour();
        if (next) {
            next.visited = true;
            this.stack.push(current);
            current.color = 'blue';
            current.highlight();
            current.removeWall(current, next);
            current = next;
        } else if (this.stack.length > 0) {
            current.color = 'black';
            let cell = current = this.stack.pop();
            current.highlight();
            current = cell;
        }

        if (this.stack.length === 0) {
            return;
        }
    }
}

class Cell {
    constructor(parentSize, parentGrid, row, column, rowNum, columnNum) {
        this.parentSize = parentSize;
        this.parentGrid = parentGrid;
        this.row = row;
        this.column = column;
        this.rowNum = rowNum;
        this.columnNum = columnNum;
        this.size = this.parentSize / this.row;
        this.wall = {
            top: true,
            right: true,
            bottom: true,
            left: true
        };
        this.visited = false;
        this.neighbours = [];
        this.color = 'black';
    }

    setNeighbours() {
        this.neighbours = [];
        let x = this.columnNum;
        let y = this.rowNum;
        let left = this.columnNum > 0 ? this.parentGrid[y][x - 1] : undefined;
        let right = this.columnNum < this.column - 1 ? this.parentGrid[y][x + 1] : undefined;
        let top = this.rowNum > 0 ? this.parentGrid[y - 1][x] : undefined;
        let bottom = this.rowNum < this.row - 1 ? this.parentGrid[y + 1][x] : undefined;

        if (left && !left.visited) {
            this.neighbours.push(left);
        }
        if (right && !right.visited) {
            this.neighbours.push(right);
        }
        if (top && !top.visited) {
            this.neighbours.push(top);
        }
        if (bottom && !bottom.visited) {
            this.neighbours.push(bottom);
        }
    }

    getRandomNeighbour() {
        this.setNeighbours();
        if (this.neighbours.length === 0) return undefined;
        let random = Math.floor(Math.random() * this.neighbours.length);
        return this.neighbours[random];
    }

    drawLine(fromX, fromY, toX, toY) {
        c.beginPath();
        c.moveTo(fromX, fromY);
        c.lineTo(toX, toY);
        c.strokeStyle = 'white';
        c.lineWidth = 2;
        c.stroke();
    }

    drawWall() {
        let fromX, fromY, toX, toY;
        if (this.wall.top) {
            fromX = this.columnNum * this.size;
            fromY = this.rowNum * this.size;
            toX = fromX + this.size;
            toY = fromY;
            this.drawLine(fromX, fromY, toX, toY);
        }
        if (this.wall.bottom) {
            fromX = this.columnNum * this.size;
            fromY = (this.rowNum * this.size) + this.size;
            toX = fromX + this.size;
            toY = fromY;
            this.drawLine(fromX, fromY, toX, toY);
        }
        if (this.wall.left) {
            fromX = this.columnNum * this.size;
            fromY = this.rowNum * this.size;
            toX = fromX;
            toY = fromY + this.size;
            this.drawLine(fromX, fromY, toX, toY);
        }
        if (this.wall.right) {
            fromX = (this.columnNum * this.size) + this.size;
            fromY = this.rowNum * this.size;
            toX = fromX;
            toY = fromY + this.size;
            this.drawLine(fromX, fromY, toX, toY);
        }
    }
    highlight() {
        c.fillStyle = 'red';
        c.fillRect((this.columnNum * this.size) + 1, (this.rowNum * this.size) + 1, this.size - 2, this.size - 2);
    }
    removeWall(cell1, cell2) {
        let xDiff = cell2.columnNum - cell1.columnNum;
        if (xDiff === 1) {
            cell1.wall.right = false;
            cell2.wall.left = false;
        } else if (xDiff === -1) {
            cell1.wall.left = false;
            cell2.wall.right = false;
        }
        let yDiff = cell2.rowNum - cell1.rowNum;
        if (yDiff === 1) {
            cell1.wall.bottom = false;
            cell2.wall.top = false;
        } else if (yDiff === -1) {
            cell1.wall.top = false;
            cell2.wall.bottom = false;
        }
    }

    show() {
        this.drawWall();
        c.fillStyle = this.color;
        c.fillRect((this.columnNum * this.size)+1,( this.rowNum * this.size) + 1, this.size -2 , this.size -2);
    }
}

let maze = new Maze(500, 30, 30);
maze.setup();
maze.draw();
console.log(maze.grid);
