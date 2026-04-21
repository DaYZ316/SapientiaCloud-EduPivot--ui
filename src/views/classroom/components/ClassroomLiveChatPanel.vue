<template>
  <div class="classroom-live-chat">
    <div
        v-if="barrageEnabledResolved"
        class="classroom-live-chat__barrage-layer"
        :style="barrageLayerStyleResolved"
    >
      <div
          v-for="item in barrageItemsResolved"
          :key="item.id"
          :class="['classroom-live-chat__barrage-item', `classroom-live-chat__barrage-item--lane-${item.lane}`]"
          @animationend="handleBarrageAnimationEnd(item.id)"
      >
        <span class="classroom-live-chat__barrage-sender">{{ item.sender }}</span>
        <span class="classroom-live-chat__barrage-content">{{ item.content }}</span>
      </div>
    </div>

    <n-button
        v-if="collapsedResolved"
        class="classroom-live-chat__collapsed-trigger"
        quaternary
        type="primary"
        @click="toggleCollapsed"
    >
      <template #icon>
        <n-icon :component="ChevronBackOutline"/>
      </template>
    </n-button>

    <aside v-if="!collapsedResolved" class="classroom-live-chat__sidebar" :style="sidebarStyleResolved">
      <button
          class="classroom-live-chat__resize-handle"
          type="button"
          @mousedown="startResize"
      />

      <div class="classroom-live-chat__header">
        <div class="classroom-live-chat__titles">
          <div class="classroom-live-chat__title">{{ t('live.room.chatTitle') }}</div>
          <div class="classroom-live-chat__subtitle">{{ extraTextResolved }}</div>
        </div>

        <div class="classroom-live-chat__header-actions">
          <n-button
              v-if="summaryEnabledResolved"
              :disabled="summaryDisabledResolved"
              quaternary
              size="small"
              @click="handleRequestSummary"
          >
            {{ t('live.room.chatSummary') }}
          </n-button>

          <n-switch v-if="false" :value="barrageEnabledResolved" size="small" @update:value="handleBarrageSwitch">
            <template #checked>{{ t('live.room.barrage') }}</template>
            <template #unchecked>{{ t('live.room.barrage') }}</template>
          </n-switch>

          <n-button circle quaternary size="small" @click="toggleCollapsed">
            <template #icon>
              <n-icon :component="ChevronForwardOutline"/>
            </template>
          </n-button>
        </div>
      </div>

      <div class="classroom-live-chat__body">
        <div v-if="statusTextResolved" class="classroom-live-chat__status">
          {{ statusTextResolved }}
        </div>

        <ChatPanel
            :can-send="roomReadyResolved"
            :extra="extraTextResolved"
            :fixed-footer="true"
            :is-collapsed="false"
            :loading="loadingResolved"
            :messages="messagesResolved"
            :placeholder="roomReadyResolved ? t('live.room.chatPlaceholder') : t('live.room.chatNotStarted')"
            :show-header="false"
            :sub-title="t('live.room.chatDescription')"
            :title="t('live.room.chatTitle')"
            :unread-count="unreadCountResolved"
            @send="handleSendMessage"
        />
      </div>
    </aside>
  </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {NButton, NIcon, NSwitch} from 'naive-ui'
import {ChevronBackOutline, ChevronForwardOutline} from '@vicons/ionicons5'
import {fetchEventSource} from '@microsoft/fetch-event-source'
import ChatPanel from '@/components/common/ChatPanel.vue'
import {apiConfig} from '@/utils/http'
import {appendLiveRoomMessage, getActiveLiveRoom, getLatestLiveRoom, getRoomMemberCount, getSseToken, listLiveRoomMessages} from '@/api/live/liveRoom'
import {useUserStore} from '@/store/modules/user'
import {LiveRoomRoleEnum, LiveRoomStatusEnum} from '@/enum/live'
import type {LiveChatSummaryRequestPayload, LiveRoomChatMessage, LiveRoomVO} from '@/types/live'

type BarrageItem = {
  id: string
  sender: string
  content: string
  lane: number
}

type LiveRoomMessagePayload = {
  id?: string | null
  content?: string | null
  sender?: string | null
  senderName?: string | null
  senderId?: string | null
  sendTime?: string | null
}

