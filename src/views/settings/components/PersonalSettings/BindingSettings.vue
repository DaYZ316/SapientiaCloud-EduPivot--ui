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
import type {TeacherVO} from '@/types/teacher'
import type {StudentVO} from '@/types/student'
import {addTeacher, getTeacherByUserId, updateTeacher} from '@/api/teacher'
import {addStudent, getStudentByUserId, updateStudent} from '@/api/student'

const userStore = useUserStore()
const {message} = getDiscreteApi()
const {t} = useI18n()
const teacherFormRef = ref<FormInst | null>(null)
const studentFormRef = ref<FormInst | null>(null)
const showTeacherModal = ref(false)
const showStudentModal = ref(false)

// 使用计算属性获取用户信息
const userInfo = computed(() => userStore.userInfo)

// 教师和学生信息
const teacherInfo = ref<TeacherVO | null>(null)
const studentInfo = ref<StudentVO | null>(null)

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
const educationOptions = [
  {label: t('settings.personal.educationOptions.college'), value: 0},
  {label: t('settings.personal.educationOptions.bachelor'), value: 1},
  {label: t('settings.personal.educationOptions.master'), value: 2},
  {label: t('settings.personal.educationOptions.doctor'), value: 3}
]

// 学籍状态选项
const academicStatusOptions = [
  {label: t('settings.personal.academicStatusOptions.studying'), value: 0},
  {label: t('settings.personal.academicStatusOptions.suspension'), value: 1},
  {label: t('settings.personal.academicStatusOptions.dropout'), value: 2},
  {label: t('settings.personal.academicStatusOptions.graduated'), value: 3}
]

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
    {required: true, message: t('settings.personal.academicStatusRequired'), trigger: 'change'}
  ]
}

// 获取学历文本
function getEducationText(education?: number): string {
  if (education === null || education === undefined) return '-'
  const option = educationOptions.find(opt => opt.value === education)
  return option ? option.label : '-'
}

// 获取学籍状态文本
function getAcademicStatusText(status?: number): string {
  if (status === null || status === undefined) return '-'
  const option = academicStatusOptions.find(opt => opt.value === status)
  return option ? option.label : '-'
}

// 查询教师和学生信息
const fetchBindingInfo = async () => {
  if (!userInfo.value?.id) return

  try {
    // 并行查询教师和学生信息
    const [teacherRes, studentRes] = await Promise.all([
      getTeacherByUserId(userInfo.value.id),
      getStudentByUserId(userInfo.value.id)
    ])

    if (teacherRes.success && teacherRes.data) {
      teacherInfo.value = teacherRes.data
      console.log('教师信息获取成功:', teacherRes.data)
    }

    if (studentRes.success && studentRes.data) {
      studentInfo.value = studentRes.data
      console.log('学生信息获取成功:', studentRes.data)
      console.log('学籍状态原始值:', studentRes.data.academicStatus)
    }
  } catch (error) {
    console.error('查询绑定信息失败:', error)
  }
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
    studentForm.academicStatus = studentInfo.value.academicStatus
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
  console.log('学籍状态值:', studentInfo.value?.academicStatus)
  console.log('表单学籍状态:', studentForm.academicStatus)
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
            await fetchBindingInfo()
          } else {
            message.error(res.message || t('settings.personal.updateFail'))
          }
        } else {
          // 添加教师信息
          const res = await addTeacher(teacherForm)
          if (res.success && res.data) {
            message.success(t('settings.personal.bindSuccess'))
            showTeacherModal.value = false
            await fetchBindingInfo()
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
  studentFormRef.value?.validate(async (errors: any) => {
    if (!errors) {
      try {
        if (studentInfo.value) {
          // 更新学生信息
          const res = await updateStudent({
            ...studentForm,
            id: studentInfo.value.id
          })
          if (res.success && res.data) {
            message.success(t('settings.personal.updateSuccess'))
            showStudentModal.value = false
            await fetchBindingInfo()
          } else {
            message.error(res.message || t('settings.personal.updateFail'))
          }
        } else {
          // 添加学生信息
          const res = await addStudent(studentForm)
          if (res.success && res.data) {
            message.success(t('settings.personal.bindSuccess'))
            showStudentModal.value = false
            await fetchBindingInfo()
          } else {
            message.error(res.message || t('settings.personal.bindFail'))
          }
        }
      } catch (error) {
        console.error('保存学生信息失败:', error)
        message.error(t('settings.personal.bindFail'))
      }
    }
  })
}

// 暴露方法给父组件
defineExpose({
  fetchBindingInfo
})

// 初始化时查询绑定信息
fetchBindingInfo()
</script>

<style lang="scss" scoped>
.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mt-4 {
  margin-top: 16px;
}

.no-binding {
  text-align: center;
  padding: 40px 0;
}

.info-display {
  margin-bottom: 24px;

  .info-card {
    border-radius: 8px;
  }
}
</style>
