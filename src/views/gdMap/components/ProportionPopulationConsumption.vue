<template>
  <div class="right-card">
    <m-card title="合作企业" sub-title="HEZUOQIYE" :width="290">
      <div class="population-proportion">
        <div class="population-proportion-chart">
          <v-chart ref="chart" :option="option" :autoresize="true" />
          <!-- <div class="label-name">消费占比</div> -->
        </div>
        <div class="pie-legend">
          <div class="pie-legend-item" v-for="(item, index) in state.pieData" :key="index">
            <div class="icon" :style="{ background: state.pieDataColor[index] }"></div>
            <div class="name">{{ item.name }}</div>
            <!-- <div class="value">{{ item.value }}<span class="unit">%</span></div> -->
          </div>
        </div>
      </div>
    </m-card>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from "vue"
import mCard from "@/components/mCard/index.vue"

interface SeriesData{
  name: string,
  value: number | string
}
interface State{
  selected: {
    [key: string]: boolean
  },
  pieDataColor: string[],
  pieData: SeriesData[]
}
const emit = defineEmits<{
  clickPie: any
}>()

const chart = ref()

let colors = ["#09BD2B", "#FF891D", "#1890FF", "#3BD3BF", "#9D1DFF", "#D9D9D9"]
const state = reactive<State>({
  selected: {"0": true},
  pieDataColor: colors,
  pieData: [
    {
      name: "类型1",
      value: 40,
    },
    {
      name: "类型2",
      value: 25,
    },
    {
      name: "类型3",
      value: 20,
    },
    {
      name: "类型4",
      value: 15,
    },
  ],
})
const option = ref({
  tooltip: {
    trigger: 'item',
    formatter:'{b}: {c}',
    textStyle:{
      color:'#fff'
    },
    backgroundColor: '#2F2F2F',
    borderColor:"transparent"
  },

  series: {
      name: "",
      type: "pie",
      itemStyle: {
        // borderWidth: 5,
        // borderColor: "rgba(26, 57, 77,1)",
        borderRadius: 2
      },
      selected: state.selected,
      padAngle: 5,
      label: { show: false },
      radius: ["55%", "70%"],
      color: colors,
      selectedMode: 'single', // 启用单选模式
      data: state.pieData,
    },
});
function clickPie(){
  chart.value.chart.on('click', (params) => {
    // 更新选中状态
    state.selected = { [params.dataIndex]: true };
    chart.value.chart.setOption({
      ...option,
      series: {
        selected: state.selected
      },
    });
    emit("clickPie", params);
  });
}
onMounted(()=>{
  clickPie()
})

</script>
<style lang="scss">
  .pie-chat-wrap {
    width: 100%;
    height: 100%;
    display: flex;
  }
  // 饼图
  .pie-chat {
    pointer-events: all;
    position: relative;
    width: 236px;
    height: 100%;

    .pieCanvas {
      width: 100%;
      height: 100%;
      pointer-events: all;
    }
    .pieCanvas-content {
      width: 100%;
      height: 100%;
      margin-bottom: 30px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 12px;
      &-value {
        font-size: 15px;
        font-weight: bold;
        text-shadow: 0 0 10px rgb(0 0 0);
      }
      &-name {
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #fff;
        font-size: 12px;
        text-align: center;
      }
    }
  }
  // 饼图3d legend
  .pie-legend {
    overflow: auto;
    margin: 10px 0;
    padding-right: 15px;
    &-item {
      box-sizing: border-box;
      margin: 10px 0;
      &>div{
        display: inline-block;
        vertical-align: middle;
      }
      .icon {
        width: 8px;
        height: 8px;
        border-radius: 8px;
        background: #17e6c3;
        box-sizing: border-box;
        margin-right: 10px;
      }
      .name {
        font-weight: 500;
        font-size: 12px;
        color: #ffffff;
      }
      .value {
        display: flex;
        flex-wrap: nowrap;
        align-items: flex-end;
        justify-content: flex-end;
        width: 80px;
        text-align: right;

        font-weight: bold;
        color: #ffffff;
        font-family: D-DIN;
        font-weight: bold;
        font-size: 16px;
        .unit {
          font-family: D-DIN;
          font-weight: 400;
          font-size: 10px;
          color: #ffffff;
          opacity: 0.5;
          padding-left: 10px;
        }
      }
    }
  }
</style>
<style lang="scss">
.population-proportion {
  display: flex;
  justify-content: space-around;
  height: 100%;
  box-sizing: border-box;
  padding-right: 10px;
  background: rgba(26, 26, 26, 0.36);
  &-chart {
    position: relative;
    width: 160px;
    height: 100%;
    margin-left: 15px;
    // background: url("~@/assets/images/pie/pie-zs-bg.png") no-repeat;
    // background-size: cover;
    .label-name {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 72px;
      height: 72px;
      margin-left: -36px;
      margin-top: -36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: #c4e3fd;
    }
    &:after {
      position: absolute;
      left: 50%;
      top: 50%;
      z-index: -1;
      content: "";
      width: 122px;
      height: 122px;
      transform: translate(-50%, -50%);
      border: 1.5px solid #FFFFFF;
      border-radius: 50%;
      opacity: 0.3;
      // background: url("~@/assets/images/pie/pie-mid-circle.png") no-repeat;
      // background-size: cover;
      // animation: rotate360Animate 2s linear infinite;
    }
  }
}
</style>
