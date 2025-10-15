<template>
  <div class="forum-detail-content">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        v-if="forum"
        :course-info="courseInfo"
        :current-page="forum.forumName"
        :show-course-link="true"
        :show-forum-option="true"
    >
      <template #actions>
        <n-button
            type="primary"
            @click="showCreatePostDialog = true"
        >
          <template #icon>
            <n-icon>
              <Add/>
            </n-icon>
          </template>
          {{ t('course.forum.createPost') }}
        </n-button>
      </template>
    </CourseBreadcrumb>

    <n-card v-if="!forum" class="no-selection-card">
      <n-empty :description="t('course.forum.selectForumToView')">
        <template #icon>
          <n-icon>
            <ChatbubblesOutline/>
          </n-icon>
        </template>
      </n-empty>
    </n-card>

    <n-card v-else class="forum-info-card">
      <!-- 论坛描述和统计信息 -->
      <div class="forum-header">
        <div class="forum-info-section">
          <p v-if="forum.description" class="forum-description">{{ forum.description }}</p>
          <div class="forum-meta">
            <n-tag
                :type="getForumTypeTagType(forum.forumType)"
                size="medium"
            >
              {{ getForumTypeLabel(forum.forumType || 0) }}
            </n-tag>
          </div>
        </div>
        <div class="posts-count-section">
          <div class="posts-count">
            <span class="count-number">{{ postTotal }}</span>
            <span class="count-label">{{ t('course.forum.posts') }}</span>
          </div>
        </div>
      </div>

      <!-- 帖子列表 -->
      <div class="posts-section">

        <!-- 帖子列表 -->
        <div class="posts-list">
          <n-empty v-if="postList.length === 0" :description="t('course.forum.noPosts')">
            <template #icon>
              <n-icon>
                <ChatbubblesOutline/>
              </n-icon>
            </template>
          </n-empty>

          <n-card
              v-for="post in postList"
              :key="post.id"
              :class="getPostCardClass(post)"
              hoverable
              @click="viewPostDetail(post)"
          >
            <!-- 动态标签显示 -->
            <div
                v-if="getPostLabelText(post)"
                :style="{ '--label-text': `'${getPostLabelText(post)}'` }"
                class="post-label"
            >
              {{ getPostLabelText(post) }}
            </div>

            <!-- 三点菜单 - 右上角 -->
            <div v-if="canEditPost(post)" class="post-actions-menu">
              <n-dropdown
                  :options="getPostActionOptions(post)"
                  :show-arrow="true"
                  trigger="click"
                  @select="(key) => handlePostAction(key, post)"
              >
                <n-button
                    circle
                    class="action-button"
                    quaternary
                    size="small"
                    @click.stop
                >
                  <template #icon>
                    <n-icon>
                      <EllipsisVertical/>
                    </n-icon>
                  </template>
                </n-button>
              </n-dropdown>
            </div>

            <div class="post-content">
              <div class="post-header">
                <div class="post-author">
                  <n-avatar
                      v-if="post.isAnonymous === 1"
                      :size="40"
                      :src="anonymousUserImg"
                      round
                      style="cursor: pointer;"
                      @click="handleAvatarClick(post)"
                  />
                  <AvatarDisplay
                      v-else
                      :avatar-src="post.userAvatar"
                      :username="post.userName"
                      size="medium"
                      style="cursor: pointer;"
                      @click="handleAvatarClick(post)"
                  />
                  <div class="author-info">
                    <span class="author-name">
                      {{ post.isAnonymous === 1 ? t('course.forum.anonymous') : (post.userName || '用户') }}
                    </span>
                    <span class="post-time">{{
                        post.createTime ? formatToBeijingTime(new Date(post.createTime)) : ''
                      }}</span>
                  </div>
                </div>
              </div>

              <div class="post-body">
                <div class="post-title-row">
                  <h4 class="post-title">{{ post.title }}</h4>
                </div>
                <div class="post-preview" v-html="getPostPreview(post.content)"></div>
              </div>

              <div class="post-footer">
                <div v-if="post.tags && post.tags.length > 0" class="post-tags">
                  <n-tag
                      v-for="tag in post.tags"
                      :key="tag"
                      size="small"
                      type="info"
                  >
                    {{ tag }}
                  </n-tag>
                </div>
                <div class="post-stats">
                  <span class="stat-item clickable" @click="handleLikeClick">
                    <n-icon><HeartOutline/></n-icon>
                    {{ post.likeCount || 0 }}
                  </span>
                  <span class="stat-item">
                    <n-icon><Eye/></n-icon>
                    {{ post.viewCount || 0 }}
                  </span>
                  <span class="stat-item">
                    <n-icon><Chatbubble/></n-icon>
                    {{ post.replyCount || 0 }}
                  </span>
                  <span class="stat-item">
                    <n-icon><Share/></n-icon>
                    {{ post.shareCount || 0 }}
                  </span>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <!-- 分页 -->
        <div class="pagination-wrapper">
          <n-pagination
              v-model:page="postQueryParams.pageNum"
              :item-count="postTotal"
              :page-size="postQueryParams.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :show-size-picker="true"
              @update:page="handlePageChange"
              @update:page-size="handlePageSizeChange"
          />
        </div>
      </div>

    </n-card>

    <!-- 创建帖子对话框 -->
    <n-modal
        v-model:show="showCreatePostDialog"
        :auto-focus="false"
        :bordered="false"
        :closable="true"
        :mask-closable="false"
        :style="{ width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' }"
        :title="t('course.forum.createPost')"
        preset="card"
        size="huge"
        transform-origin="center"
    >
      <div class="modal-content">
        <n-form
            ref="createPostFormRef"
            :model="createPostForm"
            :rules="createPostRules"
            class="fullscreen-form"
            label-placement="top"
            label-width="auto"
        >
          <!-- 标题和内容区域 -->
          <div class="form-main-content">
            <n-form-item :label="t('course.forum.postTitle')" class="title-item" path="title">
              <n-input
                  v-model:value="createPostForm.title"
                  :placeholder="t('course.forum.postTitlePlaceholder')"
                  size="large"
              />
            </n-form-item>

            <n-form-item :label="t('course.forum.postContent')" class="content-item" path="content">
              <RichTextEditor
                  v-model="postContent"
                  :max-height="'600px'"
                  :min-height="'400px'"
                  :placeholder="t('course.forum.postContentPlaceholder')"
                  class="fullscreen-editor"
              />
            </n-form-item>
          </div>

          <!-- 其他设置区域 -->
          <div class="form-settings">
            <n-row :gutter="24">
              <n-col :span="12">
                <n-form-item :label="t('course.forum.postTypeLabel')" path="postType">
                  <n-select
                      v-model:value="createPostForm.postType!"
                      :options="getPostTypeOptions(t)"
                      :placeholder="t('course.forum.postTypePlaceholder')"
                      size="large"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="12">
                <n-form-item :label="t('course.forum.isAnonymous')" path="isAnonymous">
                  <n-switch
                      v-model:value="createPostForm.isAnonymous!"
                      :checked-value="1"
                      :unchecked-value="0"
                      size="large"
                  />
                </n-form-item>
              </n-col>
            </n-row>

            <n-form-item :label="t('course.forum.tags')" path="tags">
              <n-dynamic-tags
                  v-model:value="createPostForm.tags!"
                  :placeholder="t('course.forum.tagsPlaceholder')"
                  size="large"
              />
            </n-form-item>
          </div>
        </n-form>

        <!-- 按钮区域 -->
        <div class="modal-actions">
          <n-space>
            <n-button @click="showCreatePostDialog = false">
              {{ t('common.cancel') }}
            </n-button>
            <n-button
                :loading="createPostLoading"
                type="primary"
                @click="createPost"
            >
              {{ t('common.confirm') }}
            </n-button>
          </n-space>
        </div>
      </div>
    </n-modal>

    <!-- 编辑帖子对话框 -->
    <n-modal
        v-model:show="showEditModal"
        :auto-focus="false"
        :bordered="false"
        :closable="true"
        :mask-closable="false"
        :style="{ width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' }"
        :title="t('course.forum.editPost')"
        preset="card"
        size="huge"
        transform-origin="center"
    >
      <div class="modal-content">
        <n-form
            ref="editFormRef"
            :model="editForm"
            :rules="editPostRules"
            class="fullscreen-form"
            label-placement="top"
            label-width="auto"
        >
          <!-- 标题和内容区域 -->
          <div class="form-main-content">
            <n-form-item :label="t('course.forum.postTitle')" class="title-item" path="title">
              <n-input
                  v-model:value="editForm.title"
                  :placeholder="t('course.forum.postTitlePlaceholder')"
                  size="large"
              />
            </n-form-item>

            <n-form-item :label="t('course.forum.postContent')" class="content-item" path="content">
              <RichTextEditor
                  v-model="editPostContent"
                  :max-height="'600px'"
                  :min-height="'400px'"
                  :placeholder="t('course.forum.postContentPlaceholder')"
                  class="fullscreen-editor"
              />
            </n-form-item>
          </div>

          <!-- 其他设置区域 -->
          <div class="form-settings">
            <n-row :gutter="24">
              <n-col :span="12">
                <n-form-item :label="t('course.forum.postTypeLabel')" path="postType">
                  <n-select
                      v-model:value="editForm.postType!"
                      :options="getPostTypeOptions(t)"
                      :placeholder="t('course.forum.postTypePlaceholder')"
                      size="large"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="12">
                <n-form-item :label="t('course.forum.isAnonymous')" path="isAnonymous">
                  <n-switch
                      v-model:value="editForm.isAnonymous!"
                      :checked-value="1"
                      :unchecked-value="0"
                      size="large"
                  />
                </n-form-item>
              </n-col>
            </n-row>

            <n-form-item :label="t('course.forum.tags')" path="tags">
              <n-dynamic-tags
                  v-model:value="editForm.tags!"
                  :placeholder="t('course.forum.tagsPlaceholder')"
                  size="large"
              />
            </n-form-item>
          </div>
        </n-form>

        <!-- 按钮区域 -->
        <div class="modal-actions">
          <n-space>
            <n-button :disabled="isEditing" @click="cancelEdit">
              {{ t('common.cancel') }}
            </n-button>
            <n-button
                :loading="isEditing"
                type="primary"
                @click="saveEditPost"
            >
              {{ t('common.save') }}
            </n-button>
          </n-space>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, h, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store/modules/user'
