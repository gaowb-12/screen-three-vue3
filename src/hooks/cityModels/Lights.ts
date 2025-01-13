import { AmbientLight, Object3D, PointLight, SpotLight } from "three";

export const lights: Object3D[] = [];
// 创建环境光
const ambientLight:AmbientLight = new AmbientLight(0x37383C, 0.1);

// export const pointLight: PointLight = new PointLight(
//     0xffffff,
//     0.7,
//     200,
//     0.1
// )
// pointLight.position.set(40,40,40)

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

lights.push(ambientLight)