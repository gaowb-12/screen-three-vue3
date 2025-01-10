import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { Engine } from './Engine';
import { Object3D } from 'three';

export class Panel {
    labelRenderer: CSS2DRenderer
    constructor(options:any) {
        this.labelRenderer = new CSS2DRenderer();
        this.labelRenderer.setSize( options.width, options.height );
        this.labelRenderer.domElement.style.position = 'absolute';
        this.labelRenderer.domElement.style.zIndex = "100";
        this.labelRenderer.domElement.style.top = '0px';        
        this.labelRenderer.domElement.style.pointerEvents = 'none'; // 确保鼠标事件不会影响 2D 标签

        document.body.appendChild( this.labelRenderer.domElement );
    }

    addPanel(obj: Object3D, offset: number = 10, distance?: number) {
        const massDiv = document.createElement( 'div' );
        massDiv.className = 'label';
        massDiv.innerHTML = `
            <div class="label-content">
                <p>模型名称: ${obj.name}</p>
                <p>
                    模型位置: 
                    x-${obj.position.x}，<br>
                    y-${obj.position.y}，<br>
                    z-${obj.position.z}
                </p>
            </div>
        `;

        const massLabel = new CSS2DObject( massDiv );
        // massLabel.position.set(obj.position.x, obj.position.y + offset, obj.position.z);
        massLabel.position.set(0, offset, 0);
        massLabel.center.set( 0, 0 );
        massLabel.name = "massLabel";
        obj.add( massLabel );
        // moonMassLabel.layers.set( 1 );
        
        // 监听模型的缩放变化
        obj.onBeforeRender = () => {
            const scale = obj.scale.length();
            massLabel.scale.set(1 / scale, 1 / scale, 1 / scale);
        };
    }

    labelRender(scene: Engine){
        this.labelRenderer.render( scene, scene.camera );
    }
    // public update() {
    //     const p = this.obj.position.clone()
    //     // 获取世界坐标
    //     this.obj.getWorldPosition(p)
    //     // 距离相机的距离（Panel.camera保存了特写相机跟第三人称相机）
    //     const distance = Panel.camera.position.distanceTo(p)

    //     p.y += ((this.offset as any).y * this.obj.scale.y)
    //     // 将此向量(坐标)从世界空间投影到相机的标准化设备坐标 (NDC) 空间。
    //     const v = p.project(Panel.camera)

    //     // webgl坐标转换为屏幕坐标
    //     v.x = (v.x + 1) / 2 * window.innerWidth
    //     v.y = -(v.y - 1) / 2 * window.innerHeight

    //     let style = `transform: translate3d(${v.x}px, ${v.y}px, 0);`
    //     // 距离相机远的需要隐藏
    //     if (distance > this.distance || distance <= 0) style += `visibility: hidden;`
    //     else style += `visibility: visible;`;

    //     (this.el as HTMLDivElement).setAttribute('style', style)
    // }

    dispose() {
        document.body.removeChild(this.labelRenderer.domElement);
    }
}

