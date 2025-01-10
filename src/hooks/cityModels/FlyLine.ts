import fragmentShader from "@/components/Shader/FlyLine/fragmentShader.glsl";
import vertexShader from "@/components/Shader/FlyLine/vertexShader.glsl";
import { Vector3, BufferGeometry, Line, Color, ShaderMaterial, AdditiveBlending, QuadraticBezierCurve3, Clock, Mesh, Object3D } from 'three';
import { Engine } from "./Engine";

interface FlyOptions {
    uColor: Color; // 飞线颜色
    uBgColor: Color; // 背景颜色
    uDuration: number; // 动画执行周期
}
const flyOptionsDefault: FlyOptions = {
    uColor: new Color(0xffff00),
    uBgColor: new Color(0xff0000), 
    uDuration: 4.0,
}
// 创建飞线
export const createFlyingLines = (
    positions: Vector3[][], 
    flyOptions: FlyOptions = flyOptionsDefault
): Line[] => {
    const lines: Line[] = []
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
        const geometry = new BufferGeometry().setFromPoints(points);

        // 自定义着色器，控制飞线效果
        const material = new ShaderMaterial({
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
        // 将飞线添加到场景中
        const line = new Line(geometry, material);
        lines.push(line)
    }
    
    return lines
};

