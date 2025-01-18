<template>
  <div class="left-card">
    <m-card title="出境流程图" subTitle="CHUJINGLIUCHENGTU" width="100%" height="454">
      <slot></slot>
    </m-card>
  </div>
</template>
<script setup>
import { ref, onMounted,onBeforeUnmount, nextTick } from "vue"
import mCard from "@/components/mCard/index.vue"

</script>
