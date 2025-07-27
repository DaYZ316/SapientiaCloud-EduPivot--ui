<template>
  <div class="language-switch">
    <n-dropdown
        :options="options"
        trigger="hover"
        @select="handleSelect"
    >
      <n-button text>
        <template #icon>
          <n-icon size="18">
            <globe-outline/>
          </n-icon>
        </template>
        {{ currentLang.label }}
      </n-button>
    </n-dropdown>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {GlobeOutline} from '@vicons/ionicons5'
import {setLanguage} from '@/i18n'
import type {Locale} from '@/types/i18n'

const i18n = useI18n()

const languageOptions = [
  {
    label: '简体中文',
    key: 'zh-CN',
  },
  {
    label: 'English',
    key: 'en-US',
  },
]

// 当前语言
const currentLang = computed(() => {
  return languageOptions.find((item) => item.key === i18n.locale.value) || languageOptions[0]
})

// 下拉菜单选项
const options = computed(() => {
  return languageOptions.map((item) => ({
    label: item.label,
    key: item.key,
    disabled: item.key === i18n.locale.value
  }))
})

// 切换语言
const handleSelect = (key: string) => {
  setLanguage(key as Locale)
}
</script>

<style scoped>
.language-switch {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}
</style> 