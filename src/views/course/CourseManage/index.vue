<template>
  <div>
    <page-table
        ref="pageTableRef"
        :api-fn="localCourseApiFunction"
        :auto-search="false"
        :columns="columns"
        :query-params="searchForm"
        size="small"
        @update:data="onDataUpdate"
    />

    <!-- 课程表单模态框 -->
    <n-modal v-model:show="showModal" :title="modalTitle" preset="card" style="width: 900px">
      <n-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          :style="{ maxWidth: '840px' }"
      >
        <div class="form-grid">
          <!-- 左列 -->
          <div class="form-column">
            <n-form-item :label="t('course.dialog.courseName')" path="courseName">
              <n-input
                  v-model:value="formData.courseName"
                  :placeholder="t('course.dialog.courseNamePlaceholder')"
                  clearable
              />
            </n-form-item>

            <n-form-item :label="t('course.dialog.courseType')" path="courseType">
              <n-select
                  v-model:value="formData.courseType"
                  :options="courseTypeOptions"
                  :placeholder="t('course.dialog.courseTypePlaceholder')"
                  clearable
              />
            </n-form-item>

            <n-form-item :label="t('course.dialog.teacherId')" path="teacherId">
              <n-select
                  v-model:value="formData.teacherId"
                  :loading="teacherLoading"
                  :options="teacherOptions"
                  :placeholder="t('course.dialog.teacherIdPlaceholder')"
                  :render-label="renderTeacherLabel"
                  :render-tag="renderSingleTeacherTag"
                  clearable
                  filterable
                  remote
                  @search="handleTeacherSearch"
              />
            </n-form-item>

            <n-form-item :label="t('course.dialog.assistantTeachers')" path="assistantTeacherIds">
              <n-select
                  v-model:value="formData.assistantTeacherIds"
                  :loading="teacherLoading"
                  :options="teacherOptions"
                  :placeholder="t('course.dialog.assistantTeachersPlaceholder')"
                  :render-label="renderTeacherLabel"
                  :render-tag="renderMultipleTeacherTag"
                  clearable
                  filterable
                  multiple
                  remote
                  @search="handleTeacherSearch"
              />
            </n-form-item>

            <n-form-item :label="t('course.dialog.semester')" path="semester">
              <n-input
                  v-model:value="formData.semester"
                  :placeholder="t('course.dialog.semesterPlaceholder')"
                  clearable
              />
            </n-form-item>

            <n-form-item :label="t('course.dialog.location')" path="location">
              <n-input
                  v-model:value="formData.location"
                  :placeholder="t('course.dialog.locationPlaceholder')"
                  clearable
              />
            </n-form-item>

            <n-form-item :label="t('course.dialog.status')" path="status">
              <n-select
                  v-model:value="formData.status"
                  :options="courseStatusOptions"
                  :placeholder="t('course.dialog.statusPlaceholder')"
                  clearable
              />
            </n-form-item>

            <n-form-item :label="t('course.dialog.isPublic')" path="isPublic">
              <n-switch
                  v-model:value="formData.isPublic"
                  :checked-value="CoursePublicEnum.PUBLIC"
                  :disabled="modalMode === 'edit'"
                  :unchecked-value="CoursePublicEnum.PRIVATE"
              >
                <template #checked>{{ t('course.coursePublic.PUBLIC') }}</template>
                <template #unchecked>{{ t('course.coursePublic.PRIVATE') }}</template>
              </n-switch>
            </n-form-item>
          </div>

          <!-- 右列 -->
          <div class="form-column">
            <n-form-item :label="t('course.dialog.coverImage')" path="coverImageUrl">
              <ImageUpload
                  v-model="formData.coverImageUrl"
                  :aspect-ratio="16/9"
                  :bucket-code="BusinessBucketCodeEnum.COURSE_PUBLIC"
                  :crop-size="400"
                  :round="false"
                  :show-crop="true"
                  :size="120"
                  upload-dir="course-covers"
              />
            </n-form-item>

            <n-form-item :label="t('course.dialog.description')" path="description">
              <n-input
                  v-model:value="formData.description"
                  :placeholder="t('course.dialog.descriptionPlaceholder')"
                  :rows="8"
                  clearable
                  type="textarea"
              />
            </n-form-item>
          </div>
        </div>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="handleCancel">{{ t('common.cancel') }}</n-button>
          <n-button :loading="submitting" type="primary" @click="handleSubmit">
            {{ t('common.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, h, nextTick, onMounted, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import type {DataTableColumns, FormInst, FormRules, SelectRenderLabel, SelectRenderTag} from 'naive-ui'
import {NTag, NText, useDialog, useMessage} from 'naive-ui'
import {CreateOutline, EyeOutline, TrashOutline} from '@vicons/ionicons5'
import type * as courseType from '@/types/course'
import type * as teacherType from '@/types/teacher'
import {
  CoursePublicEnum,
  getCourseStatusLabel,
  getCourseStatusOptions,
  getCourseTypeLabel,
  getCourseTypeOptions
} from '@/enum/course'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import {useI18n} from 'vue-i18n'
import {renderIcon} from '@/utils/iconUtil'
import PageTable from '@/components/common/PageTable.vue'
import * as courseApi from '@/api/course'
import {useUserStore} from '@/store/modules/user'
import * as teacherApi from '@/api/teacher'
import { listMyCourseForStudent } from '@/api/course/courseStudent'
import ImageUpload from '@/components/common/ImageUpload.vue'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'

const {t} = useI18n()
const router = useRouter()
const dialog = useDialog()
const message = useMessage()

// Props
interface Props {
  searchForm: courseType.CourseQueryParams
  courseApiFunction: any
  isAdmin: boolean
}

const props = defineProps<Props>()
const userStore = useUserStore()
// 兼容父级传入的 isAdmin 与当前登录用户角色，优先判断管理员身份
const isAdmin = computed(() => {
  return props.isAdmin || userStore.hasRole('ADMIN')
})

// 根据角色选择使用的 API：管理员使用 listCourse（父级或默认）；教师使用 listMyCourseForTeacher；学生使用 listMyCourse 并带 studentId
const localCourseApiFunction = computed(() => {
  return async (params: any) => {
    // 管理员：优先判断管理员身份（即使该账号同时是教师）
    if (isAdmin.value) {
      const fn = props.courseApiFunction || courseApi.listCourse
      return fn(params)
    }

    // 教师：调用教师专用的我的课程接口（仅限非管理员的教师）
    if (userStore.teacherInfo?.id) {
      const fn = props.courseApiFunction || courseApi.listMyCourseForTeacher
      return fn(params)
    }

    // 学生：调用我的课程接口，并确保传入 studentId（仅限非管理员的学生）
    const query = { ...params, studentId: userStore.studentInfo?.id }
    const res: any = await listMyCourseForStudent(query)
    // 将 MyCourseVO[] 映射为 CourseVO[]，以兼容表格组件预期的数据结构
    if (res && Array.isArray(res.data)) {
      const mapped = (res.data as any[]).map(item => item?.courseVO).filter(Boolean)
      return { ...res, data: mapped }
    }
    return res
  }
})

// Emits
interface Emits {
  (e: 'update:data', data: courseType.CourseVO[]): void

  (e: 'edit', course: courseType.CourseVO): void

  (e: 'delete', course: courseType.CourseVO): void

  (e: 'refresh'): void
}

const emit = defineEmits<Emits>()

// 表单相关状态
const showModal = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const currentCourseData = ref<courseType.CourseVO | undefined>(undefined)
const submitting = ref(false)

// 表单引用
const formRef = ref<FormInst | null>(null)

// 表单数据
const formData = ref<courseType.CourseDTO>(courseApi.getDefaultCourseDTO())

// 教师数据状态
const teacherOptions = ref<Array<{
  label: string;
  value: string;
  avatar?: string;
  department?: string;
  teacherCode?: string;
}>>([])
const teacherLoading = ref(false)

// 表单验证规则
const formRules: FormRules = {
  courseName: [
    {required: true, message: t('course.validation.courseNameRequired'), trigger: 'blur'},
    {min: 2, max: 50, message: t('course.validation.courseNameLength'), trigger: 'blur'}
  ],
  courseType: [
    {required: true, type: 'number', message: t('course.validation.courseTypeRequired'), trigger: 'change'}
  ],
  teacherId: [
    {required: true, message: t('course.validation.teacherIdRequired'), trigger: 'change'}
  ],
  semester: [
    {max: 20, message: t('course.validation.semesterLength'), trigger: 'blur'}
  ],
  location: [
    {max: 100, message: t('course.validation.locationLength'), trigger: 'blur'}
  ],
  description: [
    {max: 500, message: t('course.validation.descriptionLength'), trigger: 'blur'}
  ]
}

// 计算属性
const modalTitle = computed(() =>
    modalMode.value === 'add' ? t('course.dialog.addTitle') : t('course.dialog.editTitle')
)

const courseTypeOptions = computed(() => getCourseTypeOptions(t))
const courseStatusOptions = computed(() => getCourseStatusOptions(t))

// 分页表格引用
const pageTableRef = ref()

// 表格列定义
const columns = computed((): DataTableColumns => [
  {title: t('course.table.courseName'), key: 'courseName'},
  {
    title: t('course.table.courseType'),
    key: 'courseType',
    render(rowData: any) {
      if (rowData.courseType === null || rowData.courseType === undefined) return '-'
      return getCourseTypeLabel(rowData.courseType, false)
    }
  },
  {
    title: t('course.table.courseStatus'),
    key: 'status',
    render(rowData: any) {
      if (rowData.status === null || rowData.status === undefined) return '-'
      return getCourseStatusLabel(rowData.status, false)
    }
  },
  {title: t('course.table.teacherName'), key: 'teacherName'},
  {title: t('course.table.semester'), key: 'semester'},
  {title: t('course.table.location'), key: 'location'},
  {title: t('course.table.createTime'), key: 'createTime', width: 180},
  {
    title: t('course.table.operation'),
    key: 'actions',
    width: 200,
    render(rowData: any) {
      const actions = []

      // 查看详情按钮 - 所有用户都可以查看
      actions.push(
          h(
              'button',
              {
                class: 'n-button n-button--text',
                style: {marginRight: '8px'},
                onClick: () => handleViewDetail(rowData)
              },
              [
                renderIcon(EyeOutline)(),
                ' ' + t('course.card.viewDetails')
              ]
          )
      )

      // 只有管理员才能编辑和删除课程
      if (isAdmin.value) {
        actions.push(
            h(
                'button',
                {
                  class: 'n-button n-button--text',
                  style: {marginRight: '8px'},
                  onClick: () => handleEdit(rowData)
                },
                [
                  renderIcon(CreateOutline)(),
                  ' ' + t('course.actions.edit')
                ]
            ),
            h(
                'button',
                {
                  class: 'n-button n-button--text',
                  onClick: () => handleDelete(rowData)
                },
                [
                  renderIcon(TrashOutline)(),
                  ' ' + t('course.actions.delete')
                ]
            )
        )
      }

      return actions
    }
  }
])

// 教师选择器渲染函数
const renderTeacherLabel: SelectRenderLabel = (option) => {
  return h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      },
      [
        h(AvatarDisplay, {
          avatarSrc: option.avatar as string,
          teacherRealName: option.label as string,
          size: 'small',
          round: true
        }),
        h(
            'div',
            {
              style: {
                marginLeft: '12px',
                padding: '4px 0'
              }
            },
            [
              h('div', null, [option.label as string]),
              h(
                  NText,
                  {depth: 3, tag: 'div'},
                  {
                    default: () => option.department || option.teacherCode || ''
                  }
              )
            ]
        )
      ]
  )
}

const renderSingleTeacherTag: SelectRenderTag = ({option}) => {
  return h(
      'div',
      {
        style: {
          display: 'flex',
          alignItems: 'center'
        }
      },
      [
        h(AvatarDisplay, {
          avatarSrc: option.avatar as string,
          teacherRealName: option.label as string,
          size: 24,
          round: true,
          avatarClass: 'mr-2',
          style: {
            marginTop: '4px'
          }
        }),
        h('span', {
          style: {
            marginLeft: '8px',
            lineHeight: '24px',
            fontSize: '13px'
          }
        }, option.label as string)
      ]
  )
}

const renderMultipleTeacherTag: SelectRenderTag = ({
                                                     option,
                                                     handleClose
                                                   }) => {
  return h(
      NTag,
      {
        style: {
          padding: '0 6px 0 4px'
        },
        round: true,
        closable: true,
        onClose: (e) => {
          e.stopPropagation()
          handleClose()
        }
      },
      {
        default: () =>
            h(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center'
                  }
                },
                [
                  h(AvatarDisplay, {
                    avatarSrc: option.avatar as string,
                    teacherRealName: option.label as string,
                    size: 22,
                    style: {
                      marginTop: '4px'
                    }
                  }),
                  h('span', {
                    style: {
                      marginLeft: '6px',
                      lineHeight: '22px',
                      fontSize: '12px'
                    }
                  }, option.label as string)
                ]
            )
      }
  )
}

