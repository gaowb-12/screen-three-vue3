import { ClampToEdgeWrapping, Material, RepeatWrapping } from "three"
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

// 材质调试
export const initTextureGui = (material) => {
    let gui = {
        offsetX: material.map.offset.x ?? 0,
        offsetY: material.map.offset.y ?? 0,
        repeatX: material.map.repeat.y ?? 1,
        repeatY: material.map.repeat.y ?? 1,
        rotation: material.map.rotation ?? 0,
        centerX: material.map.repeat.x ?? 0.5,
        centerY: material.map.repeat.y ?? 0.5,
        flipY: material.map.flipY,
        RepeatWrapping: true
    }
    var datGui = new GUI()
    //将设置属性添加到gui当中，gui.add(对象，属性，最小值，最大值）
    datGui.add(gui, "offsetX", 0.0, 1.0).onChange(updateUV)
    datGui.add(gui, "offsetY", 0.0, 1.0).onChange(updateUV)
    datGui.add(gui, "repeatX", 0.25, 2.0).onChange(updateUV)
    datGui.add(gui, "repeatY", 0.25, 2.0).onChange(updateUV)
    datGui.add(gui, "rotation", -6.18, 6.18).onChange(updateUV)
    datGui.add(gui, "centerX", 0.0, 1.0).onChange(updateUV)
    datGui.add(gui, "centerY", 0.0, 1.0).onChange(updateUV)

    datGui.add(gui, 'flipY').onChange(e => {
        if (e) {
            material.map.flipY = true
        } else {
            material.map.flipY = false
        }
    });
    datGui.add(gui, 'RepeatWrapping').onChange(e => {
        if (e) {
            // wrapS表示x轴的纹理的回环方式
            material.map.wrapS = material.map.wrapT = RepeatWrapping
        } else {
            material.map.wrapS = material.map.wrapT = ClampToEdgeWrapping //设置会默认的最后一像素伸展
        }
    });
    function updateUV() {
        // 一种方法，直接全写在一个方法内
        // 另一种方法，分开写
        material.map.matrix
            .identity() //矩阵重置
            .translate(-gui.centerX, -gui.centerY) //设置中心点
            .rotate(gui.rotation) // 旋转
            .scale(gui.repeatX, gui.repeatY) //缩放
            .translate(gui.centerX, gui.centerY) //设置中心点
            .translate(gui.offsetX, gui.offsetY) //偏移
    }
}

// 辉光调试
export const initBloomGui = (bloomPass: UnrealBloomPass) => {
    // 辉光参数
    const params = {
        // 强度
        bloomStrength: 0.3,
        // 阈值
        bloomThreshold: 0.95,
        // 半径
        bloomRadius: 0.4
    }
    // UI调试
    const gui = new GUI()
    gui.add(params, 'bloomThreshold', 0.0, 1.0).step(0.01).name('阈值').onChange(function (value) {
        bloomPass.threshold = Number(value)
    })

    // 强度 在0-10之间可正常看到物体，超过10会因光线过强而看不见物体，步长建议0.01
    gui.add(params, 'bloomStrength', 0, 10).step(0.01).name('强度').onChange(function (value) {
        bloomPass.strength = Number(value)
    })

    gui.add(params, 'bloomRadius', 0.0, 1.0).step(0.01).name('半径').onChange(function (value) {
        bloomPass.radius = Number(value)
    })
}