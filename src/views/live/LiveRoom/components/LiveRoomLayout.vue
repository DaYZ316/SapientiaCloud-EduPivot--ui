<template>
  <div :class="['room-layout', {
    'is-connected': context.connectionIsConnected.value,
    'chat-collapsed': context.isChatCollapsed.value,
    'single-video': isSingleVideo,
    'chat-collapsed-with-video': isChatCollapsedWithVideo
  }]">
    <!-- 网络状态提示 -->
    <network-status />

    <section class="video-panel">
      <!-- 顶部状态栏 -->
      <div class="video-panel-header">
        <connection-status
          :room-status="context.roomInfo.value?.status || null"
          :online-count="context.onlineCount.value"
          :current-user-role="context.currentUserRole.value"
          :is-recording="context.recording.isRecording.value"
          :recording-status-label="context.recording.recordingStatusLabel.value"
          :connection-state-label="context.connectionStateLabel.value"
          :connection-error="context.connectionError.value"
          :show-leave-button="context.connectionIsConnected.value"
          @leave="context.handleLeave()"
        />
      </div>

      <div class="video-panel-content">
        <video-panel
          ref="videoPanelRef"
          :is-connected="context.connectionIsConnected.value"
          :connecting="context.connectionConnecting.value"
          :connection-state-label="context.connectionStateLabel.value"
          :remote-participants="context.remoteParticipants.value"
          :layout-mode="context.layoutMode.value"
          :main-participant-id="context.activeMainParticipantId.value"
          :speaker-volume="speakerVolumeValue"
          :local-video-track="context.localVideoTrack.value"
          @select-main="handleSelectMain"
        />
      </div>

      <div v-if="context.connectionIsConnected.value" class="video-overlay">
        <media-controls
          :camera-enabled="context.cameraEnabled.value"
          :microphone-enabled="context.microphoneEnabled.value"
          :is-recording="context.recording.isRecording.value"
          :recording-loading="context.recordingLoading.value"
          :current-user-role="context.currentUserRole.value"
          :can-record="context.recording.canRecord(context.roomInfo.value, context.currentUserRole.value)"
          :speaker-volume="speakerVolumeValue"
          :icon-only="true"
          :is-overlay="true"
          :show-recording="true"
          @toggle-camera="handleToggleCamera"
          @toggle-microphone="handleToggleMicrophone"
          @toggle-recording="handleToggleRecording"
          @update-speaker-volume="handleSpeakerVolumeChange"
        />

        <!-- 布局控制按钮 -->
        <div class="layout-controls">
          <!-- 布局切换按钮 -->
          <n-button quaternary size="small" @click="handleToggleLayoutMode">
            <template #icon>
              <n-icon :component="context.layoutMode.value === 'grid' ? PersonOutline : GridOutline" />
            </template>
          </n-button>
          <!-- 全屏按钮 -->
          <n-button quaternary size="small" @click="handleToggleFullscreen">
            <template #icon>
              <n-icon :component="context.isFullscreen.value ? ContractOutline : ExpandOutline" />
            </template>
          </n-button>
        </div>

      </div>

    </section>

    <section v-show="!context.isFullscreen.value || !context.isChatCollapsed.value" :class="['chat-panel', {'chat-panel-connected': context.connectionIsConnected.value, 'chat-panel-collapsed': context.isChatCollapsed.value}]">
      <div class="chat-panel-top">
      </div>

      <ChatPanel
        ref="chatPanelRef"
        :can-send="true"
        :extra="`${context.chatOnlineCount.value} ${t('live.room.members')}`"
        :fixed-footer="true"
        :loading="false"
        :messages="context.chatMessages.value"
        :placeholder="t('live.room.chatPlaceholder')"
        :show-header="true"
        :sub-title="t('live.room.chatDescription')"
        :title="t('live.room.chatTitle')"
        :is-collapsed="context.isChatCollapsed.value"
        :unread-count="context.unreadMessageCount.value"
        @send="handleSendMessage"
        @toggle-collapse="handleToggleChatCollapse"
        style="height: 100%; flex: 1 1 auto; min-height: 0;"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NIcon } from 'naive-ui'
import { ContractOutline, ExpandOutline, GridOutline, PersonOutline } from '@vicons/ionicons5'
import ChatPanel from '@/components/common/ChatPanel.vue'
import VideoPanel from './VideoPanel.vue'
import MediaControls from './MediaControls.vue'
import NetworkStatus from './NetworkStatus.vue'
import { useLiveRoomContext } from '../composables/useLiveRoomContext'

const { t } = useI18n()

// 使用注入的上下文
const context = useLiveRoomContext()

const speakerVolumeValue = computed(() => context.speakerVolume.value ?? 100)

// 布局优化计算
const isSingleVideo = computed(() => context.activeVideoCount.value <= 1)
const isChatCollapsedWithVideo = computed(() => context.isChatCollapsed.value && context.activeVideoCount.value > 0)
const handleSelectMain = (participantId: string) => {
  context.handleSelectMain(participantId)
}

const handleToggleCamera = () => {
  context.handleToggleCamera()
}

const handleToggleMicrophone = () => {
  context.handleToggleMicrophone()
}

const handleToggleRecording = () => {
  context.handleToggleRecording()
}

const handleSpeakerVolumeChange = (value: number) => {
  context.handleSpeakerVolumeChange(value)
}

const handleToggleLayoutMode = () => {
  context.handleToggleLayoutMode()
}

const handleToggleFullscreen = () => {
  context.handleToggleFullscreen()
}

const handleSendMessage = (content: string) => {
  context.handleSendMessage(content)
}

const handleToggleChatCollapse = () => {
  context.handleToggleChatCollapse()
}
// 引用 VideoPanel 的组件实例（同名 ref 在模板上）
const videoPanelRef = ref<any>(null)

onMounted(() => {
  // 将 videoPanelRef 注册到 liveRoom context（useLiveRoom 中会处理附加逻辑）
  context.registerVideoPanel?.(videoPanelRef)
})

onUnmounted(() => {
  context.unregisterVideoPanel?.()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.room-layout {
  display: flex;
  gap: 16px;
  align-items: stretch;
  /* ensure children can shrink properly inside cards */
  min-height: 360px;
  /* 拉伸为接近全屏高度，确保视频与聊天占满页面（根据实际顶部导航高度可调整） */
  height: calc(100vh - 120px);
  box-sizing: border-box;
}


.room-layout .video-panel {
  /* 增大视频面板占比，让左侧视频更大 */
  flex: 1.6 1 0%;
  min-width: 0; /* allow children to shrink */
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;

  /* 单视频时占满左侧空间 */
  .room-layout.single-video & {
    flex: 1 1 0%;
  }

  /* 聊天室折叠且有视频时，进一步放大 */
  .room-layout.chat-collapsed-with-video & {
    flex: 1 1 0%;
  }
}

.room-layout .chat-panel {
  /* 缩小聊天面板宽度以让视频占更多空间 */
  width: 300px;
  min-width: 240px;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
}

/* 将 video-overlay 放到底部，默认隐藏，hover 时显示 */
.video-overlay {
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  pointer-events: auto;
  opacity: 0;
  transition: opacity 0.18s ease;
}
.room-layout .video-panel:hover .video-overlay {
  opacity: 1;
}

.layout-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.chat-panel-top {
  padding: 8px 12px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

/* When chat is collapsed, keep just a small width for the collapsed state */
.room-layout.chat-collapsed .chat-panel,
.room-layout .chat-panel.chat-panel-collapsed {
  width: 80px;
  min-width: 80px;
}

/* When chat is collapsed and has video, hide chat completely for full video experience */
.room-layout.chat-collapsed-with-video .chat-panel {
  display: none;
}

/* Fullscreen: hide chat completely when in fullscreen and chat-collapsed is true */
</style>
