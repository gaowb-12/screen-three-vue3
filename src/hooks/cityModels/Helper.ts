import { AxesHelper, GridHelper, Object3D, PointLightHelper, SpotLightHelper } from "three";
// import { pointLight, spotLight } from "./Lights";

export const helpers: Object3D[] = []
// 辅助器：坐标轴
const axesHelper = new AxesHelper( 500 );
const size = 400;
const divisions = 50;
// 辅助器：网格
const gridHelper = new GridHelper( size, divisions, 0xaaaaaa, 0x888888 );

// 辅助器：模拟点光
// const pointLightHelper = new PointLightHelper( pointLight, 1 );

// 辅助器：模拟聚光灯
// const spotLightHelper = new SpotLightHelper( spotLight, spotLight.color );

// 取消默认的射线拾取功能
axesHelper.raycast = ()=>{}
// pointLightHelper.raycast = ()=>{}
// spotLightHelper.raycast = ()=>{}
helpers.push(axesHelper)