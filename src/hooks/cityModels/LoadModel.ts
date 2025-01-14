import { Clock, Color, DirectionalLight, EdgesGeometry, EquirectangularReflectionMapping, EquirectangularRefractionMapping, Group, Line, LineBasicMaterial, LineSegments, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, Object3DEventMap, RectAreaLight, Scene, ShaderMaterial, TextureLoader, Vector3 } from "three";
import fragmentShader from "@/components/Shader/City3D/fragmentShader.glsl";
import vertexShader from "@/components/Shader/City3D/vertexShader.glsl";

import rasterOpacityFragmentShader from "@/components/Shader/rasterOpacity/fragmentShader.glsl";
import rasterOpacityVertexShader from "@/components/Shader/rasterOpacity/vertexShader.glsl";

import { AssetsLoadingManager } from "./LoadingManager";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js"
//导入hdr加载器
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
import { createFlyingLines } from './FlyLine'
import { Engine } from "./Engine";
import { Time } from "./Time";
const rasterTexture = new TextureLoader().load( '/models/texture/光栅区域透明.png' );
const cityTexture = new TextureLoader().load( '/models/texture/网格.png' );
const rasterOpacityTexture = new TextureLoader().load('/models/texture/rasterOpacityTexture.png');
const klbRasterOpacityTexture = new TextureLoader().load('/models/texture/rasterOpacityTexture-klb.png');

const uniforms = {
    height: { value: 20 },
    uFlowColor: {
        // 流动的颜色
        value: new Color("#5588aa"),
    },
    uCityColor: {
        // 城市的颜色
        value: new Color("#1B3045"),
    },
};
// 创建着色器材质
const shader = new ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
});
// 设置城市材质
const setCityMaterial = (object: any, model: Group) => {
    const city = new Mesh(object.geometry, shader);
    city.position.set(object.position.x, object.position.y, object.position.z);
    city.name = "city";
    model.add(city);
    city.rotateX(-Math.PI / 2);
};
// 设置材质线条勾勒着色器
const setCityLineMaterial = (object: any, model: Group) => {
    const edges = new EdgesGeometry(object.geometry, 3);
    //设置模型的材质
    const lineMaterial = new LineBasicMaterial({
        // 线的颜色
        color: "rgba(38,133,254)",
    });
    //把数据组合起来
    const lineS = new LineSegments(edges, lineMaterial);
    //设置数据的位置
    lineS.position.set(object.position.x, object.position.y, object.position.z);
    //添加到场景
    model.add(lineS);

    lineS.rotateX(-Math.PI / 2);
};

// 更新高度
function updateUniforms(){
    uniforms.height.value += 0.2;
    if (uniforms.height.value > 100) {
        uniforms.height.value = 0;
    }
}

export function initEnv(scene: Engine){
    const rgbeLoader = new RGBELoader()
    return rgbeLoader.loadAsync('/models/texture/env.hdr').then((texture) => {
        texture.mapping = EquirectangularRefractionMapping//正常只是一张图平铺，设置这个可以让图包围环绕整个环境
        // scene.background = texture //设置环境贴图
        texture.premultiplyAlpha = true
        scene.environment = texture
    })
}

