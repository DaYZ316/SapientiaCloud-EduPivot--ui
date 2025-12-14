<template>
  <div :class="{ collapsed: collapsed, embedded: embeddedMode }" class="chat-sidebar">
    <!-- 顶部工具栏 (嵌入模式下隐藏) -->
    <div v-if="!embeddedMode" class="sidebar-header">
      <div class="header-top">
        <n-icon
            :component="MenuOutline"
            class="collapse-icon"
            size="24"
            @click="toggleCollapse"
        />
        <div class="header-actions">
          <n-icon
              :component="SearchOutline"
              class="action-icon"
              size="24"
              @click="showSearchInput = !showSearchInput"
          />
        </div>
      </div>
      <!-- 搜索输入框 -->
      <div v-if="showSearchInput" class="search-input-wrapper">
        <n-input
            v-model:value="searchText"
            :placeholder="t('chat.sidebar.searchPlaceholder')"
            clearable
            size="small"
        >
          <template #prefix>
            <n-icon :component="SearchOutline"/>
          </template>
        </n-input>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div ref="sidebarContentRef" class="sidebar-content" @scroll="handleScroll">
      <!-- 快速操作 -->
      <div class="quick-actions">
        <div class="action-item" @click="handleNewChat">
          <n-icon :component="CreateOutline" class="action-item-icon"/>
          <span v-if="!collapsed">{{ t('chat.sidebar.newChat') }}</span>
        </div>
        <div :class="{ active: isMyFavoritesActive }" class="action-item favorite-action-item"
             @click="handleMyFavorites">
          <n-icon :component="favoriteIcon" class="action-item-icon"/>
          <span v-if="!collapsed">{{ t('chat.sidebar.myFavorites') }}</span>
        </div>
      </div>

      <!-- 会话列表 -->
      <div v-if="!collapsed" class="session-list">
        <div class="section-title">{{ t('chat.sidebar.recent') }}</div>
        <!-- 加载状态 -->
        <LoadingSpinner
            v-if="loading"
            :title="t('chat.loading')"
            min-height="200px"
            size="medium"
        />
        <!-- 空状态 -->
        <div v-else-if="sessions.length === 0" class="empty-sessions">
          {{ t('chat.sidebar.noSessions') }}
        </div>
        <!-- 会话列表 -->
        <div v-else class="session-items">
          <div
              v-for="session in filteredSessions"
              :key="String(session.id)"
              :class="{ active: activeSessionId === session.id }"
              class="session-item"
              @click="selectSession(session)"
              @contextmenu.prevent="handleContextMenu($event, session)"
          >
            <div class="session-content">
              <div class="session-title">{{ session.sessionTitle || t('chat.sidebar.newChat') }}</div>
              <div v-if="session.lastMessagePreview" class="session-preview">
                {{ session.lastMessagePreview }}
              </div>
            </div>
            <div class="session-actions">
              <n-icon
                  v-if="session.isPinned === 1"
                  :component="Pin"
                  class="pinned-icon"
                  size="16"
              />
              <n-icon
                  v-if="session.isFavorite === 1"
                  :component="Star"
                  class="favorite-icon"
                  size="16"
              />
            </div>
          </div>
        </div>
        <!-- 加载更多提示 -->
        <div v-if="loadingMore" class="loading-more">
          <LoadingSpinner
              :center="true"
              min-height="40px"
              size="small"
          />
        </div>
      </div>
    </div>


    <!-- 右键菜单 -->
    <n-dropdown
        v-model:show="contextMenuVisible"
        :options="contextMenuOptions"
        :x="contextMenuX"
        :y="contextMenuY"
        placement="bottom-start"
        trigger="manual"
        @select="handleContextMenuSelect"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, h, onMounted, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {NDropdown, NIcon, NInput, useDialog, useMessage} from 'naive-ui'
import {CreateOutline, MenuOutline, Pin, SearchOutline, Star, StarOutline, TrashOutline} from '@vicons/ionicons5'
import type {ChatSessionQueryDTO, ChatSessionVO} from '@/types/celestialHub/chatSession'
import {
  favoriteSession,
  getDefaultChatSessionQueryDTO,
  listChatSession,
  pinSession,
  removeChatSessionById
} from '@/api/celestialHub/chatSession'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import {useUserStore} from '@/store'

// Props
const props = defineProps<{
  activeSessionId?: string | number | null
  embeddedMode?: boolean // 嵌入模式，用于在全局侧边栏中显示
}>()

// Emits
const emit = defineEmits<{
  selectSession: [session: ChatSessionVO]
  newChat: []
  myFavorites: []
}>()

