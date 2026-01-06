<template>
    <div class="celestial-hub-page" @click.stop>
      <div class="celestial-hub-container">
        <!-- 聊天侧边栏 (全局侧边栏展开时隐藏) -->
        <ChatSidebar
            v-if="shouldHideChatSidebar === false"
            ref="chatSidebarRef"
            :active-session-id="activeSessionId"
            @my-favorites="handleMyFavorites"
            @new-chat="newChat"
            @select-session="selectSessionWithAnimation"
        />
  
        <input
            ref="filePickerRef"
            class="chat-file-input"
            multiple
            type="file"
            @change="handleFileInputChange"
        />
  
        <!-- 主内容区域 -->
        <div :class="['main-content', { 'with-question-panel': isQuestionPanelActive || isQuestionToolsVisible }]">
          <!-- 聊天头部 -->
          <div v-if="currentSession" class="chat-header">
            <div class="chat-title">
              {{ currentSession.sessionTitle || t('chat.sidebar.newChat') }}
            </div>
            <div class="chat-actions">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon
                      :component="DocumentsOutline"
                      class="header-icon"
                      size="20"
                      @click="handleShowSessionFiles"
                  />
                </template>
                {{ t('chat.session.files') }}
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon
                      :class="{ active: currentSession.isPinned === 1 }"
                      :component="Pin"
                      class="header-icon"
                      size="20"
                      @click="handleTogglePin"
                  />
                </template>
                {{ currentSession.isPinned === 1 ? t('chat.session.unpin') : t('chat.session.pin') }}
              </n-tooltip>
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-icon
                      :class="{ active: currentSession.isFavorite === 1 }"
                      :component="Star"
                      class="header-icon"
                      size="20"
                      @click="handleToggleFavorite"
                  />
                </template>
                {{ currentSession.isFavorite === 1 ? t('chat.session.unfavorite') : t('chat.session.favorite') }}
              </n-tooltip>
            </div>
          </div>
  
          <!-- 聊天内容 -->
          <transition
              mode="out-in"
              name="chat-switch"
          >
            <div
                v-if="currentSession"
                :key="activeSessionId ?? 'session'"
                class="chat-content-wrapper"
            >
              <div class="chat-main-column">
                <div ref="chatContentRef" class="chat-content">
                  <!-- 消息列表容器 - Gemini风格 -->
                  <div class="messages-wrapper">
                    <div class="messages-container">
                      <ChatMessage
                          v-for="(message, index) in displayMessages"
                          :key="message.id ?? `msg-${index}`"
                          :active-question-index="activeQuestionIndex"
                          :active-question-message-id="activeQuestionMessageId"
                          :is-streaming="getIsAssistantStreaming(message)"
                          :message="message"
                          @copy="handleCopy"
                          @feedback="handleFeedback"
                          @resend="handleResend(index)"
                          @view-questions="handleViewQuestions"
                      />
                    </div>
                  </div>
                </div>
                <!-- 输入区域（对话态） -->
                <div class="input-container">
                  <div class="input-wrapper">
                    <ChatInputBox
                        v-model="input"
                        v-model:file-references="fileReferences"
                        v-model:use-rag="useRagSwitch"
                        :is-sending="isSending"
                        :is-uploading-files="isUploadingFiles"
                        :placeholder="t('chat.placeholder')"
                        :session-id="currentSession?.id ?? null"
                        @enter="sendMessage"
                        @send="sendMessage"
                        @stop="interruptStreaming"
                        @trigger-file-select="handleTriggerFileSelect"
                        @open-tools="handleToolsSelect"
                        @file-drop="handleFileDrop"
                    />
                  </div>
                </div>
              </div>
              <div
                  :class="{ 'is-visible': isQuestionPanelActive || isQuestionToolsVisible }"
                  class="question-panel-wrapper"
              >
                <PreviewPanel
                    v-show="isQuestionPanelActive"
                    :key="`${activeQuestionMessageId || 'question'}-${activeQuestionIndex ?? 0}`"
                    v-model:active-index="activeQuestionIndex"
                    :close-label="t('common.cancel')"
                    :questions="questionPanelData"
                    :title="questionPanelTitle"
                    @close="handleCloseQuestionPanel"
                />
                <SmartQuestionModal
                    v-show="isQuestionToolsVisible && !isQuestionPanelActive"
                    v-model:show="isQuestionToolsVisible"
                    :session-id="currentSession?.id ?? null"
                    @question-request-success="handleQuestionRequestSuccess"
                />
              </div>
            </div>
            <!-- 空状态 - Gemini 风格 -->
            <div
                v-else
                :key="'empty'"
                class="empty-state-wrapper"
            >
              <div class="gemini-empty-state">
                <!-- AI名称 -->
                <div class="ai-name-container">
                  <div class="ai-name-text">{{ t('chat.aiName') }}</div>
                </div>
  
                <!-- 内容区域 - 限制宽度 -->
                <div
                    :class="['greeting-wrapper', { 'slide-out-left': isQuestionToolsVisible, 'slide-in-left': !isQuestionToolsVisible && wasQuestionToolsVisible }]"
                >
                  <!-- 问候语 -->
                  <div class="greeting-text">{{ t('chat.greeting', {name: userDisplayName || 'Guest'}) }}</div>
                </div>
              </div>
  
              <!-- 输入区域 - 空状态下居中展示 -->
              <div
                  :class="['input-container', { 'empty-state-input': true, 'slide-out-left': isQuestionToolsVisible, 'slide-in-left': !isQuestionToolsVisible && wasQuestionToolsVisible }]"
              >
                <div class="input-wrapper">
                  <ChatInputBox
                      v-model="input"
                      v-model:use-rag="useRagSwitch"
                      :is-sending="isSending"
                      :is-uploading-files="isUploadingFiles"
                      :placeholder="t('chat.placeholder')"
                      @enter="sendMessage"
                      @send="sendMessage"
                      @stop="interruptStreaming"
                      @trigger-file-select="handleTriggerFileSelect"
                      @open-tools="handleToolsSelect"
                  />
                </div>
              </div>
  
              <!-- SmartQuestionModal - 空状态下显示 -->
              <div
                  :class="['smart-question-modal-container', { 'slide-in-right': isQuestionToolsVisible, 'slide-out-right': !isQuestionToolsVisible && wasQuestionToolsVisible }]"
              >
                <SmartQuestionModal
                    v-model:show="isQuestionToolsVisible"
                    :session-id="null"
                    @question-request-success="handleQuestionRequestSuccess"
                />
              </div>
            </div>
          </transition>
        </div>
      </div>
      <n-drawer
          v-model:show="isFileDrawerVisible"
          :width="380"
          placement="right"
      >
        <n-drawer-content :title="t('chat.session.filesTitle')" closable>
          <div class="session-files-drawer">
            <n-spin :show="isFileListLoading">
              <FileInfoList
                  v-if="sessionFileInfos.length"
                  :bucket-code="aiQaBucketCode"
                  :file-infos="sessionFileInfos"
                  :file-paths="[]"
                  @dragstart="handleFileDragStart"
                  @preview="handleFilePreview"
              />
              <n-empty v-else :description="t('chat.session.filesEmpty')"/>
            </n-spin>
          </div>
        </n-drawer-content>
      </n-drawer>
    </div>
  </template>
  
  <script lang="ts" setup>
  import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
  import {useI18n} from 'vue-i18n'
  import {useRoute, useRouter} from 'vue-router'
  import {NDrawer, NDrawerContent, NEmpty, NIcon, NSpin, NTooltip, useMessage} from 'naive-ui'
  import {DocumentsOutline, Pin, Star} from '@vicons/ionicons5'
  import {getChatSessionById} from '@/api/celestialHub/chatSession'
  import ChatSidebar from '@/views/celestialHub/components/ChatSidebar.vue'
  import ChatMessage from '@/views/celestialHub/components/ChatMessage.vue'
  import ChatInputBox from '@/views/celestialHub/components/ChatInputBox.vue'
  import {useThemeStore, useUserStore} from '@/store'
  import {useCelestialChat} from '@/views/celestialHub/composables/useCelestialChat'
  import {useQuestionGeneration} from '@/views/celestialHub/composables/useQuestionGeneration'
  import {useFileManagement} from '@/views/celestialHub/composables/useFileManagement'
  import {favoriteSession, pinSession} from '@/api/celestialHub/chatSession'
  import FileInfoList from '@/components/common/FileInfoList.vue'
  import SmartQuestionModal from '@/views/celestialHub/components/SmartQuestionModal.vue'
  import type {ChatMessage as ChatMessageEntity} from '@/types/celestialHub/chatMessage'
  import type {FileReference} from '@/types/celestialHub/knowledge'
  import type {FileInfoDTO} from '@/types/minIO/file'
  import PreviewPanel from '@/views/celestialHub/components/QuestionPreviewPanel.vue'
  import eventBus from '@/utils/eventBus'
  import type {ChatSessionVO} from '@/types/celestialHub/chatSession'
  
  // 路由
  const route = useRoute()
  const router = useRouter()
  
  // 状态管理
  const themeStore = useThemeStore()
  
  // 状态
  const chatSidebarRef = ref<InstanceType<typeof ChatSidebar> | null>(null)
  const wasQuestionToolsVisible = ref(false)
  
  // 计算属性：是否在全局侧边栏展开时隐藏ChatSidebar
  const shouldHideChatSidebar = computed(() => {
    return !themeStore.sidebarCollapsed
  })
  
  // 使用聊天 composable
  const {
    messages,
    input,
    isLoading: isSending,
    activeSessionId,
    currentSession,
    chatContentRef,
    sendMessage,
    resendMessage,
    interruptStreaming,
    selectSession,
    newChat,
    scrollToBottom,
    useRag,
    loadMessages,
    scrollIntoViewInMessages,
    fileReferences
  } = useCelestialChat()
  
  // 使用出题 composable
  const {
    isQuestionToolsVisible,
    activeQuestionMessageId,
    activeQuestionIndex,
    questionPanelData,
    questionPanelTitle,
    isQuestionPanelActive,
    handleToolsSelect: originalHandleToolsSelect,
    handleViewQuestions,
    handleCloseQuestionPanel,
    handleQuestionRequestSuccess,
    getDisplayMessages
  } = useQuestionGeneration(
      messages,
      currentSession,
      scrollToBottom,
      scrollIntoViewInMessages,
      loadMessages,
      selectSession
  )

  // 重写 handleToolsSelect，点击智能出题按钮时跳转到 ai 页面
  const handleToolsSelect = (key: string | number) => {
    if (key === 'smartQuestion') {
      // 跳转到 ai 页面并打开出题窗口
      router.push({
        path: '/ai',
        query: {
          openSmartQuestion: 'true',
          sessionId: currentSession.value?.id ?? activeSessionId.value ?? undefined,
          questionMessageId: (activeQuestionMessageId as any)?.value ?? undefined,
          questionIndex: (activeQuestionIndex as any)?.value != null ? String((activeQuestionIndex as any).value) : undefined
        }
      })
    } else {
      // 其他情况使用原始的处理逻辑
      originalHandleToolsSelect(key)
    }
  }
  
  // 处理文件上传成功后的回调，自动添加到文件引用列表
  const handleFilesUploaded = (newFileReferences: FileReference[]) => {
    if (!fileReferences.value) {
      fileReferences.value = []
    }
    // 合并新上传的文件到文件引用列表（避免重复）
    const existingIds = new Set(fileReferences.value.map(f => f.id).filter(Boolean))
    const newFiles = newFileReferences.filter(f => f.id && !existingIds.has(f.id))
    if (newFiles.length > 0) {
      fileReferences.value = [...fileReferences.value, ...newFiles]
    }
  }
  
  // 处理文件拖拽开始，关闭侧边栏以便拖放
  const handleFileDragStart = () => {
    isFileDrawerVisible.value = false
  }
  
  // 处理文件拖拽到输入框，直接使用拖拽的 FileInfoDTO 生成文件引用
  const handleFileDrop = (fileInfo: FileInfoDTO) => {
    if (!currentSession.value?.id) {
      return
    }
  
    const fileReference: FileReference = {
      id: (fileInfo as { id?: string | null }).id ?? null,
      fileName: fileInfo.fileName ?? null,
      fileType: (fileInfo as { fileType?: number | null }).fileType ?? null,
      fileSize: (fileInfo as { fileSize?: number | null; size?: number | null }).fileSize
          ?? (fileInfo as { size?: number | null }).size
          ?? null,
      mimeType: fileInfo.contentType ?? null,
      storagePath: fileInfo.objectName ?? null,
      bucketCode: (fileInfo as { bucketCode?: string | null }).bucketCode ?? null,
      sysUserId: (fileInfo as { sysUserId?: string | null }).sysUserId ?? null,
      courseId: (fileInfo as { courseId?: string | null }).courseId ?? null,
      sessionId: currentSession.value.id ?? null,
      isVectorized: (fileInfo as { isVectorized?: boolean | null }).isVectorized ?? null,
      vectorCount: (fileInfo as { vectorCount?: number | null }).vectorCount ?? null
    }
  
    if (!fileReferences.value) {
      fileReferences.value = []
    }
  
    const hasDuplicateById = fileReference.id !== null
        ? fileReferences.value.some(item => item.id === fileReference.id)
        : false
    const hasDuplicateByPath = fileReference.storagePath !== null
        ? fileReferences.value.some(item => item.storagePath === fileReference.storagePath)
        : false
  
    if (!hasDuplicateById && !hasDuplicateByPath) {
      fileReferences.value = [...fileReferences.value, fileReference]
    }
  }
  
  // 使用文件管理 composable
  const {
    filePickerRef,
    isUploadingFiles,
    isFileDrawerVisible,
    isFileListLoading,
    sessionFileInfos,
    aiQaBucketCode,
    handleTriggerFileSelect,
    handleFileInputChange,
    handleShowSessionFiles,
    handleFilePreview
  } = useFileManagement(
      activeSessionId,
      currentSession,
      chatSidebarRef,
      handleFilesUploaded
  )
  
  const getIsAssistantStreaming = (messageItem: ChatMessageEntity) => {
    if (messageItem.role !== 1) {
      return false
    }
    const lastAssistant = [...messages.value].reverse().find(msg => msg.role === 1)
    if (!lastAssistant) {
      return false
    }
    return messageItem === lastAssistant && isSending.value
  }
  
  const displayMessages = computed<ChatMessageEntity[]>(() => {
    const sessionId = currentSession.value?.id || null
    return getDisplayMessages(sessionId)
  })
  
  // 用户store
  const userStore = useUserStore()
  
  // 国际化
  const {t} = useI18n()
  
  // 消息提示
  const message = useMessage()
  
  
  // 获取用户显示名称（优先级：真名 > 昵称 > 用户名）
  const userDisplayName = computed(() => {
    const studentInfo = userStore.studentInfo
    const teacherInfo = userStore.teacherInfo
    const userInfo = userStore.userInfo
  
    // 优先使用真名（学生或教师）
    if (studentInfo?.realName) {
      return studentInfo.realName
    }
    if (teacherInfo?.realName) {
      return teacherInfo.realName
    }
  
    // 其次使用昵称
    if (studentInfo?.nickName) {
      return studentInfo.nickName
    }
    if (teacherInfo?.nickName) {
      return teacherInfo.nickName
    }
    if (userInfo?.nickName) {
      return userInfo.nickName
    }
  
    // 最后使用用户名
    if (studentInfo?.username) {
      return studentInfo.username
    }
    if (teacherInfo?.username) {
      return teacherInfo.username
    }
    if (userInfo?.username) {
      return userInfo.username
    }
  
    // 如果都没有，返回默认值
    return ''
  })
  
  // 将可空的 useRag 转换为开关可用的布尔状态（默认开启）
  const useRagSwitch = computed<boolean>({
    get() {
      return useRag.value === true
    },
    set(v: boolean) {
      useRag.value = v
    }
  })
  
  
  // 监听消息变化，自动滚动到底部
  watch(messages, () => {
    nextTick(() => {
      scrollToBottom()
    })
  }, {deep: true})
  
  
  // 包装 selectSession 以添加动画效果
  const selectSessionWithAnimation = async (session: ChatSessionVO) => {
    // 如果点击的是当前已选中的会话，则不执行任何操作
    if (activeSessionId.value === session.id) {
      return
    }
  
    // 直接切换会话，transition 组件会自动处理动画
    await selectSession(session)
  }
  
  // 监听会话ID变化，创建新会话时刷新侧边栏
  watch(activeSessionId, (newId, oldId) => {
    // 通知全局侧边栏activeSessionId变化
    eventBus.emit('aiActiveSessionIdChanged', newId)
  
    // 当从null变为有值时，说明创建了新会话，需要刷新侧边栏
    if (!oldId && newId) {
      chatSidebarRef.value?.loadSessions()
    }
    // 切换对话时关闭 SmartQuestionModal（包括切换到新会话和新建会话）
    if (oldId !== newId && isQuestionToolsVisible.value) {
      isQuestionToolsVisible.value = false
    }
  })
  
  // 监听来自全局侧边栏的事件
  onMounted(() => {
    eventBus.on('aiSelectSession', async (session: ChatSessionVO) => {
      await selectSessionWithAnimation(session)
    })
  
    eventBus.on('aiNewChat', () => {
      newChat()
    })
  
    eventBus.on('aiMyFavorites', () => {
      handleMyFavorites()
    })
  })
  
  onUnmounted(() => {
    eventBus.off('aiSelectSession')
    eventBus.off('aiNewChat')
    eventBus.off('aiMyFavorites')
  })
  
  // 监听 isQuestionToolsVisible 变化，用于控制动画
  watch(isQuestionToolsVisible, (newValue) => {
    if (newValue) {
      wasQuestionToolsVisible.value = true
    } else {
      // 延迟重置，确保动画完成
      setTimeout(() => {
        wasQuestionToolsVisible.value = false
      }, 400)
    }
  })
  
  // 标记是否需要打开出题模态框
  const shouldOpenSmartQuestion = ref(false)
  // 如果来自外部路由需要打开特定会话或题目，先记录目标信息
  const desiredOpenSessionId = ref<string | null>(null)
  const desiredQuestionMessageId = ref<string | null>(null)
  const desiredQuestionIndex = ref<number | null>(null)
  
  // 监听路由 query 参数，如果存在 openSmartQuestion 参数，则标记需要打开，并记录目标会话/题目信息
  watch(
      () => route.query.openSmartQuestion,
      (value) => {
        if (value === 'true') {
          // 读取并保存可能传递的目标信息（sessionId / questionMessageId / questionIndex）
          desiredOpenSessionId.value = (route.query.sessionId as string) ?? null
          desiredQuestionMessageId.value = (route.query.questionMessageId as string) ?? null
          desiredQuestionIndex.value = route.query.questionIndex ? parseInt(route.query.questionIndex as string, 10) : null

          shouldOpenSmartQuestion.value = true
          // 清除 query 参数，避免重复触发
          router.replace({
            path: route.path,
            query: {
              ...route.query,
              openSmartQuestion: undefined,
              sessionId: undefined,
              questionMessageId: undefined,
              questionIndex: undefined
            }
          })
        }
      },
      {immediate: true}
  )
  
  // 监听 currentSession，确保在任何状态下根据路由触发打开出题模态框（支持传入目标会话/题目信息）
  watch(
      () => [currentSession.value, shouldOpenSmartQuestion.value],
      async (vals: any) => {
        const [session, shouldOpen] = vals as [ChatSessionVO | null, boolean]
        if (!shouldOpen) {
          return
        }

        // 如果路由中请求打开特定会话，且当前不是该会话，则尝试通过接口获取并选择该会话
        if (desiredOpenSessionId.value && (!session || session.id !== desiredOpenSessionId.value)) {
          try {
            const resp = await getChatSessionById(desiredOpenSessionId.value)
            if (resp && resp.data) {
              await selectSession(resp.data)
            }
          } catch (e) {
            // 如果获取会话失败，仍继续尝试打开模态框（不抛错）
          }
        }

        // 延迟打开，确保页面渲染完成
        nextTick(() => {
          nextTick(() => {
            setTimeout(() => {
              // 打开 SmartQuestionModal（SmartQuestionModal 会根据 currentSession 自动初始化 sessionId）
              isQuestionToolsVisible.value = true

              // 如果路由中还包含具体的题目信息（messageId/index），尝试将它们设置到题目预览面板
              // 注意：题目数据可能尚未生成/加载，此处仅记录期望，由题目生成的消息到达时会被处理并显示
              if (desiredQuestionMessageId.value) {
                // 将 activeQuestionMessageId / activeQuestionIndex 标记为期望值，QuestionGeneration 里的逻辑会处理显示
                if (activeQuestionMessageId && typeof (activeQuestionMessageId as any).value !== 'undefined') {
                  (activeQuestionMessageId as any).value = desiredQuestionMessageId.value
                }
                if (activeQuestionIndex && typeof (activeQuestionIndex as any).value !== 'undefined') {
                  (activeQuestionIndex as any).value = desiredQuestionIndex.value
                }
              }

              // 重置路由触发标记
              shouldOpenSmartQuestion.value = false
              desiredOpenSessionId.value = null
              desiredQuestionMessageId.value = null
              desiredQuestionIndex.value = null
            }, 600)
          })
        })
      },
      {immediate: true}
  )
  
  // 组件挂载时检查 query 参数并自动选择会话
  onMounted(async () => {
    if (route.query.openSmartQuestion === 'true') {
      shouldOpenSmartQuestion.value = true
      // 清除 query 参数
      router.replace({
        path: route.path,
        query: {
          ...route.query,
          openSmartQuestion: undefined
        }
      })
    }
  
    // 每次进入页面都执行滚动逻辑
    if (activeSessionId.value) {
      // 如果有活跃会话，重新加载消息并滚动到最后用户消息
      await loadMessages(activeSessionId.value)
    } else {
      // 如果没有活跃会话，默认进入"新建对话"页面而不是自动选择历史会话
      newChat()
    }
  })
  
  
  // 处理反馈
  const handleFeedback = (messageId: string, feedback: number) => {
    // 更新消息的反馈状态
    const message = messages.value.find(msg => msg.id === messageId)
    if (message) {
      message.isFeedback = feedback
    }
  }
  
  // 处理复制
  const handleCopy = () => {
    // 收集所有消息内容
    const allContent = messages.value
        .filter(msg => msg.content)
        .map(msg => {
          if (msg.role === 0) {
            return `用户: ${msg.content}`
          } else if (msg.role === 1) {
            return `AI: ${msg.content}`
          }
          return msg.content
        })
        .join('\n\n')
  
    if (allContent) {
      navigator.clipboard.writeText(allContent)
      message.success(t('chat.copySuccess'))
    }
  }
  
  // 处理重新提问（删除对应用户提问和AI回复后再重新请求）
  const handleResend = (messageIndex: number) => {
    // 安全检查：索引是否在当前消息列表范围内
    if (messageIndex < 0 || messageIndex >= messages.value.length) {
      return
    }
  
    const targetMessage = messages.value[messageIndex]
    // 仅对AI消息生效
    if (!targetMessage || targetMessage.role !== 1) {
      return
    }
  
    // 从当前AI消息往前找到最近的一条用户消息
    let userIndex = -1
    for (let i = messageIndex - 1; i >= 0; i--) {
      const msg = messages.value[i]
      if (msg.role === 0 && msg.content) {
        userIndex = i
        break
      }
    }
  
    if (userIndex === -1) {
      return
    }
  
    const userMessage = messages.value[userIndex]
    const userMessageContent = userMessage.content
    const userFileReferences = (() => {
      const metadataRefs = (userMessage.metadata as any)?.fileReferences as FileReference[] | null | undefined
      const messageRefs = userMessage.fileReferences as FileReference[] | null | undefined
      const merged = [...(metadataRefs || []), ...(messageRefs || [])]
      if (!merged.length) return null
      const seen = new Set<string>()
      return merged.filter((item) => {
        const key = item.id ?? `${item.fileName ?? ''}-${item.storagePath ?? ''}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    })()
  
    if (!userMessageContent) {
      return
    }
  
    // 删除用户提问到当前AI回复之间的所有消息（包含两端）
    const deleteCount = messageIndex - userIndex + 1
    if (deleteCount > 0) {
      messages.value.splice(userIndex, deleteCount)
    }
  
    // 使用原始用户内容重新请求
    resendMessage(userMessageContent, userFileReferences)
  }
  
  
  // 我的收藏
  const handleMyFavorites = () => {
    // TODO: 实现我的收藏功能
  }
  
  // 处理置顶切换
  const handleTogglePin = async () => {
    if (!currentSession.value?.id) {
      return
    }
  
    const newPinStatus = currentSession.value.isPinned === 1 ? false : true
    await pinSession(currentSession.value.id, newPinStatus)
  
    // 更新当前会话状态
    if (currentSession.value) {
      currentSession.value.isPinned = newPinStatus ? 1 : 0
    }
  
    // 刷新侧边栏会话列表
    chatSidebarRef.value?.loadSessions()
  
    // 显示成功提示
    message.success(newPinStatus ? `${t('chat.session.pin')}${t('common.success')}` : `${t('chat.session.unpin')}${t('common.success')}`)
  }
  
  // 处理收藏切换
  const handleToggleFavorite = async () => {
    if (!currentSession.value?.id) {
      return
    }
  
    const newFavoriteStatus = currentSession.value.isFavorite === 1 ? false : true
    await favoriteSession(currentSession.value.id, newFavoriteStatus)
  
    // 更新当前会话状态
    if (currentSession.value) {
      currentSession.value.isFavorite = newFavoriteStatus ? 1 : 0
    }
  
    // 刷新侧边栏会话列表
    chatSidebarRef.value?.loadSessions()
  
    // 显示成功提示
    message.success(newFavoriteStatus ? `${t('chat.session.favorite')}${t('common.success')}` : `${t('chat.session.unfavorite')}${t('common.success')}`)
  }
  </script>
  
  <style lang="scss" scoped>
  @use '@/assets/styles' as *;
  
  
  .celestial-hub-container {
    display: flex;
    width: 80vw;
    max-width: 1400px;
    height: 70vh;
    max-height: 650px;
    background-color: var(--background-color);
    margin: 0;
    padding: 0;
    overflow: hidden;
    border-radius: 16px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  
    .chat-file-input {
      display: none;
    }
  
    .session-files-drawer {
      padding: 12px 0;
  
      .n-spin-container {
        min-height: 120px;
      }
  
      .session-file-item {
        padding: 12px 0;
        border-bottom: 1px solid var(--border-secondary-color);
        display: flex;
        flex-direction: column;
        gap: 6px;
  
        &:last-child {
          border-bottom: none;
        }
  
        .file-main {
          display: flex;
          align-items: center;
          gap: 12px;
  
          .file-name {
            flex: 1;
            font-weight: 600;
            color: var(--text-color);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
  
        .file-meta {
          font-size: 12px;
          color: var(--text-secondary-color);
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
      }
    }
  }
  
  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background-color: var(--background-color);
    position: relative;
    transition: all 0.25s ease;
  
    .chat-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px;
      background-color: var(--background-color);
  
      .chat-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-color);
      }
  
      .chat-actions {
        display: flex;
        gap: 16px;
        margin-right: 16px;
  
        .header-icon {
          cursor: pointer;
          color: var(--text-secondary-color);
          transition: all 0.2s ease;
  
          &:hover {
            color: var(--color-primary);
          }
  
          &.active {
            color: var(--warning-color);
          }
        }
      }
    }
  
    .chat-content-wrapper {
      flex: 1;
      display: flex;
      flex-direction: row;
      overflow: hidden;
      gap: 0;
      position: relative;
    }
  
    // 聊天切换过渡动画
    .chat-switch-enter-active,
    .chat-switch-leave-active {
      transition: all 0.35s ease-out;
    }
  
    .chat-switch-enter-from {
      opacity: 0;
      transform: translateY(100%);
    }
  
    .chat-switch-enter-to {
      opacity: 1;
      transform: translateY(0);
    }
  
    .chat-switch-leave-from {
      opacity: 1;
      transform: translateY(0);
    }
  
    .chat-switch-leave-to {
      opacity: 0;
      transform: translateY(-100%);
    }
  
    .chat-main-column {
      flex: 0 0 auto;
      flex-basis: 100%;
      max-width: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      padding: 16px 16px 24px 24px;
      box-sizing: border-box;
      transition: flex-basis 0.35s ease, max-width 0.35s ease, padding 0.35s ease;
    }
  
    .chat-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
  
      .loading-indicator {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 24px;
      }
  
      .messages-wrapper {
        flex: 1;
        overflow-y: auto;
  
        &::-webkit-scrollbar {
          width: 8px;
        }
  
        &::-webkit-scrollbar-track {
          background: var(--background-tertiary-color);
        }
  
        &::-webkit-scrollbar-thumb {
          background: var(--border-color);
          border-radius: 4px;
          transition: background 0.3s ease;
        }
  
        &::-webkit-scrollbar-thumb:hover {
          background: var(--text-secondary-color);
        }
      }
  
      .messages-container {
        width: 65%;
        margin: 0 auto;
        padding: 16px 0 24px;
        transition: width 0.25s ease;
      }
    }
  
    .input-container {
      padding: 16px 0 0;
      background-color: var(--background-color);
  
      .input-wrapper {
        width: 60%;
        margin: 0 auto;
        transition: width 0.25s ease;
      }
  
      &.empty-state-input {
        position: absolute;
        bottom: auto;
        top: 52%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 0;
        width: 60%;
        z-index: 5;
        transition: opacity 0.4s ease-out, transform 0.4s ease-out;
  
        .input-wrapper {
          width: 100%;
        }
      }
    }
  
    .empty-state-wrapper {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      min-height: 0;
    }
  
    .gemini-empty-state {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 48px 24px;
      background-color: var(--background-color);
      position: relative;
      padding-bottom: 0;
      min-height: 0;
  
      .ai-name-container {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 200;
        padding: 24px;
      }
  
      .greeting-wrapper {
        width: 60%;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: absolute;
        top: 35%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 4;
        transition: opacity 0.4s ease-out, transform 0.4s ease-out;
      }
  
      .ai-name-text {
        font-size: 32px;
        font-weight: 700;
        background: linear-gradient(
                90deg,
                #ffd700 0%,
                #ffb347 25%,
                #ff8c00 50%,
                #ffb347 75%,
                #ffd700 100%
        );
        background-size: 200% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        animation: goldenFlow 3s linear infinite;
        text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
  
        @keyframes goldenFlow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 200% 50%;
          }
        }
      }
  
      .greeting-text {
        font-size: 36px;
        font-weight: 500;
        color: var(--color-primary);
        margin-bottom: 0;
        text-align: center;
        width: 100%;
      }
    }
  
    .slide-out-left {
      animation: slideOutLeft 0.4s ease-out forwards;
    }
  
    .smart-question-modal-container {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      width: 100%;
      height: 100%;
      z-index: 100;
      opacity: 0;
      transform: translateX(100%);
      pointer-events: none;
      padding-top: 80px;
      box-sizing: border-box;
  
      &.slide-in-right {
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
        animation: slideInRightContainer 0.4s ease-out forwards;
      }
  
      &.slide-out-right {
        animation: slideOutRightContainer 0.4s ease-out forwards;
        pointer-events: none;
      }
    }
  
    @keyframes slideInRightContainer {
      0% {
        opacity: 0;
        transform: translateX(100%);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
  
    @keyframes slideOutRightContainer {
      0% {
        opacity: 1;
        transform: translateX(0);
      }
      100% {
        opacity: 0;
        transform: translateX(100%);
      }
    }
  
    @keyframes slideOutLeft {
      0% {
        opacity: 1;
        transform: translateX(0);
      }
      100% {
        opacity: 0;
        transform: translateX(-100%);
      }
    }
  
    .slide-in-right {
      animation: slideInRight 0.4s ease-out forwards;
    }
  
    @keyframes slideInRight {
      0% {
        opacity: 0;
        transform: translateX(100%);
      }
      100% {
        opacity: 1;
        transform: translateX(0);
      }
    }
  
    .slide-in-left {
      animation: slideInLeft 0.4s ease-out forwards;
    }
  
    @keyframes slideInLeft {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) translateX(-100%);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%) translateX(0);
      }
    }
  
    .input-container.empty-state-input.slide-in-left {
      animation: slideInLeftInput 0.4s ease-out forwards;
    }
  
    @keyframes slideInLeftInput {
      0% {
        opacity: 0;
        transform: translate(-50%, -50%) translateX(-100%);
      }
      100% {
        opacity: 1;
        transform: translate(-50%, -50%) translateX(0);
      }
    }
  
    .question-panel-wrapper {
      flex: 0 0 auto;
      flex-basis: 0%;
      max-width: 0%;
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 16px 32px 24px 8px;
      box-sizing: border-box;
      opacity: 0;
      transform: translateX(24px);
      transition: flex-basis 0.35s ease, max-width 0.35s ease, opacity 0.3s ease, transform 0.35s ease;
      overflow: hidden;
      pointer-events: none;
  
      .question-panel {
        border-left: 1px solid var(--border-color);
        background-color: var(--background-color);
        display: flex;
        flex-direction: column;
        height: 100%;
        box-sizing: border-box;
        padding: 16px 20px;
        margin: 0;
        border-radius: 16px;
        box-shadow: 0 0 0 1px var(--border-color);
        opacity: 0;
        transform: translateX(16px);
        transition: opacity 0.35s ease, transform 0.35s ease;
        min-height: 0;
      }
  
      :deep(.smart-question-panel) {
        width: 100%;
        height: 100%;
        margin: 0;
        border-left: 1px solid var(--border-color);
        border-radius: 16px;
        box-shadow: 0 0 0 1px var(--border-color);
        opacity: 0;
        transform: translateX(16px);
        transition: opacity 0.35s ease, transform 0.35s ease;
      }
  
      &.is-visible {
        flex-basis: 60%;
        max-width: 60%;
        opacity: 1;
        transform: translateX(0);
        pointer-events: auto;
  
        .question-panel {
          opacity: 1;
          transform: translateX(0);
        }
  
        :deep(.smart-question-panel) {
          opacity: 1;
          transform: translateX(0);
        }
      }
    }
  
    .question-panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
  
      .question-panel-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--text-color);
      }
    }
  
    .question-panel-body {
      flex: 1;
      overflow-y: auto;
      padding-right: 4px;
      min-height: 0;
  
      &::-webkit-scrollbar {
        width: 6px;
      }
  
      &::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 3px;
      }
    }
  
    .question-panel-item {
      padding: 8px 0;
  
      & + .question-panel-item {
        border-top: 1px dashed var(--border-color);
      }
  
      .question-panel-item-title {
        font-size: 13px;
        line-height: 1.6;
        color: var(--text-color);
      }
    }
  
    &.with-question-panel {
      .chat-main-column {
        flex-basis: 40%;
        max-width: 40%;
      }
  
      .chat-content {
        .messages-container {
          width: 100%;
        }
      }
  
      .input-container {
        .input-wrapper {
          width: 100%;
        }
      }
    }
  }
  </style>
  