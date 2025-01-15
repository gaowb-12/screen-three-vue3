<template>
  <div class="right-card">
    <m-card title="电子商务行业企业跨境传输路径情况" sub-title="DIANGZISHANGWU HANGYE QIYE KUAJING SHUANSHULUJINGQINGKUANG" width="900">
      <div class="container">
        <el-table :data="tableData" height="250" style="width: 100%">
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
<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue"
import * as echarts from "echarts"
import mCard from "@/components/mCard/index.vue"
const tableData = ref([
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
])
</script>

<style lang="scss" scoped>
.container{
  background: rgba(26, 26, 26, 0.36);
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
  }
}
</style>