export function loadCharactor(scene: Engine): Promise<GLTF>{
    const glbLoader = new GLTFLoader(AssetsLoadingManager)
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/models/draco/gltf/' );
    dracoLoader.setDecoderConfig({ type: 'js' })
    dracoLoader.preload()
    glbLoader.setDRACOLoader( dracoLoader );
    
    return glbLoader.loadAsync("/models/gltf/city.glb")
    .then(gltf=>{
        const model = gltf.scene;

        console.log('-----模型加载完成-----', model)
        model.traverse((child: any) => {
            if (child.isMesh) {
                // if(child.name){
                //     scene.panel.addPanel(child);
                // }
                child.castShadow = true
                child.receiveShadow = true
                // 加载不同的材质
                if (["CITY_UNTRIANGULATED"].includes(child.name)) {
                    // 拿到模型线框的Geometry
                    setCityLineMaterial(child, model);
                    setCityMaterial(child, model);
                } 
                else if(child.name == "sx_0"){
                    // 河流
                    child.material = new MeshPhongMaterial({
                        color: new Color(0x000000), // 设置材质的基础颜色
                        emissive: 0x0069ff, // 设置自发光颜色
                        emissiveIntensity: 5 // 设置自发光强度
                    });
                }
                else if(child.name == "路网"){
                    child.material = new MeshPhongMaterial({
                        color: new Color(0x000000), // 设置材质的基础颜色
                        emissive: 0xFF8324, // 设置自发光颜色
                        emissiveIntensity: 5 // 设置自发光强度
                    });
                    // 调整位置
                    child.position.x += 60
                    child.position.z += 40
                }
                // start  "拜耳医药" "康乐保"
                else if(["立方体","立方体001","立方体002","立方体003","平面009","平面012"].includes(child.name)){
                    // 城市贴图
                    child.material.map = cityTexture
                } 
                else if(["立方体004","平面008"].includes(child.name)){
                    // 光栅贴图
                    console.log("--光栅贴图--", child)
                    // child.material.map = rasterTexture
                    child.material.map = klbRasterOpacityTexture
                    // if(child.name === "平面008"){
                    //     child.material.map = klbRasterOpacityTexture
                    // }
                    // child.material = new MeshStandardMaterial({
                    //     map: rasterTexture,
                    //     transparent: true,
                    //     opacity: 1.0
                    // });
                    // child.material = new ShaderMaterial({
                    //     uniforms: {
                    //         map: {value: rasterTexture},
                    //         alphaMap: {value: rasterOpacityTexture},
                    //     },
                    //     vertexShader: rasterOpacityVertexShader,
                    //     fragmentShader: rasterOpacityFragmentShader,
                    //     transparent: true
                    // });
                } 
                // 处理文本旋转
                else if(["文本","文本001"].includes(child.name)){
                    (child as Mesh).rotateZ(Math.PI / 2);
                    (child as Mesh).scale.set(1.5,1.5,1.5);
                } 
                // end  "拜耳医药" "康乐保"
                else if(child.name == "dm_0"){
                    // 处理地面
                    console.log("--地面--", child)
                } 
                else if (["ROADS"].includes(child.name)) {
                    //道路
                    // const material = new MeshBasicMaterial({
                    //     color: "rgb(41,46,76)",
                    // });
                    // const mesh = new Mesh(child.geometry, material);
                    // mesh.rotateX(-Math.PI / 2);
                    // mesh.position.set(
                    //     child.position.x,
                    //     child.position.y,
                    //     child.position.z
                    // );
                } else {
                    // //地面
                    // const material = new MeshBasicMaterial({
                    //     color: "#040912",
                    // });
                    // const mesh = new Mesh(child.geometry, material);
                    // mesh.rotateX(-Math.PI / 2);
                    // mesh.position.set(
                    //     child.position.x,
                    //     child.position.y,
                    //     child.position.z
                    // );
                }
            }
            else if(child.name == "日光"){
                // 处理灯光
                child = child as DirectionalLight
                child.intensity = 20
                child.position.y -= 300
                child.position.y += 100
                child.castShadow = true
            } 
        })
        
        // 调整模型位置
        model.position.setY(model.position.y + 300);
        model.position.setX(model.position.x + 300);
        model.updateMatrixWorld()

        let rectLightObject = model.getObjectByName("面光") as Object3D
        // 添加面光源
        // const rectLight = new RectAreaLight(0xffffff, 0.1, 1.32, 1.32);
        // rectLight.scale.set(rectLightObject.scale.x, rectLightObject.scale.y, rectLightObject.scale.z)
        // rectLight.position.set(rectLightObject.position.x, rectLightObject.position.y, rectLightObject.position.z)
        // rectLight.rotation.set(rectLightObject.rotation.x, rectLightObject.rotation.y, rectLightObject.rotation.z)
        // rectLight.lookAt(0, 0, 0);
        // scene.add(rectLight);

        let start = model.getObjectByName("ROADS")
        let end = model.getObjectByName("CITY_UNTRIANGULATED")
        if(start && end){
            // 定义飞线的起点终点
            let positions = [
                [start.position, end.position]
            ]
            let lines = createFlyingLines(positions);
            lines.forEach(line => {
                model.add(line)
            });
            scene.time.on("tick", (timer: any) => {
                updateUniforms()
                lines.forEach(line => {
                    (line.material as ShaderMaterial).uniforms.uTime.value = (timer.time as Clock).getElapsedTime() 
                });
            })
        }
        scene.add( model );
        return gltf
    })
    .catch(err=>{
        console.error('-----模型加载失败-----', err)
        return err
    })
}