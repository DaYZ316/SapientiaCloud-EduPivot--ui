<template>
  <div class="course-forum">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        :course-info="courseInfo"
        :current-page="t('course.navigation.forum')"
    >
      <template #actions>
        <n-button
            v-if="isTeacher || userStore.hasRole('ADMIN')"
            type="primary"
            @click="showCreateForumDialog = true"
        >
          <template #icon>
            <Icon :component="PlusOutlined"/>
          </template>
          {{ t('course.forum.createForum') }}
        </n-button>
      </template>
    </CourseBreadcrumb>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <div>
        <n-form :model="searchForm" inline>
          <n-form-item :label="t('course.forum.forumName')">
            <n-input
                v-model:value="searchForm.forumName"
                :placeholder="t('course.forum.forumNamePlaceholder')"
                clearable
                style="width: 200px"
            />
          </n-form-item>
          <n-form-item :label="t('course.forum.forumTypeLabel')">
            <n-select
                v-model:value="searchForm.forumType"
                :options="forumTypeOptions"
                :placeholder="t('course.forum.forumTypePlaceholder')"
                clearable
                style="width: 180px"
            />
          </n-form-item>
          <n-form-item :label="t('course.forum.isPublic')">
            <n-select
                v-model:value="searchForm.isPublic"
                :options="isPublicOptions"
                :placeholder="t('course.forum.isPublicPlaceholder')"
                clearable
                style="width: 180px"
            />
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button type="primary" @click="handleSearch">
                <template #icon>
                  <Icon :component="SearchOutlined"/>
                </template>
                {{ t('common.search') }}
              </n-button>
              <n-button @click="handleReset">
                <template #icon>
                  <Icon :component="ReloadOutlined"/>
                </template>
                {{ t('common.reset') }}
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </div>
    </div>

    <!-- 论坛内容区域 -->
    <div class="forum-content">
      <!-- 论坛列表 -->
      <div class="forum-list">

        <!-- 论坛卡片列表 -->
        <div class="forum-cards">
          <n-card
              v-for="forum in forumList"
              :key="forum.id"
              class="forum-card"
              hoverable
              @click="selectForum(forum)"
          >
            <div class="forum-card-content">
              <div class="forum-info">
                <div class="forum-name">
                  <h3>{{ forum.forumName }}</h3>
                  <n-tag
                      :type="getForumTypeTagType(forum.forumType)"
                      size="small"
                  >
                    {{ getForumTypeLabel(forum.forumType || 0) }}
                  </n-tag>
                </div>
                <p class="forum-description">{{ forum.description || t('course.forum.noDescription') }}</p>
                <div class="forum-stats">
                  <n-space>
                    <span class="stat-item">
                      <Icon :component="FileTextOutlined"/>
                      {{ forum.postCount || 0 }} {{ t('course.forum.posts') }}
                    </span>
                    <span class="stat-item">
                      <Icon :component="MessageOutlined"/>
                      {{ forum.replyCount || 0 }} {{ t('course.forum.replies') }}
                    </span>
                    <span v-if="forum.lastPostTime" class="stat-item">
                      <Icon :component="ClockCircleOutlined"/>
                      {{ formatToBeijingTime(new Date(forum.lastPostTime)) }}
                    </span>
                  </n-space>
                </div>
              </div>

              <!-- 菜单按钮 -->
              <div v-if="isTeacher || userStore.hasRole('ADMIN')" class="forum-menu" @click.stop>
                <n-dropdown
                    :options="getForumMenuOptions()"
                    @select="(key: string | number) => handleForumMenuSelect(key, forum)"
                >
                  <n-button
                      circle
                      class="menu-trigger"
                      quaternary
                      size="small"
                  >
                    <template #icon>
                      <Icon :component="MoreOutlined"/>
                    </template>
                  </n-button>
                </n-dropdown>
              </div>
            </div>
          </n-card>
        </div>

        <!-- 空状态 -->
        <div v-if="forumList.length === 0" class="empty-state">
          <n-empty :description="t('course.forum.noForums')">
            <template #extra>
              <n-button
                  v-if="isTeacher"
                  type="primary"
                  @click="showCreateForumDialog = true"
              >
                {{ t('course.forum.createFirstForum') }}
              </n-button>
            </template>
          </n-empty>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div v-if="forumList.length > 0" class="pagination-container">
      <n-pagination
          v-model:page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-count="Math.ceil(pagination.total / pagination.pageSize)"
          :page-sizes="pagination.pageSizes"
          :show-quick-jumper="pagination.showQuickJumper"
          :show-size-picker="pagination.showSizePicker"
          :show-total="(total: number, range: [number, number]) => t('common.pagination.showTotal', { total, start: range[0], end: range[1] })"
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
      />
    </div>

    <!-- 创建论坛对话框 -->
    <n-modal v-model:show="showCreateForumDialog">
      <n-card
          :bordered="false"
          :title="t('course.forum.createForum')"
          aria-modal="true"
          role="dialog"
          size="huge"
          style="width: 600px"
      >
        <n-form
            ref="createForumFormRef"
            :model="createForumForm"
            :rules="createForumRules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
        >
          <n-form-item :label="t('course.forum.forumName')" path="forumName">
            <n-input
                v-model:value="createForumForm.forumName"
                :placeholder="t('course.forum.forumNamePlaceholder')"
            />
          </n-form-item>

          <n-form-item :label="t('course.forum.description')" path="description">
            <n-input
                v-model:value="createForumForm.description"
                :placeholder="t('course.forum.descriptionPlaceholder')"
                :rows="3"
                type="textarea"
            />
          </n-form-item>

          <n-form-item :label="t('course.forum.forumTypeLabel')" path="forumType">
            <n-select
                v-model:value="createForumForm.forumType"
                :options="forumTypeOptions"
                :placeholder="t('course.forum.forumTypePlaceholder')"
            />
          </n-form-item>

          <n-form-item :label="t('course.forum.isPublic')" path="isPublic">
            <n-radio-group v-model:value="createForumForm.isPublic">
              <n-space>
                <n-radio :value="0">{{ t('course.forum.private') }}</n-radio>
                <n-radio :value="1">{{ t('course.forum.public') }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item :label="t('course.forum.allowAnonymous')" path="allowAnonymous">
            <n-radio-group v-model:value="createForumForm.allowAnonymous">
              <n-space>
                <n-radio :value="0">{{ t('course.forum.disallow') }}</n-radio>
                <n-radio :value="1">{{ t('course.forum.allow') }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item :label="t('course.forum.rules')" path="rules">
            <n-input
                v-model:value="createForumForm.rules"
                :placeholder="t('course.forum.rulesPlaceholder')"
                :rows="4"
                type="textarea"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button @click="showCreateForumDialog = false">
              {{ t('common.cancel') }}
            </n-button>
            <n-button type="primary" @click="createForum">
              {{ t('common.confirm') }}
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>

    <!-- 编辑论坛对话框 -->
    <n-modal v-model:show="showEditForumDialog">
      <n-card
          :bordered="false"
          :title="t('course.forum.editForum')"
          aria-modal="true"
          role="dialog"
          size="huge"
          style="width: 600px"
      >
        <n-form
            ref="editForumFormRef"
            :model="editForumForm"
            :rules="editForumRules"
            label-placement="left"
            label-width="auto"
            require-mark-placement="right-hanging"
        >
          <n-form-item :label="t('course.forum.forumName')" path="forumName">
            <n-input
                v-model:value="editForumForm.forumName"
                :placeholder="t('course.forum.forumNamePlaceholder')"
            />
          </n-form-item>

          <n-form-item :label="t('course.forum.description')" path="description">
            <n-input
                v-model:value="editForumForm.description"
                :placeholder="t('course.forum.descriptionPlaceholder')"
                :rows="3"
                type="textarea"
            />
          </n-form-item>

          <n-form-item :label="t('course.forum.forumTypeLabel')" path="forumType">
            <n-select
                v-model:value="editForumForm.forumType"
                :options="forumTypeOptions"
                :placeholder="t('course.forum.forumTypePlaceholder')"
            />
          </n-form-item>

          <n-form-item :label="t('course.forum.isPublic')" path="isPublic">
            <n-radio-group v-model:value="editForumForm.isPublic">
              <n-space>
                <n-radio :value="0">{{ t('course.forum.private') }}</n-radio>
                <n-radio :value="1">{{ t('course.forum.public') }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item :label="t('course.forum.allowAnonymous')" path="allowAnonymous">
            <n-radio-group v-model:value="editForumForm.allowAnonymous">
              <n-space>
                <n-radio :value="0">{{ t('course.forum.disallow') }}</n-radio>
                <n-radio :value="1">{{ t('course.forum.allow') }}</n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>

          <n-form-item :label="t('course.forum.rules')" path="rules">
            <n-input
                v-model:value="editForumForm.rules"
                :placeholder="t('course.forum.rulesPlaceholder')"
                :rows="4"
                type="textarea"
            />
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space justify="end">
            <n-button @click="showEditForumDialog = false">
              {{ t('common.cancel') }}
            </n-button>
            <n-button type="primary" @click="updateForum">
              {{ t('common.confirm') }}
            </n-button>
          </n-space>
        </template>
      </n-card>
    </n-modal>

  </div>
</template>

<script lang="ts" setup>
import {computed, h, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store/modules/user'
import {useTitle} from '@/utils/titleUtil'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {formatToBeijingTime} from '@/utils/dateUtil'
import * as CourseApi from '@/api/course/course'
import * as CourseForumApi from '@/api/course/courseForum'
import {getDefaultCourseForumDTO, getDefaultCourseForumQuery} from '@/api/course/courseForum'
import type {CourseForumDTO, CourseForumQueryParams, CourseForumVO, CourseVO} from '@/types/course'
import type {FormInst, FormRules} from 'naive-ui'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'
import Icon from '@/components/common/Icon.vue'
import {ForumTypeEnum, getForumTypeOptions} from '@/enum/course/forumTypeEnum'
import {
  ClockCircleOutlined,
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  MessageOutlined,
  MoreOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined
} from '@vicons/antd'

// 路由和国际化
const route = useRoute()
const router = useRouter()
const {t} = useI18n()
const {setTitle} = useTitle()
const {message} = getDiscreteApi()
const userStore = useUserStore()

// 响应式数据
const courseInfo = ref<CourseVO | null>(null)
const forumList = ref<CourseForumVO[]>([])
const currentUserId = ref<string | null>(null)
const isTeacher = ref(false)

// 分页相关数据
const pagination = ref({
  pageNum: 1,
  pageSize: 12,
  total: 0,
  showSizePicker: true,
  pageSizes: [12, 24, 60, 120],
  showQuickJumper: true
})

// 查询参数
const queryParams = ref<CourseForumQueryParams>(getDefaultCourseForumQuery())

// 搜索表单数据
const searchForm = ref({
  forumName: null,
  forumType: null,
  isPublic: null
})

// 对话框状态
const showCreateForumDialog = ref(false)
const showEditForumDialog = ref(false)

// 表单引用
const createForumFormRef = ref<FormInst | null>(null)
const editForumFormRef = ref<FormInst | null>(null)

// 当前编辑的论坛
const currentEditForum = ref<CourseForumVO | null>(null)


// 创建论坛表单
const createForumForm = ref<CourseForumDTO>(getDefaultCourseForumDTO())

// 编辑论坛表单
const editForumForm = ref<CourseForumDTO>(getDefaultCourseForumDTO())


// 表单验证规则
const createForumRules = computed<FormRules>(() => ({
  forumName: [
    {required: true, message: t('course.forum.forumNameRequired'), trigger: 'blur'}
  ],
  forumType: [
    {required: true, type: 'number', message: t('course.forum.forumTypeRequired'), trigger: 'change'}
  ],
  isPublic: [
    {required: true, type: 'number', message: t('course.forum.isPublicRequired'), trigger: 'change'}
  ],
  allowAnonymous: [
    {required: true, type: 'number', message: t('course.forum.allowAnonymousRequired'), trigger: 'change'}
  ]
}))

// 编辑论坛验证规则
const editForumRules = computed<FormRules>(() => ({
  forumName: [
    {required: true, message: t('course.forum.forumNameRequired'), trigger: 'blur'}
  ],
  forumType: [
    {required: true, type: 'number', message: t('course.forum.forumTypeRequired'), trigger: 'change'}
  ],
  isPublic: [
    {required: true, type: 'number', message: t('course.forum.isPublicRequired'), trigger: 'change'}
  ],
  allowAnonymous: [
    {required: true, type: 'number', message: t('course.forum.allowAnonymousRequired'), trigger: 'change'}
  ]
}))


// 计算属性
const courseId = computed(() => route.params.courseId as string)

// 选项数据
const forumTypeOptions = computed(() => getForumTypeOptions(t))

// 公开性选项
const isPublicOptions = computed(() => [
  { label: t('course.forum.private'), value: 0 },
  { label: t('course.forum.public'), value: 1 }
])

// 设置动态标题
const setCourseForumTitle = () => {
  if (courseInfo.value?.courseName) {
    const courseForumTitle = t('app.title.course.courseForum')
    setTitle('courseForum', `${courseInfo.value.courseName} - ${courseForumTitle}`)
  } else {
    setTitle('courseForum')
  }
}

// 获取论坛类型标签
const getForumTypeLabel = (type: number) => {
  const typeMap: Record<number, string> = {
    [ForumTypeEnum.DISCUSSION]: t('course.forum.forumType.DISCUSSION'),
    [ForumTypeEnum.Q_AND_A]: t('course.forum.forumType.Q_AND_A'),
    [ForumTypeEnum.ASSIGNMENT]: t('course.forum.forumType.ASSIGNMENT'),
    [ForumTypeEnum.ANNOUNCEMENT]: t('course.forum.forumType.ANNOUNCEMENT')
  }
  return typeMap[type] || t('course.forum.forumType.DISCUSSION')
}

// 获取论坛类型标签颜色
const getForumTypeTagType = (type: number | undefined) => {
  if (type === undefined) return 'default'
  const typeMap: Record<number, string> = {
    [ForumTypeEnum.DISCUSSION]: 'info',
    [ForumTypeEnum.Q_AND_A]: 'success',
    [ForumTypeEnum.ASSIGNMENT]: 'warning',
    [ForumTypeEnum.ANNOUNCEMENT]: 'error'
  }
  return typeMap[type] || 'default'
}


// 获取论坛菜单选项
const getForumMenuOptions = () => {
  return [
    {
      label: t('course.forum.editForum'),
      key: 'edit',
      icon: () => h(Icon, {component: EditOutlined})
    },
    {
      label: () => h('span', {style: 'color: #d03050'}, t('course.forum.deleteForum')),
      key: 'delete',
      icon: () => h(Icon, {component: DeleteOutlined, color: '#d03050'})
    }
  ]
}

// 处理论坛菜单选择
const handleForumMenuSelect = (key: string | number, forum: CourseForumVO) => {
  if (key === 'edit') {
    editForum(forum)
  } else if (key === 'delete') {
    deleteForum(forum)
  }
}


// 加载课程信息
const loadCourseInfo = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    router.push('/course')
    return
  }

  const res = await CourseApi.getCourseById(courseId.value)
  if (res.success && res.data) {
    courseInfo.value = res.data
    setCourseForumTitle()
    // 加载论坛列表
    await loadForums()
  }
}

// 加载论坛列表
const loadForums = async () => {
  if (!courseId.value) return

  // 设置查询参数
  queryParams.value.courseId = courseId.value
  queryParams.value.pageNum = pagination.value.pageNum
  queryParams.value.pageSize = pagination.value.pageSize
  queryParams.value.forumName = searchForm.value.forumName
  queryParams.value.forumType = searchForm.value.forumType
  queryParams.value.isPublic = searchForm.value.isPublic

  const res = await CourseForumApi.listCourseForum(queryParams.value)
  if (res && res.data) {
    forumList.value = res.data || []
    pagination.value.total = res.total || 0
  }
}


// 选择论坛
const selectForum = (forum: CourseForumVO) => {
  // 使用路由跳转到论坛详情页面
  router.push({
    name: 'ForumDetail',
    params: {
      courseId: route.params.courseId,
      forumId: forum.id
    }
  })
}


// 创建论坛
const createForum = async () => {
  if (!createForumFormRef.value) return

  await createForumFormRef.value.validate()

  const forumData = {
    ...createForumForm.value,
    courseId: courseId.value,
    sortOrder: 0,
    status: 0
  }

  const res = await CourseForumApi.addCourseForum(forumData)
  if (res.success) {
    message.success(t('course.forum.createForumSuccess'))
    showCreateForumDialog.value = false
    resetCreateForumForm()
    await loadForums()
  }
}

// 编辑论坛
const editForum = (forum: CourseForumVO) => {
  currentEditForum.value = forum
  editForumForm.value = {
    id: forum.id,
    courseId: forum.courseId,
    forumName: forum.forumName,
    description: forum.description ?? null,
    forumType: forum.forumType ?? null,
    isPublic: forum.isPublic ?? null,
    allowAnonymous: forum.allowAnonymous ?? null,
    moderatorIds: forum.moderatorIds ?? null,
    sortOrder: forum.sortOrder ?? null,
    status: forum.status ?? null,
    rules: forum.rules ?? null,
    tags: forum.tags ?? null
  }
  showEditForumDialog.value = true
}

// 更新论坛
const updateForum = async () => {
  if (!editForumFormRef.value || !currentEditForum.value) return

  await editForumFormRef.value.validate()

  const forumData = {
    ...editForumForm.value,
    courseId: courseId.value
  }

  const res = await CourseForumApi.updateCourseForum(forumData)
  if (res.success) {
    message.success(t('course.forum.updateForumSuccess'))
    showEditForumDialog.value = false
    currentEditForum.value = null
    await loadForums()
  }
}

// 删除论坛
const deleteForum = async (forum: CourseForumVO) => {
  const {dialog} = getDiscreteApi()
  dialog.warning({
    title: t('common.confirm'),
    content: t('course.forum.deleteForumConfirm', {name: forum.forumName}),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      const res = await CourseForumApi.removeCourseForumById(forum.id!)
      if (res.success) {
        message.success(t('course.forum.deleteForumSuccess'))
        await loadForums()
      }
    }
  })
}

// 处理分页变化
const handlePageChange = (page: number) => {
  pagination.value.pageNum = page
  loadForums()
}

// 处理每页大小变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.value.pageSize = pageSize
  pagination.value.pageNum = 1 // 重置到第一页
  loadForums()
}

// 搜索论坛
const handleSearch = () => {
  pagination.value.pageNum = 1 // 重置到第一页
  loadForums()
}

// 重置搜索
const handleReset = () => {
  searchForm.value = {
    forumName: null,
    forumType: null,
    isPublic: null
  }
  pagination.value.pageNum = 1
  loadForums()
}


// 重置创建论坛表单
const resetCreateForumForm = () => {
  createForumForm.value = {
    id: null,
    courseId: null,
    forumName: null,
    description: null,
    forumType: null,
    isPublic: null,
    allowAnonymous: null,
    moderatorIds: null,
    sortOrder: null,
    status: null,
    rules: null,
    tags: null
  }
}


// 生命周期
onMounted(async () => {
  await loadCourseInfo()
  // 获取当前用户信息和权限
  currentUserId.value = userStore.userInfo?.id || null
  isTeacher.value = !!userStore.teacherInfo
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
