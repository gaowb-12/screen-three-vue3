import { Clock, Color, EdgesGeometry, Group, Line, LineBasicMaterial, LineSegments, Material, Mesh, MeshBasicMaterial, Object3D, Scene, ShaderMaterial, Vector3 } from "three";
import fragmentShader from "@/components/Shader/City3D/fragmentShader.glsl";
import vertexShader from "@/components/Shader/City3D/vertexShader.glsl";
import { AssetsLoadingManager } from "./LoadingManager";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import { createFlyingLines } from './FlyLine'
import { Engine } from "./Engine";
import { Time } from "./Time";

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

export function loadCharactor(scene: Engine): Promise<GLTF>{
    const glbLoader = new GLTFLoader(AssetsLoadingManager)
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath( '/models/draco/gltf/' );
    // dracoLoader.setDecoderConfig({ type: 'js' })
    // dracoLoader.preload()
    // glbLoader.setDRACOLoader( dracoLoader );
    
    return glbLoader.loadAsync("/models/gltf/shanghai.gltf")
    .then(gltf=>{
        const model = gltf.scene;

        console.log('-----模型加载完成-----', model)
        model.traverse((child: any) => {
            if (child.isMesh) {
                if(child.name){
                    scene.panel.addPanel(child);
                }
                // 加载不同的材质
                if (["CITY_UNTRIANGULATED"].includes(child.name)) {
                    // 拿到模型线框的Geometry
                    setCityLineMaterial(child, model);
                    setCityMaterial(child, model);
                } else if (["ROADS"].includes(child.name)) {
                    //道路
                    const material = new MeshBasicMaterial({
                        color: "rgb(41,46,76)",
                    });
                    const mesh = new Mesh(child.geometry, material);
                    mesh.rotateX(-Math.PI / 2);
                    mesh.position.set(
                        child.position.x,
                        child.position.y,
                        child.position.z
                    );
                } else {
                    //地面
                    const material = new MeshBasicMaterial({
                        color: "#040912",
                    });
                    const mesh = new Mesh(child.geometry, material);
                    mesh.rotateX(-Math.PI / 2);
                    mesh.position.set(
                        child.position.x,
                        child.position.y,
                        child.position.z
                    );
                }
            }
        })
        
        // 调整模型位置
        model.position.setY(model.position.y + 300);
        model.position.setX(model.position.x + 300);
        model.updateMatrixWorld()

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