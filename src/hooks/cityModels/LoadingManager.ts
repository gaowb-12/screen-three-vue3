import { LoadingManager } from 'three'

function createElement (tagName = 'div'): HTMLElement {
    return document.createElement(tagName)
}

let UIDomContainer: HTMLElement;
let loadUI: HTMLElement, loadText: HTMLElement;
function initDom(){
  loadUI = createElement('div')
  loadText = createElement('div')
  loadUI.appendChild(loadText)
  loadUI.className = 'load-ui'
  loadUI.id = 'load-ui'
  UIDomContainer = document.querySelector("#city-loading") as HTMLElement;
}

const AssetsLoadingManager = new LoadingManager()

AssetsLoadingManager.onStart = () => {
  initDom();
  UIDomContainer.appendChild(loadUI)
  loadText.innerHTML = `<div>正在加载... 0%</div>`
}
AssetsLoadingManager.onProgress = (url, loaded, total) => {
  console.log("loading progress", (loaded / total * 100).toFixed(2))
  loadUI.innerHTML = `<div>正在加载... ${(loaded / total * 100).toFixed(2)}%</div>`
}
AssetsLoadingManager.onLoad = () => {
  console.log('assets loaded.')
  loadText.innerHTML = '<div>正在加载... 100%</div>'
  loadUI.style.opacity = '0'
  setTimeout(() => UIDomContainer.removeChild(loadUI), 5000)
}
AssetsLoadingManager.onError = (url) => {
  console.log('load assets error.')
  loadText.innerHTML = `<div>加载资源失败: ${url}</div>`
}

export { AssetsLoadingManager }
