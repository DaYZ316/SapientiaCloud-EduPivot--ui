<template>
  <div class="system-settings">

    <h2>{{ t('settings.languageSettings') }}</h2>
    <n-form label-placement="left" label-width="120">
      <n-form-item :label="t('settings.system.defaultLanguage')">
        <n-select
            v-model:value="currentLang"
            :options="languageOptions"
        />
      </n-form-item>
    </n-form>

    <n-form label-placement="left" label-width="120">
      <n-form-item>
        <n-button type="primary" @click="saveSettings">{{ t('common.save') }}</n-button>
        <n-button style="margin-left: 12px" @click="resetSettings">{{ t('common.reset') }}</n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import {ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {setLanguage} from '@/i18n'

// 国际化
const {locale, t} = useI18n()

const languageOptions = [
  {label: '简体中文', value: 'zh-CN'},
  {label: t('settings.languageOptions.english'), value: 'en-US'}
]

// 当前语言
const currentLang = ref<'zh-CN' | 'en-US'>(locale.value as 'zh-CN' | 'en-US')

// 保存主题设置
const saveSettings = () => {
  try {

    // 保存并应用语言设置
    if (currentLang.value !== locale.value) {
      setLanguage(currentLang.value)
    }

    // 使用getDiscreteApi获取最新消息实例
    const {message} = getDiscreteApi()
    message.success(t('settings.system.updateSuccess'))
  } catch (error) {
    // 使用getDiscreteApi获取最新消息实例
    const {message} = getDiscreteApi()
    message.error(t('settings.system.updateFail'))
  }
}

// 重置主题设置
const resetSettings = () => {
  // 使用getDiscreteApi获取最新对话框实例
  const {dialog} = getDiscreteApi()

  dialog.warning({
    title: t('settings.system.resetTitle'),
    content: t('settings.system.resetConfirm'),
    positiveText: t('settings.system.reset'),
    negativeText: t('common.cancel'),
    positiveButtonProps: {
      type: 'primary',
      ghost: false
    },
    onPositiveClick: () => {
      setLanguage('zh-CN')

      // 使用getDiscreteApi获取最新消息实例
      const {message} = getDiscreteApi()
      message.success(t('settings.system.resetSuccess'))
    }
  })
}
</script>

<style lang="scss" scoped>
.system-settings {
  h2 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-size: 18px;
    font-weight: 500;
  }
}
</style> 