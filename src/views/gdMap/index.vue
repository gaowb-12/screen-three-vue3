<template>
  <div class="large-screen">
    <!-- 地图 -->
    <span @click="changeIsCity" class="back-world" v-if="isCity">回到世界地图</span>
    <mapScene ref="mapSceneRef" v-if="!isCity"></mapScene>
    <City v-else /> 
    <div class="large-screen-wrap" id="large-screen">
      <m-header title="北京朝阳国际数据跨境服务枢纽" sub-text="BEIJINGCHAOYANGGUOJISHUJVKUAJINGFUWUSHUNIU"></m-header>
      <!-- 左边布局 图表 -->
      <div class="left-wrap">
        <div class="left-wrap-3d">
          <!-- 跨境传输情况 -->
          <BulkCommoditySalesChart></BulkCommoditySalesChart>
          <!-- 累计出境数量 -->
          <YearlyEconomyTrend></YearlyEconomyTrend>
          <!-- TOP10数据出境国家 -->
          <DistrictEconomicIncome v-if="!isClickCityPath"></DistrictEconomicIncome>
        </div>
      </div>
      <!-- 底边布局 图表 -->
      <div class="bottom-wrap" v-if="!isClickCityPath">
        <div class="bottom-wrap-3d">
          <!-- 合作企业 -->
          <ProportionPopulationConsumption @clickPie="clickPie"></ProportionPopulationConsumption>
          <!-- 电子商务行业企业跨境传输路径情况 -->
          <ElectricityUsage :pieData="pieData"></ElectricityUsage>
        </div>
      </div>
      <div class="bottom-wrap-flow" v-if="isClickCityPath" >
        <!-- 底部流程图 -->
        <FlowImage></FlowImage>
        <img src="@/assets/images/city/赛诺菲-流程图.png" alt="" />
      </div>
      <!-- 底部托盘 -->
      <div class="bottom-tray">
        <!-- svg线条动画 -->
        <mSvglineAnimation
          class="bottom-svg-line-left"
          :width="721"
          :height="57"
          color="#30DCFF"
          :strokeWidth="2"
          :dir="[0, 1]"
          :length="50"
          path="M1 56.6105C1 31.5123 185.586 10.0503 451.904 1.35519C458.942 1.12543 465.781 4.00883 470.505 9.22964L484.991 25.2383C487.971 28.4775 492.938 30.4201 498.254 30.4201H720.142"
        ></mSvglineAnimation>
        <mSvglineAnimation
          class="bottom-svg-line-left bottom-svg-line-right"
          :width="721"
          :height="57"
          color="#30DCFF"
          :strokeWidth="2"
          :dir="[0, 1]"
          :length="50"
          path="M1 56.6105C1 31.5123 185.586 10.0503 451.904 1.35519C458.942 1.12543 465.781 4.00883 470.505 9.22964L484.991 25.2383C487.971 28.4775 492.938 30.4201 498.254 30.4201H720.142"
        ></mSvglineAnimation>
      </div>
      <!-- 左右装饰线 -->
      <div class="large-screen-left-zsline"></div>
      <div class="large-screen-right-zsline"></div>
    </div>

    <!-- loading动画 -->
    <div class="loading">
      <div class="loading-text">
        <span style="--index: 1">L</span>
        <span style="--index: 2">O</span>
        <span style="--index: 3">A</span>
        <span style="--index: 4">D</span>
        <span style="--index: 5">I</span>
        <span style="--index: 6">N</span>
        <span style="--index: 7">G</span>
      </div>
      <div class="loading-progress">
        <span class="value">{{ state.progress }}</span>
        <span class="unit">%</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { shallowRef, ref, reactive, onMounted, onBeforeUnmount, defineAsyncComponent, provide  } from "vue"
import mapScene from "./map.vue"
import mHeader from "@/components/mHeader/index.vue"
import mSvglineAnimation from "@/components/mSvglineAnimation/index.vue"
import BulkCommoditySalesChart from "./components/BulkCommoditySalesChart.vue"
import YearlyEconomyTrend from "./components/YearlyEconomyTrend.vue"
import DistrictEconomicIncome from "./components/DistrictEconomicIncome.vue"
import FlowImage from "./components/FlowImage.vue"
import ProportionPopulationConsumption from "./components/ProportionPopulationConsumption.vue"
import ElectricityUsage from "./components/ElectricityUsage.vue"

import { Assets } from "./assets.js"
import emitter from "@/utils/emitter"
import gsap from "gsap"
import autofit from "autofit.js"

const City = defineAsyncComponent(() =>
  // import('./city/index.vue')
  import('./city/image.vue')
);

const assets = shallowRef()
const mapSceneRef = ref()
const isCity = ref(false)
const isClickCityPath = ref(false)
const pieData = ref()

const state = reactive({
  // 进度
  progress: 0,
  // 当前顶部导航索引
  activeIndex: "1",
  // 卡片统计数据
  totalView: [
    {
      icon: "xiaoshoujine",
      zh: "2024年生产总值",
      en: "Gross Domestic Product in 2024",
      value: 31500,
      unit: "亿元",
    },
    {
      icon: "zongxiaoliang",
      zh: "2024年常驻人数",
      en: "resident population in 2024",
      value: 15000,
      unit: "万人",
    },
  ],
})
function changeIsCity(data){
  console.log(data)
  isCity.value = !isCity.value
}
provide('changeIsCity', changeIsCity)