// 数据更新处理函数
function onDataUpdate(data: courseType.CourseVO[]) {
  emit('update:data', data)
}

// 编辑课程
function handleEdit(course: courseType.CourseVO) {
  modalMode.value = 'edit'
  currentCourseData.value = course
  // 按需加载教师列表（避免页面进入时立即调用全量接口）
  loadTeachers()
  showModal.value = true
}

// 删除课程
function handleDelete(course: courseType.CourseVO) {
  dialog.warning({
    title: t('course.actions.deleteConfirm'),
    content: t('course.actions.deleteConfirmContent', {courseName: course.courseName}),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      emit('delete', course)
      message.success(t('course.actions.deleteSuccess'))
    }
  })
}

// 查看课程详情
function handleViewDetail(course: courseType.CourseVO) {
  router.push({name: 'CourseDetail', params: {courseId: course.id}})
}

// 刷新数据
function refresh() {
  pageTableRef.value?.fetchData()
}

// 重置搜索
function reset() {
  pageTableRef.value?.reset()
}

// 表单相关方法
function handleCancel() {
  showModal.value = false
  resetForm()
}

async function handleSubmit() {
  await formRef.value?.validate()
  submitting.value = true

  if (modalMode.value === 'add') {
    await courseApi.addCourse(formData.value)
    message.success(t('course.actions.addSuccess'))
  } else {
    await courseApi.updateCourse(formData.value)
    message.success(t('course.actions.editSuccess'))
  }

  showModal.value = false
  resetForm()
  refresh()
  submitting.value = false
}

