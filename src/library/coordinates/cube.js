import Grid, { LAYOUT } from "@library/grid";

class Cube {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toArray() {
    return [this.x, this.y, this.z];
  }
}

Cube.fromOffset = function(offset, layout) {
  let x, z;

  if (layout instanceof Grid) {
    layout = layout.layout;
  }

  switch (layout) {
    case LAYOUT.ODD_R:
      x = offset.col - (offset.row - (offset.row & 1)) / 2;
      z = offset.row;
      break;

    case LAYOUT.EVEN_R:
      x = offset.col - (offset.row + (offset.row & 1)) / 2;
      z = offset.row;
      break;

    case LAYOUT.ODD_Q:
      x = offset.col;
      z = offset.row - (offset.col - (offset.col & 1)) / 2;
      break;

    case LAYOUT.EVEN_Q:
      x = offset.col;
      z = offset.row - (offset.col + (offset.col & 1)) / 2;
      break;

    default:
      throw new Error(
        "Cannot convert from an offset to a cube coordinate without a valid grid layout."
      );
  }

  return new Cube(x, -x - z, z);
};

Cube.round = function(cube) {
  let rx = Math.round(cube.x);
  let ry = Math.round(cube.y);
  let rz = Math.round(cube.z);

  const xDiff = Math.abs(rx - cube.x);
  const yDiff = Math.abs(ry - cube.y);
  const zDiff = Math.abs(rz - cube.z);

  if (xDiff > yDiff && yDiff > zDiff) {
    rx = -ry - rz;
  } else if (yDiff > zDiff) {
    ry = -rx - rz;
  } else {
    rz = -rx - ry;
  }

  return Cube(rx, ry, rz);
};

export default Cube;
