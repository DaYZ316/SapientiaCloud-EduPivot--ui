<template>
  <div class="decorative-lines">
    <div class="top-left-decoration"></div>
    <div class="module1-right-decoration"></div>
    <div class="module1-long-decoration"></div>
  </div>
</template>

<script lang="ts" setup>
// 信息模块装饰线条组件
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.decorative-lines {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;

  &::before {
    content: '';
    position: absolute;
    top: 30%;
    right: 40%;
    width: 2px;
    height: 60%;
    background: linear-gradient(to bottom,
        transparent 0%,
        var(--primary-color) 20%,
        var(--warning-color) 50%,
        var(--error-color) 80%,
        transparent 100%
    );
    opacity: 0.3;
    transform: rotate(145deg);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 15%;
    left: 5%;
    width: 80px;
    height: 2px;
    background: linear-gradient(to right,
        transparent 0%,
        var(--primary-color) 50%,
        var(--success-color) 80%,
        transparent 100%
    );
    opacity: 0.4;
    transform: rotate(-60deg);
  }

  // 左上角长条装饰
  .top-left-decoration {
    position: absolute;
    top: 20%;
    left: 30%;
    width: 100px;
    height: 2px;
    background: linear-gradient(to right,
        transparent 0%,
        var(--info-color) 30%,
        var(--primary-color) 70%,
        transparent 100%
    );
    opacity: 0.5;
    transform: rotate(-30deg);
  }

  // 模块一右侧长条装饰
  .module1-right-decoration {
    position: absolute;
    top: 25%;
    right: 15%;
    width: 50px;
    height: 2px;
    background: linear-gradient(to left,
        transparent 0%,
        var(--warning-color) 40%,
        var(--error-color) 80%,
        transparent 100%
    );
    opacity: 0.6;
    transform: rotate(-30deg);
  }

  // 模块一较长装饰 - 左侧长条
  .module1-long-decoration {
    position: absolute;
    top: 50%;
    left: 39.4%;
    width: 500px;
    height: 2px;
    background: linear-gradient(to right,
        transparent 0%,
        var(--info-color) 15%,
        var(--primary-color) 40%,
        var(--success-color) 65%,
        var(--warning-color) 85%,
        transparent 100%
    );
    transform: rotate(103.3deg);
  }
}
</style>
