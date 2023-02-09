

<script setup lang="ts">
import { Board } from '@/lib/Board';
import { Direction, type Size } from '@/lib/Commons';
import { SVGBoardView } from '@/lib/SVGBoardView';
import { onMounted, onUnmounted } from 'vue'


let boardSize: Size = { height: 15, width: 15 };
let nbWalls: number = 30;
let board: Board = Board.createRandom(boardSize, nbWalls);
let boardView: SVGBoardView;

function createView(canvas: HTMLCanvasElement) {
    console.log(`Number of reachable cells: ${board.cells.getNumberReachableCells(board.player.position)}`);
    boardView = new SVGBoardView(canvas)
    // boardView.isDebug = true;
    resizeCanvas()
}

function resizeCanvas() {
    let canvas = boardView.canvas;
    // canvas.style.width = '100%';
    // canvas.style.height = '100%';
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // canvas.width = canvas.clientWidth;
    // canvas.height = canvas.clientHeight;

    boardView.draw(board)
}

const vResizeDirective = {
    created: () => {
        window.addEventListener("resize", resizeCanvas);
    },

    mounted: (el: HTMLCanvasElement) => {
        createView(el)
    }
}

function keyDown(key: any) {
    let direction: Direction | null = null;
    if (key.code === "ArrowUp") {
        direction = Direction.UP
    } else if (key.code === "ArrowDown") {
        direction = Direction.DOWN
    } else if (key.code === "ArrowLeft") {
        direction = Direction.LEFT
    } else if (key.code === "ArrowRight") {
        direction = Direction.RIGHT
    }
    if (direction != null) {
        board.moveInDirection(direction)
        if (board.isWin()) {
            board = Board.createRandom(boardSize, nbWalls);
        }
        boardView.draw(board)
    }
}



onMounted(() => {
    window.addEventListener('keydown', keyDown);

})
onUnmounted(() => {
    window.removeEventListener('keydown', keyDown);
})


</script>

<template>
    <canvas v-resizeDirective id="canvas" width="200" height="100"></canvas>
</template>

<style>
canvas {
    width: 100%;
    height: 100%;
}
</style>
