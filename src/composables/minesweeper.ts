import { ref, type Ref } from 'vue'
import { TileState, type Tile } from '../types/tileTypes'

const DIRECTIONS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1, 1],
  [0, 1],
  [1, 1],
]

export class Minesweeper {
  public grid: Tile[][] = []
  public clearedTiles = 0

  public constructor(
    private height: number,
    private width: number,
    private mineCount: number,
  ) {
    this.startNewGame()
  }

  public revealTileAndCheckForMine(x: number, y: number): boolean {
    let tile = this.grid[y][x]

    if (tile.state === TileState.Hidden) {
      tile.state = TileState.Revealed
      if (tile.hasMine) {
        return true
      }

      this.clearedTiles++
      if (tile.adjacentMines != 0) {
        return false
      }

      DIRECTIONS.forEach(([dx, dy]) => {
        let nx: number = tile.x + dx
        let ny: number = tile.y + dy
        if (this.coordinatesInRange(nx, ny)) {
          this.revealTileAndCheckForMine(nx, ny)
        }
      })
    }
    return false
  }

  

  private startNewGame() {
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

    this.grid = grid
  }

  private placeMines(): void {
    let placedMines: number = 0

    while (placedMines < this.mineCount) {
      let x: number = Math.floor(Math.random() * this.width)
      let y: number = Math.floor(Math.random() * this.height)

      let tile: Tile = this.grid[y][x]
      if (!tile.hasMine) {
        placedMines++
        tile.hasMine = true
      }
    }
  }

  private calculateAdjacent(): void {
    this.grid.forEach((array) => {
      array.forEach((tile) => {
        tile.adjacentMines = DIRECTIONS.reduce((n, [dx, dy]) => {
          let nx: number = tile.x + dx
          let ny: number = tile.y + dy
          if (this.coordinatesInRange(nx, ny)) {
            return n + (this.grid[ny][nx].hasMine ? 1 : 0)
          }
          return n
        }, 0)
      })
    })
  }

  private coordinatesInRange(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height
  }
}
