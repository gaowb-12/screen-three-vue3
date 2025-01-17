<template>
  <div class="right-card">
    <m-card title="电子商务行业企业跨境传输路径情况" sub-title="DIANGZISHANGWU HANGYE QIYE KUAJING SHUANSHULUJINGQINGKUANG" :width="1000">
      <div class="container">
        <el-table :data="tableData" height="100%" style="width: 100%">
          <el-table-column prop="company" label="名称" width="180" />
          <el-table-column prop="industry" label="行业" width="180" />
          <el-table-column prop="area" label="所在地" />
          <el-table-column prop="path" label="跨境路径数" />
          <el-table-column prop="des" label="主要目的地" />
        </el-table>
      </div>
    </m-card>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick, watch } from "vue"
import mCard from "@/components/mCard/index.vue"

const props = defineProps<{
  pieData?: {
  name: string,
  value: number | string
}
}>()
let initData = [
  {
    company: '企业名称',
    industry: '行业',
    area: '所在地',
    path: '跨境路径数',
    des: '主要目的地',
  },
  {
    company: '企业名称',
    industry: '行业',
    area: '所在地',
    path: '跨境路径数',
    des: '主要目的地',
  },
  {
    company: '企业名称',
    industry: '行业',
    area: '所在地',
    path: '跨境路径数',
    des: '主要目的地',
  },
  {
    company: '企业名称',
    industry: '行业',
    area: '所在地',
    path: '跨境路径数',
    des: '主要目的地',
  },
  {
    company: '企业名称',
    industry: '行业',
    area: '所在地',
    path: '跨境路径数',
    des: '主要目的地',
  },
  {
    company: '企业名称',
    industry: '行业',
    area: '所在地',
    path: '跨境路径数',
    des: '主要目的地',
  },
  {
    company: '企业名称',
    industry: '行业',
    area: '所在地',
    path: '跨境路径数',
    des: '主要目的地',
  },
]
const tableData = ref(initData)
function watchPieData(data){
  if(data.name=="类型1"){
    tableData.value = [
    {
      company: '企业名称1',
      industry: '行业',
      area: '所在地',
      path: '跨境路径数',
      des: '主要目的地',
    },
    {
      company: '企业名称1',
      industry: '行业',
      area: '所在地',
      path: '跨境路径数',
      des: '主要目的地',
    }]
  }else if(data.name=="类型2"){
    tableData.value = [
    {
      company: '企业名称2',
      industry: '行业',
      area: '所在地',
      path: '跨境路径数',
      des: '主要目的地',
    },
    {
      company: '企业名称2',
      industry: '行业',
      area: '所在地',
      path: '跨境路径数',
      des: '主要目的地',
    }]
  } else{
    tableData.value = initData
  }
}
watch(
  () => props.pieData,
  (newData, oldData) => {
    watchPieData(newData || {})
  },
  { deep: true, immediate: true }
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
