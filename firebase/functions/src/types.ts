export interface IPosition {
  x: number,
  y: number
}

export interface IUser {
  name: string,
  x: number,
  y: number,
  score: number
}

export enum IDirection {
  UP = 'up',
  DOWN = 'down',
  LEFT = 'left',
  RIGHT = 'right'
}
