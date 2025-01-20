<template>
  <div class="left-card">
    <m-card title="跨境传输情况" subTitle="CROSS-BORDER TRANSMISSION SITUATION">
      <div class="container">
        <div class="item" v-for="item in items" :key="item.name">
          <div class="icon"></div>
          <div class="num">{{item.value}}</div>
          <div class="name">{{item.name}}</div>
        </div>
      </div>
    </m-card>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue"
import mCard from "@/components/mCard/index.vue"
// 千分位加逗号
function formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
const items = ref( [
  {name:"数据传输国家数", value: 26},
  {name:"境外第三方数量", value: 1358},
  {name:"出境企业数", value: 14},
  {name:"出境场景数", value: 31}
]);
items.value = items.value.map(item => {
  if (typeof item.value == "number"){
    item.value = formatNumber(item.value);
  }
  return item
});
</script>
<style lang="scss" scoped>
@keyframes iconScaleAnimate {
  0% {
    transform: scale(0.8);
  }
  0% {
    transform: scale(1);
  }
  100% {
    transform:scale(1.3);
  }
}
  .container{
    background: rgba(26, 26, 26, 0.36);
    padding: 22px 8px;
    display:flex;
    height: 100%;
    box-sizing: border-box;
    justify-content: space-around;
    .item{
      display:flex;
      align-items: center;
      flex-direction: column;
      padding:10px;
      border-right: 1px solid rgba(202, 202, 202, 0.1);
      .icon{
        width: 40px;
        height: 40px;
        background-repeat:no-repeat;
        background-position:center;
        background-size:contain;
        animation: iconScaleAnimate 1s ease infinite alternate ; 
      }
      .num{
        font-family: YouSheBiaoTiHei;
        font-size: 20px;
        color: #FFFFFF;
        margin: 10px 0; 
      }
      .name{
        font-family: Alibaba PuHuiTi 3.0;
        font-size: 12px;
        color: rgba(178, 178, 178,1);
      }
      &:nth-child(1){
        .icon{
          background-image:url("~@/assets/images/kuajing-icon/1.png");
        }
      }
      &:nth-child(2){
        .icon{
          background-image:url("~@/assets/images/kuajing-icon/2.png");
        }
      }
      &:nth-child(3){
        .icon{
          background-image:url("~@/assets/images/kuajing-icon/3.png");
        }
      }
      &:nth-child(4){
        .icon{
          background-image:url("~@/assets/images/kuajing-icon/4.png");
        }
      }
    }
  }
</style>