import anonymousUserImg from '@/assets/image/anonymous-user.png'
import {
  NAvatar,
  NButton,
  NCard,
  NDropdown,
  NDynamicTags,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NModal,
  NPagination,
  NSpace,
  NSwitch,
  NTag,
  useDialog,
  useMessage
} from 'naive-ui'
import {
  Add,
  Chatbubble,
  ChatbubblesOutline,
  CreateOutline,
  Diamond,
  DiamondOutline,
  EllipsisVertical,
  Eye,
  HeartOutline,
  Share,
  Star,
  StarOutline,
  TrashOutline
} from '@vicons/ionicons5'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import CourseBreadcrumb from '@/views/course/components/CourseBreadcrumb/CourseBreadcrumb.vue'
import {CourseForumVO} from '@/types/course/courseForum'
import {ForumPostDTO, ForumPostQueryParams, ForumPostVO} from '@/types/course/forumPost'
import {CourseVO} from '@/types/course'
import {getCourseForumById} from '@/api/course/courseForum'
import {
  addForumPost,
  getDefaultForumPostDTO,
  getDefaultForumPostQuery,
  listForumPost,
  removeForumPostById,
  setPostEssence,
  setPostTop,
  updateForumPost
} from '@/api/course/forumPost'
import {getCourseById} from '@/api/course'
import {formatToBeijingTime} from '@/utils/dateUtil'
import {ForumTypeEnum} from '@/enum/course/forumTypeEnum'
import {getPostTypeOptions} from '@/enum/course/postTypeEnum'

