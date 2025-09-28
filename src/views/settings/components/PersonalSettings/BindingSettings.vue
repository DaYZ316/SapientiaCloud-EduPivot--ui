<template>
  <div>
    <!-- 教师信息表单 -->
    <div v-if="teacherInfo || showTeacherForm" class="form-section">
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
            <n-form-item :label="t('settings.personal.birthDate')" path="birthDate">
              <n-date-picker
                  v-model:value="teacherBirthDate"
                  :is-date-disabled="(date: number) => date > Date.now()"
                  :placeholder="t('settings.personal.birthDatePlaceholder')"
                  style="width: 100%"
                  type="date"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.department')" path="department">
              <n-input
                  v-model:value="teacherForm.department"
                  :placeholder="t('settings.personal.departmentPlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>

        <n-grid :cols="24" :x-gap="24">
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.education')" path="education">
              <n-select
                  v-model:value="teacherForm.education"
                  :options="educationOptions"
                  :placeholder="t('settings.personal.educationPlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item :span="12">
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

        <n-form-item>
          <n-space>
            <n-button :loading="loading" type="primary" @click="saveTeacherInfo">
              {{ teacherInfo ? t('common.save') : t('settings.personal.bindTeacher') }}
            </n-button>
            <n-button :disabled="loading" @click="resetTeacherForm">
              {{ t('common.reset') }}
            </n-button>
            <n-button v-if="!teacherInfo" @click="showTeacherForm = false">
              {{ t('common.cancel') }}
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </div>

    <!-- 学生信息表单 -->
    <div v-if="studentInfo || showStudentForm" class="form-section">
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
            <n-form-item :label="t('settings.personal.birthDate')" path="birthDate">
              <n-date-picker
                  v-model:value="studentBirthDate"
                  :is-date-disabled="(date: number) => date > Date.now()"
                  :placeholder="t('settings.personal.birthDatePlaceholder')"
                  style="width: 100%"
                  type="date"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.admissionYear')" path="admissionYear">
              <n-input-number
                  v-model:value="studentForm.admissionYear"
                  :max="2030"
                  :min="2000"
                  :placeholder="t('settings.personal.admissionYearPlaceholder')"
                  style="width: 100%"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>

        <n-grid :cols="24" :x-gap="24">
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.major')" path="major">
              <n-input
                  v-model:value="studentForm.major"
                  :placeholder="t('settings.personal.majorPlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item :span="12">
            <n-form-item :label="t('settings.personal.academicStatus')" path="academicStatus">
              <n-select
                  v-model:value="studentForm.academicStatus"
                  :options="academicStatusOptions"
                  :placeholder="t('settings.personal.academicStatusPlaceholder')"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>

        <n-form-item :label="t('settings.personal.description')" path="description">
          <n-input
              v-model:value="studentForm.description"
              :placeholder="t('settings.personal.descriptionPlaceholder')"
              :rows="3"
              type="textarea"
          />
        </n-form-item>

        <n-form-item>
          <n-space>
            <n-button :loading="loading" type="primary" @click="saveStudentInfo">
              {{ studentInfo ? t('common.save') : t('settings.personal.bindStudent') }}
            </n-button>
            <n-button :disabled="loading" @click="resetStudentForm">
              {{ t('common.reset') }}
            </n-button>
            <n-button v-if="!studentInfo" @click="showStudentForm = false">
              {{ t('common.cancel') }}
            </n-button>
          </n-space>
        </n-form-item>
      </n-form>
    </div>

    <!-- 无绑定信息时的提示 -->
    <div v-if="!teacherInfo && !studentInfo && !showTeacherForm && !showStudentForm" class="no-binding">
      <n-empty :description="t('settings.personal.noBinding')" size="large">
        <template #extra>
          <n-space>
            <n-button type="primary" @click="showTeacherForm = true">
              {{ t('settings.personal.bindTeacher') }}
            </n-button>
            <n-button type="info" @click="showStudentForm = true">
              {{ t('settings.personal.bindStudent') }}
            </n-button>
          </n-space>
        </template>
      </n-empty>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue'
