
export interface Point{
  x: number;
  y: number;
  r?: number;
}

export interface Dim{
  w: number;
  h: number;
}

export interface RectStyle{
  stroke: string;
  strokeWeight: number;
  fill: string;
  fillOpacity: number;
}

export const params = {
  canvas: {
    width: 2400,
    height: 2400,//*2,
    color: 'black',
  },
}