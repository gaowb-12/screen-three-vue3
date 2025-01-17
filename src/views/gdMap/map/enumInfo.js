export default {
    world:{
        geoName: "",
        parentGeoName:null,
        scale: 3,
        assetsMapName: "world",
        mapLevel: "world",
        centerCoordinates: [0, 50]
    },
    china:{
        geoName: "China",
        parentGeoName:"world",
        scale:18,
        assetsMapName: "china",
        mapLevel: "country",
        centerCoordinates: [104.114, 37.550]
    },
    beijing: {
        geoName: "北京市",
        parentGeoName:"china",
        scale:300,
        assetsMapName: "beijing",
        mapLevel: "province",
        centerCoordinates: [116.405285, 39.904989]
    },
    city: {
        geoName: "朝阳区",
        parentGeoName:"beijing",
        scale:200,
        assetsMapName: "chaoyangqu",
        mapLevel: "city",
        centerCoordinates:[0,0]
    },
}