const props = defineProps<{
  classroomId: string | null
  courseId?: string | null
  summaryEnabled?: boolean | null
}>()

const emit = defineEmits<{
  requestSummary: [payload: LiveChatSummaryRequestPayload]
}>()

const {t} = useI18n()
const userStore = useUserStore()

const loading = ref<boolean | null>(null)
const roomInfo = ref<LiveRoomVO | null>(null)
const messages = ref<LiveRoomChatMessage[] | null>(null)
const unreadCount = ref<number | null>(null)
const memberCount = ref<number | null>(null)
const statusText = ref<string | null>(null)
const barrageItems = ref<BarrageItem[] | null>(null)
const barrageEnabled = ref<boolean | null>(null)
const collapsed = ref<boolean | null>(null)
const panelWidth = ref<number | null>(null)
const sseController = ref<AbortController | null>(null)
const pollingTimer = ref<number | null>(null)
const barrageLaneCursor = ref<number | null>(null)
const lastMessageSignature = ref<string | null>(null)
const resizing = ref<boolean | null>(null)
const resizeStartX = ref<number | null>(null)
const resizeStartWidth = ref<number | null>(null)

const minPanelWidth = 320
const maxPanelWidth = 520

const loadingResolved = computed(() => Boolean(loading.value))
const messagesResolved = computed<LiveRoomChatMessage[]>(() => messages.value || [])
const unreadCountResolved = computed(() => unreadCount.value || 0)
const memberCountResolved = computed(() => memberCount.value || 1)
const statusTextResolved = computed(() => statusText.value || '')
const barrageItemsResolved = computed<BarrageItem[]>(() => barrageItems.value || [])
const barrageEnabledResolved = computed(() => Boolean(barrageEnabled.value))
const collapsedResolved = computed(() => Boolean(collapsed.value))
const summaryEnabledResolved = computed(() => Boolean(props.summaryEnabled))
const summaryDisabledResolved = computed(() => loadingResolved.value || messagesResolved.value.length === 0)
const roomReadyResolved = computed(() => {
  const status = roomInfo.value?.status ?? null
  return Boolean(roomInfo.value?.id) && status === LiveRoomStatusEnum.LIVE
})
const extraTextResolved = computed(() => `${memberCountResolved.value} ${t('live.room.members')}`)
const sidebarStyleResolved = computed(() => {
  return {
    width: `${panelWidth.value || 380}px`
  }
})
const barrageLayerStyleResolved = computed(() => {
  return {
    right: collapsedResolved.value ? '52px' : `${(panelWidth.value || 380) + 24}px`
  }
})

const stopPolling = () => {
  if (pollingTimer.value !== null) {
    clearInterval(pollingTimer.value)
    pollingTimer.value = null
  }
}

const teardownSseListener = () => {
  if (sseController.value) {
    sseController.value.abort()
    sseController.value = null
  }
}

const resetLiveState = () => {
  roomInfo.value = null
  messages.value = []
  memberCount.value = 1
  unreadCount.value = 0
  statusText.value = t('live.room.noActiveLive')
  teardownSseListener()
}

const resolveSenderRole = (): LiveRoomRoleEnum => {
  if (userStore.teacherInfo) {
    return LiveRoomRoleEnum.TEACHER
  }
  if (userStore.roles?.some((item: { roleKey?: string }) => item.roleKey === 'ASSISTANT')) {
    return LiveRoomRoleEnum.ASSISTANT
  }
  return LiveRoomRoleEnum.STUDENT
}

const mapMessage = (item: LiveRoomMessagePayload, isOwn: boolean): LiveRoomChatMessage => {
  return {
    id: item.id || `${Date.now()}`,
    sender: item.senderName || item.sender || t('live.room.unknown'),
    content: item.content || '',
    timestamp: item.sendTime ? new Date(item.sendTime).toLocaleTimeString() : new Date().toLocaleTimeString(),
    isOwn
  }
}

const handleBarrageAnimationEnd = (id: string) => {
  barrageItems.value = (barrageItems.value || []).filter((item) => item.id !== id)
}