import type {FormInst, FormRules} from 'naive-ui'
import {useUserStore} from '@/store'
import {useI18n} from 'vue-i18n'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import type {TeacherAddDTO} from '@/types/teacher'
import type {StudentAddDTO} from '@/types/student'
import {addTeacher, getDefaultTeacherAddDTO, getDefaultTeacherDTO, updateTeacher} from '@/api/teacher'
import {addStudent, getDefaultStudentAddDTO, getDefaultStudentDTO, updateStudent} from '@/api/student'
import {getAcademicStatusOptions} from '@/enum/student'
import {getEducationOptions} from '@/enum/teacher'

const userStore = useUserStore()
const {message} = getDiscreteApi()
const {t} = useI18n()
const teacherFormRef = ref<FormInst | null>(null)
const studentFormRef = ref<FormInst | null>(null)
const showTeacherForm = ref(false)
const showStudentForm = ref(false)
const loading = ref(false)

// 使用计算属性获取用户信息
const userInfo = computed(() => userStore.userInfo)

// 从store获取教师和学生信息
const teacherInfo = computed(() => userStore.teacherInfo)
const studentInfo = computed(() => userStore.studentInfo)

// 教师表单数据
const teacherForm = reactive<TeacherAddDTO>(getDefaultTeacherAddDTO())

// 学生表单数据
const studentForm = reactive<StudentAddDTO>(getDefaultStudentAddDTO())

// 学历选项
const educationOptions = computed(() => getEducationOptions(false))

// 学籍状态选项
const academicStatusOptions = computed(() => getAcademicStatusOptions(false))