// 路由和国际化
const route = useRoute()
const router = useRouter()
const {t} = useI18n()
const message = useMessage()
const dialog = useDialog()
const userStore = useUserStore()

// 响应式数据
const forum = ref<CourseForumVO | null>(null)
const courseInfo = ref<CourseVO | null>(null)
const postList = ref<ForumPostVO[]>([])
const postTotal = ref(0)
const createPostLoading = ref(false)

// 表单引用
const showCreatePostDialog = ref(false)

// 权限判断
const isAdmin = computed(() => {
  return userStore.hasRole('ADMIN')
})


// 检查是否为论坛创建者
const isForumCreator = computed(() => {
  if (!forum.value || !userStore.userInfo) return false
  return forum.value.creatorId === userStore.userInfo.id
})

// 检查是否可以管理帖子（置顶、精华等操作）
const canManagePost = computed(() => {
  return isAdmin.value || isForumCreator.value
})

// 查询参数
const postQueryParams = ref<ForumPostQueryParams>(getDefaultForumPostQuery())

// 创建帖子表单
const createPostForm = ref<ForumPostDTO>(getDefaultForumPostDTO())

// 计算属性用于RichTextEditor
const postContent = computed({
  get: () => createPostForm.value.content || '',
  set: (value: string) => {
    createPostForm.value.content = value
  }
})


// 编辑帖子相关状态
const showEditModal = ref(false)
const editForm = ref<ForumPostDTO>(getDefaultForumPostDTO())
const editFormRef = ref()
const isEditing = ref(false)
const editingPost = ref<ForumPostVO | null>(null)

// 计算属性用于编辑表单的RichTextEditor
const editPostContent = computed({
  get: () => editForm.value.content || '',
  set: (value: string) => {
    editForm.value.content = value
  }
})

// 表单验证规则
const createPostRules = computed(() => ({
  title: [
    {required: true, message: t('course.forum.postTitleRequired'), trigger: 'blur'}
  ],
  content: [
    {required: true, message: t('course.forum.postContentRequired'), trigger: 'blur'}
  ],
  postType: [
    {required: true, type: 'number' as const, message: t('course.forum.postTypeRequired'), trigger: 'change'}
  ],
}))

