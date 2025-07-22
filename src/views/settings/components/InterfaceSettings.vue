<template>
  <div class="settings-module">
    <n-card :title="$t('settings.interface.title')" size="small">
      <n-space vertical size="large">
        <!-- 主题模式设置 -->
        <n-form-item :label="$t('settings.interface.themeMode')">
          <n-radio-group v-model:value="themeMode" name="theme-mode">
            <n-space>
              <n-radio value="light">
                <n-space align="center">
                  <n-icon><sunny /></n-icon>
                  {{ $t('settings.theme.light') }}
                </n-space>
              </n-radio>
              <n-radio value="dark">
                <n-space align="center">
                  <n-icon><moon /></n-icon>
                  {{ $t('settings.theme.dark') }}
                </n-space>
              </n-radio>
              <n-radio value="system">
                <n-space align="center">
                  <n-icon><desktop /></n-icon>
                  {{ $t('settings.theme.system') }}
                </n-space>
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>

        <!-- 主题颜色设置 -->
        <n-form-item :label="$t('settings.interface.colorPrimary')">
          <n-color-picker v-model:value="primaryColor" :show-alpha="false" />
          <div class="color-preview" :style="{ backgroundColor: primaryColor }"></div>
        </n-form-item>

        <!-- 布局设置 -->
        <div class="setting-section">
          <h3>{{ $t('settings.interface.layoutSettings') }}</h3>
          
          <n-space vertical>
            <n-space justify="space-between">
              <span>{{ $t('settings.interface.fixedHeader') }}</span>
              <n-switch v-model:value="fixedHeader" />
            </n-space>
            
            <n-space justify="space-between">
              <span>{{ $t('settings.interface.fixedSidebar') }}</span>
              <n-switch v-model:value="fixedSidebar" />
            </n-space>
            
            <n-space justify="space-between">
              <span>{{ $t('settings.interface.compactView') }}</span>
              <n-switch v-model:value="compactView" />
            </n-space>
          </n-space>
        </div>

        <!-- 菜单设置 -->
        <div class="setting-section">
          <h3>{{ $t('settings.interface.menuStyle') }}</h3>
          
          <n-form-item :label="$t('settings.interface.menuWidth')">
            <n-slider
              v-model:value="menuWidth"
              :min="180"
              :max="300"
              :step="10"
              show-tooltip
            />
            <div class="slider-value">{{ menuWidth }}px</div>
          </n-form-item>
        </div>

        <!-- 动画效果设置 -->
        <n-form-item :label="$t('settings.interface.animationEffect')">
          <n-select
            v-model:value="animationEffect"
            :options="[
              { label: 'Fade', value: 'fade' },
              { label: 'Slide', value: 'slide' },
              { label: 'Zoom', value: 'zoom' },
              { label: 'None', value: 'none' }
            ]"
          />
        </n-form-item>

        <!-- 保存按钮 -->
        <div class="action-buttons">
          <n-button type="primary" @click="saveSettings">
            {{ $t('common.save') }}
          </n-button>
          <n-button @click="resetSettings" class="reset-button">
            {{ $t('common.reset') }}
          </n-button>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useMessage } from 'naive-ui'
import { getMessageInstance } from '@/utils/http'
import { useThemeStore } from '@/store'

const message = getMessageInstance()
const themeStore = useThemeStore()

// 主题模式设置
const themeMode = ref<'light' | 'dark' | 'system'>('light')

// 主题颜色设置
const primaryColor = ref('#1890ff')

// 布局设置
const fixedHeader = ref(true)
const fixedSidebar = ref(true)
const compactView = ref(false)

// 菜单设置
const menuWidth = ref(240)

// 动画效果
const animationEffect = ref('fade')

// 初始化设置
onMounted(() => {
  // 从主题store获取当前主题
  themeMode.value = themeStore.themeMode
  
  // 其他设置可以从本地存储或API中获取
  const savedSettings = localStorage.getItem('interfaceSettings')
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings)
      primaryColor.value = settings.primaryColor || primaryColor.value
      fixedHeader.value = settings.fixedHeader ?? fixedHeader.value
      fixedSidebar.value = settings.fixedSidebar ?? fixedSidebar.value
      compactView.value = settings.compactView ?? compactView.value
      menuWidth.value = settings.menuWidth || menuWidth.value
      animationEffect.value = settings.animationEffect || animationEffect.value
    } catch (e) {
      console.error('Failed to parse saved settings')
    }
  }
})

// 保存设置
const saveSettings = () => {
  // 更新主题
  if (themeMode.value === 'system') {
    // 根据系统主题设置
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
    themeStore.setThemeMode(isDarkMode ? 'dark' : 'light')
  } else {
    themeStore.setThemeMode(themeMode.value)
  }
  
  // 保存其他设置到本地存储
  const settings = {
    primaryColor: primaryColor.value,
    fixedHeader: fixedHeader.value,
    fixedSidebar: fixedSidebar.value,
    compactView: compactView.value,
    menuWidth: menuWidth.value,
    animationEffect: animationEffect.value
  }
  
  localStorage.setItem('interfaceSettings', JSON.stringify(settings))
  
  // 显示成功消息
  message.success('界面设置已保存')
}

// 重置设置
const resetSettings = () => {
  themeMode.value = 'light'
  primaryColor.value = '#1890ff'
  fixedHeader.value = true
  fixedSidebar.value = true
  compactView.value = false
  menuWidth.value = 240
  animationEffect.value = 'fade'
  
  // 应用默认主题
  themeStore.setThemeMode('light')
  
  // 清除本地存储
  localStorage.removeItem('interfaceSettings')
  
  message.success('已重置为默认设置')
}
</script>

<style scoped lang="scss">
.settings-module {
  margin-bottom: 20px;
}

.setting-section {
  margin-top: 16px;
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 16px;
    color: var(--text-color-primary);
  }
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  
  .reset-button {
    margin-left: 12px;
  }
}

.color-preview {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  margin-left: 12px;
  border: 1px solid #d9d9d9;
  display: inline-block;
  vertical-align: middle;
}

.slider-value {
  margin-top: 4px;
  text-align: right;
  color: var(--text-color-secondary);
}
</style> 