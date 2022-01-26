import { Component, OnInit } from '@angular/core';
import * as chroma from 'chroma.ts';
import * as p5 from 'p5';
import { rotate } from '../helpers';
import { Dim, params, Point, RectStyle } from './params';

@Component({
  selector: 'app-canvas-v2',
  template: `<div class="canvas"></div>`,
  styleUrls: ['./canvas-v2.component.scss']
})
export class CanvasV2Component implements OnInit {

  constructor() { }

  ngOnInit() {
    // const colorMachine = chroma.scale(['lightblue'])
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(params.canvas.width, params.canvas.height)
        // p.background(params.canvas.backgroundColor);
        

        // const origins = linSet(0,1,12).map((x,i)=>({x,y:0.5}))
        const s = 3;
        const origins = getGrid(8*s,8*s*2);
        console.log('origins',origins)

        const dims = [
          // {w:0.1/s,h:0.1/s},
          {w:0.04/s,h:0.08/s},
          // {w:0.03/s,h:0.12/s},
          // {w:0.12/s,h:0.03/s},
          // {w:0.06/s,h:0.06/s},
          // {w:0.12/s,h:0.04/s},
          // {w:0.16/s,h:0.02/s},
          // {w:0.02/s,h:0.10/s},
          // {w:0.04/s,h:0.10/s},
        ]


        const distance = (x0,y0,x1,y1) => {
          return (x1-x0) / (y1-y0);// + y0 - x1 + 2*y1
          // return Math.sqrt(Math.pow((x1 - x0),2) + Math.pow((y1 - y0),2))
        }

        const rotFunct = (x,y,i) => {
          const d = Math.floor(distance(x,y,1,0.5) * 60);
          console.log('d',d);
          return d;
        }


        const defaultStyle = {
          stroke:'black',
          strokeWeight: 0,//params.canvas.width * 0.001,
          fill: 'white',
          fillOpacity: 1,
        }
        const colorMachine = chroma.scale(['blue','green']);
        const styles: RectStyle[] = origins.map((_,i)=>{
          const cv = i / origins.length
          return {...defaultStyle, fill: colorMachine(cv).hex()}
        })
        //====================================
        const rects = getRectangleGroup(origins,dims, rotFunct)
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

function getRectangleGroup(
  origins:Point[],
  dims:Dim[],
  rotFunct: Function
): Point[][]{
  return origins.map(({x,y},i)=>{

    const {w,h} = dims[i % dims.length];

    const t = rotFunct(x,y,i);
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

