<template>
  <div class="profile-section">
    <!-- 学生信息显示 -->
    <n-card v-if="isStudent" :bordered="false" class="info-card">
      <template #header>
        <div class="section-header">
          <h3 class="section-title">{{ t('profile.studentInfo') }}</h3>
        </div>
      </template>
      <n-descriptions bordered>
        <n-descriptions-item :label="t('auth.username')">
          <span>{{ studentInfo?.username || userInfo?.username }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.studentCode')">
          <span>{{ studentInfo?.studentCode || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.realName')">
          <span>{{ studentInfo?.realName || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.email')">
          <span>{{ studentInfo?.email || userInfo?.email || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.phone')">
          <span>{{ studentInfo?.mobile || userInfo?.mobile || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.gender')">
          <span>{{ getGenderLabel(studentInfo?.gender || userInfo?.gender) }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.birthDate')">
          <span>{{ formatDate(studentInfo?.birthDate) }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.admissionYear')">
          <span>{{ studentInfo?.admissionYear || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.major')">
          <span>{{ studentInfo?.major || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.academicStatus')">
          <n-tag :type="getAcademicStatusType(studentInfo?.academicStatus)">
            {{ getAcademicStatusText(studentInfo?.academicStatus) }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.accountStatus')">
          <n-tag :type="getStatusType(studentInfo?.status ?? userInfo?.status)">
            {{ getStatusText(studentInfo?.status ?? userInfo?.status) }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item v-if="studentInfo?.description" :label="t('profile.description')">
          <span>{{ studentInfo.description }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.lastLoginTime')">
          <span>{{ formatDateTime(studentInfo?.lastLoginTime || userInfo?.lastLoginTime) }}</span>
        </n-descriptions-item>
      </n-descriptions>
      <div class="action-buttons">
        <n-button type="primary" @click="goToSettings">
          {{ t('profile.editProfile') }}
        </n-button>
      </div>
    </n-card>

    <!-- 教师信息显示 -->
    <n-card v-else-if="isTeacher" :bordered="false" class="info-card">
      <template #header>
        <div class="section-header">
          <h3 class="section-title">{{ t('profile.teacherInfo') }}</h3>
        </div>
      </template>
      <n-descriptions bordered>
        <n-descriptions-item :label="t('auth.username')">
          <span>{{ teacherInfo?.username || userInfo?.username }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.teacherCode')">
          <span>{{ teacherInfo?.teacherCode || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.realName')">
          <span>{{ teacherInfo?.realName || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.email')">
          <span>{{ teacherInfo?.email || userInfo?.email || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.phone')">
          <span>{{ teacherInfo?.mobile || userInfo?.mobile || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.gender')">
          <span>{{ getGenderLabel(teacherInfo?.gender || userInfo?.gender) }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.birthDate')">
          <span>{{ formatDate(teacherInfo?.birthDate) }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.department')">
          <span>{{ teacherInfo?.department || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.education')">
          <n-tag :type="getEducationType(teacherInfo?.education)">
            {{ getEducationLabel(teacherInfo?.education) }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item :label="t('profile.specialization')">
          <span>{{ teacherInfo?.specialization || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.accountStatus')">
          <n-tag :type="getStatusType(teacherInfo?.status ?? userInfo?.status)">
            {{ getStatusText(teacherInfo?.status ?? userInfo?.status) }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item v-if="teacherInfo?.description" :label="t('profile.description')">
          <span>{{ teacherInfo.description }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.lastLoginTime')">
          <span>{{ formatDateTime(teacherInfo?.lastLoginTime || userInfo?.lastLoginTime) }}</span>
        </n-descriptions-item>
      </n-descriptions>
      <div class="action-buttons">
        <n-button type="primary" @click="goToSettings">
          {{ t('profile.editProfile') }}
        </n-button>
      </div>
    </n-card>

    <!-- 普通用户信息显示 -->
    <n-card v-else :bordered="false" class="info-card">
      <n-descriptions bordered>
        <n-descriptions-item :label="t('auth.username')">
          <span>{{ userInfo?.username }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.email')">
          <span>{{ userInfo?.email || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.phone')">
          <span>{{ userInfo?.mobile || '-' }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.gender')">
          <span>{{ getGenderLabel(userInfo?.gender) }}</span>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.accountStatus')">
          <n-tag :type="getStatusType(userInfo?.status)">
            {{ getStatusText(userInfo?.status) }}
          </n-tag>
        </n-descriptions-item>
        <n-descriptions-item :label="t('settings.personal.lastLoginTime')">
          <span>{{ formatDateTime(userInfo?.lastLoginTime) }}</span>
        </n-descriptions-item>
      </n-descriptions>
      <div class="action-buttons">
        <n-button type="primary" @click="goToSettings">
          {{ t('profile.editProfile') }}
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store'
import {AcademicStatusEnum, getAcademicStatusLabel} from '@/enum/student/academicStatusEnum'

const router = useRouter()
const userStore = useUserStore()
const {t} = useI18n()

const userInfo = computed(() => userStore.userInfo)
const studentInfo = computed(() => userStore.studentInfo)
const teacherInfo = computed(() => userStore.teacherInfo)

// 检查是否为学生角色
const isStudent = computed(() => {
  return userStore.hasRole('STUDENT') && studentInfo.value
})

// 检查是否为教师角色
const isTeacher = computed(() => {
  return userStore.hasRole('TEACHER') && teacherInfo.value
})

// 获取性别标签
function getGenderLabel(gender?: number | null): string {
  if (gender === 1) return t('settings.personal.genderMale')
  if (gender === 2) return t('settings.personal.genderFemale')
  return t('settings.personal.genderUnknown')
}

// 格式化日期时间
function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleString()
}

// 格式化日期
function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString()
}

// 获取学业状态标签
function getAcademicStatusText(status?: number | null): string {
  if (status === null || status === undefined) {
    return '-'
  }
  return getAcademicStatusLabel(status as AcademicStatusEnum, false)
}

// 获取学业状态类型
function getAcademicStatusType(status?: number | null): string {
  if (status === null || status === undefined) {
    return 'default'
  }

  switch (status as AcademicStatusEnum) {
    case AcademicStatusEnum.ENROLLED:
      return 'success'
    case AcademicStatusEnum.SUSPENDED:
      return 'warning'
    case AcademicStatusEnum.DROPPED:
      return 'error'
    case AcademicStatusEnum.GRADUATED:
      return 'info'
    default:
      return 'default'
  }
}

// 获取学历标签
function getEducationLabel(education?: number | null): string {
  switch (education) {
    case 0:
      return t('profile.educationAssociate')
    case 1:
      return t('profile.educationBachelor')
    case 2:
      return t('profile.educationMaster')
    case 3:
      return t('profile.educationDoctor')
    default:
      return '-'
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

// 获取状态类型
function getStatusType(status?: number | null): string {
  return status === 0 ? 'success' : 'error'
}

// 获取状态文本
function getStatusText(status?: number | null): string {
  return status === 0 ? t('settings.personal.statusNormal') : t('settings.personal.statusDisabled')
}

// 跳转到设置页面
function goToSettings() {
  router.push('/settings')
}
</script>

<style lang="scss" scoped>
@use '../index.scss';
</style>
