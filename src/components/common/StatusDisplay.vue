<template>
  <div :class="statusClass" class="status-display">
    <span v-if="showDot" :class="dotClass"></span>
    {{ statusText }}
  </div>
</template>

<script setup lang="ts">
import {computed} from 'vue';
import {useI18n} from 'vue-i18n';
import {getStatusLabel, StatusEnum} from '@/enum/common';

const props = defineProps({
  // 状态值
  status: {
    type: Number,
    required: true
  },
  // 显示类型: 'text'=纯文本, 'dot'=带点, 'tag'=标签样式
  type: {
    type: String,
    default: 'text',
    validator: (value: string) => ['text', 'dot', 'tag'].includes(value)
  },
  // 自定义文本（不设置则使用i18n中的翻译）
  text: {
    type: String,
    default: ''
  }
});

const { locale } = useI18n();
const isEnglish = computed(() => locale.value === 'en-US');

// 状态文本
const statusText = computed(() => {
  if (props.text) return props.text;
  return getStatusLabel(props.status as StatusEnum, isEnglish.value);
});

// 是否显示状态小圆点
const showDot = computed(() => props.type === 'dot');

// 状态对应的CSS类
const statusClass = computed(() => {
  const isNormal = props.status === StatusEnum.NORMAL;
  
  switch(props.type) {
    case 'text':
      return isNormal ? 'text-status-normal' : 'text-status-disabled';
    case 'dot':
      return isNormal ? 'text-status-normal' : 'text-status-disabled';
    case 'tag':
      return isNormal ? 'status-tag-normal' : 'status-tag-disabled';
    default:
      return isNormal ? 'text-status-normal' : 'text-status-disabled';
  }
});

// 状态小圆点的CSS类
const dotClass = computed(() => {
  return props.status === StatusEnum.NORMAL ? 'status-dot-normal' : 'status-dot-disabled';
});
</script>

<style scoped>
.status-display {
  display: inline-flex;
  align-items: center;
}
</style> 