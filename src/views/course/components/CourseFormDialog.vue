<template>
  <n-modal
      v-model:show="localVisible"
      :style="{ width: modalWidth }"
      :title="modalTitle"
      preset="card"
      @update:show="handleUpdateShow"
  >
    <n-form
        ref="formRef"
        :model="localFormData"
        :rules="formRules"
        :style="{ maxWidth: formMaxWidth }"
    >
      <!-- 完整表单布局（两列） -->
      <div v-if="formLayout === 'full'" class="form-grid">
        <!-- 左列 -->
        <div class="form-column">
          <n-form-item v-if="showFields.includes('courseName')" :label="t('course.dialog.courseName')"
                       path="courseName">
            <n-input
                v-model:value="localFormData.courseName"
                :placeholder="t('course.dialog.courseNamePlaceholder')"
                clearable
            />
          </n-form-item>

          <n-form-item v-if="showFields.includes('courseType')" :label="t('course.dialog.courseType')"
                       path="courseType">
            <n-select
                v-model:value="localFormData.courseType"
                :options="courseTypeOptions"
                :placeholder="t('course.dialog.courseTypePlaceholder')"
                clearable
            />
          </n-form-item>

          <n-form-item v-if="showFields.includes('teacherId')" :label="t('course.dialog.teacherId')" path="teacherId">
            <n-select
                v-model:value="localFormData.teacherId"
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

          <n-form-item v-if="showFields.includes('assistantTeacherIds')" :label="t('course.dialog.assistantTeachers')"
                       path="assistantTeacherIds">
            <n-select
                v-model:value="localFormData.assistantTeacherIds"
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

          <n-form-item v-if="showFields.includes('semester')" :label="t('course.dialog.semester')" path="semester">
            <n-input
                v-model:value="localFormData.semester"
                :placeholder="t('course.dialog.semesterPlaceholder')"
                clearable
            />
          </n-form-item>

          <n-form-item v-if="showFields.includes('location')" :label="t('course.dialog.location')" path="location">
            <n-input
                v-model:value="localFormData.location"
                :placeholder="t('course.dialog.locationPlaceholder')"
                clearable
            />
          </n-form-item>

          <n-form-item v-if="showFields.includes('status')" :label="t('course.dialog.status')" path="status">
            <n-select
                v-model:value="localFormData.status"
                :options="courseStatusOptions"
                :placeholder="t('course.dialog.statusPlaceholder')"
                clearable
            />
          </n-form-item>

          <n-form-item v-if="showFields.includes('isPublic')" :label="t('course.dialog.isPublic')" path="isPublic">
            <n-switch
                v-model:value="localFormData.isPublic"
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
          <n-form-item v-if="showFields.includes('coverImageUrl')" :label="t('course.dialog.coverImage')"
                       path="coverImageUrl">
            <ImageUpload
                v-model="localFormData.coverImageUrl"
                :aspect-ratio="16/9"
                :bucket-code="BusinessBucketCodeEnum.COURSE_PUBLIC"
                :crop-size="400"
                :round="false"
                :show-crop="true"
                :size="120"
                upload-dir="course-covers"
            />
          </n-form-item>

          <n-form-item v-if="showFields.includes('description')" :label="t('course.dialog.description')"
                       path="description">
            <n-input
                v-model:value="localFormData.description"
                :placeholder="t('course.dialog.descriptionPlaceholder')"
                :rows="8"
                clearable
                type="textarea"
            />
          </n-form-item>
        </div>
      </div>

      <!-- 简化表单布局（单列） -->
      <div v-else class="simple-form-layout">
        <n-form-item v-if="showFields.includes('courseName')" :label="t('course.dialog.courseName')" path="courseName">
          <n-input
              v-model:value="localFormData.courseName"
              :placeholder="t('course.dialog.courseNamePlaceholder')"
              clearable
          />
        </n-form-item>

        <n-form-item v-if="showFields.includes('courseType')" :label="t('course.dialog.courseType')" path="courseType">
          <n-select
              v-model:value="localFormData.courseType"
              :options="courseTypeOptions"
              :placeholder="t('course.dialog.courseTypePlaceholder')"
              clearable
          />
        </n-form-item>

        <n-form-item v-if="showFields.includes('semester')" :label="t('course.dialog.semester')" path="semester">
          <n-input
              v-model:value="localFormData.semester"
              :placeholder="t('course.dialog.semesterPlaceholder')"
              clearable
          />
        </n-form-item>

        <n-form-item v-if="showFields.includes('location')" :label="t('course.dialog.location')" path="location">
          <n-input
              v-model:value="localFormData.location"
              :placeholder="t('course.dialog.locationPlaceholder')"
              clearable
          />
        </n-form-item>

        <n-form-item v-if="showFields.includes('description')" :label="t('course.dialog.description')"
                     path="description">
          <n-input
              v-model:value="localFormData.description"
              :placeholder="t('course.dialog.descriptionPlaceholder')"
              :rows="4"
              clearable
              type="textarea"
          />
        </n-form-item>
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
</template>

