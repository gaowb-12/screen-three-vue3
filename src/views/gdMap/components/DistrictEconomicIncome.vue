<template>
  <div class="left-card">
    <m-card title="TOP10数据接收方国家" subTitle="TOP10 DATA RECIPIENT COUNTRIES" height="454">
      <div class="container">
        <div class="item" v-for="item in items" :key="item.name">
          <div class="name">{{item.name}}</div>
          <div class="progress">
            <div class="progress-bg"></div>
            <div class="progress-bar" :style="{width: `${getRate(item.value)}%`}"></div>
          </div>
          <div class="num">{{item.value}}</div>
        </div>
      </div>
    </m-card>
  </div>
</template>
<script setup>
import { ref, onMounted,onBeforeUnmount, nextTick } from "vue"
import mCard from "@/components/mCard/index.vue"
let items = ref([
  {name:"中国澳门", value:	8	 },
  {name:"泰国	", value:	7	 },
  {name:"中国香港	", value:	7	 },
  {name:"马来西亚	", value:	1	 },
  {name:"荷兰	", value:	5	 },
  {name:"新加坡	", value:	31	 },
  {name:"美国	", value:	11	 },
  {name:"日本	", value:	3	 },
  {name:"韩国	", value:	2	 },
  {name:"英国	", value:	2	 },
])
let max = ref(Infinity);

onMounted(()=>{
  items.value = items.value.sort((a, b)=>b.value - a.value);
  max.value = items.value[0]?.value || Infinity;
})
function getRate(value){
  return (value / max.value * 100).toFixed(2);
}


</script>
<style lang="scss" scoped>
  .container{
    padding: 22px 8px;
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    background: rgba(26, 26, 26, 0.36);
    .item{
      display:flex;
      align-items: center;
      padding:10px;
      .name{
        font-family: "Alibaba", "PuHuiTi", 3.0;
        font-size: 14px;
        color: rgba(178, 178, 178,1);
        width: 80px;
      }
      .progress{
        position: relative;
        flex: 1;
        padding: 0 10px;
        height:6px;
        .progress-bg, .progress-bar{
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          border-radius: 3px;
        }
        .progress-bg{
          background: #888888;
        }
        .progress-bar{
          width: 0%;
          background: linear-gradient(-90deg, #FFFFFF 7%, #FF891D 22%, #5D2D00 102%);
          transition: width 1s ease-in;
        }
      }
      .num{
        width: 60px;
        font-weight: bold;
        font-family: "Alibaba", "PuHuiTi", 3.0;
        font-size: 16px;
        color: #FFFFFF;
        text-align: right;
      }
    }
  }
</style>