async function loadTeachers() {
  // 支持按需或按查询加载：先获取全量，再根据 query 过滤（以兼容后端接口差异）
  teacherLoading.value = true
  const response = await teacherApi.listAllTeacher()
    if (response.data) {
      let data = response.data as teacherType.TeacherVO[]
      teacherOptions.value = data.map((teacher: teacherType.TeacherVO) => ({
        label: teacher.realName || teacher.teacherCode || '',
        value: teacher.id as string,
        avatar: teacher.avatar || undefined,
        department: teacher.department || undefined,
        teacherCode: teacher.teacherCode || undefined
      }))
    } else {
      teacherOptions.value = []
    }
  teacherLoading.value = false
}

function handleTeacherSearch(_query: string) {
  // 仅在用户搜索或打开模态框时按需加载教师，避免页面进入时调用接口
  // 这里触发加载以保证下拉有数据（如果尚未加载）
  if (!teacherOptions.value || teacherOptions.value.length === 0) {
    loadTeachers()
  }
}

function resetForm() {
  formData.value = courseApi.getDefaultCourseDTO()
  formRef.value?.restoreValidation()
}

function openAddModal() {
  modalMode.value = 'add'
  currentCourseData.value = undefined
  // 打开模态框前按需加载教师
  loadTeachers()
  showModal.value = true
}

