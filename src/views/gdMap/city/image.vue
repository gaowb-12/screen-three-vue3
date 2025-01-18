<template>
    <div class="container">
        <img class="city-image" src="@/assets/images/city/city-image.png" alt="" />
        <div v-for="(item, ind) in data" :key="ind">
            <span class="text" :class="'text-' + ind">{{ item.label }}</span>
            <!-- 飞线 -->
            <mSvglineAnimation
            class="fly-line click"
            :width="width"
            :height="height"
            color="#30DCFF"
            :strokeWidth="3"
            :dir="item.dir"
            :length="50"
            :path="item.path"
            @clickPath="clickPath(item)"
            ></mSvglineAnimation>
            
            <!-- 虚线 -->
            <svg class="fly-line"
            width="100%" height="100%"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            :viewBox="`0 0 ${width} ${height}`"
            >
                <path :d="item.path" stroke="#FFCC7E" stroke-width="2" stroke-dasharray="5,5" />
            </svg>
        </div>
    </div>
</template>

<script setup lang="ts">
import mSvglineAnimation from "@/components/mSvglineAnimation/index.vue"
import  {inject, ref} from "vue"
const width = ref(721)
const height = ref(57)

function getDistance(start, end) {
    const [startX, startY] = start;
    const [endX, endY] = end;
    let dx = startX - startY;
    let dy = endX - endY;
  return Math.sqrt(dx * dx + dy * dy);
}
function getBezierPath(start, end){
    const [startX, startY] = start;
    const [endX, endY] = end;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    let len = getDistance(start, end) / 6;
    return `M${startX},${startY} Q${midX},${midY -len} ${endX},${endY}`
}
const data = ref([
    {
        label:"康乐保",
        value: 120,
        path: getBezierPath([260,-120], [-100,-50]),
        dir:[0,1]
    },
    {
        label:"拜耳医药",
        value: 200,
        path: getBezierPath([550,-90], [0,40]),
        dir:[0,1]
    },
])

const changCityPath = inject<any>("changCityPath")
function clickPath(item){
    changCityPath(item)
}

</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    position: relative;
    .city-image{
        width: 100%;
        // height: 100%;
    }
    .fly-line{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    .click{
        z-index: 1;
    }
    .text{
        position: absolute;
        left: 50%;
        top: 50%;
        color: #fff;
        font-weight: 700;
        font-size: 24px;
        &-0{
            left: 34%;
            top: 10%;
        }
        &-1{
            left: 74%;
            top: 12%;
        }
    }
}
</style>