// 编辑表单验证规则
const editPostRules = computed(() => ({
  title: [
    {required: true, message: t('course.forum.postTitleRequired'), trigger: 'blur'}
  ],
  content: [
    {required: true, message: t('course.forum.postContentRequired'), trigger: 'blur'}
  ],
  postType: [
    {required: true, type: 'number' as const, message: t('course.forum.postTypeRequired'), trigger: 'change'}
  ],
}))


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
const getForumTypeTagType = (type: number | undefined): 'default' | 'success' | 'error' | 'warning' | 'info' | 'primary' => {
  if (type === undefined) return 'default'
  const typeMap: Record<number, 'default' | 'success' | 'error' | 'warning' | 'info' | 'primary'> = {
    [ForumTypeEnum.DISCUSSION]: 'info',
    [ForumTypeEnum.Q_AND_A]: 'success',
    [ForumTypeEnum.ASSIGNMENT]: 'warning',
    [ForumTypeEnum.ANNOUNCEMENT]: 'error'
  }
  return typeMap[type] || 'default'
}


// 获取帖子预览内容
const getPostPreview = (content: string | null) => {
  if (!content) return ''
  // 移除HTML标签并截取前200个字符
  const textContent = content.replace(/<[^>]*>/g, '').trim()
  return textContent.length > 200 ? textContent.substring(0, 200) + '...' : textContent
}

// 获取帖子卡片样式类
const getPostCardClass = (post: ForumPostVO) => {
  const baseClass = 'post-card'
  const classes = [baseClass]

  if (post.isTop === 1) {
    classes.push('post-card--top')
  }

  if (post.isEssence === 1) {
    classes.push('post-card--essence')
  }

  // 如果是公告类型，添加公告样式
  if (post.postType === 1) {
    classes.push('post-card--announcement')
  }

  return classes.join(' ')
}

// 获取帖子标签文本
const getPostLabelText = (post: ForumPostVO) => {
  const isTop = post.isTop === 1
  const isEssence = post.isEssence === 1
  const isAnnouncement = post.postType === 1

  if (isAnnouncement && isTop && isEssence) {
    return t('course.forum.announcementTopEssence')
  } else if (isAnnouncement && isTop) {
    return t('course.forum.announcementTop')
  } else if (isAnnouncement && isEssence) {
    return t('course.forum.announcementEssence')
  } else if (isTop && isEssence) {
    return t('course.forum.topEssence')
  } else if (isTop) {
    return t('course.forum.topPost')
  } else if (isEssence) {
    return t('course.forum.essencePost')
  } else if (isAnnouncement) {
    return t('course.postType.ANNOUNCEMENT')
  }

  return ''
}


// 加载课程信息
const loadCourseInfo = async () => {
  const courseId = route.params.courseId as string
  if (!courseId) return

  try {
    const response = await getCourseById(courseId)
    if (response.code === 200) {
      courseInfo.value = response.data
    } else {
      message.error(response.message || t('course.loadCourseFailed'))
    }
  } catch (error) {
    message.error(t('course.loadCourseFailed'))
  }
}

// 加载论坛信息
const loadForum = async () => {
  const forumId = route.params.forumId as string
  const courseId = route.params.courseId as string
  if (!forumId) return

  try {
    const response = await getCourseForumById(forumId)
    if (response.code === 200) {
      forum.value = response.data
      postQueryParams.value.forumId = forumId
      postQueryParams.value.courseId = courseId
    } else {
      message.error(response.message || t('course.forum.loadForumFailed'))
    }
  } catch (error) {
    message.error(t('course.forum.loadForumFailed'))
  }
}

// 帖子排序函数
const sortPosts = (posts: ForumPostVO[]) => {
  return posts
}

// 加载帖子列表
const loadPosts = async () => {
  if (!postQueryParams.value.forumId) return

  try {
    const response = await listForumPost(postQueryParams.value) as any
    if (response.code === 200) {
      // 对帖子列表进行排序：置顶帖子优先，然后按时间倒序
      const sortedPosts = sortPosts(response.data)
      postList.value = sortedPosts
      postTotal.value = response.total
    } else {
      message.error(response.message || t('course.forum.loadPostsFailed'))
    }
  } catch (error) {
    message.error(t('course.forum.loadPostsFailed'))
  }
}


