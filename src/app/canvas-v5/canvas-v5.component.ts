import { Component, OnInit } from '@angular/core';
import * as chroma from 'chroma.ts';
import * as p5 from 'p5';
import { Point } from './models';
import { params } from './params';

@Component({
  selector: 'app-canvas-v5',
  template: `<div class="canvas"></div>`,
  styleUrls: ['./canvas-v5.component.scss']
})
export class CanvasV5Component implements OnInit {

  constructor() { }

  ngOnInit() {
    
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(params.canvas.width, params.canvas.height)
        p.background(params.canvas.backgroundColor);
        let triangle = [
          {x: 1, y: 0},
          {x: 0, y: 1},
          {x: 0, y: 0},
        ]
        createTiling(p,triangle)
        triangle = [
          {x: 0, y: 1},
          {x: 1, y: 0},
          {x: 1, y: 1},
        ]
        createTiling(p,triangle)
      }; 
    }
    let canvas = new p5(sketch);
  }
}


function createTiling(p: any, triangle: Point[]){
  const split = splitTriangle(triangle)
  let colorMachine = chroma.scale('Spectral')
  let index = 0;
  split.forEach((t) => {
    const subSplit = splitTriangle(t);
    subSplit.forEach((t) => {
      const subSubSplit = splitTriangle(t);
      subSubSplit.forEach((t) => {
        drawTriangle(p,t,colorMachine(index/(5*5*5-1)).hex())
        index++;
      })
    })
  })
}


function splitTriangle(t:Point[]){
  const A = t[0];
  const B = t[1];
  const C = t[2];
  const D: Point = {
    x: (A.x + 4 * B.x) / 5,
    y: (A.y + 4 * B.y) / 5
  } 
  const E: Point = {
    x: (A.x + 4 * B.x + 5 * C.x) / 10,
    y: (A.y + 4 * B.y + 5 * C.y) / 10,
  } 
  const F: Point = {
    x: (3 * A.x + 2 * B.x) / 5,
    y: (3 * A.y + 2 * B.y) / 5,
  } 
  const G: Point = {
    x: (A.x + C.x) / 2,
    y: (A.y + C.y) / 2,
  } 
  return [
    [C,B,D],
    [G,C,E],
    [F,E,D],
    [E,F,G],
    [A,G,F],
  ]
}

function drawTriangle(p5,triangle: Point[],color){
  p5.strokeWeight(0);//style.strokeWeight * params.canvas.width);
  // p5.stroke(style.stroke);
  // let c = chroma.color(style.fill).rgba()
  // c[3] = style.fillOpacity * 255;
  p5.fill(color);
  // p5.strokeJoin(p5.ROUND);
  p5.beginShape();
  // // console.log("points",points)
  triangle.forEach((v) => {
    p5.vertex(v.x * params.canvas.width,v.y * params.canvas.height)
  })

  p5.vertex(triangle[0].x * params.canvas.width,triangle[0].y  * params.canvas.height)
  p5.endShape();
}

// function drawShape(p5,points: Point[]): void{

// }

