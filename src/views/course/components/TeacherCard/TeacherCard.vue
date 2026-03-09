<template>
  <div :class="{ 'horizontal': props.horizontal }" class="teacher-card">
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

    <!-- 用户编码底部信息 -->
    <div v-if="teacherInfo?.sysUserId" class="contact-footer">
      {{ t('common.userCode') + ": " + teacherInfo.sysUserId }}
    </div>

    <!-- 右侧头像区域 -->
    <div class="teacher-brand-section">
      <!-- 教师头像边框 -->
      <div class="brand-circle">
        <AvatarDisplay
            :avatar-src="teacherInfo?.avatar"
            :nick-name="teacherInfo?.nickName"
            :round="true"
            :size="160"
            :teacher-real-name="teacherInfo?.realName"
            :username="teacherInfo?.username"
            avatar-class="teacher-avatar"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import type {TeacherVO} from '@/types/teacher'
import {getEducationLabel} from '@/enum/teacher/educationEnum'
import Icon from '@/components/common/Icon.vue'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import {ArrowForwardOutline, CallOutline, IdCardOutline, MailOutline, TimeOutline} from '@vicons/ionicons5'
import {useCourseStore} from '@/store/modules/course'

interface Props {
  /** 是否水平布局 */
  horizontal?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  horizontal: false
})

const {t} = useI18n()
const router = useRouter()
const courseStore = useCourseStore()

// 计算教师信息：优先从 assistantTeachers 中找到主讲教师，否则使用第一个助教
const teacherInfo = computed<TeacherVO | null>(() => {
  const courseInfo = courseStore.currentCourseInfo
  if (!courseInfo) return null
  const assistants = courseInfo.assistantTeachers || []
  const mainTeacherId = courseInfo.teacherId || null
  if (mainTeacherId) {
    const found = (assistants as TeacherVO[]).find((t: TeacherVO) => t.id === mainTeacherId)
    if (found) return found
  }
  return (assistants as TeacherVO[])[0] || null
})

// 处理了解教师按钮点击
const handleLearnMore = () => {
  if (teacherInfo.value?.sysUserId) {
    router.push(`/user/${teacherInfo.value.sysUserId}`)
  }
}

// 获取职位文本
const getPositionText = () => {
  if (!teacherInfo.value) return t('common.unknown')

  const {department, education, specialization} = teacherInfo.value
  const parts: string[] = []

  if (department) parts.push(department)
  if (education !== null && education !== undefined) parts.push(getEducationLabel(education))
  if (specialization) parts.push(specialization)

  return parts.length > 0 ? parts.join(' · ') : t('teacher.card.defaultPosition')
}
</script>

<style lang="scss" scoped>
@use './TeacherCard.scss';
</style>