// 状态
const collapsed = computed(() => props.embeddedMode ? false : collapsedState.value)
const collapsedState = ref(false)
const showSearchInput = ref(false)
const searchText = ref('')
const sessions = ref<ChatSessionVO[]>([])
const loading = ref(false)
const contextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const currentContextSession = ref<ChatSessionVO | null>(null)
const queryParams = ref<ChatSessionQueryDTO>(getDefaultChatSessionQueryDTO())
const total = ref(0)
const loadingMore = ref(false)
const hasMore = ref(true)
const sidebarContentRef = ref<HTMLDivElement | null>(null)
const isMyFavoritesActive = ref(false)

// 国际化
const {t} = useI18n()

// 对话框和消息提示
const dialog = useDialog()
const message = useMessage()

// 用户store
const userStore = useUserStore()

// 右键菜单选项
const contextMenuOptions = computed(() => [
  {
    label: currentContextSession.value?.isPinned === 1
        ? t('chat.session.unpin')
        : t('chat.session.pin'),
    key: 'togglePin',
    icon: () => h(NIcon, {component: Pin})
  },
  {
    label: currentContextSession.value?.isFavorite === 1
        ? t('chat.session.unfavorite')
        : t('chat.session.favorite'),
    key: 'toggleFavorite',
    icon: () => h(NIcon, {component: Star})
  },
  {
    type: 'divider'
  },
  {
    label: () => h('span', {style: 'color: #d03050'}, t('chat.session.delete')),
    key: 'delete',
    icon: () => h(NIcon, {component: TrashOutline, color: '#d03050'})
  }
])

// 过滤后的会话列表
const filteredSessions = computed(() => {
  if (!searchText.value) {
    return sessions.value
  }
  return sessions.value.filter(session =>
      session.sessionTitle?.toLowerCase().includes(searchText.value.toLowerCase())
  )
})

// 收藏图标（激活时显示填充的星形，未激活时显示轮廓）
const favoriteIcon = computed(() => {
  return isMyFavoritesActive.value ? Star : StarOutline
})

// 方法
const toggleCollapse = () => {
  collapsedState.value = !collapsedState.value
}

const handleNewChat = () => {
  emit('newChat')
}

const handleMyFavorites = () => {
  isMyFavoritesActive.value = !isMyFavoritesActive.value
  loadSessions()
  emit('myFavorites')
}

const selectSession = (session: ChatSessionVO) => {
  // 如果点击的是当前已选中的会话，则不执行任何操作
  if (props.activeSessionId === session.id) {
    return
  }
  emit('selectSession', session)
}

const handleContextMenu = (event: MouseEvent, session: ChatSessionVO) => {
  contextMenuX.value = event.clientX
  contextMenuY.value = event.clientY
  currentContextSession.value = session
  contextMenuVisible.value = true
}

const handleContextMenuSelect = async (key: string) => {
  contextMenuVisible.value = false
  if (!currentContextSession.value) {
    return
  }

  const sessionId = currentContextSession.value.id
  if (!sessionId) {
    return
  }

  switch (key) {
    case 'delete':
      // 显示确认对话框
      dialog.warning({
        title: t('chat.session.deleteConfirm'),
        content: t('chat.session.deleteConfirmMessage'),
        positiveText: t('common.confirm'),
        negativeText: t('common.cancel'),
        onPositiveClick: async () => {
          const isCurrentSession = props.activeSessionId === sessionId
          await removeChatSessionById(sessionId)
          await loadSessions()
          message.success(t('chat.session.deleteSuccess'))
          // 如果删除的是当前活动会话，跳转到新对话页面
          if (isCurrentSession) {
            emit('newChat')
          }
        }
      })
      break
    case 'togglePin':
      const newPinStatus = currentContextSession.value.isPinned === 1 ? false : true
      await pinSession(sessionId, newPinStatus)
      await loadSessions()
      break
    case 'toggleFavorite':
      const newFavoriteStatus = currentContextSession.value.isFavorite === 1 ? false : true
      await favoriteSession(sessionId, newFavoriteStatus)
      await loadSessions()
      break
  }

  currentContextSession.value = null
}

const loadSessions = async () => {
  loading.value = true
  queryParams.value = {...getDefaultChatSessionQueryDTO()}
  queryParams.value.pageNum = 1
  queryParams.value.pageSize = 20
  queryParams.value.sysUserId = userStore.userInfo?.id || null
  // 如果"我的收藏"按钮激活，设置收藏过滤条件
  if (isMyFavoritesActive.value) {
    queryParams.value.isFavorite = '1'
  } else {
    queryParams.value.isFavorite = null
  }
  const response = await listChatSession(queryParams.value)
  if (response.data) {
    sessions.value = response.data
    total.value = response.total || 0
    hasMore.value = sessions.value.length < total.value
  }
  loading.value = false
}

