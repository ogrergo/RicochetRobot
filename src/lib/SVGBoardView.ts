import type { Board } from "./Board";
import type { Position } from "./Commons";
import type { Cell } from "./NavigationMap";


export class SVGBoardView {
    canvas: HTMLCanvasElement;
    isDebug: boolean = false;

    readonly theme = {
        lines: '#999999',
        walls: '#FF0000',
        player: '#009900',
        goal: '#000099',
        debug: '#552233'
    }

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
    }

    draw(board: Board) {
        if (this.canvas.width == 0 || this.canvas.height == 0) {
            console.log("Skip rendering, canvas empty")
            return
        }
        const ctx = this.canvas.getContext('2d')!;

        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const OFFSET = 20;
        ctx.lineWidth = 1;

        const rectSize = Math.min(
            (this.canvas.width - OFFSET) / board.size.width,
            (this.canvas.height - OFFSET) / board.size.height
        )

        const borderX = this.canvas.width / 2 - rectSize * board.size.width / 2;
        const borderY = this.canvas.height / 2 - rectSize * board.size.height / 2;
        const convert = (x: number, y: number) => ({ x: x * rectSize + borderX, y: y * rectSize + borderY })

        for (let y = 0; y < board.size.height; y++) {
            for (let x = 0; x < board.size.width; x++) {
                ctx.beginPath();
                ctx.strokeStyle = this.theme.lines;
                let position = convert(x, y)
                ctx.strokeRect(position.x, position.y, rectSize, rectSize);
            }
        }

        ctx.strokeStyle = this.theme.walls
        ctx.lineWidth = 3;

        for (let wall of board.walls) {
            let row = wall.row
            let column = wall.column

            if (row % 2 == 0) {
                ctx.beginPath();
                let pos0 = convert(column, row / 2)
                let pos1 = convert(column + 1, row / 2)
                ctx.moveTo(pos0.x, pos0.y)
                ctx.lineTo(pos1.x, pos1.y)
                ctx.stroke()
            } else {
                ctx.beginPath();
                let pos0 = convert(column, (row - 1) / 2)
                let pos1 = convert(column, (row + 1) / 2)
                ctx.moveTo(pos0.x, pos0.y)
                ctx.lineTo(pos1.x, pos1.y)
                ctx.stroke()
            }
        }

        // ctx.strokeStyle = this.theme.goal
        let goal = board.goal;
        // let pos = convert(goal.position.x, goal.position.y);
        // ctx.beginPath();
        // ctx.moveTo(pos.x, pos.y)
        // ctx.lineTo(pos.x + rectSize, pos.y + rectSize)
        // ctx.moveTo(pos.x + rectSize, pos.y)
        // ctx.lineTo(pos.x, pos.y + rectSize)
        // ctx.stroke();
        SVGBoardView.drawCircle(ctx, convert(goal.position.x, goal.position.y), this.theme.goal, rectSize, rectSize)

        let player = board.player;


        let cell = board.cells.getCellAt(player.position);
        let convertCell = (cell: Cell | null) => convert(cell!.position.x, cell!.position.y);
        // SVGBoardView.drawCircle(ctx, convertCell(cell.links[Direction.DOWN]), this.theme.debug, rectSize, rectSize - 20)
        // SVGBoardView.drawCircle(ctx, convertCell(cell.links[Direction.UP]), this.theme.debug, rectSize, rectSize - 20)
        // SVGBoardView.drawCircle(ctx, convertCell(cell.links[Direction.LEFT]), this.theme.debug, rectSize, rectSize - 20)
        // SVGBoardView.drawCircle(ctx, convertCell(cell.links[Direction.RIGHT]), this.theme.debug, rectSize, rectSize - 20)

        if (this.isDebug) {
            let weights = board.cells.getReachabilityWeights(player.position)
            board.cells.getReachableCells(player.position).forEach((cell) => {
                let pos = convertCell(cell)
                SVGBoardView.drawCircle(ctx, pos, this.theme.debug, rectSize, rectSize - 30)
                ctx.font = "12px serif";
                let w = Number((weights[cell.id]).toFixed(3))
                ctx.fillText(`${w}`, pos.x + rectSize / 3, pos.y + rectSize / 2);
            })

        }


        SVGBoardView.drawCircle(ctx, convert(player.position.x, player.position.y), this.theme.player, rectSize, rectSize - 10)
    }

    private static drawCircle(ctx: CanvasRenderingContext2D, position: Position, color: string, cellSize: number, diameter: number) {
        let x = position.x;
        let y = position.y;
        ctx.strokeStyle = color
        ctx.beginPath();
        ctx.arc(x + cellSize / 2, y + cellSize / 2, diameter / 2 - 5, 0, 2 * Math.PI);
        ctx.stroke();
    }

}
