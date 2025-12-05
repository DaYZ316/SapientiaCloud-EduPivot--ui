<template>
  <div class="personal-settings">
    <n-card :bordered="false" class="profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <AvatarUpload
              :model-value="personalForm.avatar || undefined"
              :nick-name="userInfo?.nickName"
              :size="80"
              :student-real-name="userStore.studentInfo?.realName || undefined"
              :teacher-real-name="userStore.teacherInfo?.realName || undefined"
              :username="userInfo?.username"
              @update:model-value="(value: string) => personalForm.avatar = value"
              @upload-success="handleAvatarUploadSuccess"
          />
        </div>
        <div class="user-info-brief">
          <h3>{{
            userStore.studentInfo?.realName || userStore.teacherInfo?.realName || userInfo?.nickName ||
            userInfo?.username
            }}</h3>
          <n-tag v-for="role in userRoles" :key="role.id" class="role-tag" size="small">
            {{ role.roleName }}
          </n-tag>
        </div>
      </div>
    </n-card>

    <n-card :bordered="false" class="info-card mt-4">
      <n-tabs animated type="line">
        <n-tab-pane :tab="t('settings.personal.basicInfo')" name="basic">
          <BasicInfo ref="basicInfoRef"/>
        </n-tab-pane>

        <n-tab-pane :tab="t('settings.personal.binding')" name="binding">
          <BindingSettings ref="bindingSettingsRef"/>
        </n-tab-pane>

        <n-tab-pane :tab="t('settings.personal.security')" name="security">
          <SecuritySettings/>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue'
import {useUserStore} from '@/store'
import {useI18n} from 'vue-i18n'
import {getDefaultSysUserProfileDTO} from '@/api/system/user'
import type {SysUserProfileDTO} from '@/types/system/user'
import BasicInfo from './BasicInfo.vue'
import SecuritySettings from './SecuritySettings.vue'
import BindingSettings from './BindingSettings.vue'
import AvatarUpload from '@/components/common/AvatarUpload.vue'

const userStore = useUserStore()
const {t} = useI18n()
const basicInfoRef = ref()
const bindingSettingsRef = ref()

// 使用计算属性获取用户信息
const userInfo = computed(() => userStore.userInfo)
const userRoles = computed(() => userStore.userInfo?.roles || [])

// 表单数据（仅用于头像上传）
const personalForm = reactive<SysUserProfileDTO>(getDefaultSysUserProfileDTO())

// 初始化头像数据
const initAvatarData = () => {
  if (userInfo.value) {
    personalForm.avatar = userInfo.value.avatar || ''
  }
}

// 监听用户信息变化，自动同步头像数据
watch(userInfo, (newUserInfo) => {
  if (newUserInfo) {
    initAvatarData()
    // 同步更新子组件的数据
    if (basicInfoRef.value) {
      basicInfoRef.value.initFormData()
    }
    if (bindingSettingsRef.value) {
      bindingSettingsRef.value.initForms()
    }
  }
}, {immediate: true, deep: true})

// 头像上传成功处理
const handleAvatarUploadSuccess = async (url: string) => {
  // 头像已经通过 v-model 更新到 personalForm.avatar
  // 同步更新BasicInfo组件中的头像数据
  if (basicInfoRef.value) {
    basicInfoRef.value.updateAvatar(url)
  }

  // 立即刷新用户信息到store，确保头像实时更新（强制刷新）
  await userStore.refreshUserInfo(true)
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
