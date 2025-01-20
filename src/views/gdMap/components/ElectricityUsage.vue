<template>
  <div class="right-card">
    <m-card title="电子商务行业企业跨境传输路径情况" sub-title="DIANGZISHANGWU HANGYE QIYE KUAJING SHUANSHULUJINGQINGKUANG" :width="1000">
      <div class="container">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <!-- <el-table-column prop="company" label="名称" show-overflow-tooltip /> -->
          <el-table-column prop="company" label="名称" />
          <el-table-column prop="industry" label="行业" />
          <el-table-column prop="area" label="所在地" width="180" />
          <el-table-column prop="pathNum" label="跨境路径数" width="120" />
          <el-table-column prop="desArea" label="主要目的地" />
        </el-table>
      </div>
    </m-card>
  </div>
</template>
<script setup lang="ts">
import { ref, watch } from "vue"
import mCard from "@/components/mCard/index.vue"

const props = defineProps<{
  pieData?: {
  name: string,
  value: number | string
}
}>()
let initData = [
    {
        "company": "赫力昂",
        "industry": "医药行业",
        "area": "上海",
        "pathNum": 1,
        "desArea": "英国"
    },
    {
        "company": "南京传奇生物科技有限公司",
        "industry": "生物技术推广服务行业",
        "area": "上海",
        "pathNum": 1,
        "desArea": "美国"
    },
    {
        "company": "北京妇产医院",
        "industry": "医疗卫生",
        "area": "北京东城",
        "pathNum": 1,
        "desArea": "韩国"
    },
    {
        "company": "浙江连连宝网络有限公司",
        "industry": "数字科技行业",
        "area": "浙江",
        "pathNum": 7,
        "desArea": "美国、新加坡、中国香港、泰国、俄罗斯、开曼群岛（英属）、英国"
    },
    {
        "company": "万事达（两边共用）",
        "industry": "金融机构",
        "area": "上海",
        "pathNum": 1,
        "desArea": "新加坡"
    },
    {
        "company": "龙马智声（珠海）科技有限公司",
        "industry": "人工智能",
        "area": "珠海",
        "pathNum": 1,
        "desArea": "中国澳门"
    },
    {
        "company": "北京福莱森特",
        "industry": "租赁和商务服务",
        "area": "北京朝阳",
        "pathNum": 1,
        "desArea": "澳大利亚"
    },
    {
        "company": "赛诺菲（负面清单）",
        "industry": "医药制造业",
        "area": "北京朝阳",
        "pathNum": 1,
        "desArea": "法国"
    },
    {
        "company": "艺龙网信息技术（北京）有限公司",
        "industry": "商务服务业",
        "area": "北京朝阳",
        "pathNum": 3,
        "desArea": "新加坡、美国、荷兰"
    },
    {
        "company": "财付通支付科技有限公司",
        "industry": "金融科技",
        "area": "深圳",
        "pathNum": 1,
        "desArea": "中国香港"
    },
    {
        "company": "美团（北京西瓜国际旅行社有限公司）",
        "industry": "商务服务业",
        "area": "北京朝阳",
        "pathNum": 19,
        "desArea": "泰国、新加坡、中国澳门、马来西亚、中国香港、印度尼西亚、日本、菲律宾、美国、韩国、新加坡、越南、阿拉伯联合酋长国、中国台湾、西班牙、柬埔寨、希腊、墨西哥、缅甸、马尔代夫"
    },
    {
        "company": "老虎证券（北京优虎网络科技有限公司）",
        "industry": "科技推广和应用服务业",
        "area": "北京朝阳",
        "pathNum": 1,
        "desArea": "新西兰"
    },
    {
        "company": "丰田汽车（中国）投资有限公司",
        "industry": "汽车行业",
        "area": "北京朝阳",
        "pathNum": 2,
        "desArea": "日本、德国"
    },
    {
        "company": "日立能源（中国）有限公司",
        "industry": "投资与资产管理",
        "area": "北京朝阳",
        "pathNum": 1,
        "desArea": "日本"
    }
]
const tableData = ref(initData)
function watchPieData(data){
  if(data.name === null)
    tableData.value = initData
  else
    tableData.value = initData.filter(item=>item.industry == data.name)
}
watch(
  () => props.pieData,
  (newData, oldData) => {
    watchPieData(newData || {})
  },
  { deep: true, }
)

</script>

<style lang="scss" scoped>
.container{
  background: rgba(26, 26, 26, 0.36);
  box-sizing: border-box;
  height: 100%;
  :deep(.el-table){
    background-color: transparent;
    tr, th{
      background-color: transparent;
      font-size: 16px;
      font-weight: bold;
      color: #B4B4B4;
      &:hover{
        background-color: transparent;
        font-size: 16px;
        color: #B4B4B4;
        &>td.el-table__cell{
          background-color:rgba(56, 56, 56, 0.4);
        }
      }
    }
    th{
      color: #888888;
    }
    td.el-table__cell, 
    th.el-table__cell.is-leaf{
      border-bottom: none;
    }
    .el-table--border .el-table__inner-wrapper:after, 
    .el-table--border:after, 
    .el-table--border:before, 
    .el-table__inner-wrapper:before{
      background-color: unset;
    }
  }
}
</style>
