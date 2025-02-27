export enum TileState {
  Hidden,
  Revealed,
  Flagged,
}

export interface Tile {
  x: number
  y: number
  hasMine: boolean
  state: TileState
  adjacentMines: number
}
