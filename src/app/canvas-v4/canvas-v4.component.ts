import { Component, OnInit } from '@angular/core';
import * as chroma from 'chroma.ts';
import * as p5 from 'p5';
import { linSet, rotate, shuffle, SmoothLine } from '../helpers';
import { Cell, Dims, Layer, LayerType, params, Point, ShapeStyle, SliceDirection, SquareCoords } from './params';

@Component({
  selector: 'app-canvas-v4',
  template: `<div class="canvas"></div>`,
  styleUrls: ['./canvas-v4.component.scss']
})
export class CanvasV4Component implements OnInit {



  constructor() { }

  ngOnInit() {
    // const colorMachine = chroma.scale(['lightblue'])
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(params.canvas.width, params.canvas.height);
        p.background(params.canvas.color);
        drawLayers(p);
      };
      p.draw = () => {
   
      }
    }
    let canvas = new p5(sketch);
  }
}



function drawLayers(p5: any){

  const types = [
    LayerType.Square,
    LayerType.Circle,
  ];
  const directions = [
    SliceDirection.Square,
    SliceDirection.Diagonal,
  ];

  const radii: number[] = [8,4,2,1,0.5];
  // const radii: number[] = linSet(0.5,2,3);
  

  // const colors: string[] = ['red','orange','yellow'];
  const gridDims: Dims[] = [
    {width: 4 * 4, height: 4},
    {width: 8 * 4, height: 8},
    // {width: 9, height: 9},
    // {width: 4, height: 4},
    // {width: 16, height: 16},
  ]

  const palettes = Object.keys(chroma.brewer);
  
  // const pal = 'Spectral'
  // const pal = ['white','white']
  const pal = randItem(palettes);
  console.log("pal",pal)
  const colorMachine = chroma.scale(pal);

  const colors = linSet(0,1,8).map(v => colorMachine(v).hex())
  const layers: Layer[] = [];
  for(let i = 0; i < 60; i++){
    layers.push({
      type: randItem(types),
      direction: randItem(directions),
      radius: randItem(radii),
      grid: randItem(gridDims),
      displaySeed: '1',
      style: {
        fill: randItem(colors),
        strokeWeight: 0.001,
        stroke: 'black',
        fillOpacity: 1,
      }
    })
  }

  console.log('layers',layers)



  layers.forEach((layer: Layer, i: number)=>{
    const grid = getGrid(layer.grid.width,layer.grid.height);
    const displaySeed: boolean[] = layer.displaySeed.split('').map(v => !!parseInt(v));
    console.log('displaySeed',displaySeed)

    
    const n = 20
    const cells: Cell[] = grid.map((point: Point,j: number) => {
      return {
        dims: {
          width: 1 / layer.grid.width,
          height: 1 / layer.grid.height,
        },
        center: point,
        // seed: dec2bin(i + j),
        // petalSeed: dec2bin([][j % 3]),//generateSeed(),
        petalSeed: generateSeed(),
        // petalSeed: (j % 7).toString().padStart(4,'0')

      }
    }).filter((_cell: Cell,i) => {
      return displaySeed[i % displaySeed.length];
    })

    shuffle(cells);
    cells.forEach((cell: Cell, i: number) => {
      let shapes: Point[][];
      switch(layer.type){
        case LayerType.Square: {
          switch(layer.direction){
            case SliceDirection.Square: {
              shapes = generateSquareQuarters(cell,layer.radius)
            }; break;
            case SliceDirection.Diagonal: {
              shapes = generateDiagonalQuarters(cell,layer.radius)
            }; break;
          }    
        }; break;
        case LayerType.Circle: {
          switch(layer.direction){
            case SliceDirection.Square: {
              shapes = generateSquareArcs(cell,layer.radius)
            }; break;
            case SliceDirection.Diagonal: {
              shapes = generateDiagonalArcs(cell,layer.radius)
            }; break;
          }    
        }; break;
      }
      shapes.forEach((shape: Point[])=>drawShape(p5,shape,layer.style));
    });
  })
}

function randItem<Item>(ary: Item[]): Item {
  return ary[Math.floor(Math.random() * ary.length)];
}


function drawShape(p5,points: Point[],style: ShapeStyle): void{
  p5.strokeWeight(style.strokeWeight * params.canvas.width);
  p5.stroke(style.stroke);
  let c = chroma.color(style.fill).rgba()
  c[3] = style.fillOpacity * 255;
  p5.fill(c);
  p5.strokeJoin(p5.ROUND);
  p5.beginShape();
  // console.log("points",points)
  points.forEach((v) => {
    p5.vertex(v.x * params.canvas.width,v.y * params.canvas.height)
  })

  p5.vertex(points[0].x  * params.canvas.width,points[0].y  * params.canvas.height)
  p5.endShape();
}




