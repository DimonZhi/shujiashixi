import * as d3 from "d3";

class CAMapGenerator {
  generatePoints(width, height, spawn = 65, createLimit = 5, destroyLimit = 5, iterations = 5, threshold = 0.5) {
    const W = Math.max(1, Math.floor(Number(width)));
    const H = Math.max(1, Math.floor(Number(height)));
    const EMPTY = 0, SOLID = 1;

    const createMap = () => Array.from({ length: W }, () => Array(H).fill(EMPTY));

    const countN = (x, y, map) => {
      let c = 0;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          if (dx === 0 && dy === 0) continue;
          const xx = x + dx, yy = y + dy;
          if (xx < 0 || yy < 0 || xx >= W || yy >= H) c++;
          else if (map[xx][yy] === SOLID) c++;
        }
      }
      return c;
    };

    let map = createMap();
    for (let x = 0; x < W; x++) for (let y = 0; y < H; y++) if (Math.random() * 100 <= spawn) map[x][y] = SOLID;

    for (let i = 0; i < iterations; i++) {
      const next = createMap();
      for (let x = 0; x < W; x++) {
        for (let y = 0; y < H; y++) {
          const n = countN(x, y, map);
          next[x][y] = map[x][y] === SOLID ? (n < destroyLimit ? EMPTY : SOLID) : (n > createLimit ? SOLID : EMPTY);
        }
      }
      map = next;
    }

    const values = new Array(W * H);
    let k = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) values[k++] = map[x][y];

    const contour = d3.contours().size([W, H]).thresholds([threshold])(values);
    return contour;
  }
}

export { CAMapGenerator };