const loadMoreSessions = async () => {
  if (!hasMore.value || loadingMore.value) {
    return
  }
  loadingMore.value = true
  queryParams.value.pageNum = (queryParams.value.pageNum || 1) + 1
  queryParams.value.sysUserId = userStore.userInfo?.id || null
  // 确保保持收藏状态过滤
  if (isMyFavoritesActive.value) {
    queryParams.value.isFavorite = '1'
  } else {
    queryParams.value.isFavorite = null
  }
  const response = await listChatSession(queryParams.value)
  if (response.data && response.data.length > 0) {
    sessions.value = [...sessions.value, ...response.data]
    hasMore.value = sessions.value.length < total.value
  } else {
    hasMore.value = false
  }
  loadingMore.value = false
}

const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight

  // 当滚动到距离底部10px时加载更多
  if (scrollHeight - scrollTop - clientHeight < 10) {
    loadMoreSessions()
  }
}

// 生命周期
onMounted(() => {
  loadSessions()
})

// 暴露方法给父组件
defineExpose({
  loadSessions,
  toggleCollapse
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.chat-sidebar {
  width: 280px;
  height: 100%;
  background-color: var(--background-secondary-color);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  position: relative;

  &.embedded {
    width: 100%;
    height: 100%;
    border-right: none;
    border-top: none;

    .sidebar-content {
      padding: 8px 12px;
      flex: 1;
      min-height: 0;
    }
  }

  &.collapsed:not(.embedded) {
    width: 64px;

    .sidebar-header {
      padding: 9px 6px;
      display: flex;
      justify-content: center;

      .header-top {
        width: 100%;
        display: flex;
        justify-content: center;

        .collapse-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-actions {
          display: none;
        }
      }

      .search-input-wrapper {
        display: none;
      }
    }

    .sidebar-content {
      padding: 6px 4px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      flex-direction: column;

      .quick-actions {
        margin-bottom: 0;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;

        .action-item {
          width: 40px;
          height: 40px;
          padding: 0;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;

          &.active {
            background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
            color: var(--color-primary);

            .action-item-icon {
              color: var(--color-primary);
            }
          }

          &.favorite-action-item {
            &.active {
              color: var(--color-primary);

              .action-item-icon {
                color: var(--warning-color);
              }
            }
          }

          .action-item-icon {
            font-size: 20px;
          }

          span {
            display: none;
          }
        }
      }

      .session-list {
        display: none;
      }
    }

  }
}

.sidebar-header {
  padding: 9px;
  border-bottom: 1px solid var(--border-secondary-color);
  display: flex;
  flex-direction: column;
  gap: 8px;

  .header-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .collapse-icon {
    cursor: pointer;
    color: var(--text-secondary-color);
    transition: all 0.2s ease;
    padding: 4px;
    border-radius: 4px;
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: var(--color-primary);
      background-color: var(--background-tertiary-color);
    }
  }

  .header-actions {
    display: flex;
    gap: 8px;
    justify-content: flex-end;

    .action-icon {
      cursor: pointer;
      color: var(--text-secondary-color);
      transition: all 0.2s ease;
      padding: 4px;
      border-radius: 4px;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: var(--color-primary);
        background-color: var(--background-tertiary-color);
      }
    }
  }

  .search-input-wrapper {
    animation: slideDown 0.2s ease;
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;

  .quick-actions {
    margin-bottom: 16px;

    .action-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      margin-bottom: 4px;
      color: var(--text-color);
      min-height: 40px;

      &:hover {
        background-color: var(--background-tertiary-color);
      }

      &.active {
        background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
        color: var(--color-primary);

        .action-item-icon {
          color: var(--color-primary);
        }
      }

      &.favorite-action-item {
        &.active {
          color: var(--color-primary);

          .action-item-icon {
            color: var(--warning-color);
          }
        }
      }

      .action-item-icon {
        font-size: 20px;
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      span {
        font-size: 14px;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .session-list {
    .section-title {
      padding: 8px 12px;
      font-size: 12px;
      color: var(--text-secondary-color);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .empty-sessions {
      padding: 32px 12px;
      text-align: center;
      color: var(--text-secondary-color);
      font-size: 14px;
    }

    .loading-more {
      padding: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .session-items {
      .session-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 2px;
        position: relative;

        &:hover {
          background-color: var(--background-tertiary-color);
        }

        &.active {
          background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
          color: var(--color-primary);

          .session-preview {
            color: var(--text-secondary-color);
          }

          .pinned-icon,
          .favorite-icon {
            color: var(--warning-color);
          }
        }

        .session-content {
          flex: 1;
          min-width: 0;

          .session-title {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .session-preview {
            font-size: 12px;
            color: var(--text-secondary-color);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .session-actions {
          display: flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;

          .pinned-icon {
            color: var(--warning-color);
          }

          .favorite-icon {
            color: var(--warning-color-light);
          }
        }
      }
    }
  }
}

// 滚动条样式
.sidebar-content {
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 2px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary-color);
  }
}

// 暗色主题样式调整
.dark {
  .chat-sidebar {
    background-color: var(--background-secondary-color);
  }

  .session-item {
    &.active {
      background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
    }
  }
}
</style>
