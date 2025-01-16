import {
    PerspectiveCamera,
    WebGLRenderer,
    Scene,
    Vector3,
    Object3D,
    Mesh,
    MeshStandardMaterial,
    BufferGeometry,
    Vector2,
    LinearToneMapping,
} from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';
import { EventManager } from "./EventManager";
import { Time } from "./Time";
import { Panel } from "./Panel";
import {initEnv} from "./LoadModel"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { initBloomGui } from "./gui";

export class Engine extends Scene {
    private dom: HTMLCanvasElement | null
    private renderer: WebGLRenderer
    private composer!: EffectComposer
    // private scene:Scene
    private controls: OrbitControls
    private stats: Stats
    private eventManager: EventManager
    public camera: PerspectiveCamera
    public time: Time
    public panel: Panel
    
    constructor(dom: HTMLCanvasElement, ops?: any) {
        super()
        this.time = new Time();
        const options = {
            camera: {
                fov: 45,
                near: 0.1,
                far: 1000,
                position: {
                    x: 1640,
                    y: 889,
                    z: 1451,
                },
            },
            pixelRatio: 2,
            width: window.innerWidth,
            height: window.innerHeight,
            renderer: {
                clearAlpha: 1,
                clearColor: "#000",
            },
            unrealBloomPass:{
                strength: 0.3,
                radius: 0.1,
                threshold: 1,
            },
            ...ops
        }
        this.panel = new Panel(options)

        this.dom = dom;
        // 初始化渲染器
        this.renderer = new WebGLRenderer({
            canvas: this.dom,
            antialias: true
        });
        // 设置背景颜色
        this.renderer.setClearColor(options.renderer.clearColor, options.renderer.clearAlpha);

        // 允许阴影
        this.renderer.shadowMap.enabled = true;
        this.renderer.setPixelRatio(options.pixelRatio)
        this.renderer.toneMapping = LinearToneMapping
        //设置页面大小
        this.renderer.setSize(options.width, options.height, true);
        
        // 初始化场景
        // this.scene = new Scene();
        // 初始化相机，透视相机
        this.camera = new PerspectiveCamera(
            options.camera.fov,
            this.dom.width / this.dom.height,
            options.camera.near,
            options.camera.far
        );
        // 设置相机位置
        this.camera.position.set(options.camera.position.x, options.camera.position.y, options.camera.position.z);
        // 设置相机朝向
        this.camera.lookAt(new Vector3(0, 0, 0));
        // 设置相机朝上方向
        this.camera.up = new Vector3(0, 1, 0)

        this.addComposer(options)

        // 控制器
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        // // 由控件所使用的鼠标操作的引用。
        // this.controls.mouseButtons = {
        //     LEFT: null,
        //     MIDDLE: MOUSE.DOLLY,
        //     RIGHT: MOUSE.ROTATE,
        // }
        // initEnv(this)
        // 初始变换控制器
        let transing = false; // 区分触发的事件
        this.eventManager = new EventManager({
            scene: this,
            dom: this.renderer.domElement,
            camera: this.camera
        })
        type M = Mesh<BufferGeometry, MeshStandardMaterial>
        // let cacheObject3d: M | null = null
        // this.eventManager.addEventListener("mousemove",(event)=>{
        //     let scaleColor = 1.5
        //     if((event as any).intersectObjects.length){
        //         let object = (event as any).intersectObjects[0].object as M;
        //         if(object === cacheObject3d){
        //             return 
        //         }else if(cacheObject3d && object !== cacheObject3d){
        //             cacheObject3d.material.color.multiplyScalar(1 / scaleColor)
        //         }else if(object.material){
        //             object.material.color.multiplyScalar(scaleColor)
        //         }
        //         cacheObject3d = object
        //     }else{
        //         if(cacheObject3d){
        //             cacheObject3d.material.color.multiplyScalar(1 / scaleColor)
        //         }
        //         cacheObject3d = null
        //     }
        // })
        this.eventManager.addEventListener("click", (event) => {
            if (transing) {
                transing = false
                return;
            }
            let intersectObjects = (event as any).intersectObjects
            console.log('current scene is：', this)
            console.log('current selected Object：',intersectObjects)
        })
        // 性能监视器
        this.stats = new Stats();
        const statsDom = this.stats.dom;
        statsDom.style.position = 'fixed';
        statsDom.style.left = '5px'
        statsDom.style.top = '0'

        // 添加场景到页面上
        // this.dom.appendChild(this.renderer.domElement)
        // this.dom.appendChild(statsDom)
        // 渲染数据
        this.animate();
    }
    addComposer(options){
        // 创建了一个RenderPass对象，用于将场景渲染到纹理上。
        const renderScene = new RenderPass(this, this.camera);
        // 创建了一个UnrealBloomPass对象，用于实现辉光效果。≈
        const bloomPass = new UnrealBloomPass(
            new Vector2(options.width, options.height),
            1.5,
            0.4,
            0.85
        );
        // 设置发光参数,阈值、强度和半径。
        bloomPass.strength = options.unrealBloomPass.strength;
        bloomPass.radius = options.unrealBloomPass.radius;
        bloomPass.threshold = options.unrealBloomPass.threshold;

        // 创建了一个OutputPass对象，用于将最终渲染结果输出到屏幕上。
        const outputPass = new OutputPass();

        // 创建了一个EffectComposer对象，并将RenderPass、UnrealBloomPass和OutputPass添加到渲染通道中。
        this.composer = new EffectComposer(this.renderer);
        this.composer.addPass(renderScene);
        this.composer.addPass(bloomPass);
        this.composer.addPass(outputPass);
        // initBloomGui(bloomPass)
    }
    addObject(...object: Object3D[]) {
        object.forEach(element => {
            this.add(element)
        });
    }
    dispose(){
        this.dom = null;
        this.renderer.dispose()
        this.time.dispose()
        this.panel.dispose()
    }
    animate() {
        requestAnimationFrame(this.animate.bind(this));
        this.panel.labelRender(this)
        this.controls.update();
        this.stats.update();
        this.composer.render();
    }
}