import { ref, type Ref } from 'vue'
import { TileState, type Tile } from './types/tileTypes'

export class Minesweeper {
  public grid: Ref<Tile[][]> = ref([])

  public constructor(
    private height: number,
    private width: number,
    private mineCount: number,
  ) {
    this.generateGrid()
    this.placeMines()
    this.calculateAdjacent()
  }

  private generateGrid() {
    let grid: Tile[][] = []

    for (let i = 0; i < this.height; i++) {
      grid.push([])

      for (let j = 0; j < this.width; j++) {
        const tile: Tile = {
          x: j,
          y: i,
          hasMine: false,
          state: TileState.Hidden,
          adjacentMines: 0,
        }
        grid[i].push(tile)
      }
    }

    this.grid.value = grid
  }

  private placeMines(): void {
    let placedMines: number = 0

    while (placedMines < this.mineCount) {
      let x: number = Math.floor(Math.random() * this.width)
      let y: number = Math.floor(Math.random() * this.height)

      let tile: Tile = this.grid.value[y][x]
      if (!tile.hasMine) {
        placedMines++
        tile.hasMine = true
      }
    }
  }

  private calculateAdjacent(): void {
    const directions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [-1, 0],
      [1, 0],
      [-1, 1],
      [0, 1],
      [1, 1],
    ]

    this.grid.value.forEach((array) => {
      array.forEach((tile) => {
        tile.adjacentMines = directions.reduce((n, [dx, dy]) => {
          let x: number = tile.x + dx
          let y: number = tile.y + dy
          if (x < 0 || x > this.width - 1 || y < 0 || y > this.height - 1) {
            return n
          }
          return n + (this.grid.value[x][y].hasMine ? 1 : 0)
        }, 0)
      })
    })
  }
}
