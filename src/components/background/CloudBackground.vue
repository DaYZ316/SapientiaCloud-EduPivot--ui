<template>
  <div ref="container" class="cloud-background"></div>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'
import * as THREE from 'three'

const container = ref<HTMLDivElement | null>(null)
let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let clock: THREE.Clock | null = null
let animationFrameId: number | null = null

// 时间值对象
const deltaTime = {
  value: 0
}

onMounted(() => {
  // 监听窗口大小变化
  window.addEventListener('resize', onWindowResize)
})

onBeforeUnmount(() => {
  // 清理资源
  cleanupResources()

  // 移除事件监听器
  window.removeEventListener('resize', onWindowResize)
})

// 清理资源函数
const cleanupResources = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }

  if (renderer) {
    renderer.dispose()
    renderer = null
  }

  scene = null
  camera = null
  clock = null
}

// 初始化Three.js环境
const initThreeJS = () => {
  if (!container.value) return

  // 初始化场景
  scene = new THREE.Scene()

  // 初始化相机
  const {innerWidth, innerHeight} = window
  const aspect = innerWidth / innerHeight
  camera = new THREE.PerspectiveCamera(60, aspect, 0.01, 10000)
  camera.position.set(0, 0, 1)

  // 初始化渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 限制像素比以提高性能
  renderer.setSize(innerWidth, innerHeight)
  container.value.appendChild(renderer.domElement)

  // 创建时钟对象
  clock = new THREE.Clock()

  // 创建云雾效果
  createClouds()

  // 开始动画循环
  animate()
}

// 创建云雾效果
const createClouds = () => {
  if (!scene) return

  // 云雾着色器代码
  const fragmentSrc = [
    "precision mediump float;",

    "uniform vec2 iResolution;",
    "uniform float iGlobalTime;",

    "float hash( float n ) {",
    "return fract(sin(n)*43758.5453);",
    "}",

    "float noise( in vec3 x ) {",
    "vec3 p = floor(x);",
    "vec3 f = fract(x);",
    "f = f*f*(3.0-2.0*f);",
    "float n = p.x + p.y*57.0 + 113.0*p.z;",
    "return mix(mix(mix( hash(n+  0.0), hash(n+  1.0),f.x),",
    "mix( hash(n+ 57.0), hash(n+ 58.0),f.x),f.y),",
    "mix(mix( hash(n+113.0), hash(n+114.0),f.x),",
    "mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);",
    "}",

    "vec4 map( in vec3 p ) {",
    "float d = 0.2 - p.y;",
    "vec3 q = p - vec3(1.0,0.1,0.0)*iGlobalTime;",
    "float f;",
    "f  = 0.5000*noise( q ); q = q*2.02;",
    "f += 0.2500*noise( q ); q = q*2.03;",
    "f += 0.1250*noise( q ); q = q*2.01;",
    "f += 0.0625*noise( q );",
    "d += 3.0 * f;",
    "d = clamp( d, 0.0, 1.0 );",
    "vec4 res = vec4( d );",
    // 调整云雾颜色，使其更加适合浅色主题
    "res.xyz = mix( 1.15*vec3(1.0,0.95,0.8), vec3(0.7,0.7,0.7), res.x );",
    "return res;",
    "}",

    "vec3 sundir = vec3(-1.0,0.0,0.0);",

    "vec4 raymarch( in vec3 ro, in vec3 rd ) {",
    "vec4 sum = vec4(0, 0, 0, 0);",
    "float t = 0.0;",
    "for(int i=0; i<64; i++) {",
    "if( sum.a > 0.99 ) continue;",

    "vec3 pos = ro + t*rd;",
    "vec4 col = map( pos );",

    "#if 1",
    "float dif =  clamp((col.w - map(pos+0.3*sundir).w)/0.6, 0.0, 1.0 );",
    // 调整光照颜色
    "vec3 lin = vec3(0.65,0.68,0.7)*1.35 + 0.45*vec3(0.7, 0.5, 0.3)*dif;",
    "col.xyz *= lin;",
    "#endif",

    "col.a *= 0.35;",
    "col.rgb *= col.a;",
    "sum = sum + col*(1.0 - sum.a);	",

    "#if 0",
    "t += 0.1;",
    "#else",
    "t += max(0.1,0.025*t);",
    "#endif",
    "}",

    "sum.xyz /= (0.001+sum.w);",
    "return clamp( sum, 0.0, 1.0 );",
    "}",

    "void main(void) {",
    "vec2 q = gl_FragCoord.xy / iResolution.xy;",
    "vec2 p = -1.0 + 2.0*q;",
    "p.x *= iResolution.x/ iResolution.y;",

    // 固定相机位置，移除鼠标交互，水平旋转180度
    "vec3 ro = 4.0*normalize(vec3(cos(2.75 + 3.14), 0.7, sin(2.75 + 3.14)));",
    "vec3 ta = vec3(0.0, 1.0, 0.0);",
    "vec3 ww = normalize( ta - ro);",
    "vec3 uu = normalize(cross( vec3(0.0,1.0,0.0), ww ));",
    "vec3 vv = normalize(cross(ww,uu));",
    "vec3 rd = normalize( p.x*uu + p.y*vv + 1.5*ww );",

    "vec4 res = raymarch( ro, rd );",

    "float sun = clamp( dot(sundir,rd), 0.0, 1.0 );",
    // 调整天空颜色
    "vec3 col = vec3(0.6,0.71,0.75) - rd.y*0.2*vec3(1.0,0.5,1.0) + 0.15*0.5;",
    "col += 0.2*vec3(1.0,.6,0.1)*pow( sun, 8.0 );",
    "col *= 0.95;",
    "col = mix( col, res.xyz, res.w );",
    "col += 0.1*vec3(1.0,0.4,0.2)*pow( sun, 3.0 );",

    "gl_FragColor = vec4( col, 1.0 );",
    "}"
  ].join("\n")

  // 顶点着色器
  const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
  }`

  // 创建球体几何体
  const geometry = new THREE.SphereGeometry(5000, 50)

  // 创建着色器材质
  const material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.BackSide,
    uniforms: {
      iGlobalTime: deltaTime,
      iResolution: {
        value: {
          x: window.innerWidth,
          y: window.innerHeight
        }
      }
    },
    vertexShader,
    fragmentShader: fragmentSrc
  })

  // 创建网格并添加到场景
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
}

// 窗口大小变化时调整
const onWindowResize = () => {
  if (!camera || !renderer) return

  const {innerWidth, innerHeight} = window

  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  // 更新着色器分辨率
  if (scene && scene.children.length > 0) {
    const mesh = scene.children[0] as THREE.Mesh
    if (mesh.material instanceof THREE.ShaderMaterial) {
      mesh.material.uniforms.iResolution.value = {
        x: innerWidth,
        y: innerHeight
      }
    }
  }
}

// 动画循环
const animate = () => {
  if (!renderer || !scene || !camera || !clock) return

  // 更新时间
  deltaTime.value = clock.getElapsedTime()

  // 渲染场景
  renderer.render(scene, camera)

  // 请求下一帧
  animationFrameId = requestAnimationFrame(animate)
}
</script>

<style lang="scss" scoped>
.cloud-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style> 