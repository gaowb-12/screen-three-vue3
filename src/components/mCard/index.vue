<template>
  <div class="m-card" :style="calcWidthHeightStyle">
    <div class="m-card-hd">
      <div class="m-card-hd-bg"></div>
      <div class="saoguang">
        <img src="@/assets/images/m-card/saoguang.svg" alt="" />
      </div>
      <div class="border-left"></div>
      <div class="arrow-right"></div>
      <div class="m-card-hd-title">{{ title }} <span>{{ subTitle }}</span></div>
    </div>
    <div class="m-card-bd" :style="calcWidthHeightStyle">
      <div class="m-card-bd-bg" :style="calcWidthHeightStyle">
        <!-- <svg
          :width="width"
          :height="height"
          :viewBox="`0 0 ${width} ${height}`"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.6">
            <path :d="bdPath" fill="rgba(26, 57, 77,1)" />
            <path :d="bdPath" stroke="url(#paint1_linear_70_69585)" />
          </g>
          <defs>
            <linearGradient
              id="paint1_linear_70_69585"
              x1="199"
              y1="203.499"
              x2="199"
              y2="0.499359"
              gradientUnits="userSpaceOnUse"
            >
              <stop stop-color="#4FC5DD" />
              <stop offset="1" stop-color="#05839D" stop-opacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <img class="m-card-bd-bottom-left-arrow" src="@/assets/images/m-card/content-bottom-left-arrow.svg" alt="" />
        <img class="m-card-bd-bottom-right-arrow" src="@/assets/images/m-card/content-bottom-right-arrow.svg" alt="" />
        <img class="m-card-bd-middle-left-line" src="@/assets/images/m-card/content-middle-line.svg" alt="" />
        <img class="m-card-bd-middle-right-line" src="@/assets/images/m-card/content-middle-line.svg" alt="" /> -->
      </div>
      <div class="m-card-bd-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref, getCurrentInstance, onMounted } from "vue"

const props = defineProps({
  width: {
    type: Number,
    default: 500,
  },
  height: {
    type: Number,
    default: 200,
  },
  title: {
    type: String,
    default: "标题",
  },
  subTitle: {
    type: String,
    default: "",
  },
})
// 唯一id
const componentsUID = ref(1)
// svg的路径计算
const titleStorke = computed(() => {
  let width = props.width
  return `M165 0.5
  L165.707 -0.207107
  L165.414 -0.5
  H165
  V0.5Z
  M10 0.5
  V-0.5
  H9.58579
  L9.29289 -0.207107
  L10 0.5Z
  M175 10.5
  L174.293 11.2071
  L174.586 11.5
  H175
  V10.5Z
  M${width} 10.5
  H${width + 1}
  V9.5
  H${width}
  V10.5Z
  M${width} 34.5
  V35.5
  H${width + 1}
  V34.5
  H${width}Z
  M0 34.5
  H-1
  V35.5
  H0
  V34.5Z
  M0 10.5
  L-0.707107 9.79289
  L-1 10.0858
  V10.5
  H0Z
  M165 -0.5
  H10
  V1.5
  H165
  V-0.5Z
  M175.707 9.79289
  L165.707 -0.207107
  L164.293 1.20711
  L174.293 11.2071
  L175.707 9.79289Z
  M${width} 9.5
  H175
  V11.5
  H${width}
  V9.5Z
  M${width + 1} 34.5
  V10.5
  H397
  V34.5
  H${width + 1}Z
  M0 35.5
  H${width}
  V33.5
  H0
  V35.5Z
  M-1 10.5
  V34.5
  H1
  V10.5
  H-1Z
  M9.29289 -0.207107
  L-0.707107 9.79289
  L0.707107 11.2071
  L10.7071 1.20711
  L9.29289 -0.207107Z`
})
// bd的路径
const bdPath = computed(() => {
  const minHeight = 156
  let diff = props.height - minHeight
  let width = props.width
  // if (diff < minHeight) diff = 0
  return `M3.485 ${46.0565 + diff / 2}
  V${45.8735 + diff / 2}
  L3.36682 ${45.7337 + diff / 2}
  L0.5 ${42.343 + diff / 2}
  V1
  H${width - 0.5}
  V${42.3431 + diff / 2}
  L${width - 3.367} ${45.7337 + diff / 2}
  L${width - 3.485} ${45.8735 + diff / 2}
  V${46.0565 + diff / 2}
  L${width - 3.367} ${88.745 + diff / 2}
  L${width - 0.5} ${92.135 + diff / 2}
  V${155 + diff}
  H0.5
  V${92.135 + diff / 2}
  L3.36682 ${88.745 + diff / 2}
  L3.485 ${88.605 + diff / 2}
  V${88.422 + diff / 2}
  V${46.0565 + diff / 2}Z`
})