const addBarrageMessage = (message: LiveRoomChatMessage) => {
  if (!barrageEnabledResolved.value) {
    return
  }

  const content = message.content.trim()
  if (!content) {
    return
  }

  const signature = `${message.sender}:${content}:${message.timestamp}`
  if (lastMessageSignature.value === signature) {
    return
  }
  lastMessageSignature.value = signature

  const lane = (barrageLaneCursor.value || 0) % 4
  barrageLaneCursor.value = lane + 1

  const nextItem: BarrageItem = {
    id: `${message.id}-barrage`,
    sender: `${message.sender}:`,
    content,
    lane
  }

  const currentItems = barrageItems.value || []
  const nextItems = [...currentItems, nextItem]
  barrageItems.value = nextItems.slice(Math.max(nextItems.length - 12, 0))
}

const appendMessage = (message: LiveRoomChatMessage) => {
  const currentList = messages.value || []
  const exists = currentList.some((item) => item.id === message.id)
  if (exists) {
    return
  }

  messages.value = [...currentList, message]

  if (collapsedResolved.value && !message.isOwn) {
    unreadCount.value = (unreadCount.value || 0) + 1
  }

  if (!message.isOwn) {
    addBarrageMessage(message)
  }
}

const loadMemberCount = (roomId: string) => {
  getRoomMemberCount(roomId).then((result) => {
    const count = result?.data ?? result ?? 1
    memberCount.value = Number(count) > 0 ? Number(count) : 1
  }, () => {
    memberCount.value = memberCount.value || 1
  })
}

const loadHistoryMessages = (roomId: string) => {
  return listLiveRoomMessages(roomId, 50).then((response) => {
    const history = response?.data || []
    const currentUserId = userStore.userInfo?.id || null
    const currentNickName = userStore.userInfo?.nickName || null
    messages.value = history.slice().reverse().map((item: LiveRoomMessagePayload) => {
      const senderName = item.senderName || item.sender || t('live.room.unknown')
      const isOwn = senderName === currentNickName || item.senderId === currentUserId
      return mapMessage({
        id: item.id || null,
        content: item.content || '',
        senderName,
        sendTime: item.sendTime || null
      }, isOwn)
    })
  }, () => {
    messages.value = []
  })
}

