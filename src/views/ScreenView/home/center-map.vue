<script setup lang="ts">
import { ref, nextTick, defineAsyncComponent  } from "vue";
import { getCenterMap } from "@/api/screen";
import { registerMap, getMap } from "echarts/core";
import { optionHandle, regionCodes } from "./center.map";
import BorderBox13 from "@/components/datav/border-box-13";
import { ElMessage } from "element-plus";
import type { ECharts } from 'echarts';

const City = defineAsyncComponent(() =>
  import('./Three/City.vue')
);
import type { MapdataType } from "./center.map";
import axios from "axios";

const option = ref({});
const collections = ["china", "world"];
const code = ref("world"); //china 代表中国 其他地市是行政编码
const centerMapRef = ref<ECharts | null>(null);
const isCity = ref(false);

withDefaults(
  defineProps<{
    // 结束数值
    title: number | string;
  }>(),
  {
    title: "地图",
  }
);

const dataSetHandle = async (regionCode: string, list: object[]) => {
  const geojson: any = await getGeojson(regionCode);
  console.log(geojson)
  let cityCenter: any = {};
  let mapData: MapdataType[] = [];
  //获取当前地图每块行政区中心点
  geojson.features.forEach((element: any) => {
    cityCenter[element.properties.name] = element.properties.centroid || element.properties.center;
  });
  //当前中心点如果有此条数据中心点则赋值x，y当然这个x,y也可以后端返回进行大点，前端省去多行代码
  list.forEach((item: any) => {
    if (cityCenter[item.name]) {
      mapData.push({
        name: item.name,
        value: cityCenter[item.name].concat(item.value),
      });
    }
  });
  await nextTick();

  option.value = optionHandle(regionCode, list, mapData);
  // console.log("屏幕坐标", (centerMapRef.value as ECharts).convertToPixel('geo',[121.556686, 29.880177, 23]));
};

const getData = async (regionCode: string) => {
  getCenterMap({ regionCode })
    .then((res: any) => {
      if (res.success) {
        dataSetHandle(res.data.regionCode, res.data.dataList);
      } else {
        ElMessage.error(res.msg);
      }
    })
    .catch((err) => {
      ElMessage.error(err);
    });
};
const getGeojson = (regionCode: string) => {
  return new Promise<boolean>(async (resolve) => {
    let mapjson = getMap(regionCode);
    if (mapjson) {
      mapjson = mapjson.geoJSON;
      resolve(mapjson);
    } else {
      code.value = regionCode;
      // 世界/中国地图
      if (collections.includes(regionCode)) {
        // mapjson = await getCenterMap(`./map-geojson/${regionCode}.json`).then((data) => data);
        const mapjson = await axios.get(`./map-geojson/${regionCode}.json`).then((data) => data.data)
        registerMap(regionCode, {
          geoJSON: mapjson as any,
          specialAreas: {},
        });
        resolve(mapjson);
      }else{
        // 省份地图
        // mapjson = await getCenterMap(`./map-geojson/province/${regionCode}.json`).then((data) => data);
        mapjson = await axios.get(`./map-geojson/province/${regionCode}.json`).then((data) => data.data);
        registerMap(regionCode, {
          geoJSON: mapjson as any,
          specialAreas: {},
        });
        resolve(mapjson);
      }
    }
  });
};
getData(code.value);

const mapClick = (params: any) => {
  console.log(params)
  isCity.value = false
  let xzqData = regionCodes[params.name];
  if (xzqData) {
    getData(xzqData.adcode);
  } else if("朝阳区" === params.name){
    isCity.value = true;
  }else {
    window["$message"].warning("暂无下级地市");
  }
};
</script>

<template>
  <div class="centermap">
    <div class="maptitle">
      <div class="zuo"></div>
      <span class="titletext">{{ title }}</span>
      <div class="you"></div>
    </div>
    <div class="mapwrap">
      <BorderBox13>
        <div class="quanguo" @click="isCity = false;getData('world')" v-if="code !== 'world'">世界</div>
        <v-chart
          class="chart"
          :option="option"
          ref="centerMapRef"
          @click="mapClick"
          v-if="JSON.stringify(option) != '{}' && !isCity"
        />
        <City v-if="isCity" /> 
      </BorderBox13>
    </div>
  </div>
</template>

<style scoped lang="scss">
.centermap {
  margin-bottom: 30px;

  .maptitle {
    height: 60px;
    display: flex;
    justify-content: center;
    padding-top: 10px;
    box-sizing: border-box;

    .titletext {
      font-size: 28px;
      font-weight: 900;
      letter-spacing: 6px;
      background: linear-gradient(92deg, #0072ff 0%, #00eaff 48.8525390625%, #01aaff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin: 0 10px;
    }

    .zuo,
    .you {
      background-size: 100% 100%;
      width: 29px;
      height: 20px;
      margin-top: 8px;
    }

    .zuo {
      background: url("@/assets/img/xiezuo.png") no-repeat;
    }

    .you {
      background: url("@/assets/img/xieyou.png") no-repeat;
    }
  }

  .mapwrap {
    height: 580px;
    width: 100%;
    // padding: 0 0 10px 0;
    box-sizing: border-box;
    position: relative;

    .quanguo {
      position: absolute;
      right: 20px;
      top: -46px;
      width: 80px;
      height: 28px;
      border: 1px solid #00eded;
      border-radius: 10px;
      color: #00f7f6;
      text-align: center;
      line-height: 26px;
      letter-spacing: 6px;
      cursor: pointer;
      box-shadow: 0 2px 4px rgba(0, 237, 237, 0.5), 0 0 6px rgba(0, 237, 237, 0.4);
      z-index: 10;
    }
  }
}
</style>
