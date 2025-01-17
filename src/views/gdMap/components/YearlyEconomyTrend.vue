<template>
  <div class="left-card">
    <m-card title="跨境传输情况" subTitle="KUAJINGCHUANSHUQINGKUANG" height="340">
      <div class="container">
        <div class="item" v-for="item in items" :key="item.name">
          <div class="left">
            <div class="name">{{item.name}}</div>
            <div class="num">{{item.value}}GB</div>
          </div>
          <div class="right">
            <span class="hidden">{{item.value}}</span>
            <span class="num">{{item.value}}</span>
          </div>
        </div>
      </div>
    </m-card>
  </div>
</template>
<script setup>
import { ref, onMounted, nextTick, onBeforeUnmount } from "vue"
import mCard from "@/components/mCard/index.vue"

const items = ref([
  {value:10, name:"数据传输国家数"},
  {value:20, name:"数据传输国家数1"},
  {value:30, name:"数据传输国家数2"},
  {value:40, name:"数据传输国家数3"},
])
</script>
<style lang="scss" scoped>
  .container{
    height: 100%;
    box-sizing: border-box;
    background: rgba(26, 26, 26, 0.36);
    padding: 22px 8px;
    display:flex;
    flex-wrap:wrap;
    justify-content: space-around;
    .item{
      display:flex;
      justify-content: space-around;
      padding:20px 10px;
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