const setupSseListener = () => {
  teardownSseListener()

  if (!props.classroomId || !userStore.token) {
    return
  }

  getSseToken(props.classroomId).then((response) => {
    const sseToken = response?.data || null
    if (!sseToken) {
      return
    }

    const baseUrl = apiConfig.getBaseUrl()
    const sseUrl = `${baseUrl}/live/live/subscribe?classroomId=${props.classroomId}&token=${sseToken}`
    const controller = new AbortController()
    sseController.value = controller

    return fetchEventSource(sseUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${userStore.token}`,
        Accept: 'text/event-stream'
      },
      signal: controller.signal,
      openWhenHidden: true,
      credentials: 'include',
      onmessage: (event) => {
        if (!event.data || !event.data.startsWith('{')) {
          return
        }

        Promise.resolve(event.data).then((raw) => JSON.parse(raw)).then((parsed) => {
          if (!parsed || parsed.event !== 'chat_message' || !parsed.data) {
            return
          }

          const payload = parsed.data as LiveRoomMessagePayload
          const senderName = payload.senderName || payload.sender || t('live.room.unknown')
          const isOwn = senderName === (userStore.userInfo?.nickName || null)
          appendMessage(mapMessage({
            id: payload.id || null,
            content: payload.content || '',
            senderName,
            sendTime: payload.sendTime || null
          }, isOwn))
        }, () => undefined)
      },
      onerror: () => {
        teardownSseListener()
      }
    })
  }, () => undefined)
}

const resolveLiveRoom = () => {
  if (!props.classroomId) {
    resetLiveState()
    return Promise.resolve(null)
  }

  loading.value = true

  return getActiveLiveRoom(props.courseId || null, props.classroomId).then((activeResponse) => {
    const activeRoom = activeResponse?.data || null
    if (activeRoom?.id) {
      return activeRoom
    }
    return getLatestLiveRoom(props.courseId || null, props.classroomId).then((latestResponse) => latestResponse?.data || null)
  }).then((room) => {
    if (!room?.id) {
      resetLiveState()
      return null
    }

    const previousRoomId = roomInfo.value?.id || null
    const roomChanged = previousRoomId !== room.id

    roomInfo.value = room
    statusText.value = room.status === LiveRoomStatusEnum.LIVE ? null : t('live.room.chatNotStarted')
    loadMemberCount(room.id)

    if (room.status !== LiveRoomStatusEnum.LIVE) {
      messages.value = []
      teardownSseListener()
      return room
    }

    statusText.value = null
    if (roomChanged || !messages.value || messages.value.length === 0) {
      setupSseListener()
      return loadHistoryMessages(room.id).then(() => room)
    }
    return room
  }, () => {
    resetLiveState()
    return null
  }).finally(() => {
    loading.value = false
  })
}

const handleSendMessage = (content: string) => {
  const roomId = roomInfo.value?.id || null
  const trimmed = content.trim()

  if (!roomId || !trimmed || !roomReadyResolved.value) {
    return
  }

  const sender = userStore.userInfo?.nickName || t('live.room.me')
  const localMessage: LiveRoomChatMessage = {
    id: `${Date.now()}`,
    sender,
    content: trimmed,
    timestamp: new Date().toLocaleTimeString(),
    isOwn: true
  }

  appendMessage(localMessage)

  appendLiveRoomMessage(roomId, {
    content: trimmed,
    messageType: 'text',
    senderRole: resolveSenderRole()
  }).then((response) => {
    const serverMessage = response?.data || null
    if (!serverMessage) {
      return
    }

    messages.value = (messages.value || []).map((item) => {
      if (item.id === localMessage.id) {
        return mapMessage({
          id: serverMessage.id || localMessage.id,
          content: serverMessage.content || localMessage.content,
          senderName: (serverMessage as LiveRoomMessagePayload).senderName || sender,
          sendTime: serverMessage.sendTime || null
        }, true)
      }
      return item
    })
  }, () => {
    messages.value = (messages.value || []).filter((item) => item.id !== localMessage.id)
  })
}

const startPolling = () => {
  stopPolling()
  pollingTimer.value = window.setInterval(() => {
    void resolveLiveRoom()
  }, 10000)
}

const toggleCollapsed = () => {
  collapsed.value = !collapsedResolved.value
}

const handleBarrageSwitch = (value: boolean) => {
  barrageEnabled.value = value
  if (!value) {
    barrageItems.value = []
  }
}

const handleRequestSummary = () => {
  if (summaryDisabledResolved.value) {
    return
  }

  const filteredMessages = messagesResolved.value
      .filter((item) => item.content && item.content.trim().length > 0)
      .slice(-100)
      .map((item) => ({
        id: item.id || null,
        sender: item.sender || null,
        content: item.content.trim().slice(0, 500),
        timestamp: item.timestamp || null,
        isOwn: item.isOwn ?? null
      }))

  emit('requestSummary', {
    roomId: roomInfo.value?.id || null,
    classroomId: props.classroomId || null,
    courseId: props.courseId || null,
    summaryType: 'brief',
    messages: filteredMessages
  })
}

const clampPanelWidth = (value: number) => {
  return Math.min(maxPanelWidth, Math.max(minPanelWidth, value))
}

const stopResize = () => {
  resizing.value = false
  resizeStartX.value = null
  resizeStartWidth.value = null
  window.removeEventListener('mousemove', handleResizeMove)
  window.removeEventListener('mouseup', stopResize)
}

const handleResizeMove = (event: MouseEvent) => {
  if (!resizing.value || resizeStartX.value === null || resizeStartWidth.value === null) {
    return
  }

  const delta = resizeStartX.value - event.clientX
  panelWidth.value = clampPanelWidth(resizeStartWidth.value + delta)
}

const startResize = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  resizing.value = true
  resizeStartX.value = event.clientX
  resizeStartWidth.value = panelWidth.value || 380
  window.addEventListener('mousemove', handleResizeMove)
  window.addEventListener('mouseup', stopResize)
}

watch(() => props.classroomId, () => {
  void resolveLiveRoom()
}, {immediate: true})

watch(collapsedResolved, (value) => {
  if (!value) {
    unreadCount.value = 0
  }
})

onMounted(() => {
  loading.value = false
  roomInfo.value = null
  messages.value = []
  unreadCount.value = 0
  memberCount.value = 1
  statusText.value = t('live.room.noActiveLive')
  barrageItems.value = []
  barrageEnabled.value = false
  collapsed.value = false
  panelWidth.value = 380
  barrageLaneCursor.value = 0
  resizing.value = false
  startPolling()
})

onBeforeUnmount(() => {
  stopPolling()
  teardownSseListener()
  stopResize()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.classroom-live-chat {
  position: fixed;
  top: 72px;
  right: 0;
  bottom: 24px;
  z-index: 1003;
  pointer-events: none;
}

.classroom-live-chat__sidebar {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-top-left-radius: 12px;
  border-bottom-left-radius: 12px;
  border-left: 1px solid color-mix(in srgb, var(--border-color) 78%, transparent);
  border-top: 1px solid color-mix(in srgb, var(--border-color) 78%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 78%, transparent);
  background: color-mix(in srgb, var(--background-secondary-color) 94%, transparent);
  box-shadow: -12px 0 28px color-mix(in srgb, var(--shadow-color) 52%, transparent);
  backdrop-filter: blur(12px);
  pointer-events: auto;
  transition: width 0.2s ease;
}

.classroom-live-chat__collapsed-trigger {
  position: absolute;
  top: 50%;
  right: 0;
  width: 34px;
  height: 68px;
  min-width: 34px;
  padding: 0;
  transform: translateY(-50%);
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 34px;
  border-bottom-left-radius: 34px;
  border: 1px solid color-mix(in srgb, var(--border-color) 78%, transparent);
  border-right: 0;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--background-secondary-color) 94%, transparent);
  box-shadow: -8px 0 20px color-mix(in srgb, var(--shadow-color) 42%, transparent);
  backdrop-filter: blur(12px);
  pointer-events: auto;
}

.classroom-live-chat__resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  width: 10px;
  height: 100%;
  border: 0;
  background: transparent;
  cursor: col-resize;
}

.classroom-live-chat__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 56px;
  padding: 10px 12px 10px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-secondary-color) 72%, transparent);
  background: color-mix(in srgb, var(--background-tertiary-color) 78%, transparent);
}

.classroom-live-chat__titles {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.classroom-live-chat__title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
}

.classroom-live-chat__subtitle {
  font-size: 12px;
  color: var(--text-color-3);
}

.classroom-live-chat__header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.classroom-live-chat__body {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.classroom-live-chat__status {
  padding: 10px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-secondary-color) 72%, transparent);
  font-size: 12px;
  color: var(--text-color-3);
  background: color-mix(in srgb, var(--background-color) 78%, transparent);
}

.classroom-live-chat__barrage-layer {
  position: fixed;
  top: 88px;
  left: 24px;
  height: 200px;
  overflow: hidden;
  pointer-events: none;
  z-index: 1002;
}

.classroom-live-chat__barrage-item {
  position: absolute;
  right: -24px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  max-width: 420px;
  padding: 8px 14px;
  border-radius: 999px;
  color: var(--text-color);
  background: color-mix(in srgb, var(--background-color) 76%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 72%, transparent);
  box-shadow: 0 12px 24px color-mix(in srgb, var(--shadow-secondary-color) 60%, transparent);
  white-space: nowrap;
  animation: barrage-move 10s linear forwards;
  backdrop-filter: blur(8px);
}

.classroom-live-chat__barrage-item--lane-0 {
  top: 0;
}

.classroom-live-chat__barrage-item--lane-1 {
  top: 44px;
}

.classroom-live-chat__barrage-item--lane-2 {
  top: 88px;
}

.classroom-live-chat__barrage-item--lane-3 {
  top: 132px;
}

.classroom-live-chat__barrage-sender {
  max-width: 112px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--color-primary);
  font-weight: 600;
}

.classroom-live-chat__barrage-content {
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes barrage-move {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-100vw + 420px));
  }
}

@media (max-width: 768px) {
  .classroom-live-chat {
    top: 64px;
    bottom: 16px;
  }

  .classroom-live-chat__barrage-layer {
    top: 80px;
    left: 12px;
    right: 12px;
  }
}
</style>
