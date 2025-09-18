<template>
  <div :class="{ 'horizontal': horizontal }" class="teacher-card">
    <!-- 右上角了解教师按钮 -->
    <n-button
        class="learn-more-button"
        round
        size="small"
        type="primary"
        @click="handleLearnMore"
    >
      <template #icon>
        <Icon :component="ArrowForwardOutline"/>
      </template>
      {{ t('teacher.card.learnMore') }}
    </n-button>

    <!-- 左侧信息区域 -->
    <div class="teacher-info-section">
      <!-- 装饰性曲线 -->
      <div class="decorative-curve"></div>

      <!-- 教师基本信息 -->
      <div class="teacher-basic-info">
        <div class="teacher-name">
          <span class="first-name">{{
              teacherInfo?.realName?.split(' ')[0] || teacherInfo?.realName || t('common.unknown')
            }}</span>
          <span class="last-name">{{ teacherInfo?.realName?.split(' ').slice(1).join(' ') || '' }}</span>
        </div>
        <div class="teacher-title">{{ getPositionText() }}</div>
      </div>

      <!-- 联系信息 -->
      <div class="contact-info">
        <div v-if="teacherInfo?.teacherCode" class="contact-item">
          <div class="contact-icon">
            <Icon :component="IdCardOutline"/>
          </div>
          <div class="contact-content">
            <div class="contact-label">{{ t('teacher.card.teacherCode') }}</div>
            <div class="contact-value">{{ teacherInfo.teacherCode }}</div>
          </div>
        </div>

        <div v-if="teacherInfo?.mobile" class="contact-item">
          <div class="contact-icon">
            <Icon :component="CallOutline"/>
          </div>
          <div class="contact-content">
            <div class="contact-label">{{ t('common.phone') }}</div>
            <div class="contact-value">{{ teacherInfo.mobile }}</div>
          </div>
        </div>

        <div v-if="teacherInfo?.email" class="contact-item">
          <div class="contact-icon">
            <Icon :component="MailOutline"/>
          </div>
          <div class="contact-content">
            <div class="contact-label">{{ t('common.email') }}</div>
            <div class="contact-value">{{ teacherInfo.email }}</div>
          </div>
        </div>

        <div v-if="teacherInfo?.lastLoginTime" class="contact-item">
          <div class="contact-icon">
            <Icon :component="TimeOutline"/>
          </div>
          <div class="contact-content">
            <div class="contact-label">{{ t('common.lastLoginTime') }}</div>
            <div class="contact-value">{{ teacherInfo.lastLoginTime }}</div>
          </div>
        </div>

      </div>
    </div>

    <!-- 用户ID底部信息 -->
    <div v-if="teacherInfo?.sysUserId" class="contact-footer">
      {{ t('common.userId') + ": " + teacherInfo.sysUserId }}
    </div>

    <!-- 右侧头像区域 -->
    <div class="teacher-brand-section">
      <!-- 教师头像边框 -->
      <div class="brand-circle">
        <img
            v-if="teacherInfo?.avatar && !avatarError"
            :alt="teacherInfo.realName || 'Teacher Avatar'"
            :src="teacherInfo.avatar"
            class="teacher-avatar"
            @error="handleAvatarError"
        />
        <div
            v-else
            class="avatar-placeholder"
        >
          <span class="avatar-text">{{ getInitials() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import type {TeacherVO} from '@/types/teacher'
import {getEducationLabel} from '@/enum/teacher/educationEnum'
import Icon from '@/components/common/Icon.vue'
import {ArrowForwardOutline, CallOutline, IdCardOutline, MailOutline, TimeOutline} from '@vicons/ionicons5'

interface Props {
  /** 教师信息 */
  teacherInfo?: TeacherVO | null
  /** 是否水平布局 */
  horizontal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  teacherInfo: null,
  horizontal: false
})

const {t} = useI18n()
const router = useRouter()

// 头像加载错误状态
const avatarError = ref(false)

// 处理了解教师按钮点击
const handleLearnMore = () => {
  if (props.teacherInfo?.id) {
    router.push({
      name: 'TeacherProfile',
      params: {
        teacherId: props.teacherInfo.id.toString()
      }
    })
  }
}

// 处理头像加载错误
const handleAvatarError = () => {
  avatarError.value = true
}


// 获取教师姓名首字母
const getInitials = () => {
  const name = props.teacherInfo?.realName?.trim()
  if (!name) return 'T'

  // 中文名取第一个字符
  if (/[\u4e00-\u9fa5]/.test(name)) {
    return name.charAt(0)
  }

  // 英文名取首字母
  const words = name.split(' ')
  return words.length > 1
      ? (words[0].charAt(0) + words[1].charAt(0)).toUpperCase()
      : name.charAt(0).toUpperCase()
}

// 获取职位文本
const getPositionText = () => {
  if (!props.teacherInfo) return t('common.unknown')

  const {department, education, specialization} = props.teacherInfo
  const parts = []

  if (department) parts.push(department)
  if (education !== null && education !== undefined) parts.push(getEducationLabel(education))
  if (specialization) parts.push(specialization)

  return parts.length > 0 ? parts.join(' · ') : t('teacher.card.defaultPosition')
}
</script>

<style lang="scss" scoped>
@use './TeacherCard.scss';
</style>
