<template>
  <div class="module3-decorations">
    <div class="top-right-decoration"></div>
    <div class="bottom-left-decoration"></div>
    <div class="module3-long-decoration"></div>
  </div>
</template>

<script lang="ts" setup>
// 模块三装饰线条组件
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.module3-decorations {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;

  // 右上角长条装饰
  .top-right-decoration {
    position: absolute;
    top: 15%;
    right: 20%;
    width: 45px;
    height: 2px;
    background: linear-gradient(to left,
        transparent 0%,
        var(--success-color) 30%,
        var(--info-color) 70%,
        transparent 100%
    );
    opacity: 0.7;
    transform: rotate(-75deg);
  }

  // 左下角长条装饰
  .bottom-left-decoration {
    position: absolute;
    bottom: 20%;
    left: 10%;
    width: 150px;
    height: 2px;
    background: linear-gradient(to right,
        transparent 0%,
        var(--warning-color) 40%,
        var(--primary-color) 80%,
        transparent 100%
    );
    opacity: 0.6;
    transform: rotate(40deg);
  }

  // 模块三较长装饰 - 顶部中央长条
  .module3-long-decoration {
    position: absolute;
    top: 45%;
    left: -89%;
    transform: translateX(-50%) rotate(15deg);
    width: 500px;
    height: 2px;
    background: linear-gradient(to right,
        transparent 0%,
        var(--success-color) 20%,
        var(--info-color) 45%,
        var(--primary-color) 70%,
        var(--warning-color) 90%,
        transparent 100%
    );
    transform: rotate(103deg);
  }
}
</style>
