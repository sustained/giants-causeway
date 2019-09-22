<template>
  <div>
    <canvas id="hexagon-background" :width="width" :height="height" />
  </div>
</template>

<script>
import Hexagon from "@/library/hexagon";

export default {
  name: "HexagonBackground",

  data() {
    return {
      hexagons: [],
      size: 50,
      canvas: null,
      context: null,
      width: window.innerWidth,
      height: window.innerHeight,
      speed: 0.2,
      strength: 1
    };
  },

  mounted() {
    this.canvas = document.getElementById("hexagon-background");
    this.context = this.canvas.getContext("2d");

    this.context.translate(0.5, 0.5); // NOTE: Anti-aliasing.
    /*
      TODO: We need to figure out how to handle the grid being partially off screen 
            depending on the grid layout (flat/pointy orientation; odd/even offset).
    */
    this.context.translate(Math.sqrt(3) * this.size, 50);

    /*
      TODO: Of course we want to dynamically decide how big of a grid will fill the screen 
            and we should take into account the grid layout, again.
    */
    for (let y = 0; y < 5; y++) {
      for (let x = 0; x < 8; x++) {
        this.hexagons.push(new Hexagon(x, y, this.size));
      }
    }

    this.render();
  },

  methods: {
    render() {
      this.context.clearRect(0, 0, this.width, this.height);

      for (let hexagon of this.hexagons) {
        hexagon.updateColours(this.speed, this.strength);
        hexagon.render(this.context);
      }

      requestAnimationFrame(this.render);
    }
  }
};
</script>
