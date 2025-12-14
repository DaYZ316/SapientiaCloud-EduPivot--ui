<template>
  <div class="child-reply-card">
    <!-- 回复头部 -->
    <div class="reply-header">
      <div class="author-info">
        <n-avatar
            v-if="reply.deleted !== 1 && reply.isAnonymous === 1"
            :size="32"
            :src="anonymousUserImg"
            round
            style="cursor: pointer;"
            @click="handleAvatarClick"
        />
        <AvatarDisplay
            v-else-if="reply.deleted !== 1"
            :avatar-src="reply.userAvatar"
            :size="32"
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
              @select="handleDropdownSelect(reply)"
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
        <n-icon color="#999" size="12">
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
              <n-icon color="#999" size="18">
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
        <FileInfoList
            :bucket-code="BusinessBucketCodeEnum.COURSE_PUBLIC"
            :file-paths="reply.attachmentUrls"
            @preview="handleFilePreview"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, h, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import anonymousUserImg from '@/assets/image/anonymous-user.png'
import {NAvatar, NButton, NDropdown, NIcon, NImage, NSpace, NTag, useMessage} from 'naive-ui'
import {
  ChatbubbleOutline,
  CheckmarkCircleOutline,
  CloseCircleOutline,
  CreateOutline,
  EllipsisVertical,
  Heart,
  HeartOutline,
  ImageOutline,
  TrashOutline
} from '@vicons/ionicons5'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import FileInfoList from '@/components/common/FileInfoList.vue'
import {ForumReplyVO} from '@/types/course/forumReply'
import {FileInfoDTO} from '@/types/minIO/file'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import {acceptReply, likeReply, unacceptReply, unlikeReply} from '@/api/course/forumReply'
import {formatToBeijingTime} from '@/utils/dateUtil'
import {useTransitionStore} from '@/store/modules/transition'
import {runViewTransition} from '@/utils/themeAnimation'

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
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 路由和国际化
const router = useRouter()
const {t} = useI18n()
const message = useMessage()
const transitionStore = useTransitionStore()

// 响应式数据
const isLiked = ref(false)
const likeLoading = ref(false)
const imageErrors = ref<Record<number, boolean>>({})

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

const handleDropdownSelect = (reply: ForumReplyVO) => (key: string | number | null) => {
  if (key === null || key === undefined) {
    return
  }
  handleReplyAction(String(key), reply)
}

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
const handleFilePreview = (fileInfo: FileInfoDTO, event?: MouseEvent) => {
  if (!props.reply.id) return
  transitionStore.show()
  runViewTransition(() => {
    router.push({
      name: 'FilePreview',
      query: {
        fileInfo: JSON.stringify(fileInfo),
        from: 'ChildReplyCard',
        courseId: props.courseId,
        forumId: props.forumId,
        postId: props.postId,
        replyId: props.reply.id
      }
    })
  }, event)
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
      // 直接触发删除事件，让父组件处理确认对话框
      emit('action', 'delete', reply)
      break
  }
}

</script>

<style lang="scss" scoped>
.child-reply-card {
  border: 1px solid var(--border-color);
  background: var(--background-color);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
    border-color: var(--primary-color);
  }

  .reply-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;

    .author-info {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;

      .author-details {
        .author-name {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-color);
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .reply-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
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
            font-size: 9px;
            height: 16px;
            line-height: 14px;
          }
        }
      }
    }

    .reply-actions {
      .n-button {
        font-size: 11px;
        height: 24px;
        padding: 0 8px;
      }

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
      font-size: 13px;
      line-height: 1.5;
      color: var(--text-color);
      margin-bottom: 10px;

      :deep(p) {
        margin-bottom: 6px;
      }

      :deep(img) {
        max-width: 100%;
        height: auto;
        border-radius: 4px;
        margin: 6px 0;
      }

      :deep(blockquote) {
        border-left: 2px solid var(--primary-color);
        padding-left: 10px;
        margin: 6px 0;
        color: var(--text-secondary-color);
        font-style: italic;
      }

      :deep(code) {
        background-color: var(--color-primary-light);
        padding: 1px 3px;
        border-radius: 2px;
        font-family: 'Courier New', monospace;
        font-size: 11px;
      }

      :deep(pre) {
        background-color: var(--color-primary-light);
        padding: 8px;
        border-radius: 4px;
        overflow-x: auto;
        margin: 6px 0;
        font-size: 11px;
      }
    }

    .deleted-content {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 12px;
      background-color: var(--background-secondary-color);
      border: 1px dashed var(--border-color);
      border-radius: 6px;
      color: var(--text-secondary-color);
      font-style: italic;
      font-size: 13px;
      margin-bottom: 10px;
    }

    .reply-attachments {
      margin: 12px 0;
    }

    .reply-images {
      margin: 12px 0;

      .image-gallery {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
        gap: 6px;

        .image-item {
          position: relative;
          width: 100%;
          height: 100px;
          border-radius: 4px;
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
            border-radius: 4px;
            color: #999;
            text-align: center;
            padding: 8px;

            .n-icon {
              margin-bottom: 4px;
              opacity: 0.7;
            }

            .error-text {
              font-size: 10px;
              margin-bottom: 6px;
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
}

// 响应式设计
@media (max-width: 768px) {
  .child-reply-card {
    padding: 10px;

    .reply-header {
      flex-direction: column;
      gap: 6px;

      .reply-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }

    .reply-content {
      .reply-images {
        .image-gallery {
          grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
          gap: 4px;

          .image-item {
            height: 80px;

            .image-error-card {
              padding: 6px;

              .error-text {
                font-size: 9px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
