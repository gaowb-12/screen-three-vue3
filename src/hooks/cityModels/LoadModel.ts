import { Clock, Color, DirectionalLight, DoubleSide, EdgesGeometry, EquirectangularReflectionMapping, EquirectangularRefractionMapping, Group, Line, LineBasicMaterial, LineSegments, Material, Mesh, MeshBasicMaterial, MeshPhongMaterial, MeshStandardMaterial, Object3D, Object3DEventMap, RectAreaLight, RepeatWrapping, Scene, ShaderMaterial, TextureLoader, Vector3 } from "three";
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
import {initTextureGui} from "./gui"

const cityTexture = new TextureLoader().load( '/models/texture/cityTexture.png' );
const rasterOpacityTexture = new TextureLoader().load('/models/texture/rasterOpacityTexture.png');
const klbRasterOpacityTexture = new TextureLoader().load('/models/texture/kanglebaoRasterTexture.png');

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

// 加载所有其他模型
export function loadOthersModels(){
    const glbLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath( '/models/draco/gltf/' );
    dracoLoader.setDecoderConfig({ type: 'js' })
    dracoLoader.preload()
    glbLoader.setDRACOLoader( dracoLoader );
    let assets = ["/models/gltf/康乐保城市光栅模型.glb"]
    return Promise.all(
        assets.map(asset=>glbLoader.loadAsync(asset))
    )
    .then(gltfs=>{
        console.log("--加载所有其他模型--", gltfs);
        return gltfs
    });
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
        let flyStartLines:any = [];
        let flyEndLines:any = [];
        model.traverse((child: any) => {
            child.castShadow = true
            child.receiveShadow = true
            if (child.isMesh) {
                // 加载不同的材质
                if (["CITY_UNTRIANGULATED"].includes(child.name)) {
                    // 拿到模型线框的Geometry
                    // setCityLineMaterial(child, model);
                    // setCityMaterial(child, model);
                } 
                else if(child.name == "sx_0"){
                    // 河流
                    child.material = new MeshStandardMaterial({
                        color: new Color(0x000000), // 设置材质的基础颜色
                        emissive: 0x0069ff, // 设置自发光颜色
                        emissiveIntensity: 5, // 设置自发光强度
                        // shadowSide: DoubleSide
                    });
                }
                else if(child.name == "路网"){
                    child.material = new MeshStandardMaterial({
                        color: new Color(0x000000), // 设置材质的基础颜色
                        emissive: 0xFF8324, // 设置自发光颜色
                        emissiveIntensity: 5, // 设置自发光强度
                        // shadowSide: DoubleSide
                    });
                    // 调整位置
                    child.position.x += 60
                    child.position.z += 40
                }
                // start  "拜耳医药" "康乐保"
                else if(["立方体","立方体001","立方体002","立方体003","平面009","平面012"].includes(child.name)){
                    // 城市贴图 (需要解决模型纹理)
                    child.material.map = cityTexture
                    if(["立方体","立方体001","立方体002","立方体003"].includes(child.name)){
                        // 拜尔
                        if(child.name === "立方体"){
                            // 开启调试纹理，设置纹理属性matrixAutoUpdate为false以后，纹理将通过matrix属性设置的矩阵更新纹理显示
                            // cityTexture.matrixAutoUpdate = false
                            // child.material.map.needsUpdate = true
                            // initTextureGui(child.material.map)
                        }
                        if(child.name === "立方体003"){
                            // 处理单个模型位置
                            child.rotateY(1.3)
                        }
                    }else if(["平面009","平面012"].includes(child.name)){
                        // "康乐保"
                    }
                } 
                else if(["立方体004","平面008"].includes(child.name)){
                    // 光栅贴图
                    if(child.name === "立方体004"){
                        child.material.map = rasterOpacityTexture
                        // 拜耳医药
                        rasterOpacityTexture.offset.x = 0.1
                        rasterOpacityTexture.center.x = 0
                    }
                    if(child.name === "平面008"){
                        // 康乐保 (需要解决模型纹理)
                        klbRasterOpacityTexture.matrixAutoUpdate = false
                        // child.material = new MeshStandardMaterial({
                        //     color: child.material.color, // 设置材质的基础颜色
                        //     // shadowSide: DoubleSide,
                        //     map: klbRasterOpacityTexture,
                        //     transparent: true,
                        //     emissive: child.material.emissive, // 设置自发光颜色
                        //     emissiveIntensity: child.material.emissiveIntensity, // 设置自发光强度
                        // });
                        child.material = new ShaderMaterial({
                            fragmentShader: rasterOpacityFragmentShader,
                            vertexShader: rasterOpacityVertexShader,
                            transparent: true,
                            uniforms:{
                                map: {
                                    value: klbRasterOpacityTexture
                                },
                                emissive: {
                                    // value: child.material.emissive
                                    value: new Color(0x000000)
                                }, // 设置自发光颜色
                                emissiveIntensity: {
                                    value: child.material.emissiveIntensity
                                }, // 设置自发光强度
                            },
                        });
                        // child.material.map = klbRasterOpacityTexture
                        klbRasterOpacityTexture.matrixAutoUpdate = false
                        klbRasterOpacityTexture.needsUpdate = true
                        initTextureGui(klbRasterOpacityTexture)
                    }
                }
                // 处理文本旋转
                else if(["文本","文本001"].includes(child.name)){
                    (child as Mesh).rotateZ(Math.PI / 2);
                    (child as Mesh).position.y += 10;
                    (child as Mesh).scale.set(8,8,8);
                    if(child.name=="文本"){
                        // 拜耳医药
                        child.updateMatrixWorld(true)
                        flyStartLines.push(child)
                    }
                } 
                else if(["文本007","文本004","文本002"].includes(child.name)){
                    child.updateMatrixWorld(true)
                    flyEndLines.push(child)
                } 
                else if(child.name == "城市") {
                    const material = new MeshStandardMaterial({
                        color: new Color(0x241f38),
                    });
                    child.material = material;
                } else {
                    //地面
                    // const material = new MeshBasicMaterial({
                    //     color: child.material.color,
                    //     map: child.material.map
                    // })
                    // child.material = material;
                }
            }
            else if(child.name == "日光"){
                // 处理灯光
                child = child as DirectionalLight
                child.intensity = 0
                child.position.y -= 300
                child.position.y += 100
                child.castShadow = true;
                // 配置阴影映射相关参数
                child.shadow.mapSize.set(1024, 1024);
            } 
        })
        
        // let rectLightObject = model.getObjectByName("面光") as Object3D
        // 添加面光源
        // const rectLight = new RectAreaLight(0xffffff, 0.1, 1.32, 1.32);
        // rectLight.scale.set(rectLightObject.scale.x, rectLightObject.scale.y, rectLightObject.scale.z)
        // rectLight.position.set(rectLightObject.position.x, rectLightObject.position.y, rectLightObject.position.z)
        // rectLight.rotation.set(rectLightObject.rotation.x, rectLightObject.rotation.y, rectLightObject.rotation.z)
        // rectLight.lookAt(0, 0, 0);
        // scene.add(rectLight);
        if(flyStartLines[0]){
            // 定义飞线的起点终点
            let positions = flyEndLines.map(item=>(
                [flyStartLines[0]?.getWorldPosition(new Vector3), item.getWorldPosition(new Vector3)]
            ))
            let lines = createFlyingLines(positions);
            lines.forEach(line => {
                model.add(line)
            });
            scene.time.on("tick", (timer: any) => {
                updateUniforms()
                lines.forEach(line => {
                    // if(line.name == "飞线")
                    // (line.material as ShaderMaterial).uniforms.uTime.value = (timer.time as Clock).getElapsedTime() 
                });
            })
        }
        scene.add( model );

        // loadOthersModels()
        // .then(gltfs=>{
        //     const otherModels = gltfs[0].scene;
        //     otherModels.traverse((child: any) => {
        //         if(child.name === "平面008"){
        //             const material = new MeshStandardMaterial({
        //                 color: new Color(0.8, 0.8, 0.8),
        //                 // map: klbRasterOpacityTexture,
        //                 transparent: true,
        //                 emissive: new Color(0, 0.5, 1), // 设置自发光颜色
        //                 emissiveIntensity: 10 // 设置自发光强度
        //             })
        //             // 康乐保
        //             child.material = material
        //             const mesh = new Mesh(child.geometry, material);
        //             mesh.position.set(
        //                 child.position.x + 10,
        //                 child.position.y + 10,
        //                 child.position.z + 10
        //             );
        //             child.parent.add(mesh)
        //         }
        //     });
        //     otherModels.position.set(310,310,20)
        //     scene.add( otherModels );
        // });
        
        return gltf
    })
    .catch(err=>{
        console.error('-----模型加载失败-----', err)
        return err
    })
}