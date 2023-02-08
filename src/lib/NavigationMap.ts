import type { Board } from "./Board";
import { Direction, type Position } from "./Commons";


const NB_ITERATIONS = 20;

export type Cell = {
    id: string
    position: Position
    walls: {
        [key in Direction]: boolean
    }

    links: {
        [key in Direction]: Cell | null
    }
}


export class NavigationMap {

    board: Board;
    cells: Cell[][] | null;
    idToCell: { [key in string]: Cell };

    constructor(board: Board) {
        this.board = board;
        this.cells = null
        this.idToCell = {}
        this.build()
    }

    build() {
        let board = this.board;

        // Build cells matrix
        let cellMap: Cell[][] = []
        let idToCell: { [k in string]: Cell } = {}
        for (let i = 0; i < board.size.width; i++) {
            let cellColumn: Cell[] = []
            for (let j = 0; j < board.size.height; j++) {
                let id = `x=${i} y=${j}`
                let cell = {
                    id,
                    position: { x: i, y: j },
                    walls: {
                        [Direction.LEFT]: false,
                        [Direction.RIGHT]: false,
                        [Direction.UP]: false,
                        [Direction.DOWN]: false,
                    },
                    links: {
                        [Direction.LEFT]: null,
                        [Direction.RIGHT]: null,
                        [Direction.UP]: null,
                        [Direction.DOWN]: null,
                    }
                }
                idToCell[id] = cell;
                cellColumn.push(cell)
            }
            cellMap.push(cellColumn)
        }

        // Add walls to cells
        for (let wall of board.walls) {
            if (wall.row % 2 == 0) {
                let i = wall.column
                let j = wall.row / 2

                if (j != 0) {
                    let aboveCell = cellMap[i][j - 1]
                    aboveCell.walls[Direction.DOWN] = true
                }

                if (j != board.size.height) {
                    let belowCell = cellMap[i][j]
                    belowCell.walls[Direction.UP] = true
                }
            } else {
                let i = wall.column
                let j = (wall.row - 1) / 2

                if (i != 0) {
                    let leftCell = cellMap[i - 1][j]
                    leftCell.walls[Direction.RIGHT] = true
                }

                if (i != board.size.width) {
                    let rightCell = cellMap[i][j]
                    rightCell.walls[Direction.LEFT] = true
                }
            }
        }

        // 
        for (let i = 0; i < board.size.width; i++) {
            for (let j = 0; j < board.size.height; j++) {
                let cell = cellMap[i][j];
                if (cell.walls[Direction.UP] || j == 0) {
                    cell.links[Direction.UP] = cell
                } else {
                    cell.links[Direction.UP] = cellMap[i][j - 1].links[Direction.UP]
                }

                let jSym = board.size.height - 1 - j;
                cell = cellMap[i][jSym];
                if (cell.walls[Direction.DOWN] || j == 0) {
                    cell.links[Direction.DOWN] = cell
                } else {
                    cell.links[Direction.DOWN] = cellMap[i][jSym + 1].links[Direction.DOWN]
                }
            }
        }

        for (let j = 0; j < board.size.height; j++) {
            for (let i = 0; i < board.size.width; i++) {
                let cell = cellMap[i][j];
                if (cell.walls[Direction.LEFT] || i == 0) {
                    cell.links[Direction.LEFT] = cell
                } else {
                    cell.links[Direction.LEFT] = cellMap[i - 1][j].links[Direction.LEFT]
                }

                let iSym = board.size.width - 1 - i;
                cell = cellMap[iSym][j];
                if (cell.walls[Direction.RIGHT] || i == 0) {
                    cell.links[Direction.RIGHT] = cell
                } else {
                    cell.links[Direction.RIGHT] = cellMap[iSym + 1][j].links[Direction.RIGHT]
                }

            }
        }

        this.idToCell = idToCell;
        this.cells = cellMap;
    }

    getCellAt(position: Position): Cell {
        return this.cells![position.x][position.y];
    }

    getNextPosition(current: Position, direction: Direction): Position {
        return this.getCellAt(current).links[direction]!.position;
    }

    getNumberReachableCells(start: Position): number {
        return this.getReachableCells(start).length;
    }


    getReachableCells(start: Position): Cell[] {
        let seen = new Set<string>();
        let toVisit = [this.getCellAt(start)];

        let enqueue = (cell: Cell) => {
            if (seen.has(cell.id)) return;
            toVisit.push(cell);
        }

        let cell;
        while (cell = toVisit.pop()) {
            seen.add(cell.id);
            enqueue(cell.links[Direction.DOWN]!);
            enqueue(cell.links[Direction.UP]!);
            enqueue(cell.links[Direction.LEFT]!);
            enqueue(cell.links[Direction.RIGHT]!);
        }
        return Array.from(seen).map(id => this.idToCell[id]);
    }

    getReachabilityWeights(start: Position, nIteration: number = NB_ITERATIONS): { [k in string]: number } {
        let revReachability = this.getReverseReachableLinks(start);

        let weights = Object.keys(revReachability).reduce((prev: { [k in string]: number }, curr: string) => {
            prev[curr] = 1;
            return prev
        }, {});

        for (let i = 0; i < nIteration; i++) {
            let weightsNew = { ...weights }
            Object.entries(revReachability).forEach(([cellId, ancestors]) => {
                weightsNew[cellId] = 0.5 * weights[cellId] + 0.5 * ancestors.reduce((prev, c) => {
                    prev += weights[c.id]
                    return prev;
                }, 0)
            })
            weights = weightsNew;

        }

        return weights
    }

    getReverseReachableLinks(start: Position): { [id in string]: Cell[] } {
        let cells = this.getReachableCells(start)

        let revReachable = cells.reduce((prev, curr) => {
            prev[curr.id] = [];
            return prev;
        }, {} as { [id in string]: Cell[] })

        let addAncestor = (curr: Cell, cell: Cell) => {
            if (cell.id != curr.id)
                revReachable[cell.id].push(curr)
        }
        cells.forEach(cell => {
            addAncestor(cell, cell.links[Direction.DOWN]!)
            addAncestor(cell, cell.links[Direction.UP]!)
            addAncestor(cell, cell.links[Direction.LEFT]!)
            addAncestor(cell, cell.links[Direction.RIGHT]!)
        })

        return revReachable;
    }

    getGoalCandidate(start: Position, nIteration: number = NB_ITERATIONS): Position {
        let wEntries = Object.entries(this.getReachabilityWeights(start, nIteration))
        let [bestId, bestW] = wEntries.reduce(([bestId, bestW], [id, w]) => {
            if (w < bestW) {
                return [id, w]
            }
            return [bestId, bestW]
        }, wEntries[0])

        return this.idToCell[bestId].position
    }
}