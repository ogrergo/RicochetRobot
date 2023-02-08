// import { type Direction, type Position, type Size } from "./Commons"
import type { Direction, Position, Size } from "./Commons"
import { NavigationMap } from "./NavigationMap"

export enum SpawnTypes {
    PLAYER,
    GOAL
}




export type Wall = {
    // the row in [0, 2 * height]
    row: number

    // the column in [0, width - 1] if row is even or [0, width] if row is odd
    column: number

}

export class Board {
    size: Size

    walls: Wall[]

    player: {
        position: Position
    }

    goal: {
        position: Position
    }

    cells: NavigationMap

    constructor(size: Size, walls: Wall[], player: Position, goal: Position) {
        this.size = size
        this.walls = walls
        this.player = { position: player }
        this.goal = { position: goal }
        this.cells = new NavigationMap(this)
        this.cells.build()
    }

    moveInDirection(direction: Direction) {
        // let { x, y } = this.player.position
        // let incX = 0, incY = 0;
        // let getter: (a: Cell) => boolean
        // switch (direction) {
        //     case Direction.UP:
        //         incY = -1
        //         // getter = (cell) => cell.walls.top
        //         break
        //     case Direction.DOWN:
        //         incY = 1
        //         // getter = (cell) => cell.walls.bottom
        //         break
        //     case Direction.LEFT:
        //         incX = -1
        //         // getter = (cell) => cell.walls.left
        //         break
        //     case Direction.RIGHT:
        //         incX = 1
        //         // getter = (cell) => cell.walls.right
        //         break
        // }

        this.player.position = this.cells.getNextPosition(this.player.position, direction)

        // while (true) {
        //     let cell = this.cells

        //     let hasWall = cell.walls[direction]
        //     x = x + incX
        //     y = y + incY
        //     if (hasWall || y < 0 || y >= this.size.height || x < 0 || x >= this.size.width) {
        //         break
        //     }

        //     this.player.position = this.cells.getNextPosition(this.player.position, direction)
        // }
    }

    isWin(): boolean {
        return this.player.position.x == this.goal.position.x && this.player.position.y == this.goal.position.y;
    }

    // default with 
    static createDefault(size: Size): Board {
        let walls = []
        for (let i = 0; i < size.width; i++) {
            walls.push({ row: 0, column: i })
            walls.push(
                { row: size.height * 2, column: i }
            )
        }

        for (let j = 0; j < size.height; j++) {
            walls.push(
                { row: 2 * j + 1, column: 0 }
            )
            walls.push(
                { row: 2 * j + 1, column: size.width }
            )
        }

        return new Board(
            size,
            walls,
            { x: 0, y: 0 }, // player
            { x: size.width - 1, y: size.height - 1 }) // goal
    }

    static createRandom(size: Size, nWall: number): Board {
        let board = Board.createDefault(size);

        let currentReachableCells = board.cells.getNumberReachableCells(board.player.position);
        for (let i = 0; i < nWall; i++) {
            let walls = board.walls;

            let delta = 0;
            let row, column;

            while (delta <= 0) {
                if (i % 2 == 0) {
                    row = 2 * Math.floor(Math.random() * size.height)
                    column = Math.floor(Math.random() * size.width)
                } else {
                    row = 2 * Math.floor(Math.random() * (size.height - 1)) + 1
                    column = Math.floor(Math.random() * (size.width - 1))
                }
                board.walls = [...walls, { row, column }]
                board.cells.build()



                delta = board.cells.getNumberReachableCells(board.player.position) - currentReachableCells;
            }

            currentReachableCells = currentReachableCells + delta;
        }

        board.goal.position = board.cells.getGoalCandidate(board.player.position)

        return board;
    }

    static createRandomNaive(size: Size, nWall: number): Board {
        let board = Board.createDefault(size);

        for (let i = 0; i < nWall; i++) {
            if (i % 2 == 0) {
                let row = 2 * Math.floor(Math.random() * size.height)
                let column = Math.floor(Math.random() * size.width)
                board.walls.push({ row, column })
            } else {
                let row = 2 * Math.floor(Math.random() * (size.height - 1)) + 1
                let column = Math.floor(Math.random() * (size.width - 1))
                board.walls.push({ row, column })
            }
        }
        board.cells.build()
        return board;
    }
}
