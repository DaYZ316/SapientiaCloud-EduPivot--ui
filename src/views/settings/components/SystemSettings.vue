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
            class="color-option"
            :class="{ active: tempPrimaryColor === color }"
            :style="{ backgroundColor: color }"
            @click="handleColorSelect(color)"
          ></div>
        </div>
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
      <n-form-item>
        <n-button type="primary" @click="saveSettings">{{ t('common.save') }}</n-button>
        <n-button style="margin-left: 12px" @click="resetSettings">{{ t('common.reset') }}</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store'
import { getDiscreteApi } from '@/utils/naiveUIHelper'
import { setLanguage } from '@/i18n'

// 国际化
const { t, locale } = useI18n()

// 主题存储
const themeStore = useThemeStore()

// 响应式数据
const themeMode = ref(themeStore.themeMode)
const currentLang = ref(locale.value)

// 临时存储用户选择的颜色，不立即应用
const tempPrimaryColor = ref(themeStore.primaryColor)

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
  { label: '中文', value: 'zh-CN' },
  { label: 'English', value: 'en-US' }
]

// 监听主题模式变化
watch(themeMode, (newMode) => {
  themeStore.setThemeMode(newMode)
})

// 处理主要颜色变化
const handlePrimaryColorChange = (color: string) => {
  tempPrimaryColor.value = color
}

// 处理颜色选择
const handleColorSelect = (color: string) => {
  tempPrimaryColor.value = color
}

// 处理语言变化
const handleLanguageChange = (lang: 'zh-CN' | 'en-US') => {
  currentLang.value = lang
  setLanguage(lang)
}

// 保存设置
const saveSettings = () => {
  // 应用临时存储的颜色
  themeStore.setPrimaryColor(tempPrimaryColor.value)
  
  const { message } = getDiscreteApi()
  message.success(t('common.saveSuccess'))
}

// 重置设置
const resetSettings = () => {
  themeStore.resetSettings()
  themeMode.value = themeStore.themeMode
  tempPrimaryColor.value = themeStore.primaryColor
  
  // 重置语言到默认值
  const defaultLang = 'zh-CN'
  currentLang.value = defaultLang
  setLanguage(defaultLang)
  
  const { message } = getDiscreteApi()
  message.success(t('common.resetSuccess'))
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
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
}
</style> 