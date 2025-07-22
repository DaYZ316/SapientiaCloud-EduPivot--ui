<template>
  <div class="system-settings">
    <h2>{{ $t('settings.theme.title') }}</h2>
    <n-form label-placement="left" label-width="120">
      <n-form-item :label="$t('settings.system.themeMode')">
        <n-radio-group v-model:value="themeMode">
          <n-radio-button value="light">{{ $t('settings.theme.light') }}</n-radio-button>
          <n-radio-button value="dark">{{ $t('settings.theme.dark') }}</n-radio-button>
          <n-radio-button value="system">{{ $t('settings.theme.system') }}</n-radio-button>
        </n-radio-group>
      </n-form-item>
    </n-form>

    <h2>{{ $t('settings.languageSettings') }}</h2>
    <n-form label-placement="left" label-width="120">
      <n-form-item :label="$t('settings.system.defaultLanguage')">
        <n-select
          v-model:value="currentLang"
          :options="languageOptions"
        />
      </n-form-item>
    </n-form>

    <h2>{{ $t('settings.system.colorPrimary') }}</h2>
    <n-form label-placement="left" label-width="120">
      <n-form-item :label="$t('settings.system.colorPrimary')">
        <n-color-picker v-model:value="primaryColor" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="saveSettings">{{ $t('common.save') }}</n-button>
        <n-button @click="resetSettings" style="margin-left: 12px">{{ $t('common.reset') }}</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store'
import { getMessageInstance } from '@/utils/http'
import { setLanguage } from '@/i18n'

// 国际化
const { locale, t } = useI18n()

const languageOptions = [
  { label: '简体中文', value: 'zh-CN' },
  { label: t('settings.languageOptions.english'), value: 'en-US' }
]

// 当前语言
const currentLang = ref<'zh-CN' | 'en-US'>(locale.value as 'zh-CN' | 'en-US')

// 设置状态管理
const themeStore = useThemeStore()
const message = getMessageInstance()

// 主题设置状态
const themeMode = ref(themeStore.themeMode || 'system')
const primaryColor = ref(themeStore.primaryColor || '#18a058')

// 保存主题设置
const saveSettings = () => {
  // 保存主题设置
  themeStore.setThemeMode(themeMode.value)
  themeStore.setPrimaryColor(primaryColor.value)
  
  // 保存并应用语言设置
  if (currentLang.value !== locale.value) {
    setLanguage(currentLang.value)
  }
  
  message.success(t('settings.system.updateSuccess'))
}

// 重置主题设置
const resetSettings = () => {
  themeMode.value = 'system'
  primaryColor.value = '#18a058'
  currentLang.value = 'zh-CN'
  
  themeStore.setThemeMode('system')
  themeStore.setPrimaryColor('#18a058')
  setLanguage('zh-CN')
  
  message.success(t('settings.system.resetSuccess'))
}
</script>

<style scoped lang="scss">
.system-settings {
  h2 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
  }
}
</style> 