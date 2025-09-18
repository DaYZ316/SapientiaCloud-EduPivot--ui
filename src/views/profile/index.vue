<template>
  <div class="profile-container">
    <div class="page-header">
      <n-button circle quaternary @click="goBack">
        <template #icon>
          <Icon :component="ArrowBackOutline"/>
        </template>
      </n-button>
    </div>
    <div class="profile-header">
      <div class="profile-bg"></div>
      <div class="profile-avatar-container">
        <AvatarDisplay
            :avatar-src="userInfo?.avatar"
            :nick-name="userInfo?.nickName"
            :size="120"
            :student-real-name="studentInfo?.realName || undefined"
            :teacher-real-name="teacherInfo?.realName || undefined"
            :username="userInfo?.username"
            avatar-class="profile-avatar"
        />
      </div>
      <h1 class="profile-name">
        {{ studentInfo?.realName || teacherInfo?.realName || userInfo?.nickName || userInfo?.username }}</h1>
      <p class="profile-bio">{{ t('profile.userBio') }}</p>
      <!-- Admin角色特殊标识 -->
      <div v-if="isAdmin" class="admin-badge">
        <n-tag round size="large" type="success">
          {{ t('profile.superAdmin') }}
        </n-tag>
      </div>
      <div class="profile-stats">
        <div class="stat-item">
          <span class="stat-value">{{ userRoles.length }}</span>
          <span class="stat-label">{{ t('profile.roles') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ userPermissions.length }}</span>
          <span class="stat-label">{{ t('profile.permissions') }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-value">{{ accountAgeDays }}</span>
          <span class="stat-label">{{ t('profile.accountAge') }}</span>
        </div>
      </div>
    </div>

    <div class="profile-tabs">
      <n-tabs :default-value="'info'" animated class="custom-tabs" type="line">
        <n-tab-pane :tab="t('profile.basicInfo')" name="info">
          <BasicInfoTab/>
        </n-tab-pane>

        <n-tab-pane :tab="t('profile.roleInfo')" name="roles">
          <RoleInfoTab/>
        </n-tab-pane>

        <n-tab-pane :tab="t('profile.permissionInfo')" name="permissions">
          <PermissionInfoTab/>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'
import {ArrowBackOutline} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import Icon from '@/components/common/Icon.vue'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import BasicInfoTab from './components/BasicInfoTab.vue'
import RoleInfoTab from './components/RoleInfoTab.vue'
import PermissionInfoTab from './components/PermissionInfoTab.vue'
import {useProfileUtils} from './composables/useProfileUtils'

const router = useRouter()
const {t} = useI18n()

// 使用公共工具函数
const {
  userInfo,
  userRoles,
  userPermissions,
  studentInfo,
  teacherInfo,
  isAdmin,
  accountAgeDays
} = useProfileUtils()

// 返回上一页
function goBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style> 