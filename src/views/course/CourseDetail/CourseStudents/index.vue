<template>
  <div class="course-students">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        :course-info="courseInfo"
        :current-page="t('course.navigation.students')"
    />

    <!-- 搜索表单 -->
    <div class="search-container">
      <n-form :model="searchForm" class="search-form" inline>
        <n-form-item :label="t('course.student.realName')" path="realName">
          <n-input
              v-model:value="searchForm.realName"
              :placeholder="t('course.student.searchPlaceholder')"
              clearable
              style="width: 300px;"
              @keyup.enter="handleSearch"
          >
            <template #prefix>
              <n-icon>
                <SearchOutlined/>
              </n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSearch">
            <template #icon>
              <n-icon>
                <SearchOutlined/>
              </n-icon>
            </template>
            {{ t('common.search') }}
          </n-button>
          <n-button class="search-reset-btn" @click="handleResetSearch">
            <template #icon>
              <n-icon>
                <CloseOutlined/>
              </n-icon>
            </template>
            {{ t('common.reset') }}
          </n-button>
        </n-form-item>
      </n-form>
    </div>

    <!-- 高级表格 -->
    <div class="table-container">
      <AdvancedTable
          :api-fn="fetchCourseStudents"
          :auto-load="true"
          :auto-search="true"
          :columns="tableColumns"
          :query-params="queryParams"
          @action-click="handleActionClick"
      />
    </div>

    <!-- 编辑学生信息对话框 -->
    <n-modal v-model:show="editDialogVisible" :show-icon="false" :title="t('course.student.editDialog.title')"
             preset="dialog">
      <n-form
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
          label-placement="left"
          label-width="100px"
      >
        <n-form-item :label="t('course.student.editDialog.grade')" path="grade">
          <n-input-number
              v-model:value="editForm.grade"
              :max="100"
              :min="0"
              :placeholder="t('course.student.editDialog.gradePlaceholder')"
              :precision="2"
              style="width: 100%"
          />
        </n-form-item>
        <n-form-item :label="t('course.student.editDialog.status')" path="status">
          <n-select
              v-model:value="editForm.status"
              :options="enrollmentStatusOptions"
              :placeholder="t('course.student.editDialog.statusRequired')"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-space>
          <n-button @click="editDialogVisible = false">
            {{ t('course.student.editDialog.cancel') }}
          </n-button>
          <n-button :loading="editLoading" type="primary" @click="handleEditConfirm">
            {{ t('course.student.editDialog.confirm') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useTitle} from '@/utils/titleUtil'
import {type FormInst, type FormRules, NButton, NForm, NFormItem, NIcon, NInput, useDialog, useMessage} from 'naive-ui'
import {CloseOutlined, SearchOutlined} from '@vicons/antd'
import {
  getDefaultCourseStudentDTO,
  getDefaultCourseStudentQuery,
  listCourseStudent,
  removeCourseStudentByStudentId,
  updateCourseStudent
} from '@/api/course/courseStudent'
import {getStudentById} from '@/api/student'
import type {CourseStudentDTO, CourseStudentQueryParams, CourseStudentVO} from '@/types/course'
import type {ActionClickEvent, AdvancedTableColumn} from '@/types/components'
import {EnrollmentStatusEnum, getEnrollmentStatusOptions} from '@/enum/course'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'
import AdvancedTable from '@/components/common/AdvancedTable.vue'
import {useCourseStore} from '@/store'

// 路由和国际化
const route = useRoute()
const router = useRouter()
const {t} = useI18n()
const {setTitle} = useTitle()
const message = useMessage()
const dialog = useDialog()
const courseStore = useCourseStore()

// 响应式数据
const courseInfo = computed(() => courseStore.currentCourseInfo)

// 搜索表单
const searchForm = reactive<CourseStudentQueryParams>(getDefaultCourseStudentQuery())

// 编辑对话框相关
const editDialogVisible = ref(false)
const editLoading = ref(false)
const editFormRef = ref<FormInst | null>(null)
const currentEditStudent = ref<CourseStudentVO | null>(null)

// 编辑表单数据
const editForm = ref<CourseStudentDTO>(getDefaultCourseStudentDTO())

// 选课状态选项
const enrollmentStatusOptions = computed(() => {
  const isEn = t('common.language') === 'en'
  return getEnrollmentStatusOptions(isEn)
})

// 编辑表单验证规则
const editFormRules = computed<FormRules>(() => ({
  grade: [
    {
      type: 'number',
      min: 0,
      max: 100,
      message: t('course.student.editDialog.gradeInvalid'),
      trigger: 'blur'
    }
  ],
  status: [
    {
      required: true,
      type: 'number',
      message: t('course.student.editDialog.statusRequired'),
      trigger: 'change'
    }
  ]
}))

// 计算属性
const courseId = computed(() => route.params.courseId as string)

// 查询参数
const queryParams = computed((): CourseStudentQueryParams => ({
  courseId: courseId.value,
  realName: searchForm.realName,
  pageNum: 1,
  pageSize: 10,
  orderByColumn: 'create_time',
  isAsc: 'desc',
  reasonable: true
}))

// 表格列定义
const tableColumns: AdvancedTableColumn[] = [
  {
    title: t('course.student.avatar'),
    key: 'avatar',
    type: 'avatar',
    width: 80,
    avatarSrcField: 'avatar',
    studentRealNameField: 'realName',
    avatarSize: 'medium'
  },
  {
    title: t('course.student.realName'),
    key: 'realName',
    field: 'realName',
    width: 120
  },
  {
    title: t('course.student.grade'),
    key: 'grade',
    field: 'grade',
    width: 100,
    render: (row: CourseStudentVO) => {
      return row.grade !== null && row.grade !== undefined ? row.grade : '-'
    }
  },
  {
    title: t('course.student.status'),
    key: 'status',
    type: 'status',
    width: 120,
    statusField: 'status',
    statusMap: {
      [EnrollmentStatusEnum.ENROLLED]: {
        label: t('course.enrollmentStatus.ENROLLED'),
        type: 'success'
      },
      [EnrollmentStatusEnum.DROPPED]: {
        label: t('course.enrollmentStatus.DROPPED'),
        type: 'error'
      },
      [EnrollmentStatusEnum.COMPLETED]: {
        label: t('course.enrollmentStatus.COMPLETED'),
        type: 'info'
      }
    }
  },
  {
    title: t('course.student.createTime'),
    key: 'createTime',
    field: 'createTime',
    width: 160
  },
  {
    title: t('common.action'),
    key: 'action',
    type: 'action',
    width: 200,
    fixed: 'right',
    actions: [
      {
        key: 'view',
        label: t('course.student.view'),
        type: 'primary',
        size: 'small',
        text: true
      },
      {
        key: 'edit',
        label: t('course.student.edit'),
        type: 'info',
        size: 'small',
        text: true
      },
      {
        key: 'remove',
        label: t('course.student.remove'),
        type: 'error',
        size: 'small',
        text: true,
        disabled: (row: CourseStudentVO) => row.status === EnrollmentStatusEnum.COMPLETED
      }
    ]
  }
]

// 设置动态标题
const setCourseStudentsTitle = () => {
  if (courseInfo.value?.courseName) {
    // 设置动态标题：课程名称 - 课程学生
    const courseStudentsTitle = t('app.title.course.courseStudents')
    setTitle('courseStudents', `${courseInfo.value.courseName} - ${courseStudentsTitle}`)
  } else {
    // 如果课程信息还未加载，使用默认标题
    setTitle('courseStudents')
  }
}

// 获取课程学生列表
const fetchCourseStudents = async (params: any) => {
  return await listCourseStudent(params as CourseStudentQueryParams)
}

// 处理操作按钮点击
const handleActionClick = async (event: ActionClickEvent) => {
  const {actionKey, row} = event

  switch (actionKey) {
    case 'view':
      // 查看学生个人主页
      if (!row.studentId) {
        message.warning(t('course.student.studentNotFound'))
        return
      }
      // 如果有sysUserId，直接跳转
      if (row.sysUserId) {
        router.push(`/user/${row.sysUserId}`)
        return
      }

      // 如果没有sysUserId但有studentId，先查询学生信息获取sysUserId
      try {
        const response = await getStudentById(row.studentId)
        if (response.success && response.data?.sysUserId) {
          router.push(`/user/${response.data.sysUserId}`)
        } else {
          message.warning(t('course.student.userLoggedOut'))
        }
      } catch (error) {
        message.warning(t('course.student.userLoggedOut'))
      }
      break
    case 'edit':
      // 编辑学生信息
      if (!row.studentId) {
        message.warning(t('course.student.studentNotFound'))
        return
      }
      // 检查用户是否已注销
      if (!row.sysUserId) {
        message.warning(t('course.student.userLoggedOut'))
        return
      }
      // 打开编辑对话框
      openEditDialog(row)
      break
    case 'remove':
      // 移除学生
      handleRemoveStudent(row)
      break
  }
}

// 搜索处理
const handleSearch = () => {
  // 触发表格重新加载数据
  // AdvancedTable组件会自动响应queryParams的变化
}

// 重置搜索处理
const handleResetSearch = () => {
  Object.assign(searchForm, getDefaultCourseStudentQuery())
  // 触发表格重新加载数据
  // AdvancedTable组件会自动响应queryParams的变化
}

// 方法
const loadCourseInfo = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    router.push('/course')
    return
  }

  await courseStore.setCurrentCourseId(courseId.value, true)
  // 设置动态标题
  setCourseStudentsTitle()
}

