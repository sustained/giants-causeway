export const ORIENTATION = {
  FLAT: "flat", // odd-q, even-q
  POINTY: "pointy" // odd-r, even-r
};

export const OFFSET = {
  EVEN: "even",
  ODD: "odd"
};

/*
  SEE: https://www.redblobgames.com/grids/hexagons/#coordinates-offset
*/
export const LAYOUT = {
  ODD_R: "odd-r",
  EVEN_R: "even-r",
  ODD_Q: "odd-q",
  EVEN_Q: "even-q"
};

export default class Grid {
  constructor(offset, orientation) {
    if (!orientation) {
      this.setLayout(offset); // NOTE: If only one parameter is passed - presume layout.
    } else {
      this.offset = offset;
      this.orientation = orientation;
    }
  }

  get layout() {
    const offsetShorthand = this.orientation === ORIENTATION.POINTY ? "r" : "q";

    return `${this.offset}-${offsetShorthand}`;
  }

  /*
    Set the offset and the orientation based on a named layout.
  */
  setLayout(layout) {
    let offset, orientation;

    if (layout === LAYOUT.ODD_R || layout === LAYOUT.ODD_Q) {
      offset = OFFSET.ODD;
    } else if (layout === LAYOUT.EVEN_R || layout === LAYOUT.EVEN_Q) {
      offset = OFFSET.EVEN;
    }

    if (layout === LAYOUT.ODD_R || layout === LAYOUT.EVEN_R) {
      orientation = LAYOUT.POINTY;
    } else if (layout === LAYOUT.ODD_Q || layout === LAYOUT.EVEN_Q) {
      orientation = LAYOUT.FLAT;
    }

    if (!offset || !orientation) {
      throw new Error("Invalid layout passed to Grid.setLayout.");
    }

    this.offset = offset;
    this.orientation = orientation;
  }

  /*
    How much to offset the corner points by in Hexagon#getCornerPoint.
  */
  get cornerOffset() {
    return this.orientation === ORIENTATION.FLAT ? 0 : -30;
  }
}
