<template>
  <div class="map">
    <canvas id="canvasMap"></canvas>
  </div>
</template>
<script setup>
import { onMounted, shallowRef, onBeforeUnmount,inject } from "vue";
import { World } from "./map.js";
import emitter from "@/utils/emitter";
const canvasMap = shallowRef(null);

const changeIsCity = inject("changeIsCity")
onMounted(() => {
  emitter.$on("loadMap", loadMap);
});
onBeforeUnmount(() => {
  canvasMap.value && canvasMap.value.destroy();
  emitter.$off("loadMap", loadMap);
});
function loadMap(assets) {
  let options = {
    changeIsCity
  }
  canvasMap.value = new World(document.getElementById("canvasMap"), assets, options);
  canvasMap.value.time.pause();
}
async function play() {
  canvasMap.value.time.resume();
  canvasMap.value.animateTl.timeScale(1); // 设置播放速度正常
  canvasMap.value.animateTl.play();
}
defineExpose({
  loadMap,
  play,
  canvasMap,
});
</script>

<style lang="scss">
.map {
  position: absolute;
  z-index: 1;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: #000;
  .info-point {
    background: rgba(0, 4, 5, 0.8);
    // width: 200px;
    padding: 15px;
    will-change: transform;
    border-top: 6px solid #1EFF62;
    &-wrap {}
    &-label {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-bottom: 5px;
      .province {
        margin-right: 20px;
        font-family: "Alimama", "ShuHeiTi";
        font-size: 24px;
        font-weight: bold;
        color: #1EFF62;
        .icon{
          display: inline-block;
          vertical-align: middle;
          width:40px;
          height: 40px;
          background: url(~@/assets/images/china-flag.png) no-repeat center;
          background-size: contain;
          background-position: 0 -4px;
          margin-right: 5px;
        }
        .arrow{
          transform: scale(0.8);
          display: inline-block;
        }
      }
      .other {
        font-family: Open Sans;
        font-size: 10px;
        color: #ffffff;
        max-width: 60px;
      }
    }
    &-content {
      display: flex;
      .content-item {
        flex: 1;
        padding-left:10px ;
        .label {
          color: #888888;
          font-family: Open Sans;
          font-size: 12px;
          margin-bottom: 10px;
        }
        .value {
          color: #ffffff;
          font-family: Open Sans;
          font-weight: bold;
          font-size: 18px;
        }
      }
    }
  }
  .provinces-label {
    &-wrap {
      transform: translate(50%, 200%);
      opacity: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 18px;
      width: 200px;
      height: 53px;
      border-radius: 30px 30px 30px 0px;
      background: rgba(0, 0, 0, 0.4);
    }
    .number {
      color: #fff;
      font-size: 30px;
      font-weight: 700;

      .unit {
        color: #fff;
        font-size: 12px;
        font-weight: 400;
        opacity: 0.5;
        padding-left: 5px;
      }
    }
    .name {
      color: #fff;
      font-size: 16px;
      font-weight: 700;
      span {
        display: block;
      }
      .en {
        color: #fff;
        font-size: 10px;
        opacity: 0.5;
        font-weight: 700;
      }
    }
    .no {
      color: #7efbf6;
      text-shadow: 0 0 5px #7efbf6, 0 0 10px #7efbf6;
      font-size: 30px;
      font-weight: 700;
    }
    .yellow {
      .no {
        color: #fef99e !important;
        text-shadow: 0 0 5px #fef99e, 0 0 10px #fef99e !important;
      }
    }
  }

  .china-label {
    color: #fff;

    font-size: 12px;
    will-change: transform;
    .other-label {
      display: flex;
      align-items: center;
      padding: 5px;
      border-radius: 4px;
      background: rgba(0, 0, 0, 0.6);
      will-change: transform;
    }

    &.blur {
      filter: blur(2px);
      opacity: 0.5;
    }
    .label-icon {
      display: block;
      width: 20px;
      height: 20px;
      margin: 0 10px 0 0;
    }
  }
  .map-label {
    padding: 5px;
    color: #fff;
    will-change: transform;
    font-size: 36px;
    font-weight: bold;
    letter-spacing: 4.5px;
    -webkit-box-reflect: below 0 -webkit-linear-gradient(transparent, transparent
          20%, rgba(255, 255, 255, 0.3));
    .other-label {
      display: flex;
      flex-direction: column;
    }
    span {
      font-size: 46px;
      &:last-child {
        font-size: 12px;
        font-weight: normal;
        letter-spacing: 0px;
        color: #a7d5ef;
      }
    }
  }
  .decoration-label {
    // &.reflect {
    //   -webkit-box-reflect: below 0 -webkit-linear-gradient(transparent, transparent 20%, rgba(255, 255, 255, 0.3));
    // }
    // padding-bottom: 10px;
    .label-icon {
      display: block;
      width: 40px;
      height: 40px;
    }
  }
  .other-label {
    transform: translateY(200%);
    opacity: 0;
    background: none;
    will-change: transform;
  }
}
</style>
