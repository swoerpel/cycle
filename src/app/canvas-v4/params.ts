
export interface Point{
  x: number;
  y: number;
  r?: number;
}

export interface Dims{
  width: number;
  height: number;
}

export interface Cell{
  center: Point;
  dims: Dims;
  petalSeed: string;
}


export interface ShapeStyle{
  stroke: string;
  strokeWeight: number;
  fill: string;
  fillOpacity: number;
}

export interface SquareCoords{
  cx: number;
  cy: number;
  w: number;
  h: number;
}

export interface Layer {
  type: LayerType;
  direction: SliceDirection;
  radius: number;
  style: ShapeStyle;
  grid: Dims;
  displaySeed: string;
}

export enum LayerType {
  Square = 'Square',
  Circle = 'Circle',
}

export enum SliceDirection{
  Square = 'Square',
  Diagonal = 'Diagonal'
}


export const params = {
  canvas: {
    width: 2400 * 4,
    height: 2400,//*2,
    color: 'white',
  }
}