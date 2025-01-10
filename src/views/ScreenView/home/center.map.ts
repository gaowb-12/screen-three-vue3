import lambertImage from "./pageBg.jpg"
import left_top_huang from "./left_top_huang.png"

//mapData数据结构
export interface MapdataType {
    name: string;
    value: [number, number, number]; //x,y,value  第一个x 第二个y  第三个value
}
export const optionHandle = (regionCode: string,list: object[],mapData: MapdataType[]) => {
    let top = 45;
    let zoom = ["china"].includes(regionCode) ? 1.05 : 1;
    return {
        tooltip: {
            trigger: 'item',
            show: true,
            formatter: function (params: any) {
                return '<div style="color:pink;background:blue;">' + params.name + '</div>';
            },
            padding:0,
            backgroundColor: {
                image: left_top_huang,
            },
            textStyle: {
                color: "#f8fbfb",
                fontSize: 18,
            },
        },
        visualMap: {
            // seriesIndex:0,
            left: 20,
            bottom: 20,
            pieces: [
                { gte: 1000, label: "1000个以上" }, // 不指定 max，表示 max 为无限大（Infinity）。
                { gte: 600, lte: 999, label: "600-999个" },
                { gte: 200, lte: 599, label: "200-599个" },
                { gte: 50, lte: 199, label: "49-199个" },
                { gte: 10, lte: 49, label: "10-49个" },
                { lte: 9, label: "1-9个" }, // 不指定 min，表示 min 为无限大（-Infinity）。
            ],
            inRange: {
                // 渐变颜色，从小到大
                color: [
                    // "#EDF7FD",
                    "rgba(115, 189, 235, 0.8)",
                    // "#105A7E",
                    "rgba(9, 54, 77, 0.9)"
                ],
            },
            textStyle: {
                color: "#fff",
            },
        },
        geo3D: {
            zlevel: -100,
            roam: true,
            zoom: zoom,
            map: regionCode, // 地图类型。
            itemStyle: {
                // color: "#007aff",
                opacity: 0.8,
                borderWidth: 0.8,
                borderColor: "black",
                // areaColor: '#fff'
            },
            // 鼠标移入区块的样式
            emphasis: {
                disabled: true, //是否可以被选中
                label: {
                    //移入时的高亮文本
                    show: true,
                    color: "#333", //显示字体颜色变淡
                    fontSize: 18, //显示字体变大
                },
                itemStyle: {
                    color: "#ff7aff", //显示移入的区块变粉色
                },
            },
            // 文本标签
            label: {
                show: true,
                textStyle: {
                    color: "#000", //地图初始化区域字体颜色
                    position: "center",
                    fontSize: 14,
                    lineHeight: 16,
                },
            },
            // 着色
            shading: "lambert",
            lambertMaterial: {
                detailTexture: lambertImage,
                textureTiling:0.5
            },
            //光照阴影
            light: {
                main: {
                    color: "#fff", //光照颜色
                    intensity: 1, //光照强度
                    //shadowQuality: 'high', //阴影亮度
                    shadow: true, //是否显示阴影
                    shadowQuality: "medium", //阴影质量 ultra //阴影亮度
                    alpha: 55,
                    beta: 10,
                },
                ambient: {
                    intensity: 0.7,
                },
            },
        },
        series: [
            {
                name: "MAP",
                type: "map3D",
                map: regionCode,
                roam: true,
                zoom: zoom,
                zlevel: -10,
                data: list,
                // itemStyle: {
                //     color: "#fff",
                //     // opacity: 0,
                //     borderWidth: 0.8,
                //     borderColor: "black",
                //     areaColor: '#fff'
                // },
                // 着色
                shading: "lambert",
                lambertMaterial: {
                    detailTexture: lambertImage,
                    textureTiling:0.5
                },
            },
            {
                name: "scatter3D",
                type: "scatter3D",
                coordinateSystem: "geo3D",
                zlevel: -11,
                symbolSize: function (val: any) {
                    return 10;
                    // return val[2] / 50;
                },
                showEffectOn: "render",
                rippleEffect: {
                    scale: 6,
                    color: "red",
                    brushType: "fill",
                },
                tooltip: {
                    show: true,
                    formatter: function (params: any) {
                        if (params.data) {
                            return params.name + "：" + params.data["value"][2];
                        } else {
                            return params.name;
                        }
                    },
                    backgroundColor: "rgba(0,0,0,.6)",
                    borderColor: "rgba(147, 235, 248, .8)",
                    textStyle: {
                        color: "#FFF",
                    },
                },
                label: {
                    formatter: (param: any) => {
                        return param.name.slice(0, 2);
                    },
                    fontSize: 10,
                    position: "bottom",
                    textBorderColor: "#ff0000",
                    textShadowColor: "#000",
                    textShadowBlur: 10,
                    textBorderWidth: 0,
                    color: "#ff0000",
                    show: true,
                },
                itemStyle: {
                    color: "red",
                    // borderColor: "rgba(2255,255,255,2)",
                    // borderWidth: 4,
                    shadowColor: "#000",
                    shadowBlur: 10,
                },
                data: [
                    { name: "浙江", value: [121.556686, 29.880177, 23] },
                ],
            },
            {
                //配置路径
                type: 'lines3D',
                coordinateSystem: 'geo3D',
                polyline: 'true',
                blendMode: 'source-over',
                zlevel: -11,
                effect: {
                    show: true,
                    trailWidth: 3,
                    trailOpacity: 0.5,
                    trailLength: 0.2,
                    constantSpeed: 5
                },
                lineStyle: {
                    color: '#FFB728',
                    opacity: 0.8,
                    width: 1.5
                },
                data: [
                    {
                        coords: [[121.556686, 29.880177, 23], [116.405285,39.904989]],
                        // 数据值
                        value: 100,
                        // 数据名
                        name: '测试二',
                        // 线条样式
                        lineStyle: {}
                    }
                ]
            },
            // {
            //     name: "立柱",
            //     type: "bar3D",
            //     coordinateSystem: "geo3D",
            //     barSize: 2,
            //     zlevel: -12,
            //     shading: "lambert",
            //     bevelSize: 0.2,
            //     label: {
            //         show: true,
            //         formatter: "{a}",
            //     },
            //     //自定义的data数组 value中数组的含义:[杭州的经度or纬度，要展示的3d柱状图数值大小]
            //     data: [
            //         { name: "浙江", value: [121.556686, 29.880177, 163] },
            //     ],
            // },
        ],
    };
}


export const regionCodes: any = {
    "China": {
        "adcode": "china",
        "level": "country",
        "name": "中华人民共和国"
    },
    "北京市": {
        "adcode": "110000",
        "level": "province",
        "name": "北京市"
    }
}