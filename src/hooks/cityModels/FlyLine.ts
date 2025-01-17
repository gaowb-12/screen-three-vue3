import fragmentShader from "@/components/Shader/FlyLine/fragmentShader.glsl";
import vertexShader from "@/components/Shader/FlyLine/vertexShader.glsl";
import { Vector3, Line, Color, ShaderMaterial, AdditiveBlending, QuadraticBezierCurve3, Clock, Mesh, Object3D, Vector2, Shape, ExtrudeGeometry, MeshStandardMaterial, DoubleSide, BufferGeometry, BufferAttribute } from 'three';
import { Engine } from "./Engine";
import { MeshLine, MeshLineMaterial, MeshLineRaycast } from 'three.meshline';

interface FlyOptions {
    uColor: Color; // 飞线颜色
    uBgColor: Color; // 背景颜色
    uDuration: number; // 动画执行周期
}
const flyOptionsDefault: FlyOptions = {
    uColor: new Color(0xFFCC7E),
    uBgColor: new Color(0xff0000), 
    uDuration: 4.0,
}
// 创建飞线
export const createFlyingLines = (
    positions: Vector3[][], 
    flyOptions: FlyOptions = flyOptionsDefault
): Mesh[] => {
    const lines: Mesh[] = []
    for (let i = 0; i < positions.length; i++) {
        const [start, end] = positions[i];
        const length = start.distanceTo(end);
        // 二次贝塞尔曲线生成飞线
        const curve = new QuadraticBezierCurve3(
            start.clone(),
            start.clone().lerp(end, 0.5).add(new Vector3(0, length / 3, 0)), // 控制点
            end.clone()
        );
        const points = curve.getPoints(50);
        // const geometry = new BufferGeometry().setFromPoints(points);

        // 虚线
        let linePoints = points.map(point=>([point.x, point.y, point.z]))
        //创建线的几何体
        let line = new MeshLine();
        //设置构成这条线需要的几个点
        line.setPoints(linePoints.flat());
        //设置线段需要的材质
        let material = new MeshLineMaterial({
            color: new Color(0xFFCC7E),
            lineWidth: 1,
            //dashArray和dashRatio都是构成虚线的影响因素
            dashArray: 0.005,
            dashRatio: 0.5,
            dashOffset: 0.1, // 新增
            repeat: new Vector2(2, 1),
            transparent: true,
            opacity:0.8
        });
        // material.transparent = true;//虚线功能//只要开启虚线功能后,dashArray和dashRatio才会生效
        const mesh = new Mesh(line, material);//网格=几何体+材质
        mesh.renderOrder = 10

        // // 自定义着色器，控制飞线效果
        const shaderMaterial = new ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: {
                uTime: { value: 0 }, // 时间
                uLength: { value: curve.getLength() }, // 飞线长度
                uColor: { value: flyOptions.uColor },
                uBgColor: { value: flyOptions.uBgColor }, 
                uDuration: { value: flyOptions.uDuration },
            },
            transparent: true,
            blending: AdditiveBlending,
        });
        //创建线的几何体
        let flyLine = new MeshLine();
        //设置构成这条线需要的几个点
        flyLine.setPoints(linePoints.flat());
        const flyMesh = new Mesh(flyLine, shaderMaterial);//网格=几何体+材质
        flyMesh.name="虚线-飞线"

        mesh.userData={
            index: i,
            ...mesh.userData
        }
        mesh.name="飞线"
        mesh.raycast = MeshLineRaycast
        
        lines.push(mesh, flyMesh )
    }
    
    return lines
};

