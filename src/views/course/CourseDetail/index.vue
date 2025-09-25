<template>
  <div class="course-detail">
    <!-- 面包屑导航和操作按钮 -->
    <CourseBreadcrumb
        :course-info="courseInfo"
        :show-course-link="false"
    >
      <template #actions>
        <!-- 三个点操作按钮 -->
        <n-dropdown
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
        :title="$t('course.messages.loading')"
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
              v-if="teacherLoading"
              :title="$t('course.messages.loadingTeacher')"
              min-height="200px"
              size="medium"
          />
          <TeacherCard
              v-else-if="teacherInfo"
              :teacher-info="teacherInfo"
          />
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
          </div>

          <!-- 右列 -->
          <div class="form-column">
            <n-form-item :label="t('course.dialog.coverImage')" path="coverImageUrl">
              <ImageUpload
                  v-model="formData.coverImageUrl"
                  :aspect-ratio="16/9"
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
import type {CourseVO} from '@/types/course'
import type {TeacherVO} from '@/types/teacher'
import {getCourseStatusOptions, getCourseTypeOptions} from '@/enum/course'
import {useMenuStore} from '@/store'
import {createCourseDetailMenuOption} from '@/config/menu'
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

// 响应式数据
const loading = ref(false)
const courseInfo = ref<CourseVO | null>(null)
const teacherLoading = ref(false)
const teacherInfo = ref<TeacherVO | null>(null)
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
const courseTypeOptions = computed(() => getCourseTypeOptions(t))
const courseStatusOptions = computed(() => getCourseStatusOptions(t))

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
const addCourseDetailMenuItem = () => {
  if (courseInfo.value?.courseName) {
    const menuItem = createCourseDetailMenuOption(t, courseInfo.value.courseName)
    menuStore.addDynamicMenuItem(menuItem)
  }
}

const removeCourseDetailMenuItem = () => {
  menuStore.removeDynamicMenuItem('CourseDetail')
}

// 设置动态标题
const setCourseDetailTitle = () => {
  if (courseInfo.value?.courseName) {
    // 设置动态标题：课程名称 - 课程详情
    const courseDetailTitle = t('app.title.courseDetail')
    setTitle('courseDetail', `${courseInfo.value.courseName} - ${courseDetailTitle}`)
  } else {
    // 如果课程信息还未加载，使用默认标题
    setTitle('courseDetail')
  }
}

// 方法
const loadCourseInfo = async () => {
  try {
    loading.value = true

    // 检查courseId是否有效
    if (!courseId.value || courseId.value === 'undefined') {
      message.error('课程ID无效')
      router.push('/course')
      return
    }

    const res = await CourseApi.getCourseById(courseId.value)
    if (res.success && res.data) {
      courseInfo.value = res.data
      // 加载课程信息成功后，添加动态菜单项
      addCourseDetailMenuItem()
      // 设置动态标题
      setCourseDetailTitle()
      // 加载教师信息
      await loadTeacherInfo(courseId.value)
    } else {
      message.error(t('course.messages.loadFail'))
    }
  } catch (error) {
    message.error(t('course.messages.loadFail'))
  } finally {
    loading.value = false
  }
}

const loadTeacherInfo = async (courseId: string) => {
  if (!courseId) return

  try {
    teacherLoading.value = true
    // 直接使用开课教师的ID获取教师信息
    if (courseInfo.value?.teacherId) {
      const res = await TeacherApi.getTeacherById(courseInfo.value.teacherId)
      if (res.success && res.data) {
        teacherInfo.value = res.data
      }
    }
  } catch (error) {
    // 教师信息加载失败不显示错误，因为不是关键信息
  } finally {
    teacherLoading.value = false
  }
}

// 编辑课程
const handleEditCourse = async () => {
  if (!courseInfo.value) return

  // 填充表单数据
  formData.value = {
    id: courseInfo.value.id,
    courseName: courseInfo.value.courseName,
    teacherId: courseInfo.value.teacherId,
    assistantTeacherIds: courseInfo.value.assistantTeacherIds || [],
    description: courseInfo.value.description,
    coverImageUrl: courseInfo.value.coverImageUrl || '/src/assets/image/default-course.png',
    semester: courseInfo.value.semester,
    location: courseInfo.value.location,
    courseType: courseInfo.value.courseType,
    status: courseInfo.value.status
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
      try {
        const res = await CourseApi.removeCourseById(courseInfo.value!.id)
        if (res.success) {
          message.success(t('course.detailActions.deleteSuccess'))
          // 删除成功后跳转到课程列表页面
          router.push('/course/my-courses')
        } else {
          message.error(t('course.detailActions.deleteFail'))
        }
      } catch (error) {
        message.error(t('course.detailActions.deleteFail'))
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
  try {
    await formRef.value?.validate()
    editSubmitting.value = true

    await CourseApi.updateCourse(formData.value)
    message.success(t('course.actions.editSuccess'))

    showEditModal.value = false
    resetEditForm()

    // 重新加载课程信息
    await loadCourseInfo()
  } catch (error) {
    // 表单验证失败或API调用失败，不提交
  } finally {
    editSubmitting.value = false
  }
}

const resetEditForm = () => {
  formData.value = CourseApi.getDefaultCourseDTO()
  formRef.value?.restoreValidation()
}

// 教师选择器相关方法
const loadTeachersForForm = async () => {
  try {
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
  } catch (error) {
    // 处理错误
  } finally {
    teacherLoadingForForm.value = false
  }
}

const handleTeacherSearch = (_query: string) => {
  // 已加载所有教师，无需额外处理
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

// 生命周期
onMounted(async () => {
  await loadCourseInfo()
})

onUnmounted(() => {
  // 组件卸载时移除动态菜单项
  removeCourseDetailMenuItem()
  // 重置标题为默认标题
  setTitle('default')
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>

