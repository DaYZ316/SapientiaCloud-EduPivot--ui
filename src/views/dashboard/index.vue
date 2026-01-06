<template>
  <div class="dashboard-container">
    <div class="left-content">
      <div class="welcome-row">
        <WelcomeCard class="welcome-card"/>
        <StatisticsCard class="statistics-card"/>
      </div>
      <AiChatCard class="ai-chat-card"/>
    <div class="notification-row">
      <NotificationCard class="notification-card"/>
      <RecentActiveCourses class="recent-courses-container"/>
    </div>
    </div>
    <!-- 右侧书本区域 -->
    <div class="book-container">
      <Book3D />
    </div>
  </div>
</template>

<script lang="ts" setup>
import Book3D from './Book3D.vue'
import WelcomeCard from './WelcomeCard.vue'
import StatisticsCard from './StatisticsCard.vue'
import AiChatCard from './AiChatCard.vue'
import NotificationCard from './NotificationCard.vue'
import RecentActiveCourses from './RecentActiveCourses.vue'

</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
