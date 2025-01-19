<template>
  <div class="left-card">
    <m-card title="累计出境数量" subTitle="LEIJICHUJINGSHULIANG" height="260">
      <div class="container">
        <div class="item" v-for="item in items" :key="item.name">
          <div class="left">
            <div class="name">{{item.name}}</div>
            <div class="num">{{item.value}}</div>
          </div>
          <!-- <div class="right">
            <span class="hidden">{{item.value}}</span>
            <span class="num">{{item.value}}</span>
          </div> -->
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

const items = ref([
  {name:" 个人信息数据量（GB）", value: "35.25GB", rate:0, upOrDown:"up"},
  {name:" 敏感个人信息数量（GB）", value: "775.6MB", rate:0, upOrDown:"up"},
  {name:" 个人信息出境涉及人数 ", value: 4219001, rate:0, upOrDown:"up"},
  {name:" 敏感个人信息出境涉及人数", value: 1071080, rate:0, upOrDown:"up"},
])
items.value = items.value.map(item => {
  if (typeof item.value == "number"){
    item.value = formatNumber(item.value);
  }
  return item
});
</script>
<style lang="scss" scoped>
  .container{
    height: 100%;
    box-sizing: border-box;
    background: rgba(26, 26, 26, 0.36);
    padding: 10px;
    display:flex;
    flex-wrap:wrap;
    justify-content: space-around;
    .item{
      display:flex;
      justify-content: space-around;
      padding:10px;
      width:45%;
      margin-bottom: 15px;
      &:nth-child(odd){
        border-right: 1px solid rgba(202, 202, 202, 0.1);
      }
      .left{
        display:flex;
        justify-content: space-around;
        flex-direction: column;
        align-items: center;
        .num{
          font-family: "YouSheBiaoTiHei";
          font-size: 20px;
          color: #FFFFFF;
          margin: 10px 0; 
        }
        .name{
          font-family: Alibaba PuHuiTi 3.0;
          font-size: 12px;
          color: rgba(178, 178, 178,0.6);
        }
      }
      .right{
        display:flex;
        align-items: center;
        justify-content: space-around;
        flex-direction: column;
        color:rgba(42, 228, 92, 1);
        .hidden{
          visibility:hidden;
        }
        .num{
          &::before{
            content: "";
            display: inline-block;
            width: 0;
            height: 0;
            border: 5px solid rgba(42, 228, 92, 1);
            border-left-color: transparent;
            border-right-color: transparent;
            border-top-color: transparent;
            border-bottom-width: 8px;
            margin-right: 10px;
          }
        }
      }
      
    }
  }
</style>