function generateSquareQuarters({center,petalSeed, dims}: Cell, radius: number): Point[][]{
  const xStep = radius * dims.width / 2;
  const yStep = radius * dims.height / 2;

  const topRight: Point[] = [
    {x: center.x, y: center.y},
    {x: center.x + xStep, y: center.y},
    {x: center.x + xStep, y: center.y - yStep},
    {x: center.x, y: center.y - yStep},
  ]

  const topLeft: Point[] = [
    {x: center.x, y: center.y},
    {x: center.x, y: center.y - yStep},
    {x: center.x - xStep, y: center.y - yStep},
    {x: center.x - xStep, y: center.y},
  ]

  const bottomLeft: Point[] = [
    {x: center.x, y: center.y},
    {x: center.x - xStep, y: center.y},
    {x: center.x - xStep, y: center.y + yStep},
    {x: center.x, y: center.y + yStep},    
  ]

  const bottomRight: Point[] = [
    {x: center.x, y: center.y},
    {x: center.x, y: center.y + yStep},
    {x: center.x + xStep, y: center.y + yStep},
    {x: center.x + xStep, y: center.y},
  ]
  const corners: Point[][] = [
    topRight,
    topLeft,
    bottomLeft,
    bottomRight,
  ]

  const squares = [];
  petalSeed.split('').forEach((bit: string, index: number)=>{
    if(parseInt(bit)){
      squares.push([...corners[index]]);
    }
  })
  return squares;

}

function generateDiagonalQuarters({center,petalSeed, dims}: Cell,radius: number): Point[][]{
  const xStep = radius * dims.width / 2;
  const yStep = radius * dims.height / 2;

  const top: Point[] = [
    {x: center.x, y: center.y},
    {x: center.x + xStep, y: center.y - yStep},
    {x: center.x - xStep, y: center.y - yStep},
  ]

  const left: Point[] = [
    {x: center.x, y: center.y},
    {x: center.x - xStep, y: center.y - yStep},
    {x: center.x - xStep, y: center.y + yStep},
  ]

  const bottom: Point[] = [
    {x: center.x, y: center.y},
    {x: center.x - xStep, y: center.y + yStep},
    {x: center.x + xStep, y: center.y + yStep},
  ]

  const right: Point[] = [
    {x: center.x, y: center.y},
    {x: center.x + xStep, y: center.y + yStep},
    {x: center.x + xStep, y: center.y - yStep},
  ]
  const sides: Point[][] = [
    top,
    left,
    bottom,
    right,
  ]

  const triangles = [];
  petalSeed.split('').forEach((bit: string, index: number)=>{
    if(parseInt(bit)){
      triangles.push([...sides[index]]);
    }
  })
  return triangles;
}


function generateSquareArcs({center,petalSeed, dims}: Cell, radius: number): Point[][]{
  const xStep = radius * dims.width / 2;
  const yStep = radius * dims.height / 2;
  const r = Math.sqrt(xStep * xStep + yStep * yStep);
  const angles = [0, Math.PI / 2, Math.PI, 3 * Math.PI / 2];
  const corners = angles.map((angle: number,i: number )=>{
    const startAngle = angle;
    const points = [];
    const pointCount = 60;
    const dTheta = Math.PI / 2 / (pointCount - 1)
    for(let i = 0; i < pointCount; i++){
      points.push({
        x: center.x + r * Math.cos(startAngle + dTheta * (i)),
        y: center.y + r * Math.sin(startAngle + dTheta * (i)),
      })
    }
    return [center,...points];
  })

  const arcs = [];
  petalSeed.split('').forEach((bit: string, index: number)=>{
    if(parseInt(bit)){
      arcs.push([...corners[index]]);
    }
  })
  return arcs;
}

function generateDiagonalArcs({center,petalSeed, dims}: Cell, radius: number): Point[][]{
  const xStep = radius * dims.width / 2;
  const yStep = radius * dims.height / 2;
  const r = Math.sqrt(xStep * xStep + yStep * yStep);
  const angles = [Math.PI/4, 3* Math.PI/4, 5 * Math.PI/4, 7* Math.PI/4];
  const corners = angles.map((angle: number,i: number )=>{
    const startAngle = angle;
    const points = [];
    const pointCount = 60;
    const dTheta = Math.PI / 2 / (pointCount - 1)
    for(let i = 0; i < pointCount; i++){
      points.push({
        x: center.x + r * Math.cos(startAngle + dTheta * (i)),
        y: center.y + r * Math.sin(startAngle + dTheta * (i)),
      })
    }
    return [center,...points];
  })

  const arcs = [];
  petalSeed.split('').forEach((bit: string, index: number)=>{
    if(parseInt(bit)){
      arcs.push([...corners[index]]);
    }
  })
  return arcs;
}


function getGrid(cols: number,rows: number): Point[]{
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

function generateSeed(length = 4){
  return (Math.floor(Math.random() * Math.pow(2,length)) >>> 0).toString(2).padStart(4,'0');
}


function dec2bin(dec: number): string {
  return ((dec % 16) >>> 0).toString(2).padStart(4,'0');
}
