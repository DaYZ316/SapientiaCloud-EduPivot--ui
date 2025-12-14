<template>
  <div class="post-detail-container">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        v-if="post"
        :course-info="courseInfo"
        :current-page="post.title"
        :forum-id="post.forumId"
        :show-course-link="true"
        :show-forum-option="true"
        :show-post-option="true"
    >
      <template #actions>
        <n-space>
          <n-button
              v-if="canEditPost"
              type="primary"
              @click="editPost"
          >
            <template #icon>
              <n-icon>
                <CreateOutline/>
              </n-icon>
            </template>
            {{ t('course.forum.editPost') }}
          </n-button>
          <n-button
              v-if="canManagePost"
              :loading="lockLoading"
              :type="post.isLocked ? 'warning' : 'default'"
              @click="togglePostLock"
          >
            <template #icon>
              <n-icon>
                <LockClosedOutline v-if="!post.isLocked"/>
                <LockOpenOutline v-else/>
              </n-icon>
            </template>
            {{ post.isLocked ? t('course.forum.unlockPost') : t('course.forum.lockPost') }}
          </n-button>
        </n-space>
      </template>
    </CourseBreadcrumb>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <n-spin size="large">
        <template #description>
          {{ t('common.loading') }}
        </template>
      </n-spin>
    </div>

    <!-- 帖子不存在 -->
    <n-card v-else-if="!post" class="not-found-card">
      <n-empty :description="t('course.forum.postNotFound')">
        <template #icon>
          <n-icon>
            <DocumentTextOutline/>
          </n-icon>
        </template>
        <template #extra>
          <n-button @click="goBack">
            {{ t('common.goBack') }}
          </n-button>
        </template>
      </n-empty>
    </n-card>

    <!-- 帖子详情内容 -->
    <div v-else class="post-detail-content">
      <!-- 帖子主体 -->
      <n-card class="post-main-card">
        <!-- 帖子头部 -->
        <div class="post-header">
          <!-- 帖子类型标签 -->
          <div class="post-badges">
            <n-tag
                v-if="post.postType"
                :type="getPostTypeTagType(post.postType)"
                class="post-type-badge"
                size="large"
            >
              {{ getPostTypeLabel(post.postType) }}
            </n-tag>
            <n-tag
                v-if="post.isTop"
                class="post-badge"
                size="large"
                type="warning"
            >
              {{ t('course.forum.topPost') }}
            </n-tag>
            <n-tag
                v-if="post.isEssence"
                class="post-badge"
                size="large"
                type="success"
            >
              {{ t('course.forum.essencePost') }}
            </n-tag>
            <n-tag
                v-if="post.isLocked"
                class="post-badge"
                size="large"
                type="error"
            >
              {{ t('course.forum.lockedPost') }}
            </n-tag>
          </div>

          <!-- 帖子标题 -->
          <h1 class="post-title">{{ post.title }}</h1>

          <!-- 帖子元信息 -->
          <div class="post-meta">
            <div class="author-info">
              <n-avatar
                  v-if="post.isAnonymous === 1"
                  :size="40"
                  :src="anonymousUserImg"
                  round
                  style="cursor: pointer;"
                  @click="handleAvatarClick"
              />
              <AvatarDisplay
                  v-else
                  :avatar-src="post.userAvatar"
                  :username="post.userName"
                  size="medium"
                  style="cursor: pointer;"
                  @click="handleAvatarClick"
              />
              <div class="author-details">
                <div class="author-name">
                  {{ post.isAnonymous === 1 ? t('course.forum.anonymous') : (post.userName || '用户') }}
                </div>
                <div class="post-time">
                  {{ post.createTime ? formatToBeijingTime(new Date(post.createTime)) : '' }}
                </div>
              </div>
            </div>

            <!-- 帖子统计信息 -->
            <div class="post-stats">
              <n-statistic
                  :label="t('course.forum.views')"
                  :value="post.viewCount || 0"
                  class="stat-item"
              />
              <n-statistic
                  :label="t('course.forum.likes')"
                  :value="post.likeCount || 0"
                  class="stat-item"
              />
              <n-statistic
                  :label="t('course.forum.replies')"
                  :value="post.replyCount || 0"
                  class="stat-item"
              />
            </div>
          </div>

          <!-- 帖子标签 -->
          <div v-if="post.tags && post.tags.length > 0 && post.postType !== 0" class="post-tags">
            <n-tag
                v-for="tag in post.tags"
                :key="tag"
                class="tag-item"
                size="medium"
                type="info"
            >
              {{ tag }}
            </n-tag>
          </div>
        </div>

        <!-- 帖子内容 -->
        <div class="post-content">
          <div
              class="post-body"
              v-html="post.content"
          ></div>

          <!-- 附件和图片 -->
          <div v-if="post.attachmentUrls && post.attachmentUrls.length > 0" class="post-attachments">
            <FileInfoList
                :bucket-code="courseBucketCode"
                :file-paths="post.attachmentUrls"
                @preview="handleFilePreview"
            />
          </div>

          <div v-if="post.imageUrls && post.imageUrls.length > 0" class="post-images">
            <div class="image-gallery">
              <div
                  v-for="(url, index) in post.imageUrls"
                  :key="index"
                  class="image-item"
              >
                <n-image
                    :alt="`图片 ${index + 1}`"
                    :preview-disabled="false"
                    :src="url"
                    class="gallery-image"
                    object-fit="cover"
                    @error="handleImageError(index)"
                />
                <div
                    v-if="imageErrors[index]"
                    class="image-error-card"
                >
                  <n-icon color="#999" size="24">
                    <ImageOutline/>
                  </n-icon>
                  <div class="error-text">{{ t('course.forum.imageExpired') }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 帖子操作栏 -->
        <div class="post-actions">
          <n-space>
            <n-button
                :loading="likeLoading"
                :type="isLiked ? 'error' : 'default'"
                @click="handleLike"
            >
              <template #icon>
                <n-icon>
                  <Heart v-if="isLiked"/>
                  <HeartOutline v-else/>
                </n-icon>
              </template>
              {{ isLiked ? t('course.forum.unlike') : t('course.forum.like') }}
              ({{ post.likeCount || 0 }})
            </n-button>

            <n-button @click="handleShare">
              <template #icon>
                <n-icon>
                  <ShareOutline/>
                </n-icon>
              </template>
              {{ t('course.forum.share') }}
            </n-button>

            <n-button @click="handleCollect">
              <template #icon>
                <n-icon>
                  <Bookmark v-if="isCollected"/>
                  <BookmarkOutline v-else/>
                </n-icon>
              </template>
              {{ isCollected ? t('course.forum.uncollect') : t('course.forum.collect') }}
            </n-button>
          </n-space>
        </div>
      </n-card>

      <!-- 回复区域 -->
      <n-card class="replies-card">
        <div class="replies-section">
          <div class="replies-header">
            <h3 class="replies-title">
              {{ t('course.forum.replies') }} ({{ totalReplies }})
            </h3>
            <n-button
                :disabled="post.isLocked === 1"
                type="primary"
                @click="handleNewReply"
            >
              <template #icon>
                <n-icon>
                  <CreateOutline/>
                </n-icon>
              </template>
              {{ t('course.forum.writeReply') }}
            </n-button>
          </div>

          <!-- 回复列表 -->
          <div v-if="repliesLoading" class="replies-loading">
            <n-spin size="large">
              <template #description>
                {{ t('common.loading') }}
              </template>
            </n-spin>
          </div>

          <!-- 状态恢复指示 -->
          <div v-if="isRestoringState" class="state-restoring">
            <n-alert :show-icon="false" class="restoring-alert" type="info">
              <template #icon>
                <n-icon>
                  <RefreshOutline/>
                </n-icon>
              </template>
              {{ t('course.forum.restoringState') }}
            </n-alert>
          </div>

          <div v-else-if="rootReplies.length === 0" class="no-replies">
            <n-empty :description="t('course.forum.noReplies')">
              <template #icon>
                <n-icon>
                  <ChatbubbleOutline/>
                </n-icon>
              </template>
            </n-empty>
          </div>

          <div v-else class="replies-list">
            <ReplyCard
                v-for="reply in rootReplies"
                :key="reply.id"
                :course-id="post.courseId"
                :forum-id="post.forumId"
                :post-id="post.id"
                :reply="reply"
                @action="handleReplyAction"
                @like="handleReplyLike"
                @reply="handleReply"
                @expand-change="(replyId, isExpanded) => handleReplyExpandChange(replyId, isExpanded)"
            />
          </div>

          <!-- 分页 -->
          <div v-if="shouldShowPagination" class="replies-pagination">
            <n-pagination
                v-model:page="replyPageNum"
                :item-count="totalReplies"
                :page-size="replyPageSize"
                :page-sizes="[10, 20, 50]"
                :show-quick-jumper="true"
                :show-size-picker="true"
                @update:page="handlePageChange"
                @update:page-size="handlePageSizeChange"
            />
          </div>

        </div>
      </n-card>

    </div>


    <!-- 编辑帖子对话框 -->
    <n-modal
        v-model:show="showEditDialog"
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
                  :bucket-code="courseBucketCode"
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
                      v-model:value="editForm.postType"
                      :options="postTypeOptions"
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

    <!-- 回复对话框 -->
    <n-modal
        v-model:show="showReplyDialog"
        :auto-focus="false"
        :bordered="false"
        :closable="true"
        :mask-closable="false"
        :style="{ width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' }"
        :title="t('course.forum.writeReply')"
        preset="card"
        size="huge"
        transform-origin="center"
    >
      <div class="modal-content">
        <n-form
            ref="replyFormRef"
            :model="replyForm"
            :rules="replyRules"
            class="fullscreen-form"
            label-placement="top"
            label-width="auto"
        >
          <!-- 回复内容区域 -->
          <div class="form-main-content">
            <n-form-item :label="t('course.forum.replyContent')" class="content-item" path="content">
              <RichTextEditor
                  v-model="replyContent"
                  :bucket-code="courseBucketCode"
                  :max-height="'500px'"
                  :min-height="'300px'"
                  :placeholder="t('course.forum.replyContentPlaceholder')"
                  class="fullscreen-editor"
              />
            </n-form-item>
          </div>

          <!-- 其他设置区域 -->
          <div class="form-settings">
            <n-row :gutter="24">
              <n-col :span="12">
                <n-form-item :label="t('course.forum.isAnonymous')" path="isAnonymous">
                  <n-switch
                      v-model:value="replyForm.isAnonymous!"
                      :checked-value="1"
                      :unchecked-value="0"
                      size="large"
                  />
                </n-form-item>
              </n-col>
            </n-row>
          </div>
        </n-form>

        <!-- 按钮区域 -->
        <div class="modal-actions">
          <n-space>
            <n-button :disabled="isReplying" @click="cancelReply">
              {{ t('common.cancel') }}
            </n-button>
            <n-button
                :loading="isReplying"
                type="primary"
                @click="saveReply"
            >
              {{ t('common.submit') }}
            </n-button>
          </n-space>
        </div>
      </div>
    </n-modal>

  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store/modules/user'
import {useTransitionStore} from '@/store/modules/transition'
import {runViewTransition} from '@/utils/themeAnimation'
import anonymousUserImg from '@/assets/image/anonymous-user.png'
import {
  NAlert,
  NAvatar,
  NButton,
  NCard,
  NCol,
  NDynamicTags,
  NEmpty,
  NForm,
  NFormItem,
  NIcon,
  NImage,
  NInput,
  NModal,
  NPagination,
  NRow,
  NSelect,
  NSpace,
  NSpin,
  NStatistic,
  NSwitch,
  NTag,
  useDialog,
  useMessage
} from 'naive-ui'
import {
  Bookmark,
  BookmarkOutline,
  ChatbubbleOutline,
  CreateOutline,
  DocumentTextOutline,
  Heart,
  HeartOutline,
  ImageOutline,
  LockClosedOutline,
  LockOpenOutline,
  RefreshOutline,
  ShareOutline
} from '@vicons/ionicons5'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import CourseBreadcrumb from '@/views/course/components/CourseBreadcrumb/CourseBreadcrumb.vue'
import ReplyCard from './ReplyCard.vue'
import {ForumPostDTO, ForumPostVO} from '@/types/course/forumPost'
import {ForumReplyDTO, ForumReplyVO} from '@/types/course/forumReply'
import {FileInfoDTO} from '@/types/minIO/file'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import {CoursePublicEnum} from '@/enum/course'
import {
  getDefaultForumPostDTO,
  getForumPostById,
  likePost,
  setPostLock,
  sharePost,
  unlikePost,
  updateForumPost,
  viewPost
} from '@/api/course/forumPost'
import {addForumReply, getDefaultForumReplyDTO, listForumReply, removeForumReplyById} from '@/api/course/forumReply'
import {formatToBeijingTime} from '@/utils/dateUtil'
import {getPostTypeOptions} from '@/enum/course/postTypeEnum'
import FileInfoList from '@/components/common/FileInfoList.vue'
import {useCourseStore} from '@/store'

// 路由和国际化
const route = useRoute()
const router = useRouter()
const {t} = useI18n()
const message = useMessage()
const dialog = useDialog()
const userStore = useUserStore()
const courseStore = useCourseStore()
const transitionStore = useTransitionStore()


// 响应式数据
const loading = ref(false)
const post = ref<ForumPostVO | null>(null)
const courseInfo = computed(() => courseStore.currentCourseInfo)

// 根据课程是否公开决定使用的桶
const courseBucketCode = computed(() => {
  return courseInfo.value?.isPublic === CoursePublicEnum.PUBLIC
      ? BusinessBucketCodeEnum.COURSE_PUBLIC
      : BusinessBucketCodeEnum.COURSE_PRIVATE
})
const isLiked = ref(false)
const isCollected = ref(false)
const likeLoading = ref(false)
const lockLoading = ref(false)
const imageErrors = ref<Record<number, boolean>>({}) // 图片加载错误状态

// 对话框状态
const showEditDialog = ref(false)
const showReplyDialog = ref(false)

// 表单引用
const editFormRef = ref()
const replyFormRef = ref()

// 编辑帖子表单
const editForm = ref<ForumPostDTO>(getDefaultForumPostDTO())
const isEditing = ref(false)

// 回复相关数据
const rootReplies = ref<ForumReplyVO[]>([])
const repliesLoading = ref(false)
const totalReplies = ref(0)

// 使用 computed 确保响应式更新
const shouldShowPagination = computed(() => {
  return totalReplies.value > 0
})
const replyPageNum = ref(1)
const replyPageSize = ref(10)
const isReplying = ref(false)

// 展开状态管理
const expandedReplies = ref<Set<string>>(new Set())
const scrollPosition = ref(0)
const isRestoringState = ref(false)

// 回复表单
const replyForm = ref<ForumReplyDTO>({
  ...getDefaultForumReplyDTO(),
  sysUserId: userStore.userInfo?.id || null
})
const currentReplyTarget = ref<ForumReplyVO | null>(null)


// 计算属性用于编辑帖子的RichTextEditor
const editPostContent = computed({
  get: () => editForm.value.content || '',
  set: (value: string) => {
    editForm.value.content = value
  }
})

// 计算属性用于回复的RichTextEditor
const replyContent = computed({
  get: () => replyForm.value.content || '',
  set: (value: string) => {
    replyForm.value.content = value
  }
})


// 帖子类型选项（只有有权限的用户才能看到所有选项）
const postTypeOptions = computed(() => {
  return getPostTypeOptions(t)
})

const canEditPost = computed(() => {
  // 这里应该根据实际业务逻辑判断
  return true
})

const canManagePost = computed(() => {
  // 这里应该根据实际业务逻辑判断（教师或管理员）
  return true
})


// 编辑帖子表单验证规则
const editPostRules = computed(() => ({
  title: [
    {required: true, message: t('course.forum.postTitleRequired'), trigger: 'blur'}
  ],
  content: [
    {required: true, message: t('course.forum.postContentRequired'), trigger: 'blur'}
  ],
  postType: [
    {required: true, type: 'number' as const, message: t('course.forum.postTypeRequired'), trigger: 'change'}
  ]
}))

// 回复表单验证规则
const replyRules = computed(() => ({
  content: [
    {required: true, message: t('course.forum.replyContentRequired'), trigger: 'blur'}
  ]
}))


// 获取帖子类型标签文本
const getPostTypeLabel = (type: number) => {
  const typeMap: Record<number, string> = {
    0: t('course.postType.NORMAL'),
    1: t('course.postType.ANNOUNCEMENT')
  }
  return typeMap[type] || t('course.postType.NORMAL')
}

// 获取帖子类型标签颜色
const getPostTypeTagType = (type: number): 'default' | 'success' | 'error' | 'warning' | 'info' | 'primary' => {
  const typeMap: Record<number, 'default' | 'success' | 'error' | 'warning' | 'info' | 'primary'> = {
    0: 'default',  // 普通帖子
    1: 'error'     // 公告
  }
  return typeMap[type] || 'default'
}

// 加载课程信息
const loadCourseInfo = async () => {
  const courseId = route.params.courseId as string
  if (!courseId) return

  await courseStore.setCurrentCourseId(courseId, true)
}

// 加载帖子详情
const loadPost = async () => {
  const postId = route.params.postId as string
  if (!postId) return

  try {
    loading.value = true
    const response = await getForumPostById(postId)
    if (response.code === 200) {
      post.value = response.data

      // 记录浏览
      await viewPost(postId)

      // 加载回复
      await loadReplies()
    } else {
      message.error(response.message || t('course.forum.loadPostFailed'))
    }
  } catch (error) {
    message.error(t('course.forum.loadPostFailed'))
  } finally {
    loading.value = false
  }
}

// 加载回复列表
const loadReplies = async () => {
  if (!post.value) return

  try {
    repliesLoading.value = true
    const params = {
      postId: post.value.id,
      forumId: post.value.forumId,
      courseId: post.value.courseId,
      parentReplyId: null, // 只查询根回复
      pageNum: replyPageNum.value,
      pageSize: replyPageSize.value,
      orderByColumn: 'create_time',
      isAsc: 'asc' as const
    }


    const response = await listForumReply(params)


    if (response.code === 200) {
      rootReplies.value = response.data || []

      // 设置总回复数
      totalReplies.value = response.total || 0

      // 强制触发响应式更新
      await nextTick()


      // 恢复展开状态
      await nextTick(() => {
        restoreScrollPosition()
      })
    } else {
      message.error(response.msg || t('course.forum.loadRepliesFailed'))
    }
  } catch (error) {
    message.error(t('course.forum.loadRepliesFailed'))
  } finally {
    repliesLoading.value = false
  }
}


// 处理点赞
const handleLike = async () => {
  if (!post.value) return

  try {
    likeLoading.value = true
    if (isLiked.value) {
      await unlikePost(post.value.id)
      post.value.likeCount = (post.value.likeCount || 0) - 1
      isLiked.value = false
      message.success(t('course.forum.unlikeSuccess'))
    } else {
      await likePost(post.value.id)
      post.value.likeCount = (post.value.likeCount || 0) + 1
      isLiked.value = true
      message.success(t('course.forum.likeSuccess'))
    }
  } catch (error) {
    message.error(t('course.forum.likeFailed'))
  } finally {
    likeLoading.value = false
  }
}

// 处理分享
const handleShare = async () => {
  if (!post.value) return

  try {
    await sharePost(post.value.id)
    post.value.shareCount = (post.value.shareCount || 0) + 1

    // 复制链接到剪贴板
    const shareUrl = `${window.location.origin}/course/${post.value.courseId}/forum/${post.value.forumId}/post/${post.value.id}`
    await navigator.clipboard.writeText(shareUrl)
    message.success(t('course.forum.shareSuccess'))
  } catch (error) {
    message.error(t('course.forum.shareFailed'))
  }
}

// 处理收藏
const handleCollect = () => {
  isCollected.value = !isCollected.value
  message.success(isCollected.value ? t('course.forum.collectSuccess') : t('course.forum.uncollectSuccess'))
}

// 处理头像点击
const handleAvatarClick = () => {
  if (!post.value || post.value.isAnonymous === 1) {
    message.info(t('course.forum.anonymousUser'))
    return
  }

  if (!post.value.sysUserId) {
    message.warning(t('course.forum.userNotFound'))
    return
  }

  router.push(`/user/${post.value.sysUserId}`)
}

// 处理文件预览
const handleFilePreview = (fileInfo: FileInfoDTO, event?: MouseEvent) => {
  transitionStore.show()
  runViewTransition(() => {
    router.push({
      name: 'FilePreview',
      query: {
        fileInfo: JSON.stringify(fileInfo),
        from: 'PostDetail',
        courseId: route.params.courseId,
        forumId: route.params.forumId,
        postId: route.params.postId
      }
    })
  }, event)
}

// 处理图片加载错误
const handleImageError = (index: number) => {
  imageErrors.value[index] = true
}


// 编辑帖子
const editPost = () => {
  if (!post.value) return

  // 填充编辑表单
  editForm.value = {
    id: post.value.id,
    forumId: post.value.forumId,
    courseId: post.value.courseId,
    sysUserId: post.value.sysUserId,
    title: post.value.title,
    content: post.value.content,
    postType: post.value.postType || 0,
    isAnonymous: post.value.isAnonymous ?? 0,
    attachmentUrls: post.value.attachmentUrls || [],
    imageUrls: post.value.imageUrls || [],
    tags: post.value.tags ?? [],
    isLocked: post.value.isLocked ?? 0,
    status: post.value.status ?? 0,
    chapterId: post.value.chapterId || null
  }
  showEditDialog.value = true
}

// 切换帖子锁定状态
const togglePostLock = async () => {
  if (!post.value) return

  const isCurrentlyLocked = post.value.isLocked === 1
  const actionText = isCurrentlyLocked ? t('course.forum.unlockPost') : t('course.forum.lockPost')
  const confirmText = isCurrentlyLocked ? t('course.forum.confirmUnlockPost') : t('course.forum.confirmLockPost')

  dialog.warning({
    title: actionText,
    content: confirmText,
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        lockLoading.value = true
        // 将布尔值转换为整数：true -> 1, false -> 0
        const newLockStatus = isCurrentlyLocked ? 0 : 1
        await setPostLock(post.value!.id, newLockStatus)
        post.value!.isLocked = newLockStatus
        message.success(isCurrentlyLocked ? t('course.forum.unlockPostSuccess') : t('course.forum.lockPostSuccess'))
      } catch (error) {
        message.error(t('course.forum.toggleLockFailed'))
      } finally {
        lockLoading.value = false
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

    const response = await updateForumPost(editForm.value)
    if (response.code === 200) {
      message.success(t('course.forum.editPostSuccess'))
      showEditDialog.value = false

      // 重新加载帖子详情
      await loadPost()
    } else {
      message.error(response.message || t('course.forum.editPostFailed'))
    }
  } catch (error) {
    message.error(t('course.forum.editPostFailed'))
  } finally {
    isEditing.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  showEditDialog.value = false
  editForm.value = getDefaultForumPostDTO()
}


// 返回上一页
const goBack = () => {
  router.go(-1)
}

// 处理新回复事件（直接回复帖子）
const handleNewReply = () => {
  currentReplyTarget.value = null
  replyForm.value = {
    ...getDefaultForumReplyDTO(),
    postId: post.value?.id || null,
    forumId: post.value?.forumId || null,
    courseId: post.value?.courseId || null,
    sysUserId: userStore.userInfo?.id || null
  }
  showReplyDialog.value = true
}

// 处理回复事件（回复其他回复）
const handleReply = (reply: ForumReplyVO) => {
  currentReplyTarget.value = reply
  replyForm.value = {
    ...getDefaultForumReplyDTO(),
    postId: post.value?.id || null,
    forumId: post.value?.forumId || null,
    courseId: post.value?.courseId || null,
    sysUserId: userStore.userInfo?.id || null,
    parentReplyId: reply.id,
    replyToUserId: reply.sysUserId
  }
  showReplyDialog.value = true
}

// 处理回复点赞
const handleReplyLike = () => {
  // 这里可以添加点赞后的处理逻辑
  // 比如更新本地状态等
}

// 处理回复操作
const handleReplyAction = async (action: string, reply: ForumReplyVO) => {
  switch (action) {
    case 'delete':
      dialog.warning({
        title: t('course.forum.deleteReply'),
        content: t('course.forum.confirmDeleteReply'),
        positiveText: t('common.confirm'),
        negativeText: t('common.cancel'),
        onPositiveClick: async () => {
          try {
            await removeForumReplyById(reply.id)
            message.success(t('course.forum.deleteReplySuccess'))
            // 保存当前状态
            saveExpandedState()
            // 重新加载回复列表
            await loadReplies()
          } catch (error) {
            message.error(t('course.forum.deleteReplyFailed'))
          }
        }
      })
      break
    case 'edit':
      // 编辑回复逻辑
      currentReplyTarget.value = reply
      replyForm.value = {
        id: reply.id,
        postId: reply.postId,
        forumId: reply.forumId,
        courseId: reply.courseId,
        sysUserId: reply.sysUserId,
        content: reply.content,
        parentReplyId: reply.parentReplyId,
        replyToUserId: reply.replyToUserId,
        isAnonymous: reply.isAnonymous,
        attachmentUrls: reply.attachmentUrls,
        imageUrls: reply.imageUrls,
        isAccepted: reply.isAccepted,
        status: reply.status
      }
      showReplyDialog.value = true
      break
  }
}

// 保存回复
const saveReply = async () => {
  if (!replyFormRef.value) return

  try {
    await replyFormRef.value.validate()
    isReplying.value = true

    const response = await addForumReply(replyForm.value)
    if (response.code === 200) {
      message.success(t('course.forum.replySuccess'))
      showReplyDialog.value = false
      resetReplyForm()

      // 保存当前状态
      saveExpandedState()
      // 重新加载回复列表
      await loadReplies()
    } else {
      message.error(response.message || t('course.forum.replyFailed'))
    }
  } catch (error) {
    message.error(t('course.forum.replyFailed'))
  } finally {
    isReplying.value = false
  }
}

// 取消回复
const cancelReply = () => {
  showReplyDialog.value = false
  resetReplyForm()
}

// 重置回复表单
const resetReplyForm = () => {
  replyForm.value = {
    ...getDefaultForumReplyDTO(),
    postId: post.value?.id || null,
    forumId: post.value?.forumId || null,
    courseId: post.value?.courseId || null,
    sysUserId: userStore.userInfo?.id || null
  }
  currentReplyTarget.value = null
}

// 处理页码变化
const handlePageChange = (page: number) => {
  replyPageNum.value = page
  loadReplies()
}

// 处理分页大小变化
const handlePageSizeChange = (pageSize: number) => {
  replyPageSize.value = pageSize
  replyPageNum.value = 1

  loadReplies()
}

// 保存展开状态到本地存储
const saveExpandedState = () => {
  const postId = route.params.postId as string
  if (!postId) return

  const state = {
    expandedReplies: Array.from(expandedReplies.value),
    scrollPosition: window.scrollY,
    timestamp: Date.now()
  }

  localStorage.setItem(`forum_expanded_${postId}`, JSON.stringify(state))
}

// 恢复展开状态从本地存储
const restoreExpandedState = () => {
  const postId = route.params.postId as string
  if (!postId) return

  const savedState = localStorage.getItem(`forum_expanded_${postId}`)
  if (!savedState) return

  try {
    const state = JSON.parse(savedState)
    // 检查状态是否过期（24小时）
    if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(`forum_expanded_${postId}`)
      return
    }

    expandedReplies.value = new Set(state.expandedReplies || [])
    scrollPosition.value = state.scrollPosition || 0
  } catch (error) {
    localStorage.removeItem(`forum_expanded_${postId}`)
  }
}

// 清除过期状态
const clearExpiredStates = () => {
  const keys = Object.keys(localStorage)
  const forumKeyPrefix = 'forum_expanded_'

  keys.forEach(key => {
    if (key.startsWith(forumKeyPrefix)) {
      try {
        const state = JSON.parse(localStorage.getItem(key) || '{}')
        if (Date.now() - state.timestamp > 24 * 60 * 60 * 1000) {
          localStorage.removeItem(key)
        }
      } catch (error) {
        localStorage.removeItem(key)
      }
    }
  })
}

// 处理回复展开状态变化
const handleReplyExpandChange = (replyId: string, isExpanded: boolean) => {
  if (isExpanded) {
    expandedReplies.value.add(replyId)
  } else {
    expandedReplies.value.delete(replyId)
  }
  saveExpandedState()
}

// 恢复滚动位置
const restoreScrollPosition = () => {
  if (scrollPosition.value > 0) {
    isRestoringState.value = true
    // 使用 nextTick 确保 DOM 更新完成后再滚动
    nextTick(() => {
      // 平滑滚动到指定位置
      window.scrollTo({
        top: scrollPosition.value,
        behavior: 'smooth'
      })

      // 滚动完成后重置状态
      setTimeout(() => {
        isRestoringState.value = false
      }, 500)
    })
  }
}

// 页面加载时初始化
onMounted(async () => {
  // 清除过期状态
  clearExpiredStates()

  // 恢复展开状态
  restoreExpandedState()

  await loadCourseInfo()
  await loadPost()

  // 恢复滚动位置
  restoreScrollPosition()
})

// 页面卸载时保存状态
onBeforeUnmount(() => {
  saveExpandedState()
})
</script>

<style lang="scss" scoped>
@use './PostDetail.scss';
</style>


