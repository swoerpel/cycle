import { Component, OnInit } from '@angular/core';
import * as chroma from 'chroma.ts';
import * as p5 from 'p5';
import { linSet, rotate } from '../helpers';
import { Dim, params, Point, RectStyle } from './params';

@Component({
  selector: 'app-canvas',
  template: `<div class="canvas"></div>`,
  styleUrls: ['./canvas.component.scss']
})
export class CanvasComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    // const colorMachine = chroma.scale(['lightblue'])
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(params.canvas.width, params.canvas.height)
        p.background(params.canvas.backgroundColor);
        

        // const origins = linSet(0,1,12).map((x,i)=>({x,y:0.5}))
        const origins = getGrid(17,21);
        console.log('origins',origins)
        const dims = [
          // {w:0.04,h:1},
          // {w:0.06,h:0.8},
          // {w:0.01,h:0.06},
          // {w:0.02,h:0.12},
          // {w:0.03,h:0.18},
          {w:0.02,h:0.12},
          {w:0.02,h:0.12},
          {w:0.04,h:0.24},
          {w:0.12,h:1},
          // {w:0.04,h:.8},
          // {w:0.04,h:.12},
          // {w:0.04,h:1.5},
        ]

        const rots = [
          0,45,90,135,225
        ]

        const defaultStyle = {
          stroke:'black',
          strokeWeight: params.canvas.width * 0.001,
          fill: 'white',
          fillOpacity: 0.3,
        }
        const colorMachine = chroma.scale('RdYlBu');
        const styles: RectStyle[] = origins.map((_,i)=>{
          const cv = i / origins.length
          return {...defaultStyle, fill: colorMachine(cv).hex()}
        })
        //====================================
        const rects = getRectangleGroup(origins,dims,rots)
        drawRectangleGroup(p,rects,styles)
      }; 
    }
    let canvas = new p5(sketch);
  }
}


function drawRectangleGroup(p,rects: Point[][], styles: RectStyle[]){
  rects.forEach((rect:Point[],i:number) => {
    const style: RectStyle = styles[i % styles.length];
    drawRectangle(p,rect,style)  
  })
}

function drawRectangle(p,
  rect: Point[],{
  stroke, strokeWeight,
  fill, fillOpacity,
}: RectStyle){
  p.strokeWeight(strokeWeight);
  p.stroke(stroke);
  let c = chroma.color(fill).rgba()
  c[3] = fillOpacity * 255;
  p.fill(c);
  p.strokeJoin(p.ROUND);
  p.beginShape();
  rect.forEach((v: Point) => p.vertex(v.x,v.y))
  p.vertex(rect[0].x,rect[0].y)
  p.endShape();
}

function getRectangleGroup(origins:Point[],dims:Dim[],rots:Number[]): Point[][]{
  return origins.map(({x,y},i)=>{
    const {w,h} = dims[i % dims.length];
    const t = rots[i % rots.length];
    return getRectangle(x,y,w,h,t);
  })
}

function getRectangle(x,y,w,h,t): Point[]{
  const rw = w/2 * params.canvas.width;
  const rh = h/2 * params.canvas.height;
  const sx = x * params.canvas.width;
  const sy = y * params.canvas.height;
  const c = {x:sx,y:sy};
  const rect = [
    {x:sx+rw,y:sy-rh},
    {x:sx-rw,y:sy-rh},
    {x:sx-rw,y:sy+rh},
    {x:sx+rw,y:sy+rh},
  ];
  return rect.map(p => rotate(c,p,t));
}

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

