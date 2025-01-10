import { BaseEvent, Camera, EventDispatcher, Object3D, Object3DEventMap, Raycaster, Scene, Vector2 } from "three";

export interface EventManagerParameter{
    dom: HTMLCanvasElement
    scene: Scene
    camera: Camera
}
export interface dispatchEventParameter{
    click : any
}
// 集成事件触发器
export class EventManager extends EventDispatcher<dispatchEventParameter>{
    private mouse: Vector2 = new Vector2
    private raycaster: Raycaster = new Raycaster
    private dom: HTMLCanvasElement
    private scene: Scene
    private camera: Camera
    constructor(params: EventManagerParameter){
        super()
        this.dom = params.dom
        this.scene = params.scene
        this.camera = params.camera
        this.init()
    }
    init(){
        let cacheObject3d: Object3D | null = null
        // 添加鼠标事件
        const mouse = this.mouse
        const raycaster = this.raycaster
        this.dom.addEventListener("mousedown", ()=>{
            // 设置射线，根据相机跟鼠标位置进行设置
            raycaster.setFromCamera(mouse,  this.camera)
            // 通过射线获取交叉的物体
            const intersectObjects = raycaster.intersectObjects(this.scene.children, false)
            this.dispatchEvent({
                type: "mousedown",
                intersectObjects
            });
            if(intersectObjects.length>0){
                let object = intersectObjects[0].object
                object.dispatchEvent({
                    type:"mousedown" as keyof Object3DEventMap
                })
            }
        })
        this.dom.addEventListener("mousemove", (event)=>{
            const domX = event.offsetX
            const domY = event.offsetY
            const width = this.dom.offsetWidth
            const height = this.dom.offsetHeight
            // 坐标位置归一化，将屏幕canvas坐标系，转换为webgl归一化坐标
            mouse.x = domX * 2 / width - 1;
            mouse.y = -domY * 2 / height + 1;

            // 设置射线，根据相机跟鼠标位置进行设置
            raycaster.setFromCamera(mouse,  this.camera)
            // 通过射线获取交叉的物体
            const intersectObjects = raycaster.intersectObjects(this.scene.children, false)
            this.dispatchEvent({
                type: "mousemove",
                intersectObjects
            });
            if(intersectObjects.length>0){
                let object = intersectObjects[0].object
                if(object !== cacheObject3d){
                    if(cacheObject3d){
                        cacheObject3d.dispatchEvent({
                            type:"mouseleave" as keyof Object3DEventMap
                        })
                    }
                    // mouseenter
                    object.dispatchEvent({
                        type:"mouseenter" as keyof Object3DEventMap
                    })
                    cacheObject3d = object
                }else{
                    object.dispatchEvent({
                        type:"mousemove" as keyof Object3DEventMap
                    })
                }
            }else{
                if(cacheObject3d){
                    cacheObject3d.dispatchEvent({
                        type:"mouseleave" as keyof Object3DEventMap
                    })
                }
                cacheObject3d = null
            }
        })
        this.dom.addEventListener("mouseup", ()=>{
            // 设置射线，根据相机跟鼠标位置进行设置
            raycaster.setFromCamera(mouse,  this.camera)
            // 通过射线获取交叉的物体
            const intersectObjects = raycaster.intersectObjects(this.scene.children, false)
            this.dispatchEvent({
                type: "mouseup",
                intersectObjects
            });
            if(intersectObjects.length>0){
                let object = intersectObjects[0].object
                object.dispatchEvent({
                    type:"mouseup" as keyof Object3DEventMap
                })
            }
        })
        this.dom.addEventListener("click", ()=>{
            // 设置射线，根据相机跟鼠标位置进行设置
            raycaster.setFromCamera(mouse,  this.camera)
            // 通过射线获取交叉的物体
            const intersectObjects = raycaster.intersectObjects(this.scene.children, false)
            this.dispatchEvent({
                type: "click",
                intersectObjects
            });
            if(intersectObjects.length>0){
                let object = intersectObjects[0].object
                object.dispatchEvent({
                    type:"click" as keyof Object3DEventMap
                })
            }
        })
    }
}