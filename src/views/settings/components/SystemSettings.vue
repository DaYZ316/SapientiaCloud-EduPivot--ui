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
import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useThemeStore} from '@/store'
import {getDialogInstance, getMessageInstance} from '@/utils/http'
import {setLanguage} from '@/i18n'
import {createDiscreteApi, darkTheme} from 'naive-ui'

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
const dialog = getDialogInstance()

// 主题设置状态
const themeMode = ref(themeStore.themeMode || 'system')
const primaryColor = ref(themeStore.primaryColor || '#18a058')

// 计算暗黑模式
const isDarkMode = computed(() => {
  if (themeMode.value === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return themeMode.value === 'dark'
})

// 计算主题覆盖
const themeOverrides = computed(() => {
  return {
    common: {
      primaryColor: primaryColor.value,
      primaryColorHover: primaryColor.value,
      primaryColorPressed: primaryColor.value,
    }
  }
})

// 保存主题设置
const saveSettings = () => {
  try {
    // 保存主题设置
    themeStore.setThemeMode(themeMode.value)
    themeStore.setPrimaryColor(primaryColor.value)
    
    // 保存并应用语言设置
    if (currentLang.value !== locale.value) {
      setLanguage(currentLang.value)
    }
    
    // 直接使用最新的主题创建消息实例
    const { message: newMessage } = createDiscreteApi(
      ['message'],
      {
        configProviderProps: {
          theme: isDarkMode.value ? darkTheme : null,
          themeOverrides: themeOverrides.value
        }
      }
    )
    
    // 使用新创建的实例显示成功消息
    newMessage.success(t('settings.system.updateSuccess'))
  } catch (error) {
    // 直接使用最新的主题创建消息实例
    const { message: newMessage } = createDiscreteApi(
      ['message'],
      {
        configProviderProps: {
          theme: isDarkMode.value ? darkTheme : null,
          themeOverrides: themeOverrides.value
        }
      }
    )
    
    newMessage.error(t('settings.system.updateFail'))
  }
}

// 重置主题设置
const resetSettings = () => {
  // 创建使用当前主题的对话框
  const { dialog: newDialog } = createDiscreteApi(
    ['dialog'],
    {
      configProviderProps: {
        theme: isDarkMode.value ? darkTheme : null,
        themeOverrides: themeOverrides.value
      }
    }
  )

  newDialog.warning({
    title: t('settings.system.resetTitle'),
    content: t('settings.system.resetConfirm'),
    positiveText: t('settings.system.reset'),
    negativeText: t('common.cancel'),
    positiveButtonProps: {
      type: 'primary',
      ghost: false
    },
    onPositiveClick: () => {
      themeMode.value = 'system'
      primaryColor.value = '#18a058'
      currentLang.value = 'zh-CN'
      
      themeStore.setThemeMode('system')
      themeStore.setPrimaryColor('#18a058')
      setLanguage('zh-CN')
      
      // 创建使用重置后主题的消息实例
      const { message: newMessage } = createDiscreteApi(
        ['message'],
        {
          configProviderProps: {
            theme: window.matchMedia('(prefers-color-scheme: dark)').matches ? darkTheme : null,
            themeOverrides: {
              common: {
                primaryColor: '#18a058',
                primaryColorHover: '#18a058',
                primaryColorPressed: '#18a058',
              }
            }
          }
        }
      )
      
      newMessage.success(t('settings.system.resetSuccess'))
    }
  })
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