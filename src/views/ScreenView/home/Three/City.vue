<template>
  <div style="box-sizing: border-box;" ref="canvasContainer">
    <canvas class="webgl" ref="canvasDom" height="580"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useThreeCity } from "@/hooks/useThreeCity"

const canvasContainer = ref();
const canvasDom = ref();
const instance = ref();
onMounted(() => {
  let width = canvasContainer.value.offsetWidth
  canvasDom.value.width = width
  instance.value  = useThreeCity(canvasDom.value)
});
onBeforeUnmount(() => {
  if (!instance.value) return
  // (instance.value as any).dispose();
});
</script>
<style lang="scss">
.label {
  color: #fff;
  font-family: sans-serif;
  padding: 2px;
  background: rgba( 10, 10, 10, 0.8 );
  .label-content{
    font-size: 10px;
  }
}
</style>