// 创建帖子
const createPost = async () => {
  if (!forum.value) return

  // 设置必要的字段
  createPostForm.value.forumId = forum.value.id
  createPostForm.value.courseId = route.params.courseId as string
  createPostForm.value.sysUserId = userStore.userInfo?.id || null
  createPostForm.value.status = 0 // 正常状态

  try {
    createPostLoading.value = true
    const response = await addForumPost(createPostForm.value)
    if (response.code === 200) {
      message.success(t('course.forum.createPostSuccess'))
      showCreatePostDialog.value = false
      resetCreatePostForm()
      loadPosts()
    } else {
      message.error(response.message || t('course.forum.createPostFailed'))
    }
  } catch (error) {
    message.error(t('course.forum.createPostFailed'))
  } finally {
    createPostLoading.value = false
  }
}

// 重置创建帖子表单
const resetCreatePostForm = () => {
  createPostForm.value = getDefaultForumPostDTO()
  createPostForm.value.isAnonymous = 0
  createPostForm.value.postType = null
}


// 查看帖子详情
const viewPostDetail = (post: ForumPostVO) => {
  router.push({
    name: 'PostDetail',
    params: {
      courseId: post.courseId,
      forumId: post.forumId,
      postId: post.id
    },
    query: {
      fromForum: 'true' // 标识从论坛页面进入
    }
  })
}

// 处理头像点击
const handleAvatarClick = (post: ForumPostVO) => {
  // 如果是匿名帖子，不跳转
  if (post.isAnonymous === 1) {
    message.info(t('course.forum.anonymousUser'))
    return
  }

  // 检查是否有sysUserId
  if (!post.sysUserId) {
    message.warning(t('course.forum.userNotFound'))
    return
  }

  // 跳转到用户主页
  router.push(`/user/${post.sysUserId}`)
}

// 检查是否可以编辑帖子
const canEditPost = (_post: ForumPostVO) => {
  // 这里应该根据实际业务逻辑判断
  // 比如：是作者本人或者是教师
  // 暂时返回true，实际应该从用户store获取当前用户信息
  return true
}

// 获取帖子操作选项
const getPostActionOptions = (post: ForumPostVO) => {
  const options = [
    {
      label: t('course.forum.sharePost'),
      key: 'share',
      icon: () => h(NIcon, null, {default: () => h(Share)})
    },
    {
      label: t('course.forum.editPost'),
      key: 'edit',
      icon: () => h(NIcon, null, {default: () => h(CreateOutline)})
    }
  ]

  // 只有有权限的用户才能看到置顶和精华选项
  if (canManagePost.value) {
    // 置顶/取消置顶选项
    options.push({
      label: post.isTop === 1 ? t('course.forum.cancelTopPost') : t('course.forum.setTopPost'),
      key: 'toggleTop',
      icon: () => h(NIcon, null, {
        default: () => h(post.isTop === 1 ? Star : StarOutline, {
          color: post.isTop === 1 ? '#ffa500' : undefined
        })
      })
    })

    // 精华/取消精华选项
    options.push({
      label: post.isEssence === 1 ? t('course.forum.cancelEssencePost') : t('course.forum.setEssencePost'),
      key: 'toggleEssence',
      icon: () => h(NIcon, null, {
        default: () => h(post.isEssence === 1 ? Diamond : DiamondOutline, {
          color: post.isEssence === 1 ? '#ff6b6b' : undefined
        })
      })
    })
  }

  // 删除选项
  options.push({
    label: () => h('span', {style: 'color: #d03050'}, t('course.forum.deletePost')),
    key: 'delete',
    icon: () => h(NIcon, {color: '#d03050'}, {default: () => h(TrashOutline)})
  } as any)

  return options
}

// 处理帖子操作
const handlePostAction = (key: string, post: ForumPostVO) => {
  switch (key) {
    case 'edit':
      editPost(post)
      break
    case 'share':
      sharePost(post)
      break
    case 'toggleTop':
      togglePostTop(post)
      break
    case 'toggleEssence':
      togglePostEssence(post)
      break
    case 'delete':
      deletePost(post)
      break
  }
}

// 编辑帖子
const editPost = (post: ForumPostVO) => {
  editingPost.value = post
  // 填充编辑表单
  editForm.value = {
    id: post.id,
    forumId: post.forumId,
    courseId: post.courseId,
    sysUserId: post.sysUserId,
    title: post.title,
    content: post.content,
    postType: post.postType ?? null,
    isAnonymous: post.isAnonymous ?? 0,
    attachmentUrls: post.attachmentUrls || [],
    imageUrls: post.imageUrls || [],
    tags: post.tags ?? [],
    isLocked: post.isLocked ?? 0,
    status: post.status ?? 0,
    chapterId: post.chapterId || null
  }
  showEditModal.value = true
}

// 分享帖子
const sharePost = (post: ForumPostVO) => {
  // 生成分享链接
  const shareUrl = `${window.location.origin}/course/${post.courseId}/forum/${post.forumId}/post/${post.id}`

  // 复制到剪贴板
  navigator.clipboard.writeText(shareUrl).then(() => {
    message.success(t('course.forum.shareLinkCopied'))
  }).catch(() => {
    // 如果复制失败，显示链接让用户手动复制
    dialog.info({
      title: t('course.forum.sharePost'),
      content: t('course.forum.shareLink') + ': ' + shareUrl,
      positiveText: t('common.confirm')
    })
  })
}