// 将日期转换为API需要的格式 (YYYY-MM-DD)
function formatDateForAPI(date: number | string | null | undefined): string | null {
  if (!date) return null

  let dateObj: Date
  if (typeof date === 'number') {
    // 时间戳
    dateObj = new Date(date)
  } else if (typeof date === 'string') {
    // 字符串日期
    dateObj = new Date(date)
  } else {
    return null
  }

  if (isNaN(dateObj.getTime())) {
    return null
  }

  // 格式化为 YYYY-MM-DD
  const year = dateObj.getFullYear()
  const month = String(dateObj.getMonth() + 1).padStart(2, '0')
  const day = String(dateObj.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

// 将API返回的日期字符串转换为DatePicker需要的时间戳
function parseDateForPicker(date: string | null | undefined): number | null {
  if (!date) return null

  const dateObj = new Date(date)
  if (isNaN(dateObj.getTime())) {
    return null
  }
  return dateObj.getTime()
}

// 创建日期计算属性的通用函数
const createDateComputed = (form: any) => computed({
  get: () => parseDateForPicker(form.birthDate),
  set: (value: number | null) => {
    form.birthDate = value ? formatDateForAPI(value) : null
  }
})

// 教师和学生出生日期的计算属性
const teacherBirthDate = createDateComputed(teacherForm)
const studentBirthDate = createDateComputed(studentForm)

// 创建通用验证规则的函数
const createCommonRules = (codeField: string, codeMessage: string): FormRules => ({
  [codeField]: [
    {required: true, message: codeMessage, trigger: 'blur'}
  ],
  realName: [
    {required: true, message: t('settings.personal.realNameRequired'), trigger: 'blur'}
  ],
  birthDate: [
    {
      required: true,
      message: t('settings.personal.birthDateRequired'),
      trigger: 'change',
      validator: (_rule: any, value: any) => {
        if (!value) {
          return new Error(t('settings.personal.birthDateRequired'))
        }
        return true
      }
    }
  ]
})

// 教师和学生表单验证规则
const teacherRules: FormRules = createCommonRules('teacherCode', t('settings.personal.teacherCodeRequired'))
const studentRules: FormRules = {
  ...createCommonRules('studentCode', t('settings.personal.studentCodeRequired')),
  academicStatus: [
    {
      required: true,
      message: t('settings.personal.academicStatusRequired'),
      trigger: ['change', 'blur'],
      type: 'number'
    }
  ]
}

// 通用的表单初始化函数
const initForm = (form: any, info: any, getDefaultDTO: () => any) => {
  if (info.value) {
    // 编辑模式：从现有信息填充表单
    Object.assign(form, {
      ...info.value,
      sysUserId: info.value.sysUserId
    })
  } else {
    // 新增模式：使用默认值并设置用户ID
    Object.assign(form, getDefaultDTO())
    form.sysUserId = userInfo.value?.id || null
  }
}

// 初始化教师和学生表单
const initTeacherForm = () => initForm(teacherForm, teacherInfo, getDefaultTeacherAddDTO)
const initStudentForm = () => initForm(studentForm, studentInfo, getDefaultStudentAddDTO)

// 监听表单显示和信息变化的通用函数
const watchFormAndInfo = (showRef: any, info: any, initFn: () => void) => {
  // 监听表单显示事件
  watch(showRef, (newVal: boolean) => {
    if (newVal) {
      initFn()
    }
  })

  // 监听信息变化事件
  watch(info, (newVal) => {
    if (newVal) {
      showRef.value = true
      initFn()
    }
  }, {immediate: true})
}

// 监听教师和学生表单显示及信息变化
watchFormAndInfo(showTeacherForm, teacherInfo, initTeacherForm)
watchFormAndInfo(showStudentForm, studentInfo, initStudentForm)

// 通用的保存信息函数
const saveInfo = async (
    formRef: any,
    form: any,
    info: any,
    showRef: any,
    updateFn: (data: any) => Promise<any>,
    addFn: (data: any) => Promise<any>,
    getDefaultDTO: () => any,
    initFn: () => void
) => {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      const formattedForm = {
        ...form,
        birthDate: formatDateForAPI(form.birthDate)
      }

      let res
      if (info.value) {
        // 更新信息
        const updateData = {
          ...getDefaultDTO(),
          ...formattedForm,
          id: info.value.id
        }
        res = await updateFn(updateData)
        if (res.success && res.data) {
          message.success(t('settings.personal.updateSuccess'))
          // 更新成功后刷新用户信息
          await userStore.refreshUserInfo()
          // 重新初始化表单数据
          initFn()
        } else {
        }
      } else {
        // 添加信息
        res = await addFn(formattedForm)
        if (res.success && res.data) {
          message.success(t('settings.personal.bindSuccess'))
          showRef.value = false
          // 更新用户角色信息
          await userStore.fetchUserRoleInfo(userInfo.value?.id || '')
          // 重新初始化表单数据
          initFn()
        } else {
        }
      }
    }
  })
}

// 保存教师和学生信息
const saveTeacherInfo = () => saveInfo(
    teacherFormRef,
    teacherForm,
    teacherInfo,
    showTeacherForm,
    updateTeacher,
    addTeacher,
    getDefaultTeacherDTO,
    initTeacherForm
)

const saveStudentInfo = () => saveInfo(
    studentFormRef,
    studentForm,
    studentInfo,
    showStudentForm,
    updateStudent,
    addStudent,
    getDefaultStudentDTO,
    initStudentForm
)

// 重置表单
const resetTeacherForm = () => initTeacherForm()
const resetStudentForm = () => initStudentForm()

// 统一的初始化方法
const initForms = () => {
  initTeacherForm()
  initStudentForm()
}

// 暴露方法给父组件
defineExpose({
  resetTeacherForm,
  resetStudentForm,
  initForms
})
</script>

<style lang="scss" scoped>
.no-binding {
  text-align: center;
  padding: 40px 0;
}

.form-section {
  margin-bottom: 24px;
}
</style>