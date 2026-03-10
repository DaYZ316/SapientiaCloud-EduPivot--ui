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
      <Book3D/>
    </div>
    <!-- 分割线 -->
    <div class="bottom-divider">
      <span class="divider-text">{{ t('dashboard.morePublicCourses') }}</span>
    </div>
    <!-- 课程列表 -->
    <CourseList/>
  </div>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import Book3D from './Book3D.vue'
import WelcomeCard from './WelcomeCard.vue'
import StatisticsCard from './StatisticsCard.vue'
import AiChatCard from './AiChatCard.vue'
import NotificationCard from './NotificationCard.vue'
import RecentActiveCourses from './RecentActiveCourses.vue'
import CourseList from './CourseList.vue'

const {t} = useI18n()
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
