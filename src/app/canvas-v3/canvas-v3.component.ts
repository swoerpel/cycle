import { Component, OnInit } from '@angular/core';
import * as chroma from 'chroma.ts';
import * as p5 from 'p5';
import { rotate } from '../helpers';
import { params, Point, ShapeStyle, SquareCoords } from './params';

@Component({
  selector: 'app-canvas-v3',
  template: `<div class="canvas"></div>`,
  styleUrls: ['./canvas-v3.component.scss']
})
export class CanvasV3Component implements OnInit {



  constructor() { }

  ngOnInit() {
    // const colorMachine = chroma.scale(['lightblue'])
    const sketch = (p: p5) => {

      const index: number = 0;

      p.setup = () => {
        p.createCanvas(params.canvas.width, params.canvas.height)
        p.background(params.canvas.color);
        for(let i = 0; i < 10; i++){
          const seed = [i,i % 3,i,0,0,0]
          addSquare(p,seed)
        }

      };

      p.draw = () => {
   
      }
    }
    
    
    let canvas = new p5(sketch);
  }
}

function getSquareParamGroups(){
  // const starts = [
  //   {x: 0.2, y: 0.2},
  //   {x: 0.5, y: 0.2},
  //   {x: 0.5, y: 0.5},
  //   {x: 0.8, y: 0.8},
  // ]
  const starts = getGrid(4,4)
  console.log('starts',starts)
  const sizes = [
    {w: 0.1, h: 0.1},
    {w: 0.2, h: 0.2},
  ]
  const colors = ['blue','orange','yellow','green'];
  const strokes = ['white'];
  return {starts, sizes, colors, strokes };
}


// location of shape
// one of four quadrants
// size of shape
// fixed orientation

function addSquare(p5, values: number[] = [0,0,0,0,0,0]): void {

  const {starts, sizes, colors, strokes } = getSquareParamGroups()


  const strokeWeights = [0];
  const fillOpacities = [1];


  const shapeStyle: ShapeStyle = {
    fill: colors[values[2] % colors.length],
    strokeWeight: strokeWeights[3 % strokeWeights.length],
    stroke: strokes[values[4] % strokes.length],
    fillOpacity: fillOpacities[values[5] % fillOpacities.length],
  }

  const scaledCoords: SquareCoords = {
    cx: starts[values[0] % starts.length].x * params.canvas.width,
    cy: starts[values[0] % starts.length].y * params.canvas.height,
    w: sizes[values[1] % sizes.length].w / 2 * params.canvas.width,
    h: sizes[values[1] % sizes.length].h / 2 * params.canvas.height,
  } 
  const rect = [
    {
      x: scaledCoords.cx+scaledCoords.w,
      y: scaledCoords.cy-scaledCoords.h
    },
    {
      x: scaledCoords.cx-scaledCoords.w,
      y:scaledCoords.cy-scaledCoords.h
    },
    {
      x:scaledCoords.cx-scaledCoords.w,
      y:scaledCoords.cy+scaledCoords.h
    },
    {
      x:scaledCoords.cx+scaledCoords.w,
      y:scaledCoords.cy+scaledCoords.h
    },
  ];

  drawShape(p5,rect,shapeStyle)
}

function drawShape(
  p5,
  points,
  style
){
  p5.strokeWeight(style.strokeWeight);
  p5.stroke(style.stroke);
  let c = chroma.color(style.fill).rgba()
  c[3] = style.fillOpacity * 255;
  p5.fill(c);
  p5.strokeJoin(p5.ROUND);
  p5.beginShape();
  points.forEach((v) => p5.vertex(v.x,v.y))
  p5.vertex(points[0].x,points[0].y)
  p5.endShape();
}




// function drawRectangleGroup(p,rects: Point[][], styles: RectStyle[]){
//   rects.forEach((rect:Point[],i:number) => {
//     const style: RectStyle = styles[i % styles.length];
//     drawRectangle(p,rect,style)  
//   })
// }

// function drawRectangle(p,
//   rect: Point[],{
//   stroke, strokeWeight,
//   fill, fillOpacity,
// }: RectStyle){
//   p.strokeWeight(strokeWeight);
//   p.stroke(stroke);
//   let c = chroma.color(fill).rgba()
//   c[3] = fillOpacity * 255;
//   p.fill(c);
//   p.strokeJoin(p.ROUND);
//   p.beginShape();
//   rect.forEach((v: Point) => p.vertex(v.x,v.y))
//   p.vertex(rect[0].x,rect[0].y)
//   p.endShape();
// }

// function getRectangleGroup(
//   origins:Point[],
//   dims:Dim[],
//   rotFunct: Function
// ): Point[][]{
//   return origins.map(({x,y},i)=>{

//     const {w,h} = dims[i % dims.length];

//     const t = rotFunct(x,y,i);
//     return getRectangle(x,y,w,h,t);
//   })
// }

// function getRectangle(x,y,w,h,t): Point[]{
//   const rw = w/2 * params.canvas.width;
//   const rh = h/2 * params.canvas.height;
//   const sx = x * params.canvas.width;
//   const sy = y * params.canvas.height;
//   const c = {x:sx,y:sy};
//   const rect = [
//     {x:sx+rw,y:sy-rh},
//     {x:sx-rw,y:sy-rh},
//     {x:sx-rw,y:sy+rh},
//     {x:sx+rw,y:sy+rh},
//   ];
//   return rect.map(p => rotate(c,p,t));
// }

function getGrid(rows,cols): Point[]{
  const grid = [];
  const xStep = 1 / cols;
  const yStep = 1 / rows;
  let index = 0;
  for(let i = 0; i < cols; i++){
    for(let j = 0; j < rows; j++){
      grid.push({
        index,
        x: i * xStep + xStep / 2,
        y: j * yStep + yStep / 2,
      })
      index++;
    }
  }
  return grid;
}

