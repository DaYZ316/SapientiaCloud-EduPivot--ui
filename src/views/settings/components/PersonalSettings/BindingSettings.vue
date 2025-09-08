<template>
  <div>
    <div v-if="!teacherInfo && !studentInfo" class="no-binding">
      <n-empty :description="t('settings.personal.noBinding')" size="large">
        <template #extra>
          <n-space>
            <n-button type="primary" @click="showTeacherModal = true">
              {{ t('settings.personal.bindTeacher') }}
            </n-button>
            <n-button type="info" @click="showStudentModal = true">
              {{ t('settings.personal.bindStudent') }}
            </n-button>
          </n-space>
        </template>
      </n-empty>
    </div>

    <div v-else>
      <!-- 教师信息展示 -->
      <div v-if="teacherInfo" class="info-display">
        <n-card :bordered="false" class="info-card" size="small">
          <template #header>
            <div class="flex-between">
              <span>{{ t('settings.personal.teacherInfo') }}</span>
              <n-button text type="primary" @click="showTeacherModal = true">
                {{ t('common.edit') }}
              </n-button>
            </div>
          </template>
          <n-descriptions :column="2" bordered>
            <n-descriptions-item :label="t('settings.personal.teacherCode')">
              {{ teacherInfo.teacherCode }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.realName')">
              {{ teacherInfo.realName }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.department')">
              {{ teacherInfo.department || '-' }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.education')">
              {{ getEducationText(teacherInfo.education) }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.specialization')" :span="2">
              {{ teacherInfo.specialization || '-' }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.description')" :span="2">
              {{ teacherInfo.description || '-' }}
            </n-descriptions-item>
          </n-descriptions>
        </n-card>
      </div>

      <!-- 学生信息展示 -->
      <div v-if="studentInfo" class="info-display">
        <n-card :bordered="false" class="info-card" size="small">
          <template #header>
            <div class="flex-between">
              <span>{{ t('settings.personal.studentInfo') }}</span>
              <n-button text type="primary" @click="showStudentModal = true">
                {{ t('common.edit') }}
              </n-button>
            </div>
          </template>
          <n-descriptions :column="2" bordered>
            <n-descriptions-item :label="t('settings.personal.studentCode')">
              {{ studentInfo.studentCode }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.realName')">
              {{ studentInfo.realName }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.admissionYear')">
              {{ studentInfo.admissionYear || '-' }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.major')">
              {{ studentInfo.major || '-' }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.academicStatus')">
              {{ getAcademicStatusText(studentInfo.academicStatus) }}
            </n-descriptions-item>
            <n-descriptions-item :label="t('settings.personal.description')" :span="2">
              {{ studentInfo.description || '-' }}
            </n-descriptions-item>
          </n-descriptions>
        </n-card>
      </div>
    </div>

    <!-- 绑定教师信息的弹窗 -->
    <n-modal v-model:show="showTeacherModal"
             :title="teacherInfo ? t('common.edit') : t('settings.personal.bindTeacher')" preset="card"
             style="width: 600px;">
      <n-form
          ref="teacherFormRef"
          :model="teacherForm"
          :rules="teacherRules"
          label-placement="left"
          label-width="120"
      >
        <n-grid :cols="24" :x-gap="24">
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.teacherCode')" path="teacherCode">
              <n-input
                  v-model:value="teacherForm.teacherCode"
                  :placeholder="t('settings.personal.teacherCodePlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.realName')" path="realName">
              <n-input
                  v-model:value="teacherForm.realName"
                  :placeholder="t('settings.personal.realNamePlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>

        <n-grid :cols="24" :x-gap="24">
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.department')" path="department">
              <n-input
                  v-model:value="teacherForm.department"
                  :placeholder="t('settings.personal.departmentPlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.education')" path="education">
              <n-select
                  v-model:value="teacherForm.education"
                  :options="educationOptions"
                  :placeholder="t('settings.personal.educationPlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>

        <n-form-item :label="t('settings.personal.specialization')" path="specialization">
          <n-input
              v-model:value="teacherForm.specialization"
              :placeholder="t('settings.personal.specializationPlaceholder')"
              :rows="3"
              type="textarea"
          />
        </n-form-item>

        <n-form-item :label="t('settings.personal.description')" path="description">
          <n-input
              v-model:value="teacherForm.description"
              :placeholder="t('settings.personal.descriptionPlaceholder')"
              :rows="3"
              type="textarea"
          />
        </n-form-item>

        <div class="flex-center mt-4">
          <n-space>
            <n-button type="primary" @click="saveTeacherInfo">
              {{ t('common.confirm') }}
            </n-button>
            <n-button @click="showTeacherModal = false">
              {{ t('common.cancel') }}
            </n-button>
          </n-space>
        </div>
      </n-form>
    </n-modal>

    <!-- 绑定学生信息的弹窗 -->
    <n-modal v-model:show="showStudentModal"
             :title="studentInfo ? t('common.edit') : t('settings.personal.bindStudent')" preset="card"
             style="width: 600px;">
      <n-form
          ref="studentFormRef"
          :model="studentForm"
          :rules="studentRules"
          label-placement="left"
          label-width="120"
      >
        <n-grid :cols="24" :x-gap="24">
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.studentCode')" path="studentCode">
              <n-input
                  v-model:value="studentForm.studentCode"
                  :placeholder="t('settings.personal.studentCodePlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.realName')" path="realName">
              <n-input
                  v-model:value="studentForm.realName"
                  :placeholder="t('settings.personal.realNamePlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>

        <n-grid :cols="24" :x-gap="24">
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.admissionYear')" path="admissionYear">
              <n-input-number
                  v-model:value="studentForm.admissionYear"
                  :max="2030"
                  :min="2000"
                  :placeholder="t('settings.personal.admissionYearPlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.major')" path="major">
              <n-input
                  v-model:value="studentForm.major"
                  :placeholder="t('settings.personal.majorPlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>

        <n-form-item :label="t('settings.personal.academicStatus')" path="academicStatus">
          <n-select
              v-model:value="studentForm.academicStatus"
              :options="academicStatusOptions"
              :placeholder="t('settings.personal.academicStatusPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.personal.description')" path="description">
          <n-input
              v-model:value="studentForm.description"
              :placeholder="t('settings.personal.descriptionPlaceholder')"
              :rows="3"
              type="textarea"
          />
        </n-form-item>

        <div class="flex-center mt-4">
          <n-space>
            <n-button type="primary" @click="saveStudentInfo">
              {{ t('common.confirm') }}
            </n-button>
            <n-button @click="showStudentModal = false">
              {{ t('common.cancel') }}
            </n-button>
          </n-space>
        </div>
      </n-form>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue'
import type {FormInst, FormRules} from 'naive-ui'
import {useUserStore} from '@/store'
import {useI18n} from 'vue-i18n'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
// import type {TeacherDTO} from '@/types'
// import type {StudentDTO} from '@/types'
import {addTeacher, updateTeacher} from '@/api/teacher'
import {addStudent, updateStudent} from '@/api/student'
import {getAcademicStatusLabel, getAcademicStatusOptions} from '@/enum/student'
import {getEducationLabel, getEducationOptions} from '@/enum/teacher'

const userStore = useUserStore()
const {message} = getDiscreteApi()
const {t} = useI18n()
const teacherFormRef = ref<FormInst | null>(null)
const studentFormRef = ref<FormInst | null>(null)
const showTeacherModal = ref(false)
const showStudentModal = ref(false)

// 使用计算属性获取用户信息
const userInfo = computed(() => userStore.userInfo)

// 从store获取教师和学生信息
const teacherInfo = computed(() => userStore.teacherInfo)
const studentInfo = computed(() => userStore.studentInfo)

// 教师表单数据
const teacherForm = reactive({
  teacherCode: '',
  realName: '',
  birthDate: '',
  department: '',
  education: undefined as number | undefined,
  specialization: '',
  description: '',
  sysUserId: ''
})

// 学生表单数据
const studentForm = reactive({
  studentCode: '',
  realName: '',
  birthDate: '',
  admissionYear: undefined as number | undefined,
  major: '',
  academicStatus: undefined as number | undefined,
  description: '',
  sysUserId: ''
})

// 学历选项
const educationOptions = computed(() => getEducationOptions(false))

// 学籍状态选项
const academicStatusOptions = computed(() => getAcademicStatusOptions(false))

// 监听教师弹窗显示事件
watch(showTeacherModal, (newVal: boolean) => {
  if (newVal) {
    initTeacherForm()
  }
})

// 监听学生弹窗显示事件
watch(showStudentModal, (newVal: boolean) => {
  if (newVal) {
    initStudentForm()
  }
})

// 教师表单验证规则
const teacherRules: FormRules = {
  teacherCode: [
    {required: true, message: t('settings.personal.teacherCodeRequired'), trigger: 'blur'}
  ],
  realName: [
    {required: true, message: t('settings.personal.realNameRequired'), trigger: 'blur'}
  ]
}

// 学生表单验证规则
const studentRules: FormRules = {
  studentCode: [
    {required: true, message: t('settings.personal.studentCodeRequired'), trigger: 'blur'}
  ],
  realName: [
    {required: true, message: t('settings.personal.realNameRequired'), trigger: 'blur'}
  ],
  academicStatus: [
    {
      required: true,
      message: t('settings.personal.academicStatusRequired'),
      trigger: ['change', 'blur'],
      validator: (_rule: any, value: any) => {
        // 明确检查值是否为数字类型且不为 undefined 或 null
        if (value === undefined || value === null || value === '') {
          return new Error(t('settings.personal.academicStatusRequired'))
        }
        // 检查值是否在有效范围内 (0-3)
        if (typeof value !== 'number' || value < 0 || value > 3) {
          return new Error(t('settings.personal.academicStatusRequired'))
        }
        return true
      }
    }
  ]
}

// 获取学历文本
function getEducationText(education?: number): string {
  if (education === null || education === undefined) return '-'
  return getEducationLabel(education, false)
}

// 获取学籍状态文本
function getAcademicStatusText(status?: number): string {
  if (status === null || status === undefined) return '-'
  return getAcademicStatusLabel(status, false)
}


// 初始化教师表单
const initTeacherForm = () => {
  if (teacherInfo.value) {
    teacherForm.teacherCode = teacherInfo.value.teacherCode
    teacherForm.realName = teacherInfo.value.realName
    teacherForm.birthDate = teacherInfo.value.birthDate || ''
    teacherForm.department = teacherInfo.value.department || ''
    teacherForm.education = teacherInfo.value.education
    teacherForm.specialization = teacherInfo.value.specialization || ''
    teacherForm.description = teacherInfo.value.description || ''
    teacherForm.sysUserId = teacherInfo.value.sysUserId || ''
  } else {
    teacherForm.teacherCode = ''
    teacherForm.realName = ''
    teacherForm.birthDate = ''
    teacherForm.department = ''
    teacherForm.education = undefined
    teacherForm.specialization = ''
    teacherForm.description = ''
    teacherForm.sysUserId = userInfo.value?.id || ''
  }
}

// 初始化学生表单
const initStudentForm = () => {
  if (studentInfo.value) {
    studentForm.studentCode = studentInfo.value.studentCode
    studentForm.realName = studentInfo.value.realName
    studentForm.birthDate = studentInfo.value.birthDate || ''
    studentForm.admissionYear = studentInfo.value.admissionYear
    studentForm.major = studentInfo.value.major || ''
    // 确保学籍状态正确设置，即使是 0 也要保留
    studentForm.academicStatus = studentInfo.value.academicStatus !== undefined ? studentInfo.value.academicStatus : undefined
    studentForm.description = studentInfo.value.description || ''
    studentForm.sysUserId = studentInfo.value.sysUserId || ''
  } else {
    studentForm.studentCode = ''
    studentForm.realName = ''
    studentForm.birthDate = ''
    studentForm.admissionYear = undefined
    studentForm.major = ''
    studentForm.academicStatus = undefined
    studentForm.description = ''
    studentForm.sysUserId = userInfo.value?.id || ''
  }

  // 调试日志
  console.log('学生信息:', studentInfo.value)
  console.log('学籍状态值:', studentInfo.value?.academicStatus, typeof studentInfo.value?.academicStatus)
  console.log('表单学籍状态:', studentForm.academicStatus, typeof studentForm.academicStatus)
}

// 保存教师信息
const saveTeacherInfo = () => {
  teacherFormRef.value?.validate(async (errors: any) => {
    if (!errors) {
      try {
        if (teacherInfo.value) {
          // 更新教师信息
          const res = await updateTeacher({
            ...teacherForm,
            id: teacherInfo.value.id
          })
          if (res.success && res.data) {
            message.success(t('settings.personal.updateSuccess'))
            showTeacherModal.value = false
            // 刷新store中的用户角色信息
            await userStore.fetchUserRoleInfo(userInfo.value?.id || '')
          } else {
            message.error(res.message || t('settings.personal.updateFail'))
          }
        } else {
          // 添加教师信息
          const res = await addTeacher(teacherForm)
          if (res.success && res.data) {
            message.success(t('settings.personal.bindSuccess'))
            showTeacherModal.value = false
            // 刷新store中的用户角色信息
            await userStore.fetchUserRoleInfo(userInfo.value?.id || '')
          } else {
            message.error(res.message || t('settings.personal.bindFail'))
          }
        }
      } catch (error) {
        console.error('保存教师信息失败:', error)
        message.error(t('settings.personal.bindFail'))
      }
    }
  })
}

// 保存学生信息
const saveStudentInfo = () => {
  // 在验证前先检查学籍状态
  console.log('保存前检查 - 学籍状态:', studentForm.academicStatus, typeof studentForm.academicStatus)

  studentFormRef.value?.validate(async (errors: any) => {
    if (!errors) {
      try {
        // 确保学籍状态数据正确传递
        const formData = {
          ...studentForm,
          // 确保学籍状态是数字类型
          academicStatus: typeof studentForm.academicStatus === 'number' ? studentForm.academicStatus : undefined
        }

        console.log('准备保存的数据:', formData)

        if (studentInfo.value) {
          // 更新学生信息
          const res = await updateStudent({
            ...formData,
            id: studentInfo.value.id
          })
          if (res.success && res.data) {
            message.success(t('settings.personal.updateSuccess'))
            showStudentModal.value = false
            // 刷新store中的用户角色信息
            await userStore.fetchUserRoleInfo(userInfo.value?.id || '')
          } else {
            message.error(res.message || t('settings.personal.updateFail'))
          }
        } else {
          // 添加学生信息
          const res = await addStudent(formData)
          if (res.success && res.data) {
            message.success(t('settings.personal.bindSuccess'))
            showStudentModal.value = false
            // 刷新store中的用户角色信息
            await userStore.fetchUserRoleInfo(userInfo.value?.id || '')
          } else {
            message.error(res.message || t('settings.personal.bindFail'))
          }
        }
      } catch (error) {
        console.error('保存学生信息失败:', error)
        message.error(t('settings.personal.bindFail'))
      }
    } else {
      console.log('表单验证失败:', errors)
    }
  })
}

// 暴露方法给父组件
defineExpose({})
</script>

<style lang="scss" scoped>
@use './BindingSettings.scss';
</style>
