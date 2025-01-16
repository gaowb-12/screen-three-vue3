<template>
    <div class="city-container">
        <div id="city-loading" ref="uiContainer"></div>
        <canvas class="webgl" ref="canvasDom" height="580"></canvas>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import { useThreeCity } from "@/hooks/useThreeCity"

const canvasDom = ref();
const uiContainer = ref();
const instance = ref();
onMounted(() => {
    instance.value = useThreeCity(canvasDom.value)
});
onBeforeUnmount(() => {
    if (!instance.value) return
    // (instance.value as any).dispose();
});
</script>
<style scoped lang="scss">
.city-container{
    width: 100%;
    height: 100%;
    position: relative;
    #city-loading{
        position: absolute;
        left: 50%;
        top: 40%;
        color: #fff;
    }
}
</style>