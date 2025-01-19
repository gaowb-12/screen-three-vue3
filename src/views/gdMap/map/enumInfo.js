export default {
    world:{
        geoName: "",
        parentGeoName:null,
        scale: 4,
        assetsMapName: "world",
        mapLevel: "world",
        centerCoordinates: [0, 20]
    },
    china:{
        geoName: "China",
        parentGeoName:"world",
        scale:18,
        assetsMapName: "china",
        mapLevel: "country",
        centerCoordinates: [98.114, 32.550]
    },
    beijing: {
        geoName: "北京市",
        parentGeoName:"china",
        scale:400,
        assetsMapName: "beijing",
        mapLevel: "province",
        centerCoordinates: [116.005285, 39.904989]
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