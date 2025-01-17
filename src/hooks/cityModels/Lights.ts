import { AmbientLight, CameraHelper, DirectionalLight, DirectionalLightHelper, Object3D, PointLight, SpotLight } from "three";
import {addLightHelper} from "./Helper"
export const lights: Object3D[] = [];
// 创建环境光
// const ambientLight:AmbientLight = new AmbientLight(0x37383C, 0.5);
const ambientLight:AmbientLight = new AmbientLight(0x000000, 0);

export const pointLight: PointLight = new PointLight(
    0xffffff,
    1,
    400,
    0.1
)
pointLight.position.set(200,200,200)
// 产生阴影
pointLight.castShadow = true

const directionalLight = new DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(300,300,400)
directionalLight.castShadow = true;

// 光源
addLightHelper(directionalLight)

// 聚光灯
// export const spotLight: SpotLight = new SpotLight(
//     0xffffff,
//     5,
//     500,
//     Math.PI / 180 * 30,
//     0,
//     0
// )
// spotLight.position.set(0,100,300)
// 产生阴影
// spotLight.castShadow = true

lights.push(ambientLight, pointLight, directionalLight)