// 监听课程数据变化，用于编辑模式
watch(() => currentCourseData.value, (newData) => {
  if (newData && modalMode.value === 'edit') {
    formData.value = {
      id: newData.id,
      courseName: newData.courseName,
      teacherId: newData.teacherId,
    assistantTeacherIds: newData.assistantTeachers?.map((t: teacherType.TeacherVO) => t.id).filter((id): id is string => id != null) || [],
      description: newData.description,
      coverImageUrl: newData.coverImageUrl || '/assets/image/default-course.png',
      semester: newData.semester,
      location: newData.location,
      courseType: newData.courseType,
      status: newData.status,
      isPublic: newData.isPublic ?? CoursePublicEnum.PRIVATE
    }
  }
}, {immediate: true})

// 监听显示状态，重置表单
watch(() => showModal.value, (show) => {
  if (show) {
    if (modalMode.value === 'add') {
      formData.value = courseApi.getDefaultCourseDTO()
    }
    // 清除表单验证错误
    nextTick(() => {
      formRef.value?.restoreValidation()
    })
  }
})

// 组件挂载时加载教师列表
onMounted(() => {
  // 如果不是管理员，根据角色写入 teacherId 或 studentId 到父级 searchForm（优先判断管理员身份）
  if (isAdmin.value) return
  if (userStore.teacherInfo?.id) {
    ;(props.searchForm as any).teacherId = userStore.teacherInfo.id
  } else if (userStore.studentInfo?.id) {
    ;(props.searchForm as any).studentId = userStore.studentInfo.id
  }
})

// 暴露方法给父组件
defineExpose({
  refresh,
  reset,
  fetchData: () => pageTableRef.value?.fetchData(),
  openAddModal,
  resetForm
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
