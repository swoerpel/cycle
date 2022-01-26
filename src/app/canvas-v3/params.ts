
export interface Point{
  x: number;
  y: number;
  r?: number;
}

export interface Dim{
  w: number;
  h: number;
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

export const params = {
  canvas: {
    width: 2400,
    height: 2400,//*2,
    color: 'white',
  },
}