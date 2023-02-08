
export type Size = {
    // number of cells
    width: number
    height: number
}

export enum Direction {
    UP = 0,
    LEFT = 1,
    DOWN = 2,
    RIGHT = 3
}

export type Position = {
    x: number
    y: number
}