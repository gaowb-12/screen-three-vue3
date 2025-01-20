import {
  Fog,
  Group,
  MeshBasicMaterial,
  DirectionalLight,
  AmbientLight,
  PointLight,
  Vector2,
  Vector3,
  MeshLambertMaterial,
  LineBasicMaterial,
  Color,
  MeshStandardMaterial,
  PlaneGeometry,
  Mesh,
  DoubleSide,
  RepeatWrapping,
  SRGBColorSpace,
  AdditiveBlending,
  VideoTexture,
  NearestFilter,
  BoxGeometry,
  TubeGeometry,
  QuadraticBezierCurve3,
  PointsMaterial,
  Sprite,
  SpriteMaterial,
  CustomBlending,
  AddEquation,
  DstColorFactor,
  OneFactor,
} from "three"
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js'
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";

import {
  Mini3d,
  ExtrudeMap,
  BaseMap,
  Line,
  Grid,
  Label3d,
  Plane,
  Particles,
  GradientShader,
  DiffuseShader,
  Focus,
} from "@/mini3d"
import { debounce } from  "lodash-es"
import { geoMercator } from "d3-geo"
import worldData from "./map/worldData"
import chinaData from "./map/chinaData"
import provincesData from "./map/provincesData"
import gsap from "gsap"
import emitter from "@/utils/emitter"
import { InteractionManager } from "three.interactive"
import mapInfo from "./map/enumInfo"
import { initTextureGui } from "@/hooks/cityModels/gui"
export class World extends Mini3d {
  constructor(canvas, assets, options) {
    super(canvas)
    this.mapName="world"
    this.mapData = {
      world: worldData,
      china: chinaData,
      beijing: provincesData
    }
    this.options = options
    // 中心坐标
    this.geoProjectionCenter = mapInfo[this.mapName].centerCoordinates
    // 缩放比例
    this.geoProjectionScale = mapInfo[this.mapName].scale
    // 飞线中心
    this.flyLineCenter = [116.005285, 39.904989]
    // 地图拉伸高度
    this.depth = 0.5
    // 是否点击
    this.clicked = true
    // 雾
    this.scene.fog = new Fog(0x102736, 1, 50)
    // 背景
    // this.scene.background = new Color(0x102736)
    this.assets = assets

    this.scene.background = this.assets.instance.getResource("geoMapBgTexture")
    this.scene.backgroundBlurriness = 0.4
    this.scene.backgroundIntensity = 0.2

    this.mapGroupContainer = new Group()
    this.scene.add(this.mapGroupContainer)
    // 相机初始位置
    this.camera.instance.position.set(-13.767695123014105, 220.990152163077308, 39.28228164159694)
    this.camera.instance.near = 0.1
    this.camera.instance.far = 10000
    this.camera.instance.updateProjectionMatrix()
    // 创建交互管理
    this.interactionManager = new InteractionManager(this.renderer.instance, this.camera.instance, this.canvas)
    
    this.needRemovedAssets = []
    // 创建环境光
    this.initEnvironment()
    this.init()
  }
  init() {
    // 标签组
    this.labelGroup = new Group()
    this.label3d = new Label3d(this)
    this.labelGroup.rotation.x = -Math.PI / 2
    this.scene.add(this.labelGroup)
    // 飞线焦点光圈组
    this.flyLineFocusGroup = new Group()
    this.flyLineFocusGroup.visible = false
    this.flyLineFocusGroup.rotation.x = -Math.PI / 2
    this.scene.add(this.flyLineFocusGroup)
    this.allGuangquan = []
    this.InfoPointGroup = new Group
    // 区域事件元素
    this.eventElement = []
    this.infoLabelElement = []
    // 鼠标移上移除的材质
    this.defaultMaterial = null // 默认材质
    this.defaultLightMaterial = null // 高亮材质
    // 地图整体的模糊背景
    // this.createChinaBlurLine()

    // 扩散网格
    // this.createGrid()
    // 旋转圆环
    this.createRotateBorder()
    // 创建地图
    this.createMap()

    // 创建动画时间线
    let tl = gsap.timeline({
      onComplete: () => {},
    })
    tl.pause()
    this.animateTl = tl
    tl.addLabel("focusMap", 1.5)
    tl.addLabel("focusMapOpacity", 2)
    tl.addLabel("bar", 3)
    tl.to(this.camera.instance.position, {
      duration: 2,
      x: -0.17427287762525134,
      y: 17.678992786206543,
      z: 17.688611202093714,
      ease: "circ.out",
      onStart: () => {
        this.flyLineFocusGroup.visible = false
      },
    })
    tl.to(
      this.focusMapGroup.position,
      {
        duration: 1,
        x: 0,
        y: 0,
        z: 0,
      },
      "focusMap"
    )

    tl.to(
      this.focusMapGroup.scale,
      {
        duration: 1,
        x: 1,
        y: 1,
        z: 1,
        ease: "circ.out",
        onComplete: () => {
          this.flyLineGroup.visible = true
          this.InfoPointGroup.visible = true
          this.createInfoPointLabelLoop()
        },
      },
      "focusMap"
    )
    tl.to(
      this.mapLineMaterial,
      {
        duration: 0.5,
        delay: 0.3,
        opacity: 1,
      },
      "focusMapOpacity"
    )
    tl.to(
      this.rotateBorder1.scale,
      {
        delay: 0.3,
        duration: 1,
        x: 1,
        y: 1,
        z: 1,
        ease: "circ.out",
      },
      "focusMapOpacity"
    )
    tl.to(
      this.rotateBorder2.scale,
      {
        duration: 1,
        delay: 0.5,
        x: 1,
        y: 1,
        z: 1,
        ease: "circ.out",
        onComplete: () => {
          this.flyLineFocusGroup.visible = true
          emitter.$emit("mapPlayComplete")
        },
      },
      "focusMapOpacity"
    )

    this.allGuangquan.map((item, index) => {
      tl.to(
        item.children[0].scale,
        {
          duration: 1,
          delay: 0.1 * index,
          x: 1,
          y: 1,
          z: 1,
          ease: "circ.out",
        },
        "bar"
      )
      tl.to(
        item.children[1].scale,
        {
          duration: 1,
          delay: 0.1 * index,
          x: 1,
          y: 1,
          z: 1,
          ease: "circ.out",
        },
        "bar"
      )
    })
  }