// 删除帖子
const deletePost = (post: ForumPostVO) => {
  // 显示确认对话框
  dialog.warning({
    title: t('common.confirm'),
    content: t('course.forum.confirmDeletePost'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await removeForumPostById(post.id)
        message.success(t('course.forum.deletePostSuccess'))
        // 重新加载帖子列表
        await loadPosts()
      } catch (error) {
        message.error(t('course.forum.deletePostFailed'))
      }
    }
  })
}

// 保存编辑的帖子
const saveEditPost = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()
    isEditing.value = true

    await updateForumPost(editForm.value)
    message.success(t('course.forum.editPostSuccess'))

    // 关闭编辑对话框
    showEditModal.value = false
    editingPost.value = null

    // 重新加载帖子列表
    await loadPosts()
  } catch (error) {
    message.error(t('course.forum.editPostFailed'))
  } finally {
    isEditing.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  showEditModal.value = false
  editingPost.value = null
  editForm.value = getDefaultForumPostDTO()
  editForm.value.postType = null
}

// 切换帖子置顶状态
const togglePostTop = async (post: ForumPostVO) => {
  try {
    const isTop = post.isTop === 1
    const response = await setPostTop(post.id, !isTop ? 1 : 0)
    if (response.code === 200) {
      message.success(isTop ? t('course.forum.cancelTopPostSuccess') : t('course.forum.setTopPostSuccess'))
      // 重新加载帖子列表
      await loadPosts()
    } else {
      message.error(response.message || (isTop ? t('course.forum.cancelTopPostFailed') : t('course.forum.setTopPostFailed')))
    }
  } catch (error) {
    message.error(post.isTop === 1 ? t('course.forum.cancelTopPostFailed') : t('course.forum.setTopPostFailed'))
  }
}

// 切换帖子精华状态
const togglePostEssence = async (post: ForumPostVO) => {
  try {
    const isEssence = post.isEssence === 1
    const response = await setPostEssence(post.id, !isEssence ? 1 : 0)
    if (response.code === 200) {
      message.success(isEssence ? t('course.forum.cancelEssencePostSuccess') : t('course.forum.setEssencePostSuccess'))
      // 重新加载帖子列表
      await loadPosts()
    } else {
      message.error(response.message || (isEssence ? t('course.forum.cancelEssencePostFailed') : t('course.forum.setEssencePostFailed')))
    }
  } catch (error) {
    message.error(post.isEssence === 1 ? t('course.forum.cancelEssencePostFailed') : t('course.forum.setEssencePostFailed'))
  }
}

// 处理点赞点击
const handleLikeClick = () => {
  message.info(t('course.forum.likeSystemDeveloping'))
}

// 处理分页大小变化
const handlePageSizeChange = (pageSize: number) => {
  postQueryParams.value.pageSize = pageSize
  postQueryParams.value.pageNum = 1
  loadPosts()
}

// 处理页码变化
const handlePageChange = (page: number) => {
  postQueryParams.value.pageNum = page
  loadPosts()
}

// 页面加载时初始化
onMounted(async () => {
  await loadCourseInfo()
  await loadForum()
  await loadPosts()
})
</script>

