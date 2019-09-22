export function clamp(val, min, max) {
  return val > max ? max : val < min ? min : val;
}

export function randFloatBetween(min, max) {
  return Math.random() * (max - min) + min;
}

export function randIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}
