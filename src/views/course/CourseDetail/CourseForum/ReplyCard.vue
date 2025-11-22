<template>
  <div class="reply-card">
    <!-- 回复头部 -->
    <div class="reply-header">
      <div class="author-info">
        <n-avatar
            v-if="reply.deleted !== 1 && reply.isAnonymous === 1"
            :size="36"
            :src="anonymousUserImg"
            round
            style="cursor: pointer;"
            @click="handleAvatarClick"
        />
        <AvatarDisplay
            v-else-if="reply.deleted !== 1"
            :avatar-src="reply.userAvatar"
            :size="36"
            :username="reply.userName"
            style="cursor: pointer;"
            @click="handleAvatarClick"
        />
        <div class="author-details">
          <div v-if="reply.deleted !== 1" class="author-name">
            {{ reply.isAnonymous === 1 ? t('course.forum.anonymous') : (reply.userName || '用户') }}
          </div>
          <div v-if="reply.deleted !== 1" class="reply-meta">
            <span class="floor-number">#{{ reply.floorNumber || '?' }}</span>
            <span class="reply-time">
              {{ reply.createTime ? formatToBeijingTime(new Date(reply.createTime)) : '' }}
            </span>
            <n-tag
                v-if="reply.isAccepted === 1"
                class="accepted-tag"
                size="small"
                type="success"
            >
              {{ t('course.forum.accepted') }}
            </n-tag>
            <span v-if="reply.replyToUserName && reply.parentReplyId" class="reply-to">
              {{ t('course.forum.replyTo') }} {{ reply.replyToUserName }}
            </span>
          </div>
        </div>
      </div>

      <!-- 回复操作菜单 -->
      <div v-if="reply.deleted !== 1" class="reply-actions">
        <n-space>
          <n-button
              :loading="likeLoading"
              :type="isLiked ? 'error' : 'default'"
              size="small"
              @click="handleLike"
          >
            <template #icon>
              <n-icon>
                <Heart v-if="isLiked"/>
                <HeartOutline v-else/>
              </n-icon>
            </template>
            {{ reply.likeCount || 0 }}
          </n-button>

          <n-button
              size="small"
              @click="handleReply"
          >
            <template #icon>
              <n-icon>
                <ChatbubbleOutline/>
              </n-icon>
            </template>
            {{ t('course.forum.reply') }}
          </n-button>

          <n-dropdown
              v-if="canManageReply"
              :options="replyActionOptions"
              :show-arrow="true"
              trigger="click"
              @select="(key) => handleReplyAction(key, reply)"
          >
            <n-button
                circle
                class="action-button"
                quaternary
                size="small"
            >
              <template #icon>
                <n-icon>
                  <EllipsisVertical/>
                </n-icon>
              </template>
            </n-button>
          </n-dropdown>
        </n-space>
      </div>
    </div>

    <!-- 回复内容 -->
    <div class="reply-content">
      <div
          v-if="reply.deleted !== 1"
          class="reply-body"
          v-html="reply.content"
      ></div>
      <div
          v-else
          class="deleted-content"
      >
        <n-icon color="#999" size="14">
          <TrashOutline/>
        </n-icon>
        <span>{{ t('course.forum.messageNotVisible') }}</span>
      </div>

      <!-- 图片 -->
      <div v-if="reply.deleted !== 1 && reply.imageUrls && reply.imageUrls.length > 0" class="reply-images">
        <div class="image-gallery">
          <div
              v-for="(url, index) in reply.imageUrls"
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
              <n-icon color="#999" size="20">
                <ImageOutline/>
              </n-icon>
              <div class="error-text">{{ t('course.forum.imageExpired') }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 附件和文件 -->
      <div v-if="reply.deleted !== 1 && reply.attachmentUrls && reply.attachmentUrls.length > 0"
           class="reply-attachments">
        <div class="file-info-container">
          <n-spin :show="loadingFileInfo">
            <n-list>
              <n-list-item
                  v-for="fileInfo in fileInfoList"
                  :key="fileInfo.objectName"
                  class="file-info-item"
                  @click="handleFilePreview(fileInfo)"
              >
                <template #prefix>
                  <Icon :component="getFileTypeIcon(fileInfo)" color="var(--primary-color)" size="16"/>
                </template>

                <div class="file-details">
                  <div class="file-name">{{ fileInfo.fileName }}</div>
                  <div class="file-meta">
                    <n-text depth="3" style="font-size: 11px">
                      {{ formatFileSize(fileInfo.size) }}
                    </n-text>
                    <n-text depth="3" style="font-size: 11px; margin-left: 6px">
                      {{ formatUploadTime(fileInfo.lastModified) }}
                    </n-text>
                  </div>
                </div>
              </n-list-item>
            </n-list>
          </n-spin>
        </div>
      </div>
    </div>

    <!-- 子回复下拉加载 -->
    <div v-if="reply.deleted !== 1" class="child-replies">
      <n-collapse v-model:expanded-names="expandedNames">
        <n-collapse-item
            :name="reply.id"
            :title="isExpanded ? t('course.forum.collapse') : t('course.forum.expand')"
        >
          <div v-if="childRepliesLoading" class="loading-container">
            <n-spin size="small">
              <template #description>
                {{ t('common.loading') }}
              </template>
            </n-spin>
          </div>
          <div v-else-if="childReplies.length > 0">
            <ChildReplyCard
                v-for="childReply in childReplies"
                :key="childReply.id"
                :course-id="courseId"
                :forum-id="forumId"
                :post-id="postId"
                :reply="childReply"
                @action="handleChildAction"
                @like="(childReply) => emit('like', childReply)"
                @reply="(childReply) => emit('reply', childReply)"
            />
          </div>
          <div v-else class="no-child-replies">
            <n-empty :description="t('course.forum.noChildReplies')" size="small">
              <template #icon>
                <n-icon>
                  <ChatbubbleOutline/>
                </n-icon>
              </template>
            </n-empty>
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, h, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import anonymousUserImg from '@/assets/image/anonymous-user.png'
import {
  NAvatar,
  NButton,
  NCollapse,
  NCollapseItem,
  NDropdown,
  NIcon,
  NImage,
  NList,
  NListItem,
  NSpace,
  NSpin,
  NTag,
  NText,
  useMessage
} from 'naive-ui'
import {
  ArchiveOutline,
  ChatbubbleOutline,
  CheckmarkCircleOutline,
  CloseCircleOutline,
  CreateOutline,
  DocumentTextOutline,
  EllipsisVertical,
  FolderOutline,
  Heart,
  HeartOutline,
  ImageOutline,
  MusicalNotesOutline,
  TrashOutline,
  VideocamOutline
} from '@vicons/ionicons5'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import Icon from '@/components/common/Icon.vue'
import ChildReplyCard from './ChildReplyCard.vue'
import {ForumReplyVO} from '@/types/course/forumReply'
import {FileInfoDTO} from '@/types/minIO/file'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import {acceptReply, getAllRepliesByParentId, likeReply, unacceptReply, unlikeReply} from '@/api/course/forumReply'
import * as MinIOApi from '@/api/minIO'
import {formatToBeijingTime} from '@/utils/dateUtil'

interface Props {
  reply: ForumReplyVO
  courseId: string
  forumId: string
  postId: string
}

interface Emits {
  (e: 'reply', reply: ForumReplyVO): void

  (e: 'like', reply: ForumReplyVO): void

  (e: 'action', action: string, reply: ForumReplyVO): void

  (e: 'expand-change', replyId: string, isExpanded: boolean): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 路由和国际化
const router = useRouter()
const {t} = useI18n()
const message = useMessage()

// 响应式数据
const isLiked = ref(false)
const likeLoading = ref(false)
const fileInfoList = ref<FileInfoDTO[]>([])
const loadingFileInfo = ref(false)
const imageErrors = ref<Record<number, boolean>>({})

// 子回复数据
const childReplies = ref<ForumReplyVO[]>([])
const childRepliesLoading = ref(false)
const childRepliesLoaded = ref(false)

// 展开状态
const isExpanded = ref(false)

// 展开名称数组（用于collapse组件）
const expandedNames = ref<string[]>([])

// 监听expandedNames变化
watch(expandedNames, (newValue) => {
  const isCurrentlyExpanded = newValue.includes(props.reply.id || '')
  if (isCurrentlyExpanded !== isExpanded.value) {
    isExpanded.value = isCurrentlyExpanded
    if (props.reply.id) {
      emit('expand-change', props.reply.id, isCurrentlyExpanded)
    }

    // 如果展开且未加载过子回复，则加载子回复
    if (isCurrentlyExpanded && !childRepliesLoaded.value) {
      loadChildReplies()
    }
  }
})

// 回复操作选项
const replyActionOptions = computed(() => [
  {
    label: props.reply.isAccepted === 1 ? t('course.forum.unacceptReply') : t('course.forum.acceptReply'),
    key: props.reply.isAccepted === 1 ? 'unaccept' : 'accept',
    icon: () => h(NIcon, null, {
      default: () => h(props.reply.isAccepted === 1 ? CloseCircleOutline : CheckmarkCircleOutline, {
        color: props.reply.isAccepted === 1 ? '#ff6b6b' : '#18a058'
      })
    })
  },
  {
    label: t('course.forum.editReply'),
    key: 'edit',
    icon: () => h(NIcon, null, {default: () => h(CreateOutline)})
  },
  {
    label: () => h('span', {style: 'color: #d03050'}, t('course.forum.deleteReply')),
    key: 'delete',
    icon: () => h(NIcon, {color: '#d03050'}, {default: () => h(TrashOutline)})
  } as any
])

// 权限判断
const canManageReply = computed(() => {
  // 这里应该根据实际业务逻辑判断（教师或管理员）
  return true
})

// 处理点赞
const handleLike = async () => {
  if (!props.reply.id) return

  likeLoading.value = true
  if (isLiked.value) {
    await unlikeReply(props.reply.id)
    props.reply.likeCount = (props.reply.likeCount || 0) - 1
    isLiked.value = false
    message.success(t('course.forum.unlikeSuccess'))
  } else {
    await likeReply(props.reply.id)
    props.reply.likeCount = (props.reply.likeCount || 0) + 1
    isLiked.value = true
    message.success(t('course.forum.likeSuccess'))
  }
  emit('like', props.reply)
  likeLoading.value = false
}

// 处理回复
const handleReply = () => {
  if (props.reply.isAnonymous === 1) {
    message.info(t('course.forum.anonymousCannotReply'))
    return
  }
  emit('reply', props.reply)
}

// 处理头像点击
const handleAvatarClick = () => {
  if (props.reply.isAnonymous === 1) {
    message.info(t('course.forum.anonymousCannotView'))
    return
  }
  if (!props.reply.sysUserId) return
  router.push(`/user/${props.reply.sysUserId}`)
}

// 处理文件预览
const handleFilePreview = (fileInfo: FileInfoDTO) => {
  if (!props.reply.id) return
  router.push({
    name: 'FilePreview',
    query: {
      fileInfo: JSON.stringify(fileInfo),
      from: 'ReplyCard',
      courseId: props.courseId,
      forumId: props.forumId,
      postId: props.postId,
      replyId: props.reply.id
    }
  })
}

// 加载文件详细信息
const loadFileInfo = async () => {
  if (!props.reply.attachmentUrls || props.reply.attachmentUrls.length === 0) {
    fileInfoList.value = []
    return
  }

  loadingFileInfo.value = true
  const res = await MinIOApi.getBatchFileInfoByPath({
    filePaths: props.reply.attachmentUrls,
    bucketCode: BusinessBucketCodeEnum.COURSE_PUBLIC
  })
  if (res && res.success && res.data) {
    fileInfoList.value = res.data.filter(file => !file.error)
  }
  loadingFileInfo.value = false
}

// 获取文件类型图标
const getFileTypeIcon = (fileInfo: FileInfoDTO) => {
  const contentType = fileInfo.contentType || ''
  if (contentType.startsWith('image/')) return ImageOutline
  if (contentType.startsWith('video/')) return VideocamOutline
  if (contentType.startsWith('audio/')) return MusicalNotesOutline
  if (contentType.includes('pdf') || contentType.includes('document') || contentType.includes('text')) return DocumentTextOutline
  if (contentType.includes('zip') || contentType.includes('rar') || contentType.includes('7z')) return ArchiveOutline
  return FolderOutline
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化上传时间
const formatUploadTime = (timeString: string): string => {
  const date = new Date(timeString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 处理图片加载错误
const handleImageError = (index: number) => {
  imageErrors.value[index] = true
}

// 处理回复操作
const handleReplyAction = async (action: string, reply: ForumReplyVO) => {
  if (!reply.id) return

  switch (action) {
    case 'accept':
      await acceptReply(reply.id)
      reply.isAccepted = 1
      message.success(t('course.forum.acceptReplySuccess'))
      emit('action', 'accept', reply)
      break

    case 'unaccept':
      await unacceptReply(reply.id)
      reply.isAccepted = 0
      message.success(t('course.forum.unacceptReplySuccess'))
      emit('action', 'unaccept', reply)
      break

    case 'edit':
      emit('action', 'edit', reply)
      break

    case 'delete':
      emit('action', 'delete', reply)
      break
  }
}


// 处理子回复操作
const handleChildAction = (action: string, childReply: ForumReplyVO) => {
  emit('action', action, childReply)
}

// 加载子回复
const loadChildReplies = async () => {
  if (!props.reply.id || childRepliesLoaded.value) return

  try {
    childRepliesLoading.value = true
    const response = await getAllRepliesByParentId(props.reply.id)
    if (response.code === 200) {
      childReplies.value = response.data || []
      childRepliesLoaded.value = true
    } else {
      message.error(response.message || t('course.forum.loadChildRepliesFailed'))
    }
  } catch (error) {
    message.error(t('course.forum.loadChildRepliesFailed'))
  } finally {
    childRepliesLoading.value = false
  }
}


// 页面加载时初始化
onMounted(async () => {
  await loadFileInfo()
})
</script>

<style lang="scss" scoped>
.reply-card {
  border: 1px solid var(--border-color);
  background: var(--background-color);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-color);
  }

  .reply-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;

    .author-info {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;

      .author-details {
        .author-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .reply-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--text-secondary-color);

          .floor-number {
            font-weight: 500;
            color: var(--primary-color);
          }

          .reply-to {
            color: var(--primary-color);
            font-weight: 500;
          }

          .accepted-tag {
            font-size: 10px;
            height: 18px;
            line-height: 16px;
          }
        }
      }
    }

    .reply-actions {
      .action-button {
        opacity: 0.6;
        transition: opacity 0.2s ease;

        &:hover {
          opacity: 1;
        }
      }
    }
  }

  .reply-content {
    .reply-body {
      font-size: 14px;
      line-height: 1.6;
      color: var(--text-color);
      margin-bottom: 12px;

      :deep(p) {
        margin-bottom: 8px;
      }

      :deep(img) {
        max-width: 100%;
        height: auto;
        border-radius: 6px;
        margin: 8px 0;
      }

      :deep(blockquote) {
        border-left: 3px solid var(--primary-color);
        padding-left: 12px;
        margin: 8px 0;
        color: var(--text-secondary-color);
        font-style: italic;
      }

      :deep(code) {
        background-color: var(--color-primary-light);
        padding: 1px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 12px;
      }

      :deep(pre) {
        background-color: var(--color-primary-light);
        padding: 12px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 8px 0;
        font-size: 12px;
      }
    }

    .deleted-content {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 16px;
      background-color: var(--background-secondary-color);
      border: 1px dashed var(--border-color);
      border-radius: 8px;
      color: var(--text-secondary-color);
      font-style: italic;
      font-size: 14px;
      margin-bottom: 12px;
    }

    .reply-attachments {
      margin: 16px 0;

      .file-info-container {
        .file-info-item {
          padding: 8px 12px;
          border-bottom: 1px solid var(--border-color);
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 6px;
          margin-bottom: 3px;

          &:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }

          &:hover {
            background-color: var(--background-secondary-color);
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          }

          .file-details {
            flex: 1;
            margin-left: 8px;

            .file-name {
              font-weight: 500;
              margin-bottom: 2px;
              word-break: break-all;
              color: var(--text-color);
              font-size: 12px;
              transition: color 0.2s ease;
            }

            .file-meta {
              display: flex;
              align-items: center;
              gap: 6px;
            }
          }

          &:hover .file-details .file-name {
            color: var(--primary-color);
          }
        }
      }
    }

    .reply-images {
      margin: 16px 0;

      .image-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 8px;

        .image-item {
          position: relative;
          width: 100%;
          height: 120px;
          border-radius: 6px;
          overflow: hidden;

          .gallery-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            cursor: pointer;
            transition: opacity 0.3s ease;
          }

          .image-error-card {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            border: 2px dashed #d9d9d9;
            border-radius: 6px;
            color: #999;
            text-align: center;
            padding: 12px;

            .n-icon {
              margin-bottom: 6px;
              opacity: 0.7;
            }

            .error-text {
              font-size: 11px;
              margin-bottom: 8px;
              font-weight: 500;
            }
          }

          &:hover .gallery-image {
            opacity: 0.9;
          }
        }
      }
    }
  }

  .child-replies {
    margin-top: 16px;
    padding-left: 16px;
    border-left: 2px solid var(--border-color);

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
    }

    .no-child-replies {
      padding: 20px;
      text-align: center;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .reply-card {
    padding: 12px;

    .reply-header {
      flex-direction: column;
      gap: 8px;

      .reply-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }

    .reply-content {
      .reply-images {
        .image-gallery {
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 6px;

          .image-item {
            height: 100px;

            .image-error-card {
              padding: 8px;

              .error-text {
                font-size: 10px;
              }
            }
          }
        }
      }
    }

    .child-replies {
      padding-left: 12px;
    }
  }
}
</style>