<script lang="ts" setup>
import {computed, h, nextTick, ref, watch} from 'vue'
import type {FormInst, FormRules, SelectRenderLabel, SelectRenderTag} from 'naive-ui'
import {NTag, NText} from 'naive-ui'
import type * as courseType from '@/types/course'
import type * as teacherType from '@/types/teacher'
import {
  CoursePublicEnum,
  getCourseStatusOptions,
  getCourseTypeOptions
} from '@/enum/course'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import {useI18n} from 'vue-i18n'
import ImageUpload from '@/components/common/ImageUpload.vue'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import * as teacherApi from '@/api/teacher'
import * as courseApi from '@/api/course'

const {t} = useI18n()

// Props
interface Props {
  visible: boolean
  mode?: 'add' | 'edit'
  courseData?: courseType.CourseVO | null
  formLayout?: 'full' | 'simple'
  showFields?: string[]
  modalWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'add',
  courseData: null,
  formLayout: 'full',
  showFields: () => ['courseName', 'courseType', 'teacherId', 'assistantTeacherIds', 'semester', 'location', 'status', 'isPublic', 'coverImageUrl', 'description'],
  modalWidth: '900px'
})

// Emits
interface Emits {
  (e: 'update:visible', value: boolean): void

  (e: 'submit', data: courseType.CourseDTO): void

  (e: 'cancel'): void
}

const emit = defineEmits<Emits>()

// 表单相关状态
const submitting = ref(false)
const formRef = ref<FormInst | null>(null)

// 表单数据
const localFormData = ref<courseType.CourseDTO>(courseApi.getDefaultCourseDTO())

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
const localVisible = computed({
  get: () => props.visible,
  set: (val) => emit('update:visible', val)
})

const modalTitle = computed(() =>
    props.mode === 'add' ? t('course.dialog.addTitle') : t('course.dialog.editTitle')
)

const formMaxWidth = computed(() =>
    props.formLayout === 'full' ? '840px' : '500px'
)

const modalMode = computed(() => props.mode)

const courseTypeOptions = computed(() => getCourseTypeOptions(t))
const courseStatusOptions = computed(() => getCourseStatusOptions(t))

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

// 加载教师列表
async function loadTeachers() {
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
  if (!teacherOptions.value || teacherOptions.value.length === 0) {
    loadTeachers()
  }
}

// 处理模态框显示状态更新
function handleUpdateShow(show: boolean) {
  if (!show) {
    resetForm()
    emit('cancel')
  }
}

// 取消按钮
function handleCancel() {
  localVisible.value = false
  resetForm()
  emit('cancel')
}

// 提交表单
async function handleSubmit() {
  await formRef.value?.validate()
  submitting.value = true

  emit('submit', localFormData.value)

  submitting.value = false
}

// 重置表单
function resetForm() {
  localFormData.value = courseApi.getDefaultCourseDTO()
  formRef.value?.restoreValidation()
}

// 监听课程数据变化，用于编辑模式
watch(() => props.courseData, (newData) => {
  if (newData && props.mode === 'edit') {
    localFormData.value = {
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
watch(() => props.visible, (show) => {
  if (show) {
    if (props.mode === 'add') {
      localFormData.value = courseApi.getDefaultCourseDTO()
    }
    // 如果需要加载教师
    if (props.showFields.includes('teacherId') || props.showFields.includes('assistantTeacherIds')) {
      loadTeachers()
    }
    nextTick(() => {
      formRef.value?.restoreValidation()
    })
  }
})

// 暴露方法给父组件
defineExpose({
  resetForm,
  formRef
})
</script>

<style lang="scss" scoped>
@use './CourseFormDialog.scss';
</style>