  initToggleAnimate(){
    this.flyLineFocusGroup.visible = false
    let duration = 1.5
    gsap.to(
      this.focusMapGroup.position,
      {
        duration,
        x: 0,
        y: 0,
        z: 0,
        ease: "circ.out",
      }
    )
    gsap.to(
      this.focusMapGroup.scale,
      {
        duration,
        x: 1,
        y: 1,
        z: 1,
        ease: "circ.out",
        onComplete: () => {
          this.flyLineGroup.visible = true
          this.InfoPointGroup.visible = true
          this.flyLineFocusGroup.visible = true
          this.createInfoPointLabelLoop()
        },
      }
    )
    this.allGuangquan.map((item, index) => {
      let i = index + 1
      gsap.to(
        item.children[0].scale,
        {
          duration,
          delay: 1 + 0.1 * i,
          x: 1,
          y: 1,
          z: 1,
          ease: "circ.out",
        }
      )
      gsap.to(
        item.children[1].scale,
        {
          duration,
          delay: 1 + 0.1 * i,
          x: 1,
          y: 1,
          z: 1,
          ease: "circ.out",
        }
      )
    })
  }

  initEnvironment() {
    let sun = new AmbientLight(0xffffff, 5)
    this.scene.add(sun)
    let directionalLight = new DirectionalLight(0xffffff, 3)
    directionalLight.position.set(-10, 5, -8)
    directionalLight.shadow.radius = 12
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    this.scene.add(directionalLight)
    // this.createPointLight({
    //   color: "#1d5e5e",
    //   intensity: 800,
    //   distance: 10000,
    //   x: -9,
    //   y: 3,
    //   z: -3,
    // })
    this.createPointLight({
      color: "#1d5e5e",
      intensity: 200,
      distance: 10000,
      x: 0,
      y: 2,
      z: 5,
    })
  }
  createPointLight(pointParams) {
    const pointLight = new PointLight(0x1d5e5e, pointParams.intensity, pointParams.distance)
    pointLight.position.set(pointParams.x, pointParams.y, pointParams.z)
    this.scene.add(pointLight)
  }
  createMap() {
    let mapGroup = new Group()
    let focusMapGroup = new Group()
    this.focusMapGroup = focusMapGroup
    // 地图
    let { map, mapTop, mapLine, mapBottomeLine } = this.createProvince()
    map.setParent(focusMapGroup)
    mapTop.setParent(focusMapGroup)
    mapLine.setParent(focusMapGroup)
    mapBottomeLine.setParent(focusMapGroup)
    focusMapGroup.position.set(0, 0, -0.01)
    focusMapGroup.scale.set(1, 1, 0)
    mapGroup.add(focusMapGroup)
    mapGroup.rotation.x = -Math.PI / 2
    mapGroup.position.set(0, 0.2, 0)
    // this.scene.add(mapGroup)
    this.mapGroupContainer.add(mapGroup)
    
    // 添加事件
    this.createEvent()
    // 创建飞线
    this.createFlyLine()
    // 创建飞线焦点
    this.createFocus()
    // 创建信息点
    this.createInfoPoint()
    
    // 创建轮廓
    this.createStorke()
    // let num = 0;
    // this.scene.traverse(child=>{
    //   child.isMesh ? num++ : null
    // })
    // console.log(`---当前的场景有多少物体数量：${num}---`,this.scene)
  }
  createProvince() {
    let mapJsonData = this.assets.instance.getResource(this.mapName)
    let [topMaterial, sideMaterial] = this.createProvinceMaterial()
    // 创建地图
    let map = new ExtrudeMap(this, {
      geoProjectionCenter: this.geoProjectionCenter,
      geoProjectionScale: this.geoProjectionScale,
      position: new Vector3(0, 0, 0.11),
      data: mapJsonData,
      depth: this.depth,
      topFaceMaterial: topMaterial,
      sideMaterial: sideMaterial,
      renderOrder: 9,
    })
    
    let mapTexture = this.assets.instance.getResource("geoMapTexture")
    mapTexture.wrapS = mapTexture.wrapT = RepeatWrapping
    mapTexture.repeat.set(0.25,0.25)
    mapTexture.colorSpace = SRGBColorSpace
    // 创建地图默认与鼠标交互时的材质
    let faceMaterial = new MeshStandardMaterial({
      color: 0xffffff,
      map: mapTexture,
      transparent: true,
      opacity: 1,
      metalness:0.2,
      roughness:0.3
    })

    // 地图鼠标hover状态时材质
    this.defaultMaterial = faceMaterial
    this.defaultLightMaterial = this.defaultMaterial.clone()
    this.defaultLightMaterial.color = new Color("rgba(30, 233, 255, 0.41)")
    this.defaultLightMaterial.map = null
    this.defaultLightMaterial.opacity = 1
    let mapTop = new BaseMap(this, {
      geoProjectionCenter: this.geoProjectionCenter,
      geoProjectionScale: this.geoProjectionScale,
      position: new Vector3(0, 0, this.depth + 0.22),
      data: mapJsonData,
      material: faceMaterial,
      renderOrder: 2,
    })
    mapTop.mapGroup.children.map((group) => {
      group.children.map((mesh) => {
        if (mesh.type === "Mesh") {
          this.eventElement.push(mesh)
        }
      })
    })
    this.mapLineMaterial = new LineMaterial({
      color: 0xE58D3D,
      linewidth: 1.5,
      fog: false,
    })
    // 地图内部区域边界线
    let mapLine = new Line(this, {
      geoProjectionCenter: this.geoProjectionCenter,
      geoProjectionScale: this.geoProjectionScale,
      data: mapJsonData,
      material: this.mapLineMaterial,
      renderOrder: 3,
      type:"Line2"
    })
    // 地图鼠标hover状态时材质
    this.mapLineLightMaterial = this.mapLineMaterial.clone()
    this.mapLineLightMaterial.color = new Color("#4EFFFF")
    this.mapLineLightMaterial.linewidth = 3

    mapLine.lineGroup.position.z += this.depth + 0.23


    let mapBottomeLineMaterial = new LineMaterial({
      color: 0x31c0da,
      linewidth: 1,
      fog: false,
    })
    // 地图内部区域边界线
    let mapBottomeLine = new Line(this, {
      geoProjectionCenter: this.geoProjectionCenter,
      geoProjectionScale: this.geoProjectionScale,
      data: mapJsonData,
      material: mapBottomeLineMaterial,
      renderOrder: 2,
      type:"Line2"
    })
    mapBottomeLine.lineGroup.position.z += this.depth - 0.46;
    mapBottomeLine.lineGroup.scale.set(1.02, 1.02, 1)
    mapBottomeLine.lineGroup.traverse(line=>{
      line.lineName = "mapBottomeLine"
    })
    return {
      map,
      mapTop,
      mapLine,
      mapBottomeLine,
    }
  }
  createProvinceMaterial() {
    let mapTexture = this.assets.instance.getResource("geoMapTexture")
    mapTexture.wrapS = mapTexture.wrapT = RepeatWrapping
    mapTexture.repeat.set(0.25,0.25)
    mapTexture.colorSpace = SRGBColorSpace
    // lamber材质
    let topMaterial = new MeshLambertMaterial({
      // color: 0x1b5069,
      map:mapTexture,
      transparent: true,
      fog: false,
      side: DoubleSide,
    })
    // beijinglurLine
    let sideMapTexture = this.assets.instance.getResource("beijinglurLine")
    sideMapTexture.repeat.set(0, 0)
    sideMapTexture.rotation = 3.14
    sideMapTexture.wrapS = sideMapTexture.wrapT = RepeatWrapping
    // sideMapTexture.matrixAutoUpdate = false
    // sideMapTexture.needsUpdate = true
    // initTextureGui(sideMapTexture)
    let sideMaterial = new MeshStandardMaterial({
      color: 0xffffff,
      map: sideMapTexture,
      fog: false,
      transparent: true,
    })
    sideMaterial.onBeforeCompile = (shader) => {
      shader.uniforms = {
        ...shader.uniforms,
        uColor1: { value: new Color(0x2a6e92) },
        uColor2: { value: new Color(0x2a6e92) },
      }
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        /* glsl */ `
      #ifdef OPAQUE
      diffuseColor.a = 1.0;
      #endif
            #ifdef USE_TRANSMISSION
      diffuseColor.a *= transmissionAlpha + 0.1;
      #endif
      outgoingLight = outgoingLight*2.5;
      gl_FragColor = vec4( outgoingLight, diffuseColor.a  );
      `
      )
    }
    return [topMaterial, sideMaterial]
  }
  
  // 移除所有子节点
  removeAllChildren(parent) {
    let childs = []
    parent.traverse(( object ) => {
      object.isMesh && childs.push( object );
    } );
    childs.forEach(child => {
      child.geometry?.dispose();
      if (child.material) {
        if (child.material.isMaterial) {
            this.cleanMaterial(child.material);
        } else {
            // 多材质合集
            for (const m of child.material) this.cleanMaterial(m);
        }
      }
      child.texture?.dispose();
      this.scene.remove( child );
    });
    while (parent.children.length > 0) {
      const child = parent.children[0];
      parent.remove(child);
      child.geometry?.dispose();
    }
  }
  // 清理内存
  cleanMaterial(material) {
      material.dispose();
      material.map?.dispose();
      material.lightMap?.dispose();
      material.bumpMap?.dispose();
      material.normalMap?.dispose();
      material.specularMap?.dispose();
      material.envMap?.dispose();
  }
  toggleMap() {
    let mapGroup = new Group()
    let focusMapGroup = new Group()
    this.focusMapGroup = focusMapGroup
    // 地图
    let { map, mapTop, mapLine, mapBottomeLine } = this.createProvince()
    map.setParent(focusMapGroup)
    mapTop.setParent(focusMapGroup)
    mapLine.setParent(focusMapGroup)
    mapBottomeLine.setParent(focusMapGroup)
    focusMapGroup.position.set(0, 0, -0.01)
    focusMapGroup.scale.set(0, 0, 0)
    mapGroup.add(focusMapGroup)
    mapGroup.rotation.x = -Math.PI / 2
    mapGroup.position.set(0, 0.2, 0)
    // this.scene.add(mapGroup)
    this.mapGroupContainer.add(mapGroup)
    this.createEvent()
    if(this.mapName == "world"){
      // 创建飞线
      this.createFlyLine()
      // 创建飞线焦点
      this.createFocus()
    }
    // 创建信息点
    this.createInfoPoint()
    // 创建地图轮廓描边
    this.createStorke()
    this.initToggleAnimate()
    // let num = 0;
    // this.scene.traverse(child=>{
    //   child.isMesh ? num++ : null
    // })
    // console.log(`---当前的场景有多少物体数量：${num}---`,this.scene)
  }
  removeRelatedEvent(){
    // 移出精灵图事件
    this.spriteEventHandler.forEach((item, sprite)=>{
      sprite.forEach(item=>{
        sprite.removeEventListener(item.name, item.fn)
      })
    })
    
    // 移出网格事件
    this.eventHandler.forEach((items, mesh)=>{
      items.forEach(item=>{
        mesh.removeEventListener(item.name, item.fn)
      })
    })
    this.eventElement.forEach(mesh => {
      this.interactionManager.remove(mesh)
    });
    this.interactionManager.dispose();
    this.interactionManager = new InteractionManager(this.renderer.instance, this.camera.instance, this.canvas)
    this.eventElement = [];
  }
  removeAllbar(){
    this.removeAllChildren(this.mapGroupContainer);
    this.removeAllChildren(this.flyLineFocusGroup)
    this.removeAllChildren(this.labelGroup)
    this.removeAllChildren(this.InfoPointGroup)
    this.removeAllChildren(this.mapGroupContainer)
    this.infoLabelElement = []
    this.allGuangquan = []
  }
  // 下钻
  downDrill(itemMapInfo){
    if(this.mapName === itemMapInfo.userData?.name.toLocaleLowerCase()) return;
    let names = ['China','北京市','朝阳区'];
    if( names.includes(itemMapInfo.userData.name)){
      this.removeAllbar()
      this.removeRelatedEvent()
      this.scene.background = this.assets.instance.getResource("geoMapBgTexture")
      if(itemMapInfo.userData.name == 'China'){
        // 点击中国
        this.mapName = "china"
      }else if(itemMapInfo.userData.name == '北京市'){
        // 点击广东
        this.scene.background = this.assets.instance.getResource("beijinglurLine")
        this.mapName = "beijing"
      }else if(itemMapInfo.userData.name == '朝阳区'){
        this.options.goCity&&this.options.goCity(itemMapInfo);
        return;
      }

      this.geoProjectionCenter = mapInfo[this.mapName].centerCoordinates
      this.geoProjectionScale = mapInfo[this.mapName].scale

      this.toggleMap()
    }
  }
  backWorld(){
    this.mapName = "world"
    this.geoProjectionCenter = mapInfo[this.mapName].centerCoordinates
    this.geoProjectionScale = mapInfo[this.mapName].scale
    this.toggleMap()
  }
  createEvent() {
    let objectsHover = []
    // 鼠标移出
    const reset = (mesh) => {
      mesh.traverse((obj) => {
        if (obj.isMesh) {
          obj.material = this.defaultMaterial
          let lines = this.scene.getObjectsByProperty("lineName", obj.userData?.name);
          if(lines){
            lines.forEach(line=>{
              line.material = this.mapLineMaterial;
            })
          }
        }
      })
    }
    // 鼠标移入状态
    const move = (mesh) => {
      mesh.traverse((obj) => {
        if (obj.isMesh) {
          obj.material = this.defaultLightMaterial;
          let lines = this.scene.getObjectsByProperty("lineName", obj.userData?.name);
          if(lines){
            lines.forEach(line=>{
              line.material = this.mapLineLightMaterial;
            })
          }
        }
      })
    }
    this.eventHandler = new Map();
    this.eventElement.map((mesh) => {
      this.interactionManager.add(mesh);
      let mouseArrs = [];
      
      let mouseDownFn = (ev) => {
        this.camera.instance.updateProjectionMatrix()
        this.downDrill(ev.target)
      }
      mouseArrs.push({eventName:"mousedown", fn: mouseDownFn})
      mesh.addEventListener("mousedown", mouseDownFn);

      let mouseOverFn = (event) => {
        if (!objectsHover.includes(event.target.parent)) {
          objectsHover.push(event.target.parent)
        }
        document.body.style.cursor = "pointer"
        move(event.target.parent)
      }
      mouseArrs.push({eventName:"mouseover", fn: mouseOverFn})
      mesh.addEventListener("mouseover", mouseOverFn)

      let mouseOutFn = (event) => {
        objectsHover = objectsHover.filter((n) => n.userData.name !== event.target.parent.userData.name)
        if (objectsHover.length > 0) {
          const mesh = objectsHover[objectsHover.length - 1]
        }
        reset(event.target.parent)
        document.body.style.cursor = "default"
      }
      mouseArrs.push({eventName:"mouseout", fn: mouseOutFn})
      mesh.addEventListener("mouseout", mouseOutFn)
      
      this.eventHandler.set(mesh, mouseArrs)
    })
  }
  // 辉光
  createHUIGUANG(h, color) {
    let geometry = new PlaneGeometry(0.35, h)
    geometry.translate(0, h / 2, 0)
    const texture = this.assets.instance.getResource("huiguang")
    texture.colorSpace = SRGBColorSpace
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    let material = new MeshBasicMaterial({
      color: color,
      map: texture,
      transparent: true,
      opacity: 0.4,
      depthWrite: false,
      side: DoubleSide,
      blending: AdditiveBlending,
    })
    let mesh = new Mesh(geometry, material)
    mesh.renderOrder = 10
    mesh.rotateX(Math.PI / 2)
    let mesh2 = mesh.clone()
    let mesh3 = mesh.clone()
    mesh2.rotateY((Math.PI / 180) * 60)
    mesh3.rotateY((Math.PI / 180) * 120)
    return [mesh, mesh2, mesh3]
  }
  createQuan(position, index) {
    const guangquan1 = this.assets.instance.getResource("guangquan1")
    const guangquan2 = this.assets.instance.getResource("guangquan2")
    let geometry = new PlaneGeometry(0.5, 0.5)
    let material1 = new MeshBasicMaterial({
      color: 0xffffff,
      map: guangquan1,
      alphaMap: guangquan1,
      opacity: 1,
      transparent: true,
      depthTest: false,
      fog: false,
      blending: AdditiveBlending,
    })
    let material2 = new MeshBasicMaterial({
      color: 0xffffff,
      map: guangquan2,
      alphaMap: guangquan2,
      opacity: 1,
      transparent: true,
      depthTest: false,
      fog: false,
      blending: AdditiveBlending,
    })
    let mesh1 = new Mesh(geometry, material1)
    let mesh2 = new Mesh(geometry, material2)
    mesh1.renderOrder = 6
    mesh2.renderOrder = 6
    mesh1.rotateX(-Math.PI / 2)
    mesh2.rotateX(-Math.PI / 2)
    mesh1.position.copy(position)
    mesh2.position.copy(position)
    mesh2.position.y -= 0.001
    mesh1.scale.set(0, 0, 0)
    mesh2.scale.set(0, 0, 0)
    this.quanGroup = new Group()
    this.quanGroup.add(mesh1, mesh2)
    this.mapGroupContainer.add(this.quanGroup)
    this.time.on("tick", () => {
      mesh1.rotation.z += 0.05
    })
    return this.quanGroup
  }
  // 创建扩散
  createDiffuse() {
    let geometry = new PlaneGeometry(200, 200)
    let material = new MeshBasicMaterial({
      color: 0x000000,
      depthWrite: false,
      // depthTest: false,
      transparent: true,
      blending: CustomBlending,
    })
    // 使用CustomBlending  实现混合叠加
    material.blendEquation = AddEquation
    material.blendSrc = DstColorFactor
    material.blendDst = OneFactor
    let diffuse = new DiffuseShader({
      material,
      time: this.time,
      size: 60,
      diffuseSpeed: 8.0,
      diffuseColor: 0x71918e,
      diffuseWidth: 2.0,
      callback: (pointShader) => {
        setTimeout(() => {
          gsap.to(pointShader.uniforms.uTime, {
            value: 4,
            repeat: -1,
            duration: 6,
            ease: "power1.easeIn",
          })
        }, 3)
      },
    })
    let mesh = new Mesh(geometry, material)
    mesh.renderOrder = 3
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(0, 0.21, 0)
    this.scene.add(mesh)
  }
  createGrid() {
    new Grid(this, {
      gridSize: 50,
      gridDivision: 20,
      gridColor: 0x1b4b70,
      shapeSize: 0.5,
      shapeColor: 0x2a5f8a,
      pointSize: 0.1,
      pointColor: 0x154d7d,
    })
  }
  // 地图背景
  createChinaBlurLine() {
    let geometry = new PlaneGeometry(200, 200)
    const texture = this.assets.instance.getResource("worldBlurLine")
    texture.colorSpace = SRGBColorSpace
    texture.wrapS = RepeatWrapping
    texture.wrapT = RepeatWrapping
    texture.generateMipmaps = false
    texture.minFilter = NearestFilter
    texture.repeat.set(4, 4)
    let material = new MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 1,
    })
    
    texture.matrixAutoUpdate = false
    texture.needsUpdate = true
    initTextureGui(texture)

    let mesh = new Mesh(geometry, material)
    mesh.rotateX(-Math.PI / 3)
    mesh.position.set(-10.3, -1, -10.7)
    this.scene.add(mesh)
  }
  createRotateBorder() {
    let max = 12
    let rotationBorder1 = this.assets.instance.getResource("rotationBorder1")
    let rotationBorder2 = this.assets.instance.getResource("rotationBorder2")
    let plane01 = new Plane(this, {
      width: max * 1.178,
      needRotate: true,
      rotateSpeed: 0.001,
      material: new MeshBasicMaterial({
        map: rotationBorder1,
        color: 0x48afff,
        transparent: true,
        opacity: 0.2,
        side: DoubleSide,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
      position: new Vector3(0, 0.28, 0),
    })
    plane01.instance.rotation.x = -Math.PI / 2
    plane01.instance.renderOrder = 6
    plane01.instance.scale.set(0, 0, 0)
    // plane01.setParent(this.scene)
    let plane02 = new Plane(this, {
      width: max * 1.116,
      needRotate: true,
      rotateSpeed: -0.004,
      material: new MeshBasicMaterial({
        map: rotationBorder2,
        color: 0x48afff,
        transparent: true,
        opacity: 0.4,
        side: DoubleSide,
        depthWrite: false,
        blending: AdditiveBlending,
      }),
      position: new Vector3(0, 0.3, 0),
    })
    plane02.instance.rotation.x = -Math.PI / 2
    plane02.instance.renderOrder = 6
    plane02.instance.scale.set(0, 0, 0)
    // plane02.setParent(this.scene)
    this.rotateBorder1 = plane01.instance
    this.rotateBorder2 = plane02.instance
  }
  // 飞线
  createFlyLine() {
    this.flyLineGroup = new Group()
    this.flyLineGroup.visible = false
    // this.scene.add(this.flyLineGroup)
    this.mapGroupContainer.add(this.flyLineGroup)
    const texture = this.assets.instance.getResource("mapFlyline")
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(0.5, 2)
    const tubeRadius = 0.1
    const tubeSegments = 32
    const tubeRadialSegments = 2
    const closed = false
    const material = new MeshBasicMaterial({
      map: texture,
      // alphaMap: texture,
      color: 0x2a6f72,
      transparent: true,
      fog: false,
      opacity: 1,
      depthTest: false,
      blending: AdditiveBlending,
    })
    this.time.on("tick", () => {
      texture.offset.x -= 0.006
    })
    
    let data = (this.mapData[this.mapName] || provincesData)
    data
      .map((city) => {
        // 飞线起点
        let [centerX, centerY] = this.geoProjection(city.fromCenter)
        let centerPoint = new Vector3(centerX, -centerY, 0)

        // 飞线终点
        let [x, y] = this.geoProjection(city.center)
        let point = new Vector3(x, -y, 0)
        const center = new Vector3()
        // 计算控制点
        center.addVectors(centerPoint, point).multiplyScalar(0.5)
        center.setZ(3)
        // 生成三维二次贝塞尔曲线
        const curve = new QuadraticBezierCurve3(centerPoint, center, point);
        const tubeGeometry = new TubeGeometry(curve, tubeSegments, tubeRadius, tubeRadialSegments, closed)
        const mesh = new Mesh(tubeGeometry, material)
        mesh.rotation.x = -Math.PI / 2
        mesh.position.set(0, this.depth + 0.44, 0)
        mesh.renderOrder = 21

        // 虚线
        const points = curve.getPoints(50);
        let linePoints = points.map(point=>([point.x, point.y, point.z])).flat()
        const lineGeometry = new LineGeometry();
				lineGeometry.setPositions( linePoints );
				let lineMaterial = new LineMaterial( {
					color: 0x999999,
					// color: 0xE58D3D,
					linewidth: 1.5, 
					dashed: true,
          dashScale: 10,
          dashSize: 1,
          gapSize: 1,
        });

				let line = new Line2( lineGeometry, lineMaterial );
				line.computeLineDistances();
        line.rotation.x = -Math.PI / 2
        line.position.set(0, this.depth + 0.44, 0)
        line.renderOrder = 22

        this.flyLineGroup.add(line)
        this.flyLineGroup.add(mesh)
      })
  }
  // 创建焦点
  createFocus() {
    let focusObj = new Focus(this, { color1: 0xbdfdfd, color2: 0xbdfdfd })
    let [x, y] = this.geoProjection(this.flyLineCenter)
    focusObj.position.set(x, -y, this.depth + 0.44)
    focusObj.scale.set(1, 1, 1)
    this.flyLineFocusGroup.add(focusObj)
  }
  // 创建粒子
  createParticles() {
    this.particles = new Particles(this, {
      num: 10,
      range: 30,
      dir: "up",
      speed: 0.05,
      material: new PointsMaterial({
        map: Particles.createTexture(),
        size: 1,
        color: 0x00eeee,
        transparent: true,
        opacity: 1,
        depthTest: false,
        depthWrite: false,
        vertexColors: true,
        blending: AdditiveBlending,
        sizeAttenuation: true,
      }),
    })
    this.particleGroup = new Group()
    this.scene.add(this.particleGroup)
    this.particleGroup.rotation.x = -Math.PI / 2
    this.particles.setParent(this.particleGroup)
    this.particles.enable = true
    this.particleGroup.visible = true
  }
  
  // 千分位加逗号
  formatNumber(num) {
    return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  // 创建地图标记，以及提示信息
  createInfoPoint() {
    let self = this
    this.InfoPointGroup = new Group()
    this.mapGroupContainer.add(this.InfoPointGroup)
    this.InfoPointGroup.visible = false
    this.InfoPointGroup.rotation.x = -Math.PI / 2
    this.infoPointIndex = 0
    this.infoLabelElement = []
    this.allGuangquan = [] // 存储所有标记点底座旋转光圈
    let label3d = this.label3d
    const texture = this.assets.instance.getResource("point")
    const activeTexture = this.assets.instance.getResource("pointActive")
    let colors = [0xfffef4, 0x77fbf5]
    let infodata = (this.mapData[this.mapName] || provincesData)
    this.spriteEventHandler = new Map();

    infodata.map((data, index) => {
      let mouseArrs = []

      const material = new SpriteMaterial({
        map: texture,
        color: colors[index % colors.length],
        fog: false,
        transparent: true,
        depthTest: false,
      })
      const sprite = new Sprite(material)
      sprite.renderOrder = 23
      // let scale = 0.7 + (data.value / max) * 0.4
      // sprite.scale.set(scale, scale, scale)
      sprite.scale.set(0.8, 0.8, 0.8)
      let [x, y] = this.geoProjection(data.center)

      let guangQuan = this.createQuan(new Vector3(x, this.depth + 0.44, y), index)
      // 柱子底座旋转光圈
      this.allGuangquan.push(guangQuan)

      let position = [x, -y, this.depth + 0.7]
      sprite.position.set(...position)
      sprite.userData.position = [...position]
      sprite.userData = {
        position: [x, -y, this.depth + 0.7],
        name: data.name,
        value: data.value,
        fromName: data.fromName,
        toName: data.toName,
        transmissionNum: this.formatNumber(data.transmissionNum),
        sensitiveNum: this.formatNumber(data.transmissionNum),
        index: index,
      }
      this.InfoPointGroup.add(sprite)
      let label = infoLabel(data, label3d, this.InfoPointGroup)
      this.infoLabelElement.push(label)
      this.interactionManager.add(sprite)

      let mouseDownFn = (ev) => {
        if (this.clicked || !this.InfoPointGroup.visible) return false
        this.clicked = true
        this.infoPointIndex = ev.target.userData.index
        this.infoLabelElement.map((label) => {
          label.visible = false
        })
        label.visible = true
        this.createInfoPointLabelLoop()
      }
      mouseArrs.push({eventName:"mousedown", fn: mouseDownFn})
      sprite.addEventListener("mousedown", mouseDownFn)

      let mouseupFn = (ev) => {
        this.clicked = false
      }
      mouseArrs.push({eventName:"mouseup", fn: mouseupFn})
      sprite.addEventListener("mouseup", mouseupFn)

      let mouseoverFn = (event) => {
        document.body.style.cursor = "pointer"
      }
      mouseArrs.push({eventName:"mouseover", fn: mouseoverFn})
      sprite.addEventListener("mouseover", mouseoverFn)

      let mouseoutFn = (event) => {
        document.body.style.cursor = "default"
      }
      mouseArrs.push({eventName:"mouseout", fn: mouseoutFn})
      sprite.addEventListener("mouseout", mouseoutFn)
    })
    function infoLabel(data, label3d, labelGroup) {
      let label = label3d.create("", "info-point", true)
      const [x, y] = self.geoProjection(data.center)
      if(self.mapName == "world"){
        label.init(
          ` <div class="info-point-wrap">
              <div class="info-point-label">
                <div class="province">${data.fromName}<span class="arrow">>></span></div>
                <div class="other" >${data.toName}</div>
              </div>
            </div>
        `,
          new Vector3(x, -y, self.depth + 1.9)
        )
      }else{
        label.init(
          ` <div class="info-point-wrap">
              <div class="info-point-label" style="justify-content: flex-start;">
                <div class="province"><span class="icon"></span>${data.name}</div>
              </div>
              <div class="info-point-label">
                <div class="province">${data.fromName}<span class="arrow">>></span></div>
                <div class="other" >${data.toName}</div>
              </div>
              <div class="info-point-content">
                <div class="content-item">
                  <div class="label">传输数据量</div>
                  <div class="value">${self.formatNumber(data.transmissionNum)}</div>
                </div>
                <div class="content-item">
                  <div class="label">敏感数据量</div>
                  <div class="value">${self.formatNumber(data.transmissionNum)}</div>
                </div>
              </div>
            </div>
        `,
          new Vector3(x, -y, self.depth + 1.9)
        )
      }
      label3d.setLabelStyle(label, 0.015, "x")
      label.setParent(labelGroup)
      label.visible = false
      return label
    }
  }
  createInfoPointLabelLoop() {
    clearInterval(this.infoPointLabelTime)
    this.infoPointLabelTime = setInterval(() => {
      this.infoPointIndex++
      if (this.infoPointIndex >= this.infoLabelElement.length) {
        this.infoPointIndex = 0
      }
      this.infoLabelElement.map((label, i) => {
        if (this.infoPointIndex === i) {
          label.visible = true
        } else {
          label.visible = false
        }
      })
    }, 3000)
  }
  // 地图流动轮廓
  createStorke() {
    let parentGeoName = mapInfo[this.mapName]?.parentGeoName || this.mapName;
    let mapJsonData = this.assets.instance.getResource(parentGeoName)
    // let mapJsonData = this.assets.instance.getResource(this.mapName)
    const texture = this.assets.instance.getResource("pathLine3")
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(2, 1)
    let lineMaterial = new LineMaterial( {
      // color: 0xFFCC7E,
      color: 0xE58D3D,
      linewidth: 6, 
      dashed: true,
      dashScale: 10,
      dashSize: 1,
      gapSize: 1,
    });
    lineMaterial.colorSpace = SRGBColorSpace
    let pathLine = new Line(this, {
      geoProjectionCenter: this.geoProjectionCenter,
      geoProjectionScale: this.geoProjectionScale,
      position: new Vector3(0, 0, this.depth + 0.24),
      data: mapJsonData,
      // material: new MeshBasicMaterial({
      //   color: 0xE58D3D,
      //   map: texture,
      //   // alphaMap: texture,
      //   transparent: true,
      //   opacity: 1,
      //   // blending: AdditiveBlending,
      // }),
      material: lineMaterial,
      // 当前的
      currentGeoName: mapInfo[this.mapName].geoName,
      type: "outLine2",
      renderOrder: 24,
      tubeRadius: 0.03,
    })
    // 设置父级
    this.focusMapGroup.add(pathLine.lineGroup)
    this.time.on("tick", () => {
      texture.offset.x += 0.005
    })
  }
  geoProjection(args) {
    return geoMercator().center(this.geoProjectionCenter).scale(this.geoProjectionScale).translate([0, 0])(args)
  }
  update() {
    super.update()
    this.interactionManager && this.interactionManager.update()
  }
  destroy() {
    super.destroy()
    this.label3d && this.label3d.destroy()
  }
}
