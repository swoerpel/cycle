import { Point } from "./canvas/models";

export function getRadialVertices(
    origin: Point, 
    radius: number, 
    vertices: number = 4,
    rotation:number = 0,
  ) : Point[]{
  let angle = Math.PI * 2 / vertices
  let points = []
  let orientation = Math.PI / vertices
  rotation = rotation / (Math.PI * 2);
  for (let a = -angle+0.001; a < Math.PI * 2 * (1 - 1 / vertices); a += angle) {
      let sx = origin.x + Math.cos(a + orientation + rotation) * radius;
      let sy = origin.y + Math.sin(a + orientation + rotation) * radius;
      points.push({ x: round(sx), y: round(sy) })
  }
  return points
}

export var round = (N,acc = 100000) => {
    return Math.round(N * acc) / acc
}

export function rotate(center: Point,point: Point, angle,scaleX = 1, scaleY = 1): Point {
  var radians = (Math.PI / 180) * angle,
      cos = scaleX * Math.cos(radians),
      sin = scaleY * Math.sin(radians),
      nx = (cos * (point.x - center.x)) + (sin * (point.y - center.y)) + center.x,
      ny = (cos * (point.y - center.y)) - (sin * (point.x - center.x)) + center.y;
  return {x:nx, y:ny};
}

export function SmoothLine(
  line: Point[], 
  current_iter: number, 
  dist_ratio: number,
  total_iters: number = 8, 
): Point[] {
  if(total_iters == current_iter)
    return line;
  else{
    let sm_line:Point[] = []
    sm_line.push(line[0])
    for (let i = 0; i < line.length - 1; i++) {
      sm_line.push({
        x: line[i].x + (dist_ratio) * (line[i + 1].x - line[i].x),
        y: line[i].y + (dist_ratio) * (line[i + 1].y - line[i].y)
      })
      sm_line.push({
        x: line[i].x + (1 - dist_ratio) * (line[i + 1].x - line[i].x),
        y: line[i].y + (1 - dist_ratio) * (line[i + 1].y - line[i].y)
      })
    }
    sm_line.push(line[line.length - 1])
    return SmoothLine(sm_line, current_iter + 1, dist_ratio,total_iters)
  }
}


export function linSet(min: number, max: number, length: number, sorted = true){
  const vals = [];
  const step = (max - min) / (length - 1);
  for(let i = min; i <= max; i+=step){
    vals.push(i)
  }
  return vals.sort().reverse();;
}
export function randSet(min, max, length){
  const vals = [];
  for(let i = 0; i < length; i++){
    vals.push(Math.random() * length * (max - min) + min)
  }
  return vals.sort()
}

export function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function midPoint(p1:Point, p2:Point){
  const minX = Math.min(p1.x,p2.x)
  const minY = Math.min(p1.y,p2.y)
  const maxX = Math.max(p1.x,p2.x)
  const maxY = Math.max(p1.y,p2.y)
  return {
    x: (maxX - minX) / 2 + minX,
    y: (maxY - minY) / 2 + minY
  }
}

export function rotateArray(arr: any[], count = 1): any[] {
  return [...arr.slice(count, arr.length), ...arr.slice(0, count)];
};