function changCityPath(item){
  isClickCityPath.value = !isClickCityPath.value
}
provide('changCityPath', changCityPath)

function clickPie(params){
  pieData.value = params.data
}

onMounted(() => {
  // 监听地图播放完成，执行事件
  emitter.$on("mapPlayComplete", handleMapPlayComplete)
  // 自动适配
  assets.value = autofit.init({
    dh: 1080,
    dw: 1920,
    el: "#large-screen",
    resize: true,
  })
  // 初始化资源
  initAssets(async () => {
    // 加载地图
    emitter.$emit("loadMap", assets.value)
    // 隐藏loading
    await hideLoading()
    // 播放场景
    mapSceneRef.value.play()
  })
})
onBeforeUnmount(() => {
  emitter.$off("mapPlayComplete", handleMapPlayComplete)
})
// 初始化加载资源
function initAssets(onLoadCallback) {
  assets.value = new Assets()
  // 资源加载进度
  let params = {
    progress: 0,
  }
  assets.value.instance.on("onProgress", (path, itemsLoaded, itemsTotal) => {
    let p = Math.floor((itemsLoaded / itemsTotal) * 100)
    gsap.to(params, {
      progress: p,
      onUpdate: () => {
        state.progress = Math.floor(params.progress)
      },
    })
  })
  // 资源加载完成
  assets.value.instance.on("onLoad", () => {
    onLoadCallback && onLoadCallback()
  })
}
// 隐藏loading
async function hideLoading() {
  return new Promise<void>((resolve, reject) => {
    let tl = gsap.timeline()
    tl.to(".loading-text span", {
      y: "200%",
      opacity: 0,
      ease: "power4.inOut",
      duration: 2,
      stagger: 0.2,
    })
    tl.to(".loading-progress", { opacity: 0, ease: "power4.inOut", duration: 2 }, "<")
    tl.to(
      ".loading",
      {
        opacity: 0,
        ease: "power4.inOut",
        onComplete: () => {
          resolve()
        },
      },
      "-=1"
    )
  })
}

function handleMenuSelect(index) {
  state.activeIndex = index
}
// 地图开始动画播放完成
function handleMapPlayComplete() {
  let tl = gsap.timeline({ paused: false })
  let leftCards = gsap.utils.toArray(".left-card")
  let rightCards = gsap.utils.toArray(".right-card")
  let countCards = gsap.utils.toArray(".count-card")
  tl.addLabel("start", 0.5)
  tl.addLabel("menu", 0.5)
  tl.addLabel("card", 1)
  tl.addLabel("countCard", 3)
  tl.to(".m-header", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "start")
  tl.to(".bottom-tray", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "start")
  tl.to(
    ".top-menu",
    {
      y: 0,
      opacity: 1,
      duration: 1.5,
      ease: "power4.out",
    },
    "-=1"
  )
  tl.to(".bottom-radar", { y: 0, opacity: 1, duration: 1.5, ease: "power4.out" }, "-=2")
  tl.to(leftCards, { x: 0, opacity: 1, stagger: 0.2, duration: 1.5, ease: "power4.out" }, "card")
  tl.to(rightCards, { x: 0, opacity: 1, stagger: 0.2, duration: 1.5, ease: "power4.out" }, "card")
  tl.to(
    countCards,
    {
      y: 0,
      opacity: 1,
      stagger: 0.2,
      duration: 1.5,
      ease: "power4.out",
    },
    "card"
  )
}
</script>

<style lang="scss">
@import "~@/assets/style/home.scss";
.back-world {
  position: absolute;
  right: 2%;
  top: 90px;
  color: #fff;
  z-index: 10;
  cursor: pointer;
  padding: 5px;
  border-radius:5px;
  background: rgba(24, 144, 255, 0.5);
}
.m-header-weather,
.m-header-date {
  span {
    padding-right: 10px;
    color: #c4f3fe;
    font-size: 14px;
  }
}
.top-menu {
  position: absolute;
  left: 0px;
  right: 0px;
  top: 40px;
  z-index: 3;
  display: flex;
  justify-content: center;
  .top-menu-mid-space {
    width: 800px;
  }
}
.bottom-radar {
  position: absolute;
  right: 500px;
  bottom: 100px;
  z-index: 3;
}
.main-btn-group {
  display: flex;
  left: 50%;
  transform: translateX(-50%);
  bottom: 10px;
  z-index: 999;
  &.disabled {
    pointer-events: none;
  }
  .btn {
    margin-right: 10px;
  }
}
.bottom-svg-line-left,
.bottom-svg-line-right {
  position: absolute;
  right: 50%;
  width: 721px;
  height: 57px;
  margin-right: -5px;
  bottom: -21px;
}
.bottom-svg-line-right {
  transform: scaleX(-1);
  left: 50%;
  right: inherit;
  margin-right: inherit;
  margin-left: -5px;
}
/* 初始化动画开始位置 */
.m-header {
  transform: translateY(-100%);
  opacity: 0;
}
.top-menu {
  transform: translateY(-250%);
  opacity: 0;
}
.count-card {
  transform: translateY(150%);
  opacity: 0;
}
.left-card {
  transform: translateX(-150%);
  opacity: 0;
}
.right-card {
  transform: translateX(150%);
  opacity: 0;
}
.bottom-tray {
  transform: translateY(100%);
  opacity: 0;
}
.bottom-radar {
  transform: translateY(100%);
  opacity: 0;
}
</style>
