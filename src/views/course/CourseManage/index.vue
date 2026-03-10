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
    <CourseFormDialog
        v-model:visible="showModal"
        :course-data="currentCourseData"
        :mode="modalMode"
        :show-fields="['courseName', 'courseType', 'teacherId', 'assistantTeacherIds', 'semester', 'location', 'status', 'isPublic', 'coverImageUrl', 'description']"
        form-layout="full"
        @cancel="handleFormCancel"
        @submit="handleFormSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, h, onMounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import type {DataTableColumns} from 'naive-ui'
import {useDialog, useMessage} from 'naive-ui'
import {CreateOutline, EyeOutline, TrashOutline} from '@vicons/ionicons5'
import type * as courseType from '@/types/course'
import {getCourseStatusLabel, getCourseTypeLabel} from '@/enum/course'
import {useI18n} from 'vue-i18n'
import {renderIcon} from '@/utils/iconUtil'
import PageTable from '@/components/common/PageTable.vue'
import * as courseApi from '@/api/course'
import {useUserStore} from '@/store/modules/user'
import {listMyCourseForStudent} from '@/api/course/courseStudent'
import CourseFormDialog from '../components/CourseFormDialog.vue'

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

// 根据角色选择使用的 API：管理员使用 listCourse（父级或默认）；教师使用 listCourse 查看所有课程；学生使用 listMyCourse 并带 studentId
const localCourseApiFunction = computed(() => {
  return async (params: any) => {
    // 管理员：优先判断管理员身份（即使该账号同时是教师）
    if (isAdmin.value) {
      const fn = props.courseApiFunction || courseApi.listCourse
      return fn(params)
    }

    // 教师：调用 listCourse 查看所有课程（仅限非管理员的教师）
    if (userStore.teacherInfo?.id) {
      const fn = props.courseApiFunction || courseApi.listCourse
      return fn(params)
    }

    // 学生：调用我的课程接口，并确保传入 studentId（仅限非管理员的学生）
    const query = {...params, studentId: userStore.studentInfo?.id}
    const res: any = await listMyCourseForStudent(query)
    // 将 MyCourseVO[] 映射为 CourseVO[]，以兼容表格组件预期的数据结构
    if (res && Array.isArray(res.data)) {
      const mapped = (res.data as any[]).map(item => item?.courseVO).filter(Boolean)
      return {...res, data: mapped}
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

// 数据更新处理函数
function onDataUpdate(data: courseType.CourseVO[]) {
  emit('update:data', data)
}

// 编辑课程
function handleEdit(course: courseType.CourseVO) {
  modalMode.value = 'edit'
  currentCourseData.value = course
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

// 表单提交处理
async function handleFormSubmit(formData: courseType.CourseDTO) {
  if (modalMode.value === 'add') {
    await courseApi.addCourse(formData)
    message.success(t('course.actions.addSuccess'))
  } else {
    await courseApi.updateCourse(formData)
    message.success(t('course.actions.editSuccess'))
  }

  showModal.value = false
  refresh()
}

// 表单取消处理
function handleFormCancel() {
  showModal.value = false
}

// 打开添加模态框
function openAddModal() {
  modalMode.value = 'add'
  currentCourseData.value = undefined
  showModal.value = true
}

// 组件挂载时加载教师列表
onMounted(() => {
  // 管理员：不需要设置任何过滤条件
  if (isAdmin.value) return
  // 教师：不需要设置 teacherId，可以查看所有课程
  if (userStore.teacherInfo?.id) {
    return
  }
  // 学生：需要设置 studentId（仅限非管理员且非教师的学生）
  if (userStore.studentInfo?.id) {
    ;(props.searchForm as any).studentId = userStore.studentInfo.id
  }
})

// 暴露方法给父组件
defineExpose({
  refresh,
  reset,
  fetchData: () => pageTableRef.value?.fetchData(),
  openAddModal
})
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
