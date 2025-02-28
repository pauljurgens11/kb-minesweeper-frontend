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
    private width: number,
    private height: number,
    private mineCount: number,
  ) {
    this.startNewGame()
  }

  /**
   * Handle tile click.
   *
   * @param x coordinate
   * @param y coordinate
   * @param isUserClick whether the click was made by the user or a recursive cascade
   * @returns true if the tile was a mine, false otherwise
   */
  public clickTile(x: number, y: number, isUserClick: boolean): boolean {
    let tile = this.grid[y][x]

    // Reveal adjacent tiles when adjacent flags are set correctly.
    if (
      isUserClick &&
      tile.state === TileState.Revealed &&
      this.checkFlagNumberValidity(tile)
    ) {

      for (let [dx, dy] of DIRECTIONS) {
        let nx: number = tile.x + dx
        let ny: number = tile.y + dy

        if (
          this.coordinatesInRange(nx, ny) &&
          this.grid[ny][nx].state === TileState.Hidden &&
          this.clickTile(nx, ny, false)
        ) {
          return true
        }
      }
    }

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
          this.clickTile(nx, ny, false)
        }
      })
    }
    return false
  }

  public flagTile(x: number, y: number) {
    let tile = this.grid[y][x]

    if (tile.state === TileState.Hidden) {
      tile.state = TileState.Flagged
    } else if (tile.state === TileState.Flagged) {
      tile.state = TileState.Hidden
    }
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

  /**
   * Check if number of adjacent flags is equal to number of adjacent mines.
   * 
   * NB! If adjacentMines number is 0, this method returns false.
   *
   * @returns true if the number of adjacent flags is equal to the number of
   * adjacent mines.
   */
  private checkFlagNumberValidity(tile: Tile): boolean {
    if (tile.adjacentMines == 0) return false

    let numOfFlags = 0

    DIRECTIONS.forEach(([dx, dy]) => {
      let nx: number = tile.x + dx
      let ny: number = tile.y + dy
      if (this.coordinatesInRange(nx, ny) && this.grid[ny][nx].state === TileState.Flagged) {
        numOfFlags += 1
      }
    })
    return numOfFlags === tile.adjacentMines
  }
}
