<template>
    <div class="container">
        <img class="city-image" src="@/assets/images/city/city-image.png" alt="" />
        <div class="fly-line">
            <svg width="100%" height="100%" :viewBox="`0 0 ${width} ${height}`" fill="none" xmlns="http://www.w3.org/2000/svg">
                <GoupPath  
                v-for="(item, ind) in data" 
                :key="ind"
                :width="width" 
                :height="height" 
                color="#30DCFF" 
                :strokeWidth="2"
                :dir="item.dir" 
                :length="50" 
                :path="item.path" 
                :begin="ind"
                @clickPath="clickPath(item)" 
                @mouseEnterPath="mouseEnterPath($event,item)" 
                @mouseLeavePath="mouseLeavePath"/>
            </svg>
        </div>
        <!-- 文本 -->
        <span 
            v-for="(item, ind) in data" 
            :key="ind"
            class="text" 
            :class="'text-' + ind"
            >{{ item.fromName }}</span>
        <!-- 提示弹框 -->
        <div class="info-tip" ref="infoTip">
            <div class="info-tip-wrap">
                <div class="info-tip-label">
                    <div class="province"><span class="icon"></span>{{ currentActiveData.fromName }}<span class="arrow">>></span></div>
                    <div class="other">{{ currentActiveData.toName }}</div>
                </div>
                <div class="info-tip-content">
                    <div class="content-item">
                        <div class="label">传输数据量</div>
                        <div class="value">{{ currentActiveData.transmissionNum }}</div>
                    </div>
                    <div class="content-item">
                        <div class="label">敏感数据量</div>
                        <div class="value">{{currentActiveData.sensitiveNum}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import GoupPath from "./path.vue"
import { inject, onMounted, ref } from "vue"
import { debounce } from "lodash-es"
import gsap from "gsap";

const infoTip = ref()
const width = ref(721)
const height = ref(57)
const currentActiveData = ref({
    fromName:"",
    toName:"",
    transmissionNum:"",
    sensitiveNum:"",
})

function getDistance(start, end) {
    const [startX, startY] = start;
    const [endX, endY] = end;
    let dx = startX - startY;
    let dy = endX - endY;
    return Math.sqrt(dx * dx + dy * dy);
}
function getBezierPath(start, end) {
    const [startX, startY] = start;
    const [endX, endY] = end;
    const midX = (startX + endX) / 2;
    const midY = (startY + endY) / 2;
    let len = getDistance(start, end) / 6;
    return `M${startX},${startY} Q${midX},${midY - len} ${endX},${endY}`
}

const initData = [
    {
        "fromName": "赫力昂",
        "toName": "英国",
        transmissionNum: 24523,
        sensitiveNum: 14847,
        path: getBezierPath([260, -120], [-100, -50]),
        dir: [0, 1]
    },
    {
        // "fromName": "赛诺菲（负面清单）",
        "fromName": "赛诺菲",
        "toName": "法国",
        transmissionNum: 11483,
        sensitiveNum: 11483,
        path: getBezierPath([550, -90], [500, 250]),
        dir: [0, 1]
    },
    {
        "fromName": "北京妇产医院",
        "toName": "韩国",
        transmissionNum: 800,
        sensitiveNum: 800,
        path: getBezierPath([390, -130], [900, 40]),
        dir: [0, 1]
    },
    {
        "fromName": "浙江连连宝网络有限公司",
        "toName": "美国、新加坡、中国香港、泰国、俄罗斯、开曼群岛（英属）、英国",
        transmissionNum: 472524,
        sensitiveNum: 0,
        path: getBezierPath([290, -60], [0, -50]),
        dir: [0, 1]
    },
    {
        // "fromName": "万事达（两边共用）",
        "fromName": "万事达",
        "toName": "新加坡",
        transmissionNum: 0,
        sensitiveNum: 12596,
        path: getBezierPath([390, 30], [100, 200]),
        dir: [0, 1]
    },
    {
        "fromName": "龙马智声（珠海）科技有限公司",
        "toName": "中国澳门",
        transmissionNum: 1000,
        sensitiveNum: 0,
        path: getBezierPath([660, -90], [750, 100]),
        dir: [0, 1]
    },
    {
        "fromName": "北京福莱森特",
        "toName": "澳大利亚",
        transmissionNum: 97198,
        sensitiveNum: 19031,
        path: getBezierPath([210, -30], [0, 40]),
        dir: [0, 1]
    },
    

    
    {
        "fromName": "南京传奇生物科技有限公司",
        "toName": "美国",
        transmissionNum: 2023,
        sensitiveNum: 493,
        path: getBezierPath([0, 0], [0, 0]),
        dir: [0, 1]
    },
    {
        "fromName": "艺龙网信息技术（北京）有限公司",
        "toName": "新加坡、美国、荷兰",
        transmissionNum: 126138,
        sensitiveNum: 126138,
        path: getBezierPath([0, 0], [0, 0]),
        dir: [0, 1]
    },
    {
        "fromName": "财付通支付科技有限公司",
        "toName": "中国香港",
        transmissionNum: 21010,
        sensitiveNum: 21010,
        path: getBezierPath([0, 0], [0, 0]),
        dir: [0, 1]
    },
    {
        "fromName": "美团（北京西瓜国际旅行社有限公司）",
        "toName": "泰国、新加坡+中国澳门、泰国、马来西亚、中国香港、印度尼西亚、日本、菲律宾、美国、韩国、新加坡、越南、阿拉伯联合酋长国、中国台湾、西班牙、柬埔寨、希腊、墨西哥、缅甸、马尔代夫",
        transmissionNum: 3372867,
        sensitiveNum: 788291,
        path: getBezierPath([0, 0], [0, 0]),
        dir: [0, 1]
    },
    {
        "fromName": "老虎证券（北京优虎网络科技有限公司）",
        "toName": "新西兰",
        transmissionNum: 88138,
        sensitiveNum: 88138,
        path: getBezierPath([0, 0], [0, 0]),
        dir: [0, 1]
    },
    {
        "fromName": "丰田汽车（中国）投资有限公司",
        "toName": "日本、德国",
        transmissionNum: 504,
        sensitiveNum: 500,
        path: getBezierPath([0, 0], [0, 0]),
        dir: [0, 1]
    },
    {
        "fromName": "日立能源（中国）有限公司",
        "toName": "日本",
        transmissionNum: 1793,
        sensitiveNum: 349,
        path: getBezierPath([0, 0], [0, 0]),
        dir: [0, 1]
    }
]

const data = ref(initData)

const changCityPath = inject<any>("changCityPath")

function clickPath(item) {
    changCityPath(item)
}
const mouseEnterPath = debounce((e, item) => {
    currentActiveData.value = {
        fromName:item.fromName,
        toName:item.toName,
        transmissionNum:item.transmissionNum,
        sensitiveNum:item.sensitiveNum,
    }
    infoTip.value.style.display = "block"
    infoTip.value.style.left = e.clientX - 100 + 10 + "px"
    infoTip.value.style.top = e.clientY + 20 + "px"
}, 300)
const mouseLeavePath = debounce((e) => {
    currentActiveData.value = {
        fromName:"",
        toName:"",
        transmissionNum:"",
        sensitiveNum:"",
    }
    infoTip.value.style.display = "none"
}, 300)

onMounted(()=>{
    gsap.to(".container", {
        scale: 1,
        duration: 1,
        ease: "circ.out"
    });
})

</script>

<style scoped lang="scss">
.container {
    width: 100%;
    height: 100%;
    position: relative;
    transform: scale(0, 0);
    .city-image {
        width: 100%;
        // height: 100%;
    }
    .fly-line-container{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
    }
    .fly-line {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
    }
    .click {
        z-index: 1;
    }
    .text {
        position: absolute;
        left: 50%;
        top: 50%;
        color: #fff;
        font-weight: 700;
        font-size: 24px;
        white-space: nowrap;
        &-0 { left: 34%; top: 10%; }
        &-1 { left: 74%; top: 12%; }
        &-2 { left: 50%; top: 12%; transform: scale(0.8); }
        &-3 { left: 34%; top: 27%; transform: scale(0.8);}
        &-4 { left: 52%; top: 43%; transform: scale(0.8); }
        &-5 { left: 81%; top: 20%; transform: scale(0.5); }
        &-6 { left: 26%; top: 33%; transform: scale(0.5); }

        &-7 { left: 39%; top: 17%; transform: scale(0.2); }
        &-8 { left: 53%; top: 17%; transform: scale(0.2); }
        &-9 { left: 51%; top: 17%; transform: scale(0.2); }
        &-10 { left: 10%; top: 17%; transform: scale(0.2); }
        &-11 { left: 25%; top: 23%; transform: scale(0.2); }
        &-12 { left: 86%; top: 32%; transform: scale(0.2); }
        &-13 { left: 80%; top: 17%; transform: scale(0.2); }
        &-14 { left: 75%; top: 12%; transform: scale(0.2); }
    }
    .info-tip {
        position: fixed;
        left: 50%;
        top: 50%;
        background: rgba(0, 4, 5, 0.8);
        padding: 15px;
        will-change: transform;
        border-top: 6px solid #1EFF62;
        display: none;
        z-index: 15;
        &-wrap {
            width: 200px;
        }

        &-label {
            display: flex;
            align-items: center;
            justify-content: space-around;
            margin-bottom: 5px;

            .province {
                margin-right: 20px;
                font-family: "Alimama", "ShuHeiTi";
                font-size: 24px;
                font-weight: bold;
                color: #1EFF62;

                .arrow {
                    transform: scale(0.8);
                    display: inline-block;
                }
            }

            .other {
                font-family: Open Sans;
                font-size: 10px;
                color: #ffffff;
                max-width: 60px;
            }
        }

        &-content {
            display: flex;
            .content-item {
                flex: 1;
                padding-left: 10px;

                .label {
                    color: #888888;
                    font-family: Open Sans;
                    font-size: 12px;
                    margin-bottom: 10px;
                }

                .value {
                    color: #ffffff;
                    font-family: Open Sans;
                    font-weight: bold;
                    font-size: 18px;
                }
            }
        }
    }
}
</style>