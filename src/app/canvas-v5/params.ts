
export interface Point{
  x: number;
  y: number;
  r?: number;
}

export interface Dims{
  width: number;
  height: number;
}
export const params = {
  canvas: {
    width: 4800,
    height: 4800,//*2,
    backgroundColor: 'white',
  },
}