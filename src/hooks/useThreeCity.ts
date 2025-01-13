import { loadCharactor, helpers, lights, Engine } from "./cityModels";

export const useThreeCity = (canvas: HTMLCanvasElement, ops?:any) => {
  const options = {
    camera: {
      fov: 45,
      near: 0.1,
      far: 8000,
      position: {
          x: -971,
          y: 1852,
          z: 439,
      },
    },
    width: canvas.width, 
    height: canvas.height,
    ...ops
  }
  let S = new Engine(canvas, options);
  S.addObject(
    // 灯光
  ...lights,
  // 辅助器
  // ...helpers,
  );
  // 加载外部模型
  loadCharactor(S);
  return S
};
