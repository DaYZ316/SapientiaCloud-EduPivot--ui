<template>
  <div class="course-detail">
    <!-- 面包屑导航和操作按钮 -->
    <CourseBreadcrumb
        :course-info="courseInfo"
        :show-course-link="false"
    >
      <template #actions>
        <!-- 三个点操作按钮 - 只有开课教师或管理员可见 -->
        <n-dropdown
            v-if="canEditOrDelete"
            :options="actionOptions"
            placement="bottom-end"
            trigger="click"
            @select="handleActionSelect"
        >
          <n-button circle class="action-button" quaternary>
            <template #icon>
              <n-icon>
                <EllipsisHorizontalOutline/>
              </n-icon>
            </template>
          </n-button>
        </n-dropdown>
      </template>
    </CourseBreadcrumb>

    <!-- 加载状态 -->
    <LoadingSpinner
        v-if="loading"
        :title="t('course.messages.loading')"
        min-height="400px"
        size="large"
    />

    <!-- 课程详情内容 -->
    <div v-else-if="courseInfo" class="course-detail-content">
      <div class="content-layout">
        <!-- 左侧课程信息 -->
        <div class="course-section">
          <!-- 使用CourseCard组件显示课程信息 -->
          <CourseCard :course-info="courseInfo"/>

          <!-- 教师跑马灯和学生计数器容器 -->
          <div class="teacher-student-container">
            <!-- 学生和教师数量计数器 -->
            <StudentTeacherCounter
                :course-id="courseId"
                :teacher-count="totalTeachers"
                :teacher-loading="teacherDataLoading"
            />

            <!-- 教师跑马灯组件 -->
            <TeacherMarquee
                :course-id="courseId"
                :loading="teacherDataLoading"
                :main-teacher-id="courseInfo?.teacherId"
                :teachers="courseTeachers"
            />
          </div>

          <!-- 学生加课趋势折线图 -->
          <div class="enrollment-chart-container">
            <EnrollmentChart :course-id="courseId" :course-type="courseInfo?.courseType"/>
          </div>

          <!-- 统计图表容器 -->
          <div class="charts-container">
            <!-- 教师学历分布饼图 -->
            <div class="education-chart-container">
              <TeacherEducationChart
                  :course-id="courseId"
                  :course-type="courseInfo?.courseType"
                  :data="teacherEducationData"
                  :loading="teacherDataLoading"
              />
            </div>

            <!-- 学生状态分布饼图 -->
            <div class="student-status-chart-container">
              <StudentStatusChart :course-id="courseId" :course-type="courseInfo?.courseType"/>
            </div>
          </div>
        </div>

        <!-- 右侧教师信息 -->
        <div class="teacher-section">
          <LoadingSpinner
              v-if="teacherDataLoading"
              :title="t('course.messages.loadingTeacher')"
              min-height="200px"
              size="medium"
          />
          <TeacherCard v-else-if="courseInfo"/>
          <div v-else class="teacher-empty">
            <n-empty description="暂无教师信息"/>
          </div>

          <!-- 课程功能导航按钮 -->
          <CourseNavigation :course-id="courseId"/>

          <!-- 学生成绩分布柱状图 -->
          <div class="grade-chart-container">
            <StudentGradeChart :course-id="courseId" :course-type="courseInfo?.courseType"/>
          </div>
        </div>
      </div>

    </div>

    <!-- 分享课程对话框 -->
    <ShareCourseDialog
        v-model:visible="shareDialogVisible"
        :course-info="courseInfo"
    />

    <!-- 课程编辑对话框 -->
    <n-modal v-model:show="showEditModal" :title="t('course.dialog.editTitle')" preset="card" style="width: 900px">
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
                  :loading="teacherLoadingForForm"
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
                  :loading="teacherLoadingForForm"
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
                  :disabled="true"
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
                  @upload-success="handleCoverImageUploadSuccess"
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
          <n-button @click="handleEditCancel">{{ t('common.cancel') }}</n-button>
          <n-button :loading="editSubmitting" type="primary" @click="handleEditSubmit">
            {{ t('common.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>

  </div>
</template>

<script lang="ts" setup>
import {computed, h, nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useTitle} from '@/utils/titleUtil'
import type {FormInst, FormRules, SelectRenderLabel, SelectRenderTag} from 'naive-ui'
import {NTag, NText, useDialog, useMessage} from 'naive-ui'
import {CreateOutline, EllipsisHorizontalOutline, ShareSocialOutline, TrashOutline} from '@vicons/ionicons5'
import * as CourseApi from '@/api/course/course'
import * as TeacherApi from '@/api/teacher'
import type {TeacherVO} from '@/types/teacher'
import {CoursePublicEnum, getCourseStatusOptions, getCourseTypeOptions} from '@/enum/course'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import {useCourseStore, useMenuStore, useUserStore} from '@/store'
import TeacherCard from '../components/TeacherCard/TeacherCard.vue'
import CourseCard from '../components/CourseCard/CourseCard.vue'
import TeacherMarquee from '../components/TeacherMarquee.vue'
import StudentTeacherCounter from '../components/StudentTeacherCounter.vue'
import ShareCourseDialog from '../components/ShareCourseDialog.vue'
import TeacherEducationChart from '../components/TeacherEducationChart.vue'
import StudentStatusChart from '../components/StudentStatusChart.vue'
import EnrollmentChart from '../components/EnrollmentChart.vue'
import StudentGradeChart from '../components/StudentGradeChart.vue'
import CourseNavigation from '../components/CourseNavigation/CourseNavigation.vue'
import CourseBreadcrumb from '../components/CourseBreadcrumb/CourseBreadcrumb.vue'
import ImageUpload from '@/components/common/ImageUpload.vue'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import Icon from '@/components/common/Icon.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import {useTeacherEducationData} from '../composables/useTeacherEducationData'

// 路由和国际化
const route = useRoute()
const router = useRouter()
const {t} = useI18n()
const message = useMessage()
const dialog = useDialog()
const {setTitle} = useTitle()

// 菜单状态管理
const menuStore = useMenuStore()
const courseStore = useCourseStore()
const userStore = useUserStore()

// 响应式数据
const loading = ref(false)
const shareDialogVisible = ref(false)


// 编辑对话框相关状态
const showEditModal = ref(false)
const editSubmitting = ref(false)
const formRef = ref<FormInst | null>(null)
const formData = ref(CourseApi.getDefaultCourseDTO())

// 教师数据状态
const teacherOptions = ref<Array<{
  label: string;
  value: string;
  avatar?: string;
  department?: string;
  teacherCode?: string;
}>>([])
const teacherLoadingForForm = ref(false)

// 计算属性
const courseId = computed(() => route.params.courseId as string)
const courseInfo = computed(() => courseStore.currentCourseInfo)
const courseTypeOptions = computed(() => getCourseTypeOptions(t))
const courseStatusOptions = computed(() => getCourseStatusOptions(t))

// 判断当前用户是否有编辑/删除课程的权限（开课教师或管理员）
const canEditOrDelete = computed(() => {
  // 未登录则没有权限
  if (!userStore.isLogin) return false

  // 管理员有权限
  if (userStore.hasRole('ADMIN')) return true

  // 开课教师有权限
  if (userStore.teacherInfo && courseInfo.value?.teacherId) {
    return userStore.teacherInfo.id === courseInfo.value.teacherId
  }

  return false
})

// 统一管理教师数据，避免重复API调用
const {
  educationData: teacherEducationData,
  teachers: courseTeachers,
  totalTeachers,
  isLoading: teacherDataLoading
} = useTeacherEducationData(courseId.value)

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

// 操作选项
const actionOptions = computed(() => [
  {
    label: t('course.share.title'),
    key: 'share',
    icon: () => h(Icon, {component: ShareSocialOutline, size: 16})
  },
  {
    label: t('course.detailActions.edit'),
    key: 'edit',
    icon: () => h(Icon, {component: CreateOutline, size: 16})
  },
  {
    label: () => h('span', {style: {color: '#d03050'}}, t('course.detailActions.delete')),
    key: 'delete',
    icon: () => h(Icon, {component: TrashOutline, size: 16, color: '#d03050'}),
    type: 'error'
  }
])

// 处理操作选择
const handleActionSelect = (key: string) => {
  switch (key) {
    case 'share':
      shareDialogVisible.value = true
      break
    case 'edit':
      handleEditCourse()
      break
    case 'delete':
      handleDeleteCourse()
      break
    default:
      break
  }
}


// 菜单管理方法
// 更新最后访问的课程信息
const updateLastAccessedCourse = () => {
  if (courseInfo.value?.courseName) {
    menuStore.setLastAccessedCourse(courseInfo.value.id, courseInfo.value.courseName)
  }
}

// 设置动态标题
const setCourseDetailTitle = () => {
  if (courseInfo.value?.courseName) {
    // 设置动态标题：课程名称 - 课程详情
    const courseDetailTitle = t('app.title.course.courseDetail')
    setTitle('courseDetail', `${courseInfo.value.courseName} - ${courseDetailTitle}`)
  } else {
    // 如果课程信息还未加载，使用默认标题
    setTitle('courseDetail')
  }
}

// 方法
const loadCourseInfo = async () => {
  loading.value = true

  // 检查courseId是否有效
  if (!courseId.value || courseId.value === 'undefined') {
    router.push('/course')
    loading.value = false
    return
  }

  // 使用 courseStore 设置课程ID并获取课程信息
  await courseStore.setCurrentCourseId(courseId.value, true)

  // 加载课程信息成功后，更新最后访问的课程信息
  updateLastAccessedCourse()
  // 设置动态标题
  setCourseDetailTitle()
  // 不再主动调用教师详情 API，这里直接使用 courseStore.currentCourseInfo 中的数据

  loading.value = false
}

// 不再通过独立 API 加载教师信息，组件直接从 courseStore 获取教师数据

// 编辑课程
const handleEditCourse = async () => {
  if (!courseInfo.value) return

  // 填充表单数据
  formData.value = {
    id: courseInfo.value.id,
    courseName: courseInfo.value.courseName,
    teacherId: courseInfo.value.teacherId,
    assistantTeacherIds: courseInfo.value.assistantTeachers?.map((t: TeacherVO) => t.id).filter((id): id is string => id != null) || [],
    description: courseInfo.value.description,
    coverImageUrl: courseInfo.value.coverImageUrl || '/assets/image/default-course.png',
    semester: courseInfo.value.semester,
    location: courseInfo.value.location,
    courseType: courseInfo.value.courseType,
    status: courseInfo.value.status,
    isPublic: courseInfo.value.isPublic ?? CoursePublicEnum.PRIVATE
  }

  // 加载教师数据用于编辑表单
  await loadTeachersForForm()

  // 显示编辑对话框
  showEditModal.value = true
}

// 删除课程
const handleDeleteCourse = () => {
  if (!courseInfo.value) return

  dialog.warning({
    title: t('course.detailActions.deleteConfirm'),
    content: t('course.detailActions.deleteConfirmContent', {courseName: courseInfo.value.courseName}),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      const res = await CourseApi.removeCourseById(courseInfo.value!.id)
      if (res.success) {
        message.success(t('course.detailActions.deleteSuccess'))
        // 删除成功后跳转到课程列表页面
        router.push('/course/my-courses')
      }
    }
  })
}

// 编辑对话框相关方法
const handleEditCancel = () => {
  showEditModal.value = false
  resetEditForm()
}

const handleEditSubmit = async () => {
  await formRef.value?.validate()
  editSubmitting.value = true

  await CourseApi.updateCourse(formData.value)
  message.success(t('course.actions.editSuccess'))

  showEditModal.value = false
  resetEditForm()

  // 使用 courseStore 刷新课程信息
  await courseStore.refreshCourseInfo()
  // 更新最后访问的课程信息和标题
  updateLastAccessedCourse()
  setCourseDetailTitle()
  // 重新加载教师信息
  // 不再主动调用教师详情 API，这里直接使用 courseStore.currentCourseInfo 中的数据

  editSubmitting.value = false
}

const resetEditForm = () => {
  formData.value = CourseApi.getDefaultCourseDTO()
  formRef.value?.restoreValidation()
}

// 教师选择器相关方法
const loadTeachersForForm = async () => {
  teacherLoadingForForm.value = true
  const response = await TeacherApi.listAllTeacher()
  if (response.data) {
    teacherOptions.value = response.data.map((teacher: TeacherVO) => ({
      label: teacher.realName || teacher.teacherCode || '',
      value: teacher.id,
      avatar: teacher.avatar || null,
      department: teacher.department || null,
      teacherCode: teacher.teacherCode || null
    }))
  }
  teacherLoadingForForm.value = false
}

const handleTeacherSearch = (_query: string) => {
  // 已加载所有教师，无需额外处理
}

// 处理封面图片上传成功
const handleCoverImageUploadSuccess = (imageUrl: string) => {
  // 只取 URL 的 '?' 之前的部分给后端
  const urlWithoutQuery = imageUrl.split('?')[0]
  formData.value.coverImageUrl = urlWithoutQuery
}

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

// 监听编辑对话框显示状态，重置表单
watch(() => showEditModal.value, (show) => {
  if (show) {
    // 清除表单验证错误
    nextTick(() => {
      formRef.value?.restoreValidation()
    })
  }
})

// 监听课程信息变化，更新标题
watch(() => courseInfo.value?.courseName, () => {
  setCourseDetailTitle()
})

// 监听 courseId 变化，更新课程信息
watch(() => courseId.value, async (newCourseId) => {
  if (newCourseId && newCourseId !== 'undefined') {
    await loadCourseInfo()
  }
})

// 生命周期
onMounted(async () => {
  await loadCourseInfo()
})

onUnmounted(() => {
  // 重置标题为默认标题
  // 可以选择在组件卸载时清除当前课程信息
  // 如果希望在页面间切换时保持状态，可以注释掉以下代码
  // courseStore.setCurrentCourseId(null)
  setTitle('default')
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>