// 打开编辑对话框
const openEditDialog = (student: CourseStudentVO) => {
  currentEditStudent.value = student

  // 确保status是数字类型
  const statusValue = student.status !== undefined && student.status !== null
      ? Number(student.status)
      : null

  editForm.value = {
    ...getDefaultCourseStudentDTO(),
    studentId: student.studentId,
    courseId: student.courseId,
    grade: student.grade || null,
    status: statusValue
  }
  editDialogVisible.value = true
}

// 处理编辑确认
const handleEditConfirm = async () => {
  if (!editFormRef.value) return

  await editFormRef.value.validate()
  editLoading.value = true

  const res = await updateCourseStudent(editForm.value)
  if (res.success) {
    message.success(t('course.student.editDialog.editSuccess'))
    editDialogVisible.value = false
    // 刷新表格数据
    // 这里可以通过事件通知AdvancedTable组件刷新数据
    window.location.reload() // 临时方案，后续可以优化为事件通知
  } else {
  }
  editLoading.value = false
}

// 处理删除学生
const handleRemoveStudent = (student: CourseStudentVO) => {
  if (!student.studentId) {
    message.warning(t('course.student.studentNotFound'))
    return
  }

  dialog.warning({
    title: t('course.student.removeConfirm'),
    content: t('course.student.removeConfirmContent', {studentName: student.realName || '未知学生'}),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      const res = await removeCourseStudentByStudentId(student.studentId!, courseId.value)
      if (res.success) {
        message.success(t('course.student.removeSuccess'))
        // 刷新表格数据
        window.location.reload() // 临时方案，后续可以优化为事件通知
      } else {
      }
    }
  })
}

// 生命周期
onMounted(async () => {
  await loadCourseInfo()
})
</script>

<style lang="scss" scoped>
@use './index.scss';

.search-container {
  margin: 20px 0;

  .search-form {
    .search-reset-btn {
      margin-left: 8px;
    }
  }
}

.table-container {
  margin-top: 20px;
}
</style>