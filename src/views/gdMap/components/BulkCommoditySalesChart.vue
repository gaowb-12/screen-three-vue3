<template>
  <div class="left-card">
    <m-card title="跨境传输情况" subTitle="KUAJINGCHUANSHUQINGKUANG">
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

const items = ref([
  {value:10, name:"数据传输国家数"},
  {value:20, name:"数据传输国家数1"},
  {value:30, name:"数据传输国家数2"},
  {value:40, name:"数据传输国家数3"},
])
</script>
<style lang="scss" scoped>
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
        color: rgba(178, 178, 178,0.6);
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
