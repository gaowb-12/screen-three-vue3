import { AxesHelper, CameraHelper, DirectionalLight, DirectionalLightHelper, GridHelper, Light, Object3D, PointLightHelper, RectAreaLight, SpotLight, SpotLightHelper } from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";
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
// helpers.push(axesHelper)
export function addLightHelper(light: Light){
    let helper
    if(light instanceof DirectionalLight) helper = new DirectionalLightHelper( light );
    else if(light instanceof SpotLight) helper = new SpotLightHelper( light );
    else if(light instanceof RectAreaLight) helper = new RectAreaLightHelper( light );
    // 没有产生阴影的关键设置在这里
    // const cam = (light as any).shadow.camera;
    // console.log(cam);
    // cam.near = 0.11;
    // cam.far = 5000;
    // cam.left = -1000;
    // cam.right = 1000;
    // cam.top = 1000;
    // cam.bottom = -1000;
    
    // //光投影相机
    // const cameraHelper = new CameraHelper( cam );
    // cameraHelper.visible = false;
    // helpers.push(cameraHelper)

    helper.visible = true;
    helpers.push(light)
}