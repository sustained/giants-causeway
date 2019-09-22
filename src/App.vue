<template>
  <div id="app">
    <HexagonBackground />
  </div>
</template>

<script>
import HexagonBackground from "@/components/HexagonBackground";

export default {
  name: "App",

  components: {
    HexagonBackground
  }
};
</script>

<style>
html {
  box-sizing: border-box;
}

* {
  margin: 0;
  padding: 0;
}

*,
*:before,
*:after {
  box-sizing: inherit;
}

#app {
  background-color: #20262e;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}
</style>