<style lang="scss" scoped>
.forum-detail-content {
  height: 100%;

  .no-selection-card {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .forum-info-card {
    height: 100%;
    overflow-y: auto;

    .forum-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;

      .forum-info-section {
        flex: 1;

        .forum-description {
          margin: 0 0 12px 0;
          line-height: 1.6;
          color: var(--text-secondary-color);
          font-size: 16px;
        }

        .forum-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
      }

      .posts-count-section {
        display: flex;
        align-items: center;
        margin-left: 24px;

        .posts-count {
          text-align: center;
          padding: 16px 20px;
          background: var(--info-color-light);
          border-radius: 8px;
          border: 1px solid var(--info-color-light-hover);

          .count-number {
            display: block;
            font-size: 28px;
            font-weight: 700;
            color: var(--primary-color);
            line-height: 1;
            margin-bottom: 4px;
          }

          .count-label {
            display: block;
            font-size: 14px;
            color: var(--text-secondary-color);
            font-weight: 500;
          }
        }
      }
    }

    .posts-section {
      margin-bottom: 24px;

      .section-title {
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
        align-items: center;

        h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--text-color);
        }

        .posts-stats {
          display: flex;
          gap: 24px;

          .stat-item {
            text-align: center;
          }
        }
      }

      .posts-list {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 24px;

        .post-card {
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          border-radius: 8px;

          &:hover {
            background-color: rgba(255, 255, 255, 0.05);
          }

          // 动态标签样式
          .post-label {
            position: absolute;
            top: -2px;
            left: -1px;
            font-size: 12px;
            font-weight: bold;
            padding: 2px 8px;
            border-radius: 8px 0 8px 0;
            z-index: 1;
            color: #fff;
            background: #ff4757; // 默认背景色
          }


          // 三点菜单样式
          .post-actions-menu {
            position: absolute;
            top: 16px;
            right: 12px;
            z-index: 10;

            .action-button {
              opacity: 0.6;
              transition: all 0.3s ease;

              &:hover {
                opacity: 1;
                background-color: rgba(255, 255, 255, 0.1);
              }
            }
          }

          .post-content {
            .post-header {
              margin-bottom: 16px;
              margin-top: 8px;

              .post-author {
                display: flex;
                align-items: center;
                gap: 12px;

                .author-info {
                  display: flex;
                  flex-direction: column;
                  gap: 4px;

                  .author-name {
                    font-weight: 500;
                    color: var(--text-color);
                  }

                  .post-time {
                    font-size: 14px;
                    color: var(--text-secondary-color);
                  }
                }
              }
            }

            .post-body {
              margin-bottom: 12px;

              .post-title-row {
                margin-bottom: 8px;

                .post-title {
                  margin: 0;
                  font-size: 18px;
                  font-weight: 600;
                  color: var(--text-color);
                }
              }

              .post-preview {
                color: var(--text-secondary-color);
                line-height: 1.6;
              }
            }

            .post-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;

              .post-tags {
                display: flex;
                gap: 8px;
              }

              .post-stats {
                display: flex;
                gap: 16px;

                .stat-item {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  font-size: 14px;
                  color: var(--text-secondary-color);
                }
              }
            }
          }
        }
      }

      .pagination-wrapper {
        display: flex;
        justify-content: center;
        margin-top: 24px;
      }
    }
  }
}