const calcWidthHeightStyle = computed(() => {
  return `width:${props.width}px;height:${props.height}px;`
})
onMounted(() => {
  componentsUID.value = "__" + getCurrentInstance().uid
})
</script>
<style lang="scss">
.m-card {
  position: relative;
  // background: rgba(26, 26, 26, 0.36);
  &-hd {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    z-index: 2;
    &-bg {
      position: absolute;
      left: 0;
      top: 0;
    }
    &-zs1 {
      position: absolute;
      right: 12px;
      top: 10px;
      width: 120px;
      height: 11px;
    }
    &-title {
      position: absolute;
      // left: 22px;
      padding-left:22px;
      box-sizing: border-box;
      width:100%;
      color: #fff;
      letter-spacing: 0.04em;
      height: 36px;
      line-height: 36px;
      font-family: "YouSheBiaoTiHei";
      font-size: 20px;
      font-weight: 600;
      white-space:nowrap;
      // background: -webkit-linear-gradient(rgba(219, 249, 255, 1), rgba(169, 240, 255, 1));
      // -webkit-background-clip: text;
      // -webkit-text-fill-color: transparent;

      background: linear-gradient(0deg, #615c5c 11%, #FFFFFF 82%);;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-fill-color: transparent;
      box-shadow: 2px 2px 3px 0px rgba(14, 14, 14, 0.5);
      span{
        background: linear-gradient(90deg, #888888 10%, rgba(0, 0, 0, 0.8) 82%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        font-family: "Alimama", "ShuHeiTi";
        font-size: 14px;
      }
    }
    .saoguang {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 36px;
      overflow: hidden;
      pointer-events: none;
      border-width: 2px 0px 2px 0px;
      border-style: solid;
      border-image: linear-gradient(270deg, rgba(169, 169, 169, 0.9) 0%, rgba(255, 255, 255, 0) 99%) 2 0 2 0;
      background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.272) 15%, transparent 64%, transparent 99%);
      img {
        width: 89px;
        height: 36px;
        animation: saoguangMove 6s linear infinite;
      }
    }
    .border-left {
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 36px;
      overflow: hidden;
      pointer-events: none;
      background: linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.5) 20%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0.5) 80%, transparent 100%);
    }
    .arrow-right {
      position: absolute;
      right: 20px;
      top: 18px;
      height:4px;
      border-right:4px solid #fff;
      pointer-events: none;
      z-index:1;
      &::after, &::before{
        content:"";
        position: absolute;
        top: -4px;
        right: 0;
        width:4px;
        height:4px;
        overflow: hidden;
        background:#fff;
      }
      &::after{
        top: auto;
        bottom: -4px;
      }
    }
  }
  &-bd {
    position: absolute;
    left: 0;
    top: 0;

    z-index: 1;

    &-bg {
      position: absolute;
      left: 0;
      top: 0;
    }
    &-bottom-left-arrow {
      position: absolute;
      left: 4px;
      bottom: 4px;
    }
    &-bottom-right-arrow {
      position: absolute;
      right: 4px;
      bottom: 4px;
    }
    &-middle-left-line {
      position: absolute;
      left: 0;
      top: 50%;
      margin-top: -35px;
    }
    &-middle-right-line {
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -35px;
    }
    &-content {
      backdrop-filter: blur(31px);
      position: absolute;
      left: 0;
      top: 36px;
      right: 0;
      bottom: 0;
      pointer-events: all;
      overflow: hidden;
      border-width: 0px 0px 2px 0px;
      border-style: solid;
      border-image: linear-gradient(270deg, rgba(169, 169, 169, 0.9) 0%, rgba(255, 255, 255, 0) 99%) 2 0 2 0;
    }
  }
}
@keyframes saoguangMove {
  from {
    transform: translateX(-160px);
  }
  to {
    transform: translateX(2000px);
  }
}
</style>
