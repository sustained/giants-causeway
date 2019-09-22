import { clamp, randIntBetween } from "@/library/math";

const START_HUE = Math.floor(Math.random() * 360);

const ORIENTATION = {
  FLAT: "flat",
  POINTY: "pointy"
};

const PARITY = {
  EVEN: "even",
  ODD: "odd"
};

const HEX_ORIENTATION = ORIENTATION.POINTY;
const HEX_OFFSET_PARITY = PARITY.ODD;
const HEX_CORNER_OFFSET = HEX_ORIENTATION === ORIENTATION.FLAT ? 0 : -30;

/*
  TODO: We moved the constants (orientation, parity, etc. etc.) to a new Grid class, so now 
        we need to switch over to using that. Each Hexagon should probably take a grid param 
        in the constructor now and that will be the new source of the data.
*/
export default class Hexagon {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;

    /*
      TODO: Switch to using Offset class.
    */
    this.r = y; // r = row
    this.q = x; // q = column

    this._size = size;

    this._colour = {
      h: START_HUE,
      s: randIntBetween(50, 75),
      l: randIntBetween(20, 40)
    };
  }

  /*
    TODO: Move to Offset class.
  */
  get col() {
    return this.x;
  }

  /*
    TODO: Move to Offset class.
  */
  get row() {
    return this.y;
  }

  /*
    TODO: Move to Cube class.
  */
  get cube() {
    const x = this.col - (this.row + (this.row & 1)) / 2;
    const z = this.row;
    const y = -x - z;
    return [x, y, z];
  }

  set size(size) {
    this._size = size;
  }

  get size() {
    return this._size;
  }

  get width() {
    return 2 * this.size;
  }

  get height() {
    return Math.sqrt(3) * this.size;
  }

  get colour() {
    return `hsl(${this.hue}, ${this.saturation}%, ${this.lightness}%`;
  }

  get hue() {
    return this._colour.h;
  }

  get saturation() {
    return this._colour.s;
  }

  set saturation(s) {
    this._colour.s = s;
  }

  get lightness() {
    return this._colour.l;
  }

  set lightness(l) {
    this._colour.l = l;
  }

  updateColours(speed, strength) {
    if (Math.random() >= 1 - speed) {
      if (Math.random() >= 0.5) {
        this.lightness += strength * randIntBetween(0.1, 0.4);
      } else {
        this.lightness -= strength * randIntBetween(0.1, 0.4);
      }

      this.lightness = clamp(this.lightness, 20, 40);
    }

    if (Math.random() >= 1 - speed) {
      if (Math.random() >= 0.5) {
        this.saturation += strength * randIntBetween(0.1, 0.4);
      } else {
        this.saturation -= strength * randIntBetween(0.1, 0.4);
      }

      this.saturation = clamp(this.saturation, 50, 75);
    }
  }

  /*
    TODO:
    
      x - flat = w * 1.5 ; pointy = w * 1
      y - flat = h / 2   ; pointy = h * 0.75
  */
  get position() {
    return [
      this.xOffset + this.x * this.xSpacing,
      this.yOffset + this.y * this.ySpacing
    ];
  }

  /*
    How should the columns (X axis) be spaced out?
  */
  get xSpacing() {
    return HEX_ORIENTATION === ORIENTATION.FLAT
      ? this.width * 0.75
      : this.height;
  }

  /*
    How should the rows (Y axis) be spaced out?
  */
  get ySpacing() {
    return HEX_ORIENTATION === ORIENTATION.FLAT ? this.height : 1.5 * this.size;
  }

  /*
  	The X axis offset added to odd/even rows (depending on offset settings).
  */
  get xOffset() {
    if (this.y % 2 === 0 && HEX_ORIENTATION === ORIENTATION.POINTY) {
      let offset = Math.sqrt(3) * (this.size / 2);

      return HEX_OFFSET_PARITY === PARITY.ODD ? -offset : offset;
    }

    return 0;
  }

  /*
  	The Y axis offset added to odd/even columns (depending on offset settings).
  */
  get yOffset() {
    if (this.x % 2 === 0 && HEX_ORIENTATION === ORIENTATION.FLAT) {
      let offset = Math.sqrt(3) * (this.size / 2);

      return HEX_OFFSET_PARITY === PARITY.ODD ? -offset : offset;
    }

    return 0;
  }

  /*
    Get the Nth vertex of the hexagon polygon.
  */
  getCornerPoint(n) {
    const angleDeg = 60 * n - HEX_CORNER_OFFSET;
    const angleRad = (Math.PI / 180) * angleDeg;

    return [
      this.position[0] + this.size * Math.cos(angleRad),
      this.position[1] + this.size * Math.sin(angleRad)
    ];
  }

  render(context) {
    this.drawHexagon(context);
    //this.drawCenterPoint(context);
    this.drawCoordinates(context);
  }

  drawHexagon(context) {
    context.beginPath();
    context.moveTo(...this.getCornerPoint(0));

    for (let side = 1; side < 7; side++) {
      context.lineTo(...this.getCornerPoint(side));
    }

    context.fillStyle = this.colour;
    context.fill();
    context.closePath();
  }

  drawCenterPoint(context) {
    context.beginPath();
    context.arc(this.position[0], this.position[1], 2, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
    context.closePath();
  }

  drawCoordinates(context) {
    // const angleDeg = HEX_ORIENTATION === ORIENTATION.FLAT ? 210 : 180;
    const pos = [
      this.position[0], // + this.size * Math.cos((Math.PI / 180) * angleDeg) + 15,
      this.position[1] // + this.size * Math.sin((Math.PI / 180) * angleDeg) + -5
    ];
    context.beginPath();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "10px monospace";
    context.fillStyle = "white";
    context.translate(0, -7);
    context.fillText(`Q/R: ${this.q},${this.r}`, ...pos);
    context.translate(0, +14);
    context.fillText(`X/Y/Z: ${this.cube.join(",")}`, ...pos);
    context.translate(0, -7);
    // context.fillText(`r=${this.r}`, ...pos);
    // context.translate(0, -10);
    // context.fillText(`q=${this.q}`, ...pos);
    // context.translate(0, 10);
    context.closePath();
  }
}