// 模态框内容样式
.modal-content {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;

  .fullscreen-form {
    flex: 1;
    overflow-y: auto;
    padding: 0 24px;

    .form-main-content {
      margin-bottom: 32px;

      .title-item {
        margin-bottom: 24px;
      }

      .content-item {
        :deep(.n-card__content) {
          padding: 0;
          height: calc(100vh - 200px);
          overflow: hidden;
        }
      }

      .n-form-item-label {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 12px;
      }

      .fullscreen-editor {
        :deep(.editor-content) {
          background-color: var(--background-color);
        }

        :deep(.ProseMirror) {
          background-color: var(--background-color);
          border: none;
          border-radius: 0;
        }
      }
    }

    .form-settings {
      border-top: 1px solid var(--border-color);
      padding-top: 24px;

      .n-form-item-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-color);
        margin-bottom: 8px;
      }

      .n-row {
        margin-bottom: 16px;
      }
    }
  }

  .modal-actions {
    padding: 16px 24px;
    border-top: 1px solid var(--border-color);
    background: var(--card-color);
    display: flex;
    justify-content: flex-end;

    .n-space {
      .n-button {
        min-width: 100px;
        height: 40px;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

// 全屏对话框的模态框样式覆盖
.n-modal {
  &.n-modal--fullscreen {
    .n-card {
      border-radius: 0;
      box-shadow: none;
      height: 100vh;
      max-height: 100vh;

      .n-card-header {
        padding: 24px 24px 16px 24px;
        border-bottom: 1px solid var(--border-color);
        background: var(--card-color);

        .n-card-header__main {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-color);
        }
      }

      .n-card__content {
        padding: 0;
        height: calc(100vh - 80px);
        overflow: hidden;
      }
    }
  }
}

// 特殊卡片样式
.post-card {
  &--top {
    border: 2px solid #ffd700 !important;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%) !important;
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3) !important;

    &:hover {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%) !important;
      box-shadow: 0 6px 25px rgba(255, 215, 0, 0.4) !important;
    }

    // 置顶标签样式
    .post-label {
      background: #ffd700 !important;
      color: #000 !important;
    }
  }

  &--essence {
    border: 2px solid #00c851 !important;
    background: linear-gradient(135deg, rgba(0, 200, 81, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%) !important;
    box-shadow: 0 4px 20px rgba(0, 200, 81, 0.3) !important;

    &:hover {
      background: linear-gradient(135deg, rgba(0, 200, 81, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%) !important;
      box-shadow: 0 6px 25px rgba(0, 200, 81, 0.4) !important;
    }

    // 精华标签样式
    .post-label {
      background: #00c851 !important;
      color: #fff !important;
    }
  }

  &--announcement {
    border: 2px solid #ff4757 !important;
    background: linear-gradient(135deg, rgba(255, 71, 87, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%) !important;
    box-shadow: 0 4px 20px rgba(255, 71, 87, 0.3) !important;

    &:hover {
      background: linear-gradient(135deg, rgba(255, 71, 87, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%) !important;
      box-shadow: 0 6px 25px rgba(255, 71, 87, 0.4) !important;
    }

    // 公告标签样式
    .post-label {
      background: #ff4757 !important;
      color: #fff !important;
    }
  }

  // 同时是置顶和精华的样式
  &--top.post-card--essence {
    border: 2px solid #ffd700 !important;
    background: linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(0, 200, 81, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%) !important;
    box-shadow: 0 4px 20px rgba(255, 215, 0, 0.3), 0 4px 20px rgba(0, 200, 81, 0.3) !important;

    &:hover {
      background: linear-gradient(135deg, rgba(255, 215, 0, 0.15) 0%, rgba(0, 200, 81, 0.15) 50%, rgba(255, 255, 255, 0.08) 100%) !important;
      box-shadow: 0 6px 25px rgba(255, 215, 0, 0.4), 0 6px 25px rgba(0, 200, 81, 0.4) !important;
    }

    // 置顶+精华标签样式
    .post-label {
      background: linear-gradient(45deg, #ffd700 0%, #00c851 100%) !important;
      color: #000 !important;
    }
  }

  // 公告+置顶的样式
  &--announcement.post-card--top {
    border: 2px solid #ff4757 !important;
    background: linear-gradient(135deg, rgba(255, 71, 87, 0.1) 0%, rgba(255, 215, 0, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%) !important;
    box-shadow: 0 4px 20px rgba(255, 71, 87, 0.3), 0 4px 20px rgba(255, 215, 0, 0.3) !important;

    &:hover {
      background: linear-gradient(135deg, rgba(255, 71, 87, 0.15) 0%, rgba(255, 215, 0, 0.15) 50%, rgba(255, 255, 255, 0.08) 100%) !important;
      box-shadow: 0 6px 25px rgba(255, 71, 87, 0.4), 0 6px 25px rgba(255, 215, 0, 0.4) !important;
    }

    // 公告+置顶标签样式
    .post-label {
      background: linear-gradient(45deg, #ff4757 0%, #ffd700 100%) !important;
      color: #fff !important;
    }
  }

  // 公告+精华的样式
  &--announcement.post-card--essence {
    border: 2px solid #ff4757 !important;
    background: linear-gradient(135deg, rgba(255, 71, 87, 0.1) 0%, rgba(0, 200, 81, 0.1) 50%, rgba(255, 255, 255, 0.05) 100%) !important;
    box-shadow: 0 4px 20px rgba(255, 71, 87, 0.3), 0 4px 20px rgba(0, 200, 81, 0.3) !important;

    &:hover {
      background: linear-gradient(135deg, rgba(255, 71, 87, 0.15) 0%, rgba(0, 200, 81, 0.15) 50%, rgba(255, 255, 255, 0.08) 100%) !important;
      box-shadow: 0 6px 25px rgba(255, 71, 87, 0.4), 0 6px 25px rgba(0, 200, 81, 0.4) !important;
    }

    // 公告+精华标签样式
    .post-label {
      background: linear-gradient(45deg, #ff4757 0%, #00c851 100%) !important;
      color: #fff !important;
    }
  }

  // 公告+置顶+精华的样式
  &--announcement.post-card--top.post-card--essence {
    border: 2px solid #ff4757 !important;
    background: linear-gradient(135deg, rgba(255, 71, 87, 0.1) 0%, rgba(255, 215, 0, 0.1) 33%, rgba(0, 200, 81, 0.1) 66%, rgba(255, 255, 255, 0.05) 100%) !important;
    box-shadow: 0 4px 20px rgba(255, 71, 87, 0.3), 0 4px 20px rgba(255, 215, 0, 0.3), 0 4px 20px rgba(0, 200, 81, 0.3) !important;

    &:hover {
      background: linear-gradient(135deg, rgba(255, 71, 87, 0.15) 0%, rgba(255, 215, 0, 0.15) 33%, rgba(0, 200, 81, 0.15) 66%, rgba(255, 255, 255, 0.08) 100%) !important;
      box-shadow: 0 6px 25px rgba(255, 71, 87, 0.4), 0 6px 25px rgba(255, 215, 0, 0.4), 0 6px 25px rgba(0, 200, 81, 0.4) !important;
    }

    // 公告+置顶+精华标签样式
    .post-label {
      background: linear-gradient(45deg, #ff4757 0%, #ffd700 50%, #00c851 100%) !important;
      color: #fff !important;
    }
  }
}
</style>
