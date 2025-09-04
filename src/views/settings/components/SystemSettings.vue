<template>
  <div class="system-settings">
    <h2>{{ t('settings.theme.title') }}</h2>
    <n-form label-placement="left" label-width="120">
      <n-form-item :label="t('settings.system.themeMode')">
        <n-radio-group v-model:value="themeMode">
          <n-radio-button value="light">{{ t('settings.theme.light') }}</n-radio-button>
          <n-radio-button value="dark">{{ t('settings.theme.dark') }}</n-radio-button>
          <n-radio-button value="system">{{ t('settings.theme.system') }}</n-radio-button>
        </n-radio-group>
      </n-form-item>
    </n-form>

    <h2>{{ t('settings.system.globalColors') }}</h2>
    <n-form label-placement="left" label-width="120">
      <!-- 主要颜色设置 -->
      <n-form-item :label="t('settings.system.primaryColor')">
        <div class="color-options">
          <div
              v-for="color in systemColors"
              :key="color"
              :class="{ active: primaryColor === color }"
              :style="{ backgroundColor: color }"
              class="color-option"
              @click="handleColorSelect(color)"
          ></div>
        </div>
      </n-form-item>
    </n-form>


    <h2>{{ t('settings.system.layoutSettings') }}</h2>
    <n-form label-placement="left" label-width="120">
      <n-form-item :label="t('settings.system.sidebarCollapsed')">
        <n-switch v-model:value="sidebarCollapsed" @update:value="handleSidebarCollapsedChange"/>
        <span class="setting-description">{{ t('settings.system.sidebarCollapsedDesc') }}</span>
      </n-form-item>
    </n-form>

    <h2>{{ t('settings.languageSettings') }}</h2>
    <n-form label-placement="left" label-width="120">
      <n-form-item :label="t('settings.system.defaultLanguage')">
        <n-select
            v-model:value="currentLang"
            :options="languageOptions"
            @update:value="handleLanguageChange"
        />
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useThemeStore} from '@/store'
import {setLanguage} from '@/i18n'

// 国际化
const {t, locale} = useI18n()

// 主题存储
const themeStore = useThemeStore()

// 响应式数据 - 直接使用 store 的值
const themeMode = ref(themeStore.themeMode)
const currentLang = ref(locale.value)
const sidebarCollapsed = ref(themeStore.sidebarCollapsed)
const primaryColor = ref(themeStore.primaryColor)

// 系统预设颜色
const systemColors = [
  '#1890ff', // 蓝色
  '#52c41a', // 绿色
  '#faad14', // 橙色
  '#f5222d', // 红色
  '#722ed1', // 紫色
  '#13c2c2', // 青色
  '#eb2f96', // 粉色
  '#fa8c16'  // 深橙色
]

// 语言选项
const languageOptions = [
  {label: '中文', value: 'zh-CN'},
  {label: 'English', value: 'en-US'}
]

// 监听主题模式变化
watch(themeMode, (newMode) => {
  themeStore.setThemeMode(newMode)
})

// 处理函数 - 简化并统一命名
const handleColorSelect = (color: string) => {
  primaryColor.value = color
  themeStore.setPrimaryColor(color)
}

const handleLanguageChange = (lang: 'zh-CN' | 'en-US') => {
  currentLang.value = lang
  setLanguage(lang)
}

const handleSidebarCollapsedChange = (collapsed: boolean) => {
  sidebarCollapsed.value = collapsed
  themeStore.setSidebarCollapsed(collapsed)
}

</script>

<style lang="scss" scoped>
.system-settings {
  padding: 20px;

  h2 {
    margin: 24px 0 16px 0;
    color: var(--text-color);
    font-size: 18px;
    font-weight: 600;
  }

  .color-options {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .color-option {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.1);
      border-color: var(--border-color);
    }

    &.active {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px var(--primary-color-light, rgba(24, 144, 255, 0.2));
    }
  }

  .setting-description {
    margin-left: 12px;
    font-size: 14px;
    color: var(--text-secondary-color);
  }
}
</style> 