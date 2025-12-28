<template>
  <div class="dashboard-container">
    <div class="book-container">

    </div>
    <!-- <CelestailHub /> -->
    <Book/>
  </div>
</template>

<script lang="ts" setup>
// 主页逻辑已清空
import Book from './Book3D.vue';
</script>

<style lang="scss" scoped>
@use './index.scss';

.dashboard-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.book-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
