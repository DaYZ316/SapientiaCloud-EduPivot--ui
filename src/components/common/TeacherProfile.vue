<template>
  <div class="teacher-profile-container">
    <div v-if="loading" class="loading-state">
      <n-spin size="large"/>
    </div>
    <div v-else-if="!teacher" class="empty-state">
      <n-empty :description="t('teacher.profile.notFound')"/>
    </div>
    <div v-else class="profile-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <n-button circle quaternary @click="goBack">
          <template #icon>
            <Icon :component="ArrowBackOutline"/>
          </template>
        </n-button>
      </div>

      <!-- 教师头像和基本信息头部 -->
      <div class="profile-header">
        <div class="profile-bg"></div>
        <div class="profile-avatar-container">
          <AvatarDisplay
              :avatar-src="teacher.avatar"
              :nick-name="teacher.nickName"
              :round="true"
              :size="120"
              :teacher-real-name="teacher.realName"
              :username="teacher.username"
              avatar-class="profile-avatar"
          />
        </div>
        <h1 class="profile-name">{{ teacher.realName || teacher.nickName || teacher.username }}</h1>
        <p class="profile-bio">{{ t('profile.teacherInfo') }}</p>
      </div>

      <!-- 教师详细信息 -->
      <div class="profile-section">
        <n-card :bordered="false" class="info-card">
          <template #header>
            <div class="section-header">
              <h3 class="section-title">{{ t('profile.teacherInfo') }}</h3>
            </div>
          </template>
          <n-descriptions bordered>
            <n-descriptions-item :label="t('auth.username')">
              <span>{{ teacher.username || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.teacherCode')">
              <span>{{ teacher.teacherCode || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.realName')">
              <span>{{ teacher.realName || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.email')">
              <span>{{ teacher.email || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.phone')">
              <span>{{ teacher.mobile || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.gender')">
              <span>{{ getGenderLabel(teacher.gender) }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.birthDate')">
              <span>{{ formatDate(teacher.birthDate) }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.department')">
              <span>{{ teacher.department || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.education')">
              <n-tag :type="getEducationType(teacher.education)">
                {{ getEducationLabel(teacher.education ?? 0) }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.specialization')">
              <span>{{ teacher.specialization || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item v-if="teacher.description" :label="t('profile.description')">
              <span>{{ teacher.description }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.lastLoginTime')">
              <span>{{ formatDateTime(teacher.lastLoginTime ?? undefined) }}</span>
            </n-descriptions-item>
          </n-descriptions>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {TeacherVO} from '@/types/teacher'
import {useI18n} from 'vue-i18n'
import {useRoute, useRouter} from 'vue-router'
import {ArrowBackOutline} from '@vicons/ionicons5'
import {getEducationLabel} from '@/enum/teacher'
import {getTeacherById} from '@/api/teacher'
import {onMounted, ref} from 'vue'
import Icon from '@/components/common/Icon.vue'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'

const {t} = useI18n()
const router = useRouter()
const route = useRoute()

// 从路由参数获取teacherId
const teacherId = route.params.teacherId as string

// 响应式数据
const teacher = ref<TeacherVO | null>(null)
const loading = ref(true)

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 获取性别标签
function getGenderLabel(gender?: number | null): string {
  if (gender === 1) return t('settings.personal.genderMale')
  if (gender === 2) return t('settings.personal.genderFemale')
  return t('settings.personal.genderUnknown')
}

// 格式化日期时间
function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleString()
  } catch (e) {
    return dateStr
  }
}

// 格式化日期
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  } catch (e) {
    return dateStr
  }
}

// 获取学历类型
function getEducationType(education?: number | null): string {
  switch (education) {
    case 0:
      return 'default'
    case 1:
      return 'info'
    case 2:
      return 'warning'
    case 3:
      return 'success'
    default:
      return 'default'
  }
}

// 加载教师信息
const loadTeacherInfo = async () => {
  loading.value = true

  // 获取教师基本信息
  const teacherResponse = await getTeacherById(teacherId)
  const teacherData = teacherResponse.data as TeacherVO

  // 直接使用教师信息
  teacher.value = teacherData
  loading.value = false
}

// 组件挂载时加载数据
onMounted(() => {
  loadTeacherInfo()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.teacher-profile-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;

  .loading-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
  }

  .empty-state {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 400px;
  }

  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  .profile-header {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 60px;
    padding-bottom: 40px;
    margin-bottom: 30px;
    overflow: hidden;
    border-radius: 12px;
    text-align: center;

    .profile-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 180px;
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--info-color) 100%);
      z-index: 0;
    }

    .profile-avatar-container {
      position: relative;
      z-index: 2;
      margin-bottom: 16px;

      .profile-avatar {
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .profile-name {
      font-size: 28px;
      font-weight: 600;
      margin: 0 0 8px 0;
      position: relative;
      z-index: 2;
    }

    .profile-bio {
      color: var(--text-secondary-color);
      margin: 0 0 20px 0;
      position: relative;
      z-index: 2;
    }
  }

  .profile-section {
    margin-bottom: 30px;
  }

  .info-card {
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .section-title {
    font-size: 18px;
    font-weight: 500;
    margin: 0 0 16px 0;
    color: var(--text-color);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
}

@media (max-width: 768px) {
  .teacher-profile-container {
    padding: 12px;
  }
}
</style>