<template>
  <div class="user-profile-container">
    <div v-if="loading" class="loading-state">
      <n-spin size="large"/>
    </div>
    <div v-else-if="!userId" class="error-state">
      <n-result :description="t('profile.userIdMissing')" :title="t('common.error')" status="error">
        <template #footer>
          <n-button @click="goBack">
            {{ t('common.back') }}
          </n-button>
        </template>
      </n-result>
    </div>
    <div v-else-if="!userInfo" class="empty-state">
      <n-empty :description="t('profile.userNotFound')">
        <template #extra>
          <n-button @click="loadUserInfo">
            {{ t('common.retry') }}
          </n-button>
        </template>
      </n-empty>
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

      <!-- 用户头像和基本信息头部 -->
      <div class="profile-header">
        <div class="profile-bg"></div>
        <div class="profile-avatar-container">
          <AvatarDisplay
              :avatar-src="userInfo.avatar"
              :nick-name="userInfo.nickName"
              :round="true"
              :size="120"
              :student-real-name="studentInfo?.realName"
              :teacher-real-name="teacherInfo?.realName"
              :username="userInfo.username"
              avatar-class="profile-avatar"
          />
        </div>
        <h1 class="profile-name">{{ getDisplayName() }}</h1>
        <p class="profile-bio">{{ getProfileBio() }}</p>
      </div>

      <!-- 用户详细信息 -->
      <div class="profile-section">
        <n-card :bordered="false" class="info-card">
          <template #header>
            <div class="section-header">
              <h3 class="section-title">{{ t('profile.basicInfo') }}</h3>
            </div>
          </template>
          <n-descriptions bordered>
            <n-descriptions-item :label="t('auth.username')">
              <span>{{ userInfo.username || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.realName')">
              <span>{{ getRealName() || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.email')">
              <span>{{ userInfo.email || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.phone')">
              <span>{{ userInfo.mobile || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.gender')">
              <span>{{ getGenderLabel(userInfo.gender) }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.birthDate')">
              <span>{{ getBirthDate() }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.lastLoginTime')">
              <span>{{ formatDateTime(userInfo.lastLoginTime) }}</span>
            </n-descriptions-item>
          </n-descriptions>
        </n-card>
      </div>

      <!-- 学生信息 -->
      <div v-if="isStudent" class="profile-section">
        <n-card :bordered="false" class="info-card">
          <template #header>
            <div class="section-header">
              <h3 class="section-title">{{ t('profile.studentInfo') }}</h3>
            </div>
          </template>
          <n-descriptions bordered>
            <n-descriptions-item :label="t('profile.studentCode')">
              <span>{{ studentInfo?.studentCode || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.admissionYear')">
              <span>{{ studentInfo?.admissionYear || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.major')">
              <span>{{ studentInfo?.major || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.academicStatus')">
              <n-tag :type="getAcademicStatusType(studentInfo?.academicStatus)">
                {{ getAcademicStatusLabel(studentInfo?.academicStatus ?? 0) }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item v-if="studentInfo?.description" :label="t('profile.description')">
              <span>{{ studentInfo.description }}</span>
            </n-descriptions-item>
          </n-descriptions>
        </n-card>
      </div>

      <!-- 教师信息 -->
      <div v-if="isTeacher" class="profile-section">
        <n-card :bordered="false" class="info-card">
          <template #header>
            <div class="section-header">
              <h3 class="section-title">{{ t('profile.teacherInfo') }}</h3>
            </div>
          </template>
          <n-descriptions bordered>
            <n-descriptions-item :label="t('profile.teacherCode')">
              <span>{{ teacherInfo?.teacherCode || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.employeeId')">
              <span>{{ teacherInfo?.employeeId || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.department')">
              <span>{{ teacherInfo?.department || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.education')">
              <n-tag :type="getEducationType(teacherInfo?.education)">
                {{ getEducationLabel(teacherInfo?.education ?? 0) }}
              </n-tag>
            </n-descriptions-item>
            <n-descriptions-item :label="t('profile.specialization')">
              <span>{{ teacherInfo?.specialization || '-' }}</span>
            </n-descriptions-item>
            <n-descriptions-item v-if="teacherInfo?.description" :label="t('profile.description')">
              <span>{{ teacherInfo.description }}</span>
            </n-descriptions-item>
          </n-descriptions>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {StudentVO, TeacherVO} from '@/types'
import type {SysUserLoginVO} from '@/types/auth'
import {useI18n} from 'vue-i18n'
import {useRoute, useRouter} from 'vue-router'
import {ArrowBackOutline} from '@vicons/ionicons5'
import {getAcademicStatusLabel} from '@/enum/student'
import {getEducationLabel} from '@/enum/teacher'
import {getStudentByUserId} from '@/api/student'
import {getTeacherByUserId} from '@/api/teacher'
import {getUserById} from '@/api/system/user'
import {computed, onMounted, ref} from 'vue'
import Icon from '@/components/common/Icon.vue'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'

const {t} = useI18n()
const router = useRouter()
const route = useRoute()

// 从路由参数获取userId（固定是用户的id）
const userId = route.params.userId as string

// 验证路由参数
if (!userId) {
  console.error('路由参数 userId 缺失')
}

// 响应式数据
const userInfo = ref<SysUserLoginVO | null>(null)
const studentInfo = ref<StudentVO | null>(null)
const teacherInfo = ref<TeacherVO | null>(null)
const loading = ref(true)

// 计算属性
const isStudent = computed(() => !!studentInfo.value)
const isTeacher = computed(() => !!teacherInfo.value)

// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 获取显示名称
const getDisplayName = (): string => {
  if (isStudent.value && studentInfo.value?.realName) {
    return studentInfo.value.realName
  }
  if (isTeacher.value && teacherInfo.value?.realName) {
    return teacherInfo.value.realName
  }
  return userInfo.value?.nickName || userInfo.value?.username || '-'
}

// 获取真实姓名
const getRealName = (): string => {
  if (isStudent.value && studentInfo.value?.realName) {
    return studentInfo.value.realName
  }
  if (isTeacher.value && teacherInfo.value?.realName) {
    return teacherInfo.value.realName
  }
  return '-'
}

// 获取出生日期
const getBirthDate = (): string => {
  if (isStudent.value && studentInfo.value?.birthDate) {
    return formatDate(studentInfo.value.birthDate)
  }
  if (isTeacher.value && teacherInfo.value?.birthDate) {
    return formatDate(teacherInfo.value.birthDate)
  }
  return '-'
}

// 获取个人简介
const getProfileBio = (): string => {
  if (isStudent.value) {
    return t('profile.studentInfo')
  }
  if (isTeacher.value) {
    return t('profile.teacherInfo')
  }
  return t('profile.userInfo')
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

// 获取学籍状态类型
function getAcademicStatusType(academicStatus?: number | null): string {
  switch (academicStatus) {
    case 0: // 在读
      return 'success'
    case 1: // 休学
      return 'warning'
    case 2: // 退学
      return 'error'
    case 3: // 毕业
      return 'info'
    default:
      return 'default'
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

// 加载用户信息
const loadUserInfo = async () => {
  loading.value = true

  // 验证 userId 参数
  if (!userId) {
    console.error('用户ID参数缺失')
    loading.value = false
    return
  }

  try {
    // 并行查询系统用户、学生和教师信息
    const tasks = [
      getUserById(userId),
      getStudentByUserId(userId),
      getTeacherByUserId(userId)
    ]

    const results = await Promise.allSettled(tasks)

    // 处理系统用户信息结果
    const userRes = results[0]
    let systemUser = null
    if (userRes.status === 'fulfilled' && userRes.value.success && userRes.value.data) {
      systemUser = userRes.value.data
    }

    // 处理学生信息结果
    const studentRes = results[1]
    if (studentRes.status === 'fulfilled' && studentRes.value.success && studentRes.value.data) {
      studentInfo.value = studentRes.value.data
    }

    // 处理教师信息结果
    const teacherRes = results[2]
    if (teacherRes.status === 'fulfilled' && teacherRes.value.success && teacherRes.value.data) {
      teacherInfo.value = teacherRes.value.data
    }

    // 构建用户信息，优先使用系统用户信息
    if (systemUser) {
      userInfo.value = {
        id: userId,
        username: systemUser.username || '',
        nickName: systemUser.nickName || '',
        email: systemUser.email || '',
        mobile: systemUser.mobile || '',
        gender: systemUser.gender || 0,
        avatar: systemUser.avatar || '',
        status: systemUser.status || 0,
        lastLoginTime: systemUser.lastLoginTime || '',
        roles: systemUser.roles || [],
        permissions: systemUser.permissions || [],
        accessToken: ''
      }
    } else if (studentInfo.value) {
      // 如果没有系统用户信息但有学生信息，使用学生信息
      userInfo.value = {
        id: userId,
        username: studentInfo.value?.username || '',
        nickName: studentInfo.value?.nickName || '',
        email: studentInfo.value?.email || '',
        mobile: studentInfo.value?.mobile || '',
        gender: studentInfo.value?.gender || 0,
        avatar: studentInfo.value?.avatar || '',
        status: 1, // 默认状态为正常
        lastLoginTime: studentInfo.value?.lastLoginTime || '',
        roles: [],
        permissions: [],
        accessToken: ''
      }
    } else if (teacherInfo.value) {
      // 如果没有系统用户信息但有教师信息，使用教师信息
      userInfo.value = {
        id: userId,
        username: teacherInfo.value?.username || '',
        nickName: teacherInfo.value?.nickName || '',
        email: teacherInfo.value?.email || '',
        mobile: teacherInfo.value?.mobile || '',
        gender: teacherInfo.value?.gender || 0,
        avatar: teacherInfo.value?.avatar || '',
        status: 1, // 默认状态为正常
        lastLoginTime: teacherInfo.value?.lastLoginTime || '',
        roles: [],
        permissions: [],
        accessToken: ''
      }
    }

    // 如果都没有找到用户信息，显示默认信息
    if (!systemUser && !studentInfo.value && !teacherInfo.value) {
      userInfo.value = {
        id: userId, // 使用路由中的userId
        username: '未知用户',
        nickName: '未知用户',
        email: '',
        mobile: '',
        gender: 0,
        avatar: '',
        status: 0,
        lastLoginTime: '',
        roles: [],
        permissions: [],
        accessToken: ''
      }
    }
  } catch (error) {
    console.error('加载用户信息失败:', error)
    // 设置错误状态
    userInfo.value = null
  } finally {
    loading.value = false
  }
}

// 组件挂载时加载数据
onMounted(() => {
  loadUserInfo()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.user-profile-container {
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
  .user-profile-container {
    padding: 12px;
  }
}
</style>
