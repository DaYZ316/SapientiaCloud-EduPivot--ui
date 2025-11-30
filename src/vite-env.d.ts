/// <reference types="vite/client" />

// 声明模块
declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>
    export default component
}

// 声明缺少类型定义的模块
declare module '@vicons/ionicons5';

// 扩展 Window 接口以支持 Three.js 相关属性
import type { PerspectiveCamera, Euler } from 'three'
import type { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import type { InstancedMesh } from 'three'

declare global {
    interface Window {
        cameraPositions?: {
            front: {
                position: { x: number; y: number; z: number }
                initialRotation: Euler
            }
            rightRear: {
                position: { x: number; y: number; z: number }
                initialRotation: Euler
            }
            leftRear: {
                position: { x: number; y: number; z: number }
                initialRotation: Euler
            }
        }
        currentCameraPosition?: 'front' | 'rightRear' | 'leftRear'
        camera?: PerspectiveCamera
        controls?: PointerLockControls
        switchCameraPosition?: () => void
        instancedObjects?: InstancedMesh[]
        deskHoverHandlers?: Array<{
            handler: (event: MouseEvent) => void
            leaveHandler: () => void
            clickHandler: (event: MouseEvent) => void
            canvas: HTMLCanvasElement
        }>
    }
}
