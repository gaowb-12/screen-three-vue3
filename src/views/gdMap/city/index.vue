<template>
  <canvas class="webgl" ref="canvasDom" height="580"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useThreeCity } from "@/hooks/useThreeCity"

const canvasDom = ref();
const instance = ref();
onMounted(() => {
  instance.value  = useThreeCity(canvasDom.value)
});
onBeforeUnmount(() => {
  if (!instance.value) return
  // (instance.value as any).dispose();
});
</script>
<style>
.label {
  color: #fff;
  font-family: sans-serif;
  padding: 2px;
  background: rgba( 10, 10, 10, 0.8 );
}
</style>