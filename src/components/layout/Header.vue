<template>
  <div class="dashboard-header">
    <!-- 左侧：菜单图标、刷新 -->
    <div class="header-left">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button
              circle
              quaternary
              size="medium"
              @click="handleMenuToggle"
          >
            <template #icon>
              <Icon :component="MenuOutline"/>
            </template>
          </n-button>
        </template>
        {{ t('header.toggleMenu') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button
              circle
              quaternary
              size="medium"
              @click="handleRefresh"
          >
            <template #icon>
              <Icon :component="RefreshOutline"/>
            </template>
          </n-button>
        </template>
        {{ t('header.refresh') }}
      </n-tooltip>
      <FastEnter/>
    </div>

    <!-- 中间：搜索框 -->
    <div class="header-center">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-input
              ref="searchInputRef"
              v-model:value="searchValue"
              :placeholder="t('header.searchPlaceholder')"
              clearable
              class="search-input"
          >
            <template #prefix>
              <Icon :component="SearchOutline"/>
            </template>
          </n-input>
        </template>
        {{ t('header.searchTooltip') }}
      </n-tooltip>
    </div>

    <!-- 右侧：全屏、通知、终端、设置、主题切换 -->
    <div class="header-right">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button
              circle
              quaternary
              size="medium"
              @click="handleFullscreenToggle"
          >
            <template #icon>
              <Icon :component="isFullscreen ? ContractOutline : ExpandOutline"/>
            </template>
          </n-button>
        </template>
        {{ isFullscreen ? t('header.exitFullscreen') : t('header.enterFullscreen') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button
              circle
              quaternary
              size="medium"
              @click="handleNotifications"
          >
            <template #icon>
              <Icon :component="NotificationsOutline"/>
            </template>
          </n-button>
        </template>
        {{ t('header.notifications') }}
      </n-tooltip>
      <n-dropdown
          :options="languageOptions"
          trigger="click"
          @select="handleLanguageChange"
      >
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
                circle
                quaternary
                size="medium"
            >
              <template #icon>
                <Icon :component="GlobeOutline"/>
              </template>
            </n-button>
          </template>
          {{ t('header.languageSelect') }}
        </n-tooltip>
      </n-dropdown>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button
              circle
              quaternary
              size="medium"
              @click="handleSettings"
          >
            <template #icon>
              <Icon :component="SettingsOutline"/>
            </template>
          </n-button>
        </template>
        {{ t('header.settings') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button
              circle
              quaternary
              size="medium"
              @click="handleThemeToggle"
          >
            <template #icon>
              <Icon :component="themeStore.isDarkMode ? SunnyOutline : MoonOutline"/>
            </template>
          </n-button>
        </template>
        {{ themeStore.isDarkMode ? t('header.switchToLightMode') : t('header.switchToDarkMode') }}
      </n-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from 'vue'
import {useRouter} from 'vue-router'
import {
  ContractOutline,
  ExpandOutline,
  GlobeOutline,
  MenuOutline,
  MoonOutline,
  NotificationsOutline,
  RefreshOutline,
  SearchOutline,
  SettingsOutline,
  SunnyOutline
} from '@vicons/ionicons5'
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {NDropdown, NButton, NInput, NTooltip} from 'naive-ui'
import Icon from '@/components/common/Icon.vue'
import FastEnter from '@/components/common/FastEnter.vue'
import {useThemeStore} from '@/store'
import {themeAnimation} from '@/utils/themeAnimation'
import {setLanguage} from '@/i18n'
import type {Locale} from '@/types/i18n'

const router = useRouter()
const themeStore = useThemeStore()
const { t } = useI18n()
const i18n = useI18n()

const searchValue = ref<string | null>(null)
const isFullscreen = ref(false)
const searchInputRef = ref<InstanceType<typeof NInput> | null>(null)

// 语言选项
const languageOptions = computed(() => [
  {
    label: t('header.simplifiedChinese'),
    key: 'zh-CN',
    disabled: i18n.locale.value === 'zh-CN'
  },
  {
    label: t('header.english'),
    key: 'en-US',
    disabled: i18n.locale.value === 'en-US'
  }
])

const handleMenuToggle = () => {
  themeStore.setSidebarCollapsed(!themeStore.sidebarCollapsed)
}

const handleRefresh = () => {
  window.location.reload()
}

const handleFullscreenToggle = () => {
  if (!isFullscreen.value) {
    enterFullscreen()
  } else {
    exitFullscreen()
  }
}

const enterFullscreen = () => {
  const element = document.documentElement
  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if ((element as any).webkitRequestFullscreen) {
    (element as any).webkitRequestFullscreen()
  } else if ((element as any).msRequestFullscreen) {
    (element as any).msRequestFullscreen()
  }
}

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen()
  } else if ((document as any).msExitFullscreen) {
    (document as any).msExitFullscreen()
  }
}

const handleFullscreenChange = () => {
  const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
  )
  isFullscreen.value = isCurrentlyFullscreen
}

const handleNotifications = () => {
  // 通知功能待实现
}

const handleLanguageChange = (key: string) => {
  setLanguage(key as Locale)
}

const handleSettings = () => {
  router.push('/settings')
}

const handleThemeToggle = (e: MouseEvent) => {
  themeAnimation(e)
}

// 全局快捷键监听
const handleGlobalKeydown = (e: KeyboardEvent) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    const inputElement = searchInputRef.value?.$el?.querySelector('input') as HTMLInputElement
    inputElement?.focus()
  }
}

onMounted(() => {
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)
  document.addEventListener('keydown', handleGlobalKeydown)

  handleFullscreenChange()
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
  document.removeEventListener('keydown', handleGlobalKeydown)
})
</script>

<style lang="scss" scoped>
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background-color: var(--background-color);
  gap: 16px;
  min-height: 64px;

  .header-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-shrink: 0;
  }

  .header-center {
    flex: 1;
    max-width: 400px;
    margin: 0 auto;

    .search-input {
      width: 100%;
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .dashboard-header {
    padding: 8px 12px;
    gap: 8px;

    .header-left {
      gap: 8px;
    }

    .header-center {
      max-width: 200px;
    }

    .header-right {
      gap: 4px;
    }
  }
